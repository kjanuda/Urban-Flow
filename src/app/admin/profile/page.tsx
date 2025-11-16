"use client";

import { useState, useEffect } from 'react';
import { MapPin, MessageSquare, Upload, CheckCircle, AlertCircle, Loader2, Send, Camera, User, Briefcase } from 'lucide-react';

// Type definitions
interface AdminProfile {
  _id?: string;
  name: string;
  email: string;
  position?: string;
  city: string;
  district: string;
  province: string;
}

interface Location {
  address: string;
  city: string;
  district: string;
  province: string;
  latitude: number;
  longitude: number;
}

interface Reporter {
  name: string;
  email: string;
}

interface StatusChange {
  from: string;
  to: string;
}

interface AdminAction {
  actionType: 'comment' | 'status_update' | 'photo_upload';
  adminId: string;
  adminName: string;
  adminPosition: string;
  timestamp: string;
  comment?: string;
  statusChange?: StatusChange;
}

interface EvidencePhoto {
  url: string;
  uploadedBy?: string;
  uploadedAt?: string;
}

interface Issue {
  _id: string;
  reporter: Reporter;
  description: string;
  location: Location;
  photoUrl: string;
  resolutionStatus: 'pending' | 'resolving' | 'processing' | 'arranging' | 'resolved';
  assignedAdmin?: string;
  assignedAdminName?: string;
  assignedAdminPosition?: string;
  assignedAt?: string;
  createdAt: string;
  adminActions?: AdminAction[];
  evidencePhotos?: EvidencePhoto[];
}

interface StatusConfig {
  [key: string]: {
    label: string;
    color: string;
    textColor: string;
    badgeColor: string;
    borderColor: string;
  };
}

const statusConfig: StatusConfig = {
  'resolving': { label: 'Resolving', color: 'bg-blue-50', textColor: 'text-blue-700', badgeColor: 'bg-blue-200 text-blue-900', borderColor: 'border-blue-300' },
  'processing': { label: 'Processing', color: 'bg-yellow-50', textColor: 'text-yellow-700', badgeColor: 'bg-yellow-200 text-yellow-900', borderColor: 'border-yellow-300' },
  'arranging': { label: 'Arranging', color: 'bg-purple-50', textColor: 'text-purple-700', badgeColor: 'bg-purple-200 text-purple-900', borderColor: 'border-purple-300' },
  'resolved': { label: 'Resolved', color: 'bg-green-50', textColor: 'text-green-700', badgeColor: 'bg-green-200 text-green-900', borderColor: 'border-green-300' },
  'pending': { label: 'Pending', color: 'bg-gray-50', textColor: 'text-gray-700', badgeColor: 'bg-gray-300 text-gray-900', borderColor: 'border-gray-400' }
};

export default function AdminIssueManagement() {
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [error, setError] = useState<string>('');
  const [uploadingPhoto, setUploadingPhoto] = useState<boolean>(false);

  useEffect(() => {
    loadAdminProfile();
  }, []);

  const loadAdminProfile = async (): Promise<void> => {
    try {
      const storedAdmin = localStorage.getItem('admin');
      if (storedAdmin) {
        const adminData: AdminProfile = JSON.parse(storedAdmin);
        setAdminProfile(adminData);
        
        // Check if admin has an ID, if not we need to register them
        if (adminData._id) {
          loadIssuesForLocation(adminData.city);
        } else {
          // Register admin first
          await registerAdmin(adminData);
        }
      }
    } catch (err) {
      console.error('Error loading admin profile:', err);
      setError('Failed to load admin profile');
    } finally {
      setLoading(false);
    }
  };

  const registerAdmin = async (adminData: AdminProfile): Promise<void> => {
    try {
      const response = await fetch('https://cityreg.onrender.com/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminData)
      });

      const result = await response.json();
      if (result.success) {
        const updatedAdmin: AdminProfile = result.admin;
        setAdminProfile(updatedAdmin);
        localStorage.setItem('admin', JSON.stringify(updatedAdmin));
        loadIssuesForLocation(adminData.city);
      }
    } catch (err) {
      console.error('Error registering admin:', err);
      setError('Failed to register admin');
    }
  };

  const loadIssuesForLocation = async (city: string): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:5001/reports/by-city/${city}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setIssues(data.reports);
        setError('');
      }
    } catch (err) {
      console.error('Error loading issues:', err);
      setError(`Unable to load issues: ${err instanceof Error ? err.message : 'Unknown error'}. Make sure the backend is running on port 5001.`);
    }
  };

  const handleStatusChange = async (newStatus: string): Promise<void> => {
    if (!selectedIssue || !adminProfile) return;
    setUpdating(true);
    
    try {
      const response = await fetch(`http://localhost:5001/reports/${selectedIssue._id}/resolution-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: newStatus,
          adminId: adminProfile._id 
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedIssue(data.report);
        setIssues(issues.map(i => i._id === selectedIssue._id ? data.report : i));
      } else {
        setError('Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddComment = async (): Promise<void> => {
    if (!newComment.trim() || !selectedIssue || !adminProfile) return;
    
    // Validate comment length
    if (newComment.trim().length < 3) {
      setError('Comment must be at least 3 characters long');
      return;
    }
    
    if (newComment.trim().length > 1000) {
      setError('Comment is too long. Maximum 1000 characters.');
      return;
    }
    
    setUpdating(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:5001/reports/${selectedIssue._id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          comment: newComment.trim(),
          adminId: adminProfile._id 
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedIssue(data.report);
        setIssues(issues.map(i => i._id === selectedIssue._id ? data.report : i));
        setNewComment('');
      } else {
        setError('Failed to add comment');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment');
    } finally {
      setUpdating(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !selectedIssue || !adminProfile) return;

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const invalidFiles = files.filter(f => !validTypes.includes(f.type));
    
    if (invalidFiles.length > 0) {
      setError('Please upload only image files (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file sizes (max 5MB per file)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(f => f.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      setError('Some files are too large. Maximum size is 5MB per image.');
      return;
    }

    setUploadingPhoto(true);
    setError('');
    
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('photo', file);
        formData.append('adminId', adminProfile._id || '');

        const response = await fetch(`http://localhost:5001/reports/${selectedIssue._id}/evidence-photo`, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          setSelectedIssue(data.report);
          setIssues(issues.map(i => i._id === selectedIssue._id ? data.report : i));
        } else {
          setError('Failed to upload photo');
        }
      } catch (err) {
        console.error('Error uploading photo:', err);
        setError('Failed to upload photo');
      }
    }
    
    setUploadingPhoto(false);
    // Reset file input
    e.target.value = '';
  };

  const filteredIssues = filterStatus === 'all' 
    ? issues 
    : issues.filter(i => i.resolutionStatus === filterStatus);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading issues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto pt-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Issue Management Dashboard</h1>
          {adminProfile && (
            <div className="text-gray-600 mt-3 space-y-1">
              <p className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {adminProfile.name}
              </p>
              <p className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                {adminProfile.position || 'Administrator'}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {adminProfile.city} • {adminProfile.district} • {adminProfile.province}
              </p>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Issues List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Filter Tabs */}
              <div className="flex border-b border-gray-200 flex-wrap">
                {['all', 'pending', 'resolving', 'processing', 'arranging', 'resolved'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`flex-1 px-2 py-3 text-xs sm:text-sm font-medium transition min-w-fit ${
                      filterStatus === status
                        ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>

              {/* Issues */}
              <div className="divide-y max-h-[calc(100vh-300px)] overflow-y-auto">
                {filteredIssues.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No issues found</p>
                  </div>
                ) : (
                  filteredIssues.map(issue => (
                    <button
                      key={issue._id}
                      onClick={() => setSelectedIssue(issue)}
                      className={`w-full p-4 text-left transition border-l-4 ${
                        selectedIssue?._id === issue._id
                          ? 'bg-blue-50 border-blue-600'
                          : 'bg-white border-transparent hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate text-sm">{issue.reporter.name}</p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{issue.description}</p>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            <span className={`px-3 py-1.5 rounded-md text-xs font-bold border-2 ${statusConfig[issue.resolutionStatus]?.badgeColor || 'bg-gray-300 text-gray-900'} ${statusConfig[issue.resolutionStatus]?.borderColor || 'border-gray-400'}`}>
                              {statusConfig[issue.resolutionStatus]?.label || 'Pending'}
                            </span>
                            {issue.assignedAdminName && (
                              <span className="px-3 py-1.5 rounded-md text-xs font-bold bg-purple-200 text-purple-900 border-2 border-purple-300">
                                {issue.assignedAdminName === adminProfile?.name ? '👤 You' : issue.assignedAdminName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Issue Details Panel */}
          {selectedIssue ? (
            <div className="lg:col-span-2 space-y-6">
              {/* Main Issue Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedIssue.reporter.name}</h2>
                    <p className="text-gray-600 text-sm mt-1">{selectedIssue.reporter.email}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(selectedIssue.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Assignment Info */}
                {selectedIssue.assignedAdmin && (
                  <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm">
                      <span className="font-semibold text-purple-900">Assigned to:</span>
                      <span className="text-purple-700 ml-2">{selectedIssue.assignedAdminName} ({selectedIssue.assignedAdminPosition})</span>
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      Assigned: {new Date(selectedIssue.assignedAt || '').toLocaleDateString()}
                    </p>
                  </div>
                )}

                {/* Location Info */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mb-4 border border-blue-100">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{selectedIssue.location.address}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedIssue.location.city} • {selectedIssue.location.district} • {selectedIssue.location.province}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedIssue.location.latitude.toFixed(4)}, {selectedIssue.location.longitude.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Issue Description</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedIssue.description}</p>
                </div>

                {/* Status Selection */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Resolution Status</h3>
                  <div className="space-y-2">
                    {['resolving', 'processing', 'arranging', 'resolved'].map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        disabled={updating}
                        className={`w-full px-4 py-3 text-left rounded-lg font-medium transition flex items-center gap-3 ${
                          selectedIssue.resolutionStatus === status
                            ? `${statusConfig[status]?.color || 'bg-gray-50'} ${statusConfig[status]?.textColor || 'text-gray-700'} border-2 border-current`
                            : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                        } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {selectedIssue.resolutionStatus === status && <CheckCircle className="w-5 h-5" />}
                        {statusConfig[status]?.label || status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Photos Section */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Photos & Evidence
                </h3>
                
                {/* Initial Report Photo */}
                <div className="mb-4">
                  <p className="text-xs text-gray-700 mb-2 font-bold uppercase tracking-wide">Initial Report</p>
                  <div className="relative rounded-lg overflow-hidden bg-gray-200 aspect-video border-2 border-gray-300">
                    <img 
                      src={selectedIssue.photoUrl} 
                      alt="Initial Report" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="absolute inset-0 bg-gray-300 hidden flex-col items-center justify-center text-gray-600">
                      <Camera className="w-12 h-12 mb-2 opacity-50" />
                      <p className="text-xs font-medium">Image not available</p>
                      <p className="text-xs text-gray-500 mt-1">Photo may not be uploaded yet</p>
                    </div>
                  </div>
                </div>

                {/* Evidence Photos */}
                {selectedIssue.evidencePhotos && selectedIssue.evidencePhotos.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-700 mb-2 font-bold uppercase tracking-wide">Evidence Photos ({selectedIssue.evidencePhotos.length})</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedIssue.evidencePhotos.map((photo, idx) => (
                        <div key={idx} className="relative rounded-lg overflow-hidden bg-gray-200 aspect-video group border-2 border-gray-300">
                          <img 
                            src={photo.url} 
                            alt={`Evidence ${idx + 1}`} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          <div className="absolute inset-0 bg-gray-300 hidden flex-col items-center justify-center text-gray-600">
                            <Camera className="w-12 h-12 mb-2 opacity-50" />
                            <p className="text-xs font-medium">Image not available</p>
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition flex items-end pointer-events-none">
                            <div className="w-full p-3 bg-gradient-to-t from-black via-black/80 to-transparent text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                              <p className="font-bold">{photo.uploadedBy || 'Unknown'}</p>
                              <p className="font-medium">{photo.uploadedAt ? new Date(photo.uploadedAt).toLocaleDateString() : 'Date unknown'}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload New Photo */}
                <label className="block">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploadingPhoto}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-blue-400 rounded-lg p-6 text-center cursor-pointer hover:bg-blue-50 transition bg-white">
                    {uploadingPhoto ? (
                      <>
                        <Loader2 className="w-8 h-8 text-blue-600 mx-auto mb-2 animate-spin" />
                        <p className="text-sm text-blue-700 font-bold">Uploading...</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm text-blue-700 font-bold">Upload Evidence Photos</p>
                        <p className="text-xs text-gray-600 mt-1">Click to select one or more images</p>
                      </>
                    )}
                  </div>
                </label>
              </div>

              {/* Comments Section */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Comments & Updates ({selectedIssue.adminActions?.length || 0})
                </h3>

                {/* Comments List */}
                <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
                  {!selectedIssue.adminActions || selectedIssue.adminActions.length === 0 ? (
                    <p className="text-gray-600 text-sm text-center py-4">No comments or updates yet</p>
                  ) : (
                    selectedIssue.adminActions
                      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                      .map((action, idx) => (
                        <div key={idx} className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-l-4 border-blue-500 shadow-sm">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1">
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{action.adminName}</p>
                              <p className="text-xs text-gray-600 font-medium">{action.adminPosition}</p>
                            </div>
                            <span className="text-xs text-gray-600 font-medium">
                              {new Date(action.timestamp).toLocaleString()}
                            </span>
                          </div>
                          
                          {action.actionType === 'comment' && (
                            <p className="text-gray-900 text-sm font-medium leading-relaxed mt-2">{action.comment}</p>
                          )}
                          
                          {action.actionType === 'status_update' && action.statusChange && (
                            <p className="text-gray-900 text-sm font-medium mt-2">
                              Status changed: <span className="font-bold text-blue-700">{action.statusChange.from}</span> → <span className="font-bold text-green-700">{action.statusChange.to}</span>
                            </p>
                          )}
                          
                          {action.actionType === 'photo_upload' && (
                            <p className="text-gray-900 text-sm font-medium mt-2">📸 Uploaded evidence photo</p>
                          )}
                        </div>
                      ))
                  )}
                </div>

                {/* Comment Input */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment or update..."
                    rows={3}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-gray-900 font-medium placeholder:text-gray-500"
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || updating}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold text-sm sm:self-end"
                  >
                    {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-12 flex items-center justify-center">
              <div className="text-center">
                <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Select an issue to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
