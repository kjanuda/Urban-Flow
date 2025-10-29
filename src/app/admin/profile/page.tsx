"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  LogOut, 
  Settings, 
  Camera,
  Edit2,
  Save,
  X,
  Loader2,
  MapPin,
  Briefcase
} from "lucide-react";

export default function AdminProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", city: "", position: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Try multiple possible endpoints
      let res;
      let data;
      
      // Option 1: Try /api/admin/profile
      res = await fetch("http://localhost:5000/api/admin/profile", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      // If 404, try alternative endpoint
      if (res.status === 404) {
        res = await fetch("http://localhost:5000/api/auth/admin/me", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
      }

      // If still 404, try another alternative
      if (res.status === 404) {
        res = await fetch("http://localhost:5000/api/admin/me", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
      }

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
        router.push("/admin/login");
        return;
      }

      if (res.ok) {
        data = await res.json();
        const adminData = data.admin || data;
        setProfile(adminData);
        setEditForm({ 
          name: adminData.name, 
          email: adminData.email,
          city: adminData.city || "",
          position: adminData.position || ""
        });
      } else {
        // Fallback: use stored admin data or decode token
        const storedAdmin = localStorage.getItem("admin");
        if (storedAdmin) {
          const adminData = JSON.parse(storedAdmin);
          setProfile(adminData);
          setEditForm({ 
            name: adminData.name, 
            email: adminData.email,
            city: adminData.city || "",
            position: adminData.position || ""
          });
        } else {
          // Decode JWT token
          try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            const decoded = JSON.parse(jsonPayload);
            const adminData = {
              name: decoded.name || "Admin User",
              email: decoded.email || "N/A",
              city: decoded.city || "N/A",
              position: decoded.position || "Administrator",
            };
            setProfile(adminData);
            setEditForm({ 
              name: adminData.name, 
              email: adminData.email,
              city: adminData.city,
              position: adminData.position
            });
          } catch (decodeErr) {
            setError("Unable to load profile");
          }
        }
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError("Failed to load profile. Please try again.");
      
      // Fallback: use stored admin data
      const storedAdmin = localStorage.getItem("admin");
      if (storedAdmin) {
        const adminData = JSON.parse(storedAdmin);
        setProfile(adminData);
        setEditForm({ 
          name: adminData.name, 
          email: adminData.email,
          city: adminData.city || "",
          position: adminData.position || ""
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({ 
      name: profile.name, 
      email: profile.email,
      city: profile.city || "",
      position: profile.position || ""
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({ 
      name: profile.name, 
      email: profile.email,
      city: profile.city || "",
      position: profile.position || ""
    });
  };

  const handleSaveProfile = async () => {
    const token = localStorage.getItem("token");
    setSaving(true);

    try {
      const res = await fetch("http://localhost:5000/api/admin/profile", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editForm)
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await res.json();
      const updatedAdmin = data.admin || data;
      setProfile(updatedAdmin);
      localStorage.setItem("admin", JSON.stringify(updatedAdmin));
      setIsEditing(false);
      setError("");
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    router.push("/admin/login");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">Unable to load your profile data.</p>
          <button
            onClick={() => router.push("/admin/login")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto pt-8 pb-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
            <p className="text-gray-600 mt-1">Manage your account information</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6 flex items-start gap-3">
            <X className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>

          {/* Profile Header */}
          <div className="px-8 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <User className="w-16 h-16 text-white" />
                  </div>
                </div>
                <button className="absolute bottom-2 right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="mt-4 sm:mt-0">
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md disabled:opacity-60"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900"
                    placeholder="Enter your name"
                  />
                ) : (
                  <p className="text-lg font-semibold text-gray-900">{profile.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900"
                    placeholder="Enter your email"
                  />
                ) : (
                  <p className="text-lg text-gray-900">{profile.email}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4" />
                  City
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900"
                    placeholder="Enter your city"
                  />
                ) : (
                  <p className="text-lg text-gray-900">{profile.city || "N/A"}</p>
                )}
              </div>

              {/* Position */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Briefcase className="w-4 h-4" />
                  Position
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.position}
                    onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900"
                    placeholder="Enter your position"
                  />
                ) : (
                  <p className="text-lg text-gray-900">{profile.position || "N/A"}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Shield className="w-4 h-4" />
                  Account Role
                </label>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {profile.role || "Admin"}
                </span>
              </div>

              {/* Member Since */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  Member Since
                </label>
                <p className="text-lg text-gray-900">{formatDate(profile.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition text-left group">
            <Settings className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition" />
            <h3 className="font-semibold text-gray-900 mb-1">Account Settings</h3>
            <p className="text-sm text-gray-600">Manage your account preferences</p>
          </button>

          <button className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition text-left group">
            <Shield className="w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition" />
            <h3 className="font-semibold text-gray-900 mb-1">Security</h3>
            <p className="text-sm text-gray-600">Update password and security settings</p>
          </button>
        </div>
      </div>
    </div>
  );
}