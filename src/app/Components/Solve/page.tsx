'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, MapPin, Loader, AlertCircle, CheckCircle, X, Building2, Phone, Mail, Navigation, Send, Check } from 'lucide-react';

export default function IssueReporter() {
  const [photo, setPhoto] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState({ lat: null, lng: null, address: '' });
  const [detecting, setDetecting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [officeInfo, setOfficeInfo] = useState(null);
  const [loadingOffice, setLoadingOffice] = useState(false);
  const [selectedOffices, setSelectedOffices] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const GOOGLE_MAPS_API_KEY = 'AIzaSyBGNzHoT1SJCM7J3zvGbxyyiOlsO9ps_H8';
  const OFFICE_FINDER_URL = 'http://localhost:5000';
  const SUBMIT_REPORT_URL = 'http://localhost:5001';
  const defaultCenter = { lat: 6.9271, lng: 80.7789 };

  useEffect(() => {
    if (showMap && !mapLoaded && mapRef.current) {
      initializeMap();
    }
  }, [showMap, mapLoaded]);

  const initializeMap = () => {
    if (typeof window.google === 'undefined') {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => {
        setTimeout(() => createMap(), 100);
      };
      document.head.appendChild(script);
    } else {
      createMap();
    }
  };

  const createMap = () => {
    if (!mapRef.current || !window.google) return;

    const initialLocation = location.lat ? { lat: location.lat, lng: location.lng } : defaultCenter;

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 15,
      center: initialLocation,
      mapTypeControl: true,
      fullscreenControl: true,
    });

    mapInstanceRef.current = map;

    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    const marker = new window.google.maps.Marker({
      position: initialLocation,
      map: map,
      draggable: true,
      title: 'Select location',
    });

    markerRef.current = marker;

    marker.addListener('dragend', () => {
      const pos = marker.getPosition();
      updateLocation(pos.lat(), pos.lng());
    });

    map.addListener('click', (e) => {
      marker.setPosition(e.latLng);
      updateLocation(e.latLng.lat(), e.latLng.lng());
    });

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Search for a place...';
    input.className = 'map-search-box';
    map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(input);

    const searchBox = new window.google.maps.places.SearchBox(input);
    map.addListener('bounds_changed', () => {
      searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      if (places.length === 0) return;

      const place = places[0];
      if (!place.geometry || !place.geometry.location) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      marker.setPosition(new window.google.maps.LatLng(lat, lng));
      map.setCenter(place.geometry.location);
      map.setZoom(17);

      updateLocation(lat, lng, place.formatted_address);
    });

    setMapLoaded(true);
  };

  const updateLocation = async (lat, lng, address = '') => {
    setLocation({ lat, lng, address });

    if (!address) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await response.json();
        setLocation(prev => ({ 
          ...prev, 
          address: data.address?.road || data.address?.city || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
        }));
      } catch (e) {
        setLocation(prev => ({ 
          ...prev, 
          address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
        }));
      }
    }

    fetchOfficeInfo(lat, lng);
  };

  const fetchOfficeInfo = async (lat, lng) => {
    setLoadingOffice(true);
    setOfficeInfo(null);
    setSelectedOffices([]);
    try {
      const response = await fetch(`${OFFICE_FINDER_URL}/find-office`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: lat,
          longitude: lng
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch office information');
      }

      const data = await response.json();
      setOfficeInfo(data);
      
      if (data.divisionalSecretariat?.contact?.primary?.email !== "Not available") {
        setSelectedOffices([{
          type: 'ds',
          name: data.office.name,
          email: data.divisionalSecretariat.contact.primary.email
        }]);
      }
    } catch (err) {
      console.error('Error fetching office:', err);
      setError('Could not find nearest office. Please try again.');
    } finally {
      setLoadingOffice(false);
    }
  };

  const toggleOfficeSelection = (officeType, officeName, email) => {
    if (email === "Not available") return;

    const officeId = `${officeType}-${email}`;
    const isSelected = selectedOffices.some(o => `${o.type}-${o.email}` === officeId);

    if (isSelected) {
      setSelectedOffices(selectedOffices.filter(o => `${o.type}-${o.email}` !== officeId));
    } else {
      setSelectedOffices([...selectedOffices, { type: officeType, name: officeName, email }]);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const autoDetectLocation = async () => {
    setDetecting(true);
    setError('');
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation not supported');
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setShowMap(false);
          setMapLoaded(false);
          await updateLocation(latitude, longitude);
          setDetecting(false);
        },
        (err) => {
          setError('Unable to detect location. Please enable GPS.');
          setDetecting(false);
        }
      );
    } catch (err) {
      setError(err.message);
      setDetecting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!photoFile) {
      setError('Please upload a photo');
      return;
    }
    if (!description.trim()) {
      setError('Please describe the issue');
      return;
    }
    if (!location.lat) {
      setError('Please select or detect a location');
      return;
    }
    if (selectedOffices.length === 0) {
      setError('Please select at least one office to report to');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('photo', photoFile);
      formData.append('description', description);
      formData.append('location', JSON.stringify({
        latitude: location.lat,
        longitude: location.lng,
        address: location.address
      }));
      formData.append('offices', JSON.stringify(selectedOffices));

      console.log('📤 Submitting report to:', SUBMIT_REPORT_URL);

      const response = await fetch(`${SUBMIT_REPORT_URL}/submit-report`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || result.error || 'Failed to submit report');
      }

      console.log('✅ Report submitted successfully:', result);
      setSubmissionResult(result.data);
      setSubmitted(true);
      
      setTimeout(() => {
        setPhoto(null);
        setPhotoFile(null);
        setPreview(null);
        setDescription('');
        setLocation({ lat: null, lng: null, address: '' });
        setOfficeInfo(null);
        setSelectedOffices([]);
        setShowMap(false);
        setMapLoaded(false);
        setSubmitted(false);
        setSubmitting(false);
        setSubmissionResult(null);
      }, 5000);
    } catch (err) {
      console.error('❌ Submission error:', err);
      setError(err.message || 'Failed to submit report. Please try again.');
      setSubmitting(false);
    }
  };

  const canSubmit = photoFile && description.trim() && location.lat && selectedOffices.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <style>{`
        .map-search-box {
          background-color: #fff;
          border: 2px solid #ccc;
          border-radius: 3px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          box-sizing: border-box;
          font-family: Roboto;
          font-size: 15px;
          font-weight: 300;
          margin: 10px;
          max-width: 280px;
          outline: none;
          padding: 0 11px;
          text-overflow: ellipsis;
          width: 300px;
          height: 40px;
          z-index: 1;
        }
        .map-search-box:focus {
          border-color: #4285f4;
        }
        #map {
          width: 100%;
          height: 100%;
          border-radius: 8px;
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 sm:px-8 py-8">
            <h1 className="text-3xl font-bold text-white mb-2">SmartCity Issue Reporter</h1>
            <p className="text-blue-100">Report problems in your city and help make it better</p>
          </div>

          {submitted && submissionResult && (
            <div className="mx-6 sm:mx-8 mt-6 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <span className="text-green-800 font-bold block mb-2 text-lg">✅ Issue Reported Successfully!</span>
                  
                  <div className="space-y-2 mb-3">
                    <p className="text-green-700 text-sm">
                      📝 <strong>Report ID:</strong> {submissionResult.reportId}
                    </p>
                    <p className="text-green-700 text-sm">
                      📧 <strong>Emails sent:</strong> {submissionResult.successfulEmails} of {submissionResult.totalEmails}
                    </p>
                    <p className="text-green-700 text-sm">
                      🔥 <strong>Photo uploaded to:</strong> Firebase Storage
                    </p>
                    <p className="text-green-700 text-sm">
                      💾 <strong>Saved to:</strong> MongoDB
                    </p>
                  </div>

                  <div className="bg-white rounded p-3 border border-green-200">
                    <p className="text-green-800 font-semibold text-sm mb-1">Emails sent to:</p>
                    <ul className="text-green-700 text-sm space-y-1">
                      {submissionResult.emailsSent?.map((email, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          {email.status === 'success' ? 
                            <CheckCircle className="w-4 h-4 text-green-600" /> : 
                            <AlertCircle className="w-4 h-4 text-red-600" />
                          }
                          {email.email} - {email.status}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {submissionResult.photoUrl && (
                    <div className="mt-3 p-2 bg-white rounded border border-green-200">
                      <p className="text-xs text-green-700">
                        🖼️ <strong>Photo URL:</strong> 
                        <a href={submissionResult.photoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1 break-all">
                          View Image
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="p-6 sm:p-8 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-800">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Upload Photo Evidence *</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  id="photo-input"
                  disabled={submitted || submitting}
                />
                <label htmlFor="photo-input" className="block cursor-pointer">
                  {preview ? (
                    <div className="relative rounded-lg overflow-hidden">
                      <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center hover:bg-opacity-50 transition">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition">
                      <Upload className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                      <p className="text-gray-700 font-medium">Click to upload photo</p>
                      <p className="text-gray-500 text-sm">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-3">
                Describe the Issue *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={submitted || submitting}
                placeholder="Describe the issue in detail (e.g., pothole on Main Street, broken streetlight, damaged bench...)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="4"
              />
              <p className="text-gray-500 text-sm mt-2">{description.length}/500 characters</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Location *</label>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={autoDetectLocation}
                  disabled={detecting || submitted || submitting}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
                >
                  {detecting ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Detecting...
                    </>
                  ) : (
                    <>
                      <Navigation className="w-5 h-5" />
                      Auto Detect
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowMap(!showMap)}
                  disabled={submitted || submitting}
                  className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
                >
                  <MapPin className="w-5 h-5" />
                  Select on Map
                </button>
              </div>

              {showMap && (
                <div className="mb-4 border-2 border-blue-300 rounded-lg overflow-hidden">
                  <div className="relative">
                    <div ref={mapRef} id="map" style={{ height: '400px' }}></div>
                    <button
                      type="button"
                      onClick={() => setShowMap(false)}
                      className="absolute top-2 right-2 bg-white p-2 rounded-lg shadow-lg hover:bg-gray-100 z-10"
                    >
                      <X className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                </div>
              )}

              {location.lat && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <span className="font-semibold">📍 Location:</span> {location.address}
                  </p>
                  <p className="text-xs text-green-700">
                    Coordinates: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </p>
                </div>
              )}
            </div>

            {loadingOffice && (
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                  <span className="text-blue-800 font-medium">Finding nearest offices...</span>
                </div>
              </div>
            )}

            {officeInfo && !loadingOffice && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-700">
                    Select Office(s) to Report * <span className="text-gray-500 font-normal">(Select one or more)</span>
                  </label>
                  {selectedOffices.length > 0 && (
                    <span className="text-sm text-blue-600 font-medium">
                      {selectedOffices.length} selected
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  {officeInfo.divisionalSecretariat?.contact?.primary?.email !== "Not available" && (
                    <div 
                      onClick={() => toggleOfficeSelection(
                        'ds', 
                        officeInfo.office.name, 
                        officeInfo.divisionalSecretariat.contact.primary.email
                      )}
                      className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${
                        selectedOffices.some(o => o.type === 'ds' && o.email === officeInfo.divisionalSecretariat.contact.primary.email)
                          ? 'border-blue-500 bg-blue-50 shadow-md' 
                          : 'border-gray-200 hover:border-blue-300 bg-white hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          selectedOffices.some(o => o.type === 'ds' && o.email === officeInfo.divisionalSecretariat.contact.primary.email)
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-300 bg-white'
                        }`}>
                          {selectedOffices.some(o => o.type === 'ds' && o.email === officeInfo.divisionalSecretariat.contact.primary.email) && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>

                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 flex-shrink-0">
                          <Building2 className="w-6 h-6 text-blue-600" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 mb-1">Divisional Secretariat</h3>
                          <p className="text-sm font-semibold text-gray-700 mb-1">{officeInfo.office.name}</p>
                          <p className="text-xs text-gray-600 mb-3 line-clamp-1">{officeInfo.office.address}</p>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                              <span className="text-sm text-gray-700 truncate">{officeInfo.divisionalSecretariat.contact.primary.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{officeInfo.divisionalSecretariat.contact.primary.phone}</span>
                            </div>
                          </div>

                          {officeInfo.distance && (
                            <p className="text-xs text-gray-500 mt-3">
                              {officeInfo.distance.roadDistance} • {officeInfo.distance.drivingTime}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {officeInfo.pradeshiyaSabha?.contact?.primary?.email !== "Not available" && (
                    <div 
                      onClick={() => toggleOfficeSelection(
                        'ps', 
                        officeInfo.pradeshiyaSabha.officeName, 
                        officeInfo.pradeshiyaSabha.contact.primary.email
                      )}
                      className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${
                        selectedOffices.some(o => o.type === 'ps' && o.email === officeInfo.pradeshiyaSabha.contact.primary.email)
                          ? 'border-green-500 bg-green-50 shadow-md' 
                          : 'border-gray-200 hover:border-green-300 bg-white hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          selectedOffices.some(o => o.type === 'ps' && o.email === officeInfo.pradeshiyaSabha.contact.primary.email)
                            ? 'border-green-500 bg-green-500' 
                            : 'border-gray-300 bg-white'
                        }`}>
                          {selectedOffices.some(o => o.type === 'ps' && o.email === officeInfo.pradeshiyaSabha.contact.primary.email) && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>

                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 flex-shrink-0">
                          <Building2 className="w-6 h-6 text-green-600" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 mb-1">Pradeshiya Sabha</h3>
                          <p className="text-sm font-semibold text-gray-700 mb-3">{officeInfo.pradeshiyaSabha.officeName}</p>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-green-600 flex-shrink-0" />
                              <span className="text-sm text-gray-700 truncate">{officeInfo.pradeshiyaSabha.contact.primary.email}</span>
                            </div>
                            {officeInfo.pradeshiyaSabha.contact.primary.phone !== "Not available" && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{officeInfo.pradeshiyaSabha.contact.primary.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {selectedOffices.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800 font-medium mb-2">📧 Report will be sent to:</p>
                    <ul className="space-y-1">
                      {selectedOffices.map((office, idx) => (
                        <li key={idx} className="text-sm text-blue-700 flex items-center gap-2">
                          <Check className="w-4 h-4" />
                          <span className="font-medium">{office.name}:</span>
                          <span className="truncate">{office.email}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2 text-lg shadow-lg"
            >
              {submitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Sending Report to {selectedOffices.length} Office{selectedOffices.length > 1 ? 's' : ''}...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Issue Report
                  {selectedOffices.length > 0 && ` (${selectedOffices.length} Office${selectedOffices.length > 1 ? 's' : ''})`}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}