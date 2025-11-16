'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, MapPin, Loader, AlertCircle, CheckCircle, X, Building2, Phone, Mail, Navigation, Send, Check, User, Map, Camera } from 'lucide-react';

export default function IssueReporter() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<{ lat: number | null; lng: number | null; address: string }>({ lat: null, lng: null, address: '' });
  const [detecting, setDetecting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [officeInfo, setOfficeInfo] = useState<any>(null);
  const [loadingOffice, setLoadingOffice] = useState(false);
  const [selectedOffices, setSelectedOffices] = useState<Array<{ type: string; name: string; email: string }>>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [locationInfo, setLocationInfo] = useState<any>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const GOOGLE_MAPS_API_KEY = 'AIzaSyBGNzHoT1SJCM7J3zvGbxyyiOlsO9ps_H8';
  const OFFICE_FINDER_URL = 'https://cityget.onrender.com';
  const SUBMIT_REPORT_URL = 'https://city-process.onrender.com';

  const defaultCenter = { lat: 6.9271, lng: 80.7789 };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (showMap && !mapLoaded && mapRef.current) {
      initializeMap();
    }
  }, [showMap, mapLoaded]);

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setCameraStream(stream);
      setShowCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
      console.error('Camera error:', err);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
            setPhotoFile(file);
            setPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  const fetchUserProfile = async () => {
    try {
      setLoadingUser(true);
      
      const endpoints = [
        'https://cityreg.onrender.com/api/user/profile',
        '/api/user/profile',
        'https://cityreg.onrender.com/api/user/profile'
      ];

      let profileRes = null;
      let userData = null;

      for (const endpoint of endpoints) {
        try {
          console.log(`🔄 Trying to fetch user profile from: ${endpoint}`);
          profileRes = await fetch(endpoint, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          });

          if (profileRes && profileRes.ok) {
            console.log(`✅ Successfully connected to: ${endpoint}`);
            userData = await profileRes.json();
            break;
          }
        } catch (err) {
          console.warn(`❌ Failed to fetch from ${endpoint}:`, (err as Error).message);
          continue;
        }
      }

      if (!userData) {
        console.log('🔄 Falling back to localStorage data...');
        userData = await getUserFromLocalStorage();
      }

      if (userData) {
        setUserInfo(userData);
        setError('');
      } else {
        throw new Error('Could not load user information');
      }

    } catch (err) {
      console.error('❌ Error fetching user profile:', err);
      
      const demoUser = {
        fullName: "Demo User",
        email: "demo@smartcity.com",
        _id: "demo-user-123",
        id: "demo-user-123"
      };
      
      setUserInfo(demoUser);
      setError('Note: Using demo data. Backend connection failed.');
    } finally {
      setLoadingUser(false);
    }
  };

  const getUserFromLocalStorage = async () => {
    try {
      const token = localStorage.getItem('token');
      const userDataStr = localStorage.getItem('user');
      
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        return {
          fullName: userData.name || userData.fullName || 'User',
          email: userData.email || 'user@example.com',
          _id: userData._id || userData.id || 'user-id',
          id: userData.id || userData._id || 'user-id'
        };
      }

      const adminToken = localStorage.getItem('adminToken');
      const adminDataStr = localStorage.getItem('admin');
      
      if (adminDataStr) {
        const adminData = JSON.parse(adminDataStr);
        return {
          fullName: adminData.name || adminData.fullName || 'Admin User',
          email: adminData.email || 'admin@example.com',
          _id: adminData._id || adminData.id || 'admin-id',
          id: adminData.id || adminData._id || 'admin-id'
        };
      }

      if (token) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          
          const decoded = JSON.parse(jsonPayload);
          return {
            fullName: decoded.name || decoded.fullName || 'User',
            email: decoded.email || 'user@example.com',
            _id: decoded._id || decoded.id || 'user-id',
            id: decoded.id || decoded._id || 'user-id'
          };
        } catch (decodeErr) {
          console.warn('Token decode error:', decodeErr);
        }
      }

      return null;
    } catch (error) {
      console.error('Error getting user from localStorage:', error);
      return null;
    }
  };

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
      if (pos) {
        updateLocation(pos.lat(), pos.lng());
      }
    });

    map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        marker.setPosition(e.latLng);
        updateLocation(e.latLng.lat(), e.latLng.lng());
      }
    });

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Search for a place...';
    input.className = 'map-search-box';
    map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(input);

    const searchBox = new window.google.maps.places.SearchBox(input);
    map.addListener('bounds_changed', () => {
      searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
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

      updateLocation(lat, lng, place.formatted_address || '');
    });

    setMapLoaded(true);
  };

  const updateLocation = async (lat: number, lng: number, address = '') => {
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

  const fetchOfficeInfo = async (lat: number, lng: number) => {
    setLoadingOffice(true);
    setOfficeInfo(null);
    setLocationInfo(null);
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
      setLocationInfo(data.userLocation);
      
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

  const toggleOfficeSelection = (officeType: string, officeName: string, email: string) => {
    if (email === "Not available") return;

    const officeId = `${officeType}-${email}`;
    const isSelected = selectedOffices.some(o => `${o.type}-${o.email}` === officeId);

    if (isSelected) {
      setSelectedOffices(selectedOffices.filter(o => `${o.type}-${o.email}` !== officeId));
    } else {
      setSelectedOffices([...selectedOffices, { type: officeType, name: officeName, email }]);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
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
      setError((err as Error).message);
      setDetecting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    if (!userInfo) {
      setError('User information not available. Please refresh the page.');
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
        address: location.address,
        city: locationInfo?.cityName || 'Unknown',
        district: locationInfo?.district || 'Unknown',
        province: locationInfo?.province || 'Unknown',
        fullAddress: location.address
      }));
      
      formData.append('offices', JSON.stringify(selectedOffices));
      formData.append('userInfo', JSON.stringify({
        fullName: userInfo.fullName,
        email: userInfo.email,
        userId: userInfo._id || userInfo.id
      }));

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
        setLocationInfo(null);
        setSelectedOffices([]);
        setShowMap(false);
        setMapLoaded(false);
        setSubmitted(false);
        setSubmitting(false);
        setSubmissionResult(null);
      }, 5000);
    } catch (err) {
      console.error('❌ Submission error:', err);
      setError((err as Error).message || 'Failed to submit report. Please try again.');
      setSubmitting(false);
    }
  };

  const canSubmit = photoFile && description.trim() && location.lat && selectedOffices.length > 0 && userInfo;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        .map-search-box {
          background-color: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 500;
          margin: 12px;
          max-width: 320px;
          outline: none;
          padding: 12px 16px;
          text-overflow: ellipsis;
          width: 320px;
          height: 40px;
          z-index: 1;
        }
        .map-search-box:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }
        #map {
          width: 100%;
          height: 100%;
          border-radius: 8px;
        }
      `}</style>

      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12 px-4">
          <p className="text-gray-600 text-xs md:text-sm font-semibold tracking-wide mb-2">REPORT</p>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 md:mb-4">Report City Issues</h1>
          <p className="text-gray-600 text-sm md:text-lg max-w-2xl mx-auto">Search for the nearest office and submit your issue. See our locations and discover more about the services available in your area.</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mx-4 md:mx-0">
          <div className="p-4 md:p-8">
            {loadingUser && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                <div className="flex items-center gap-3">
                  <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                  <span className="text-blue-900 font-medium">Loading profile...</span>
                </div>
              </div>
            )}

            {submitted && submissionResult && (
              <div className="p-6 bg-green-50 border-2 border-green-300 rounded-lg mb-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-green-900 mb-2">Report Submitted Successfully!</h3>
                    <p className="text-green-800 text-sm mb-3">Report ID: {submissionResult.reportId}</p>
                    <p className="text-green-800 text-sm">Emails sent: {submissionResult.successfulEmails}/{submissionResult.totalEmails}</p>
                  </div>
                </div>
              </div>
            )}

            {error && !error.includes('demo') && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-red-900 text-sm font-medium">{error}</span>
              </div>
            )}

            {/* Tab Navigation */}
            <div className="flex gap-8 border-b border-gray-200 mb-8">
              <button className="pb-4 px-1 font-semibold text-blue-600 border-b-2 border-blue-600 text-sm">Report Issue</button>
            </div>

            <div className="space-y-6 md:space-y-8">
              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Photo Evidence</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  id="photo-input"
                  disabled={submitted || submitting}
                />
                <canvas ref={canvasRef} className="hidden" />
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className={`w-full rounded-lg ${showCamera ? 'block' : 'hidden'}`}
                />
                
                {showCamera && (
                  <div className="space-y-2 md:space-y-3 mt-4">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="w-full px-4 py-2 md:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Capture Photo</span>
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="w-full px-4 py-2 md:py-3 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold rounded-lg transition-colors text-sm md:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {!showCamera && (
                  <>
                    {preview ? (
                      <div className="relative rounded-lg overflow-hidden">
                        <img src={preview} alt="Preview" className="w-full h-48 md:h-64 object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <div className="flex items-center gap-2 text-white">
                            <Upload className="w-4 md:w-5 h-4 md:h-5" />
                            <span className="font-medium text-sm md:text-base">Change Photo</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-8">
                        <div className="space-y-3 md:space-y-4">
                          <div className="text-center">
                            <Upload className="w-6 md:w-8 h-6 md:h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-700 font-medium text-sm">Click to upload photo</p>
                            <p className="text-gray-500 text-xs">PNG, JPG up to 10MB</p>
                          </div>
                          <div className="flex gap-2 md:gap-3">
                            <label htmlFor="photo-input" className="flex-1 px-3 md:px-4 py-2 md:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-xs md:text-sm cursor-pointer">
                              <Upload className="w-3 md:w-4 h-3 md:h-4" />
                              <span>Upload</span>
                            </label>
                            <button
                              type="button"
                              onClick={startCamera}
                              disabled={submitted || submitting}
                              className="flex-1 px-3 md:px-4 py-2 md:py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-xs md:text-sm"
                            >
                              <Camera className="w-3 md:w-4 h-3 md:h-4" />
                              <span>Camera</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-3">
                  Issue Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={submitted || submitting}
                  placeholder="Describe the issue in detail..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  rows="4"
                />
              </div>

              {/* Location Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Location</label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-6">
                  <button
                    type="button"
                    onClick={autoDetectLocation}
                    disabled={detecting || submitted || submitting}
                    className="px-4 py-2 md:py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    {detecting ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        <span>Detecting...</span>
                      </>
                    ) : (
                      <>
                        <Navigation className="w-4 h-4" />
                        <span>Auto Detect</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setShowMap(!showMap)}
                    disabled={submitted || submitting}
                    className="px-4 py-2 md:py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-400 text-gray-900 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Select on Map</span>
                  </button>
                </div>

                {showMap && (
                  <div className="mb-6 border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                    <div className="relative">
                      <div ref={mapRef} id="map" style={{ height: '300px' }} className="md:h-96"></div>
                      <button
                        type="button"
                        onClick={() => setShowMap(false)}
                        className="absolute top-2 md:top-3 right-2 md:right-3 bg-white p-2 rounded-lg shadow hover:bg-gray-50 z-10 border border-gray-200"
                      >
                        <X className="w-4 h-4 text-gray-700" />
                      </button>
                    </div>
                  </div>
                )}

                {location.lat && (
                  <div className="p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-lg mb-6">
                    <div className="flex items-start gap-2 md:gap-3">
                      <MapPin className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 mb-1">Selected Location</p>
                        <p className="text-sm text-gray-700 truncate">{location.address}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {loadingOffice && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Loader className="w-4 h-4 text-blue-600 animate-spin" />
                    <span className="text-blue-900 font-medium text-sm">Finding nearest offices...</span>
                  </div>
                </div>
              )}

              {officeInfo && !loadingOffice && (
                <div className="space-y-4 md:space-y-6">
                  {/* Office Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-4">
                      Select Recipients {selectedOffices.length > 0 && <span className="text-blue-600 text-xs md:text-sm">({selectedOffices.length} selected)</span>}
                    </label>

                    <div className="space-y-2 md:space-y-3">
                      {officeInfo.divisionalSecretariat?.contact?.primary?.email !== "Not available" && (
                        <div 
                          onClick={() => toggleOfficeSelection(
                            'ds', 
                            officeInfo.office.name, 
                            officeInfo.divisionalSecretariat.contact.primary.email
                          )}
                          className={`cursor-pointer border-2 rounded-lg p-3 md:p-4 transition-all ${
                            selectedOffices.some(o => o.type === 'ds' && o.email === officeInfo.divisionalSecretariat.contact.primary.email)
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="flex items-start gap-2 md:gap-3">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              selectedOffices.some(o => o.type === 'ds' && o.email === officeInfo.divisionalSecretariat.contact.primary.email)
                                ? 'border-blue-500 bg-blue-500' 
                                : 'border-gray-300 bg-white'
                            }`}>
                              {selectedOffices.some(o => o.type === 'ds' && o.email === officeInfo.divisionalSecretariat.contact.primary.email) && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 text-sm mb-0.5">Divisional Secretariat</h3>
                              <p className="text-xs md:text-sm text-gray-600 truncate">{officeInfo.office.name}</p>
                              <div className="mt-1.5 md:mt-2 flex items-center gap-1.5 text-xs text-gray-600">
                                <Mail className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{officeInfo.divisionalSecretariat.contact.primary.email}</span>
                              </div>
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
                          className={`cursor-pointer border-2 rounded-lg p-3 md:p-4 transition-all ${
                            selectedOffices.some(o => o.type === 'ps' && o.email === officeInfo.pradeshiyaSabha.contact.primary.email)
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="flex items-start gap-2 md:gap-3">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              selectedOffices.some(o => o.type === 'ps' && o.email === officeInfo.pradeshiyaSabha.contact.primary.email)
                                ? 'border-blue-500 bg-blue-500' 
                                : 'border-gray-300 bg-white'
                            }`}>
                              {selectedOffices.some(o => o.type === 'ps' && o.email === officeInfo.pradeshiyaSabha.contact.primary.email) && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 text-sm mb-0.5">Pradeshiya Sabha</h3>
                              <p className="text-xs md:text-sm text-gray-600 truncate">{officeInfo.pradeshiyaSabha.officeName}</p>
                              <div className="mt-1.5 md:mt-2 flex items-center gap-1.5 text-xs text-gray-600">
                                <Mail className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{officeInfo.pradeshiyaSabha.contact.primary.email}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4 md:pt-6 border-t border-gray-200">
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit || submitting}
                  className="w-full px-4 md:px-6 py-3 md:py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  {submitting ? (
                    <>
                      <Loader className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 md:w-5 md:h-5" />
                      Submit Issue Report
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
