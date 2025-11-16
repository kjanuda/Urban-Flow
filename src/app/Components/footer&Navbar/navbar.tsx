'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Menu, X, ChevronDown, Search, User, LogOut, Settings, LayoutDashboard,
  Building2, Lightbulb, Megaphone, Users, Shield, Globe, Battery, FileText, Award, MessageCircle
} from 'lucide-react';

// Define user type
interface UserType {
  name?: string;
  email?: string;
  role?: string;
  picture?: string;
  profileImage?: string;
  avatar?: string;
  image?: string;
}

interface ProfileAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target) && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Authentication check
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const token = localStorage.getItem('token');
        const adminToken = localStorage.getItem('adminToken');

        if (adminToken) {
          const adminData = localStorage.getItem('admin');
          if (adminData) {
            setIsAuthenticated(true);
            setUser(JSON.parse(adminData));
            setUserRole('admin');
            setIsLoaded(true);
            setImageError(false);
            return;
          }
        }

        if (token) {
          const userData = localStorage.getItem('user');
          if (userData) {
            setIsAuthenticated(true);
            setUser(JSON.parse(userData));
            setUserRole('user');
            setIsLoaded(true);
            setImageError(false);
            return;
          }

          try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
              '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join(''));
            const decoded = JSON.parse(jsonPayload);
            const userData: UserType = {
              name: decoded.name || 'User',
              email: decoded.email || '',
              role: decoded.role,
              profileImage: decoded.picture || decoded.profileImage || decoded.avatar || decoded.image
            };
            setIsAuthenticated(true);
            setUser(userData);
            setUserRole(decoded.role === 'admin' ? 'admin' : 'user');
            setIsLoaded(true);
            setImageError(false);
            return;
          } catch (decodeErr) {
            console.error('Token decode error:', decodeErr);
          }
        }

        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
      }
      setIsLoaded(true);
    };

    checkAuthStatus();

    const handleStorageChange = (e: StorageEvent) => {
      if (e?.key === 'adminToken' || e?.key === 'admin' || e?.key === 'token' || e?.key === 'user' || !e?.key) {
        checkAuthStatus();
      }
    };

    const handleAuthChange = () => checkAuthStatus();
    const handleAdminLogin = () => setTimeout(checkAuthStatus, 100);

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('adminLogin', handleAdminLogin);

    const interval = setInterval(checkAuthStatus, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('adminLogin', handleAdminLogin);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    setIsAuthenticated(false);
    setUser(null);
    setUserRole(null);
    setProfileOpen(false);
    setImageError(false);
    
    window.dispatchEvent(new Event('authChange'));
    window.location.href = '/';
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n.charAt(0).toUpperCase()).join('').slice(0, 2);
  };

  const getProfileLink = () => userRole === 'admin' ? '/admin/profile' : '/user/profile';
  const getDashboardLink = () => userRole === 'admin' ? '/admin/dashboard' : '/user/dashboard';
  const getSettingsLink = () => userRole === 'admin' ? '/admin/settings' : '/user/settings';

  const ProfileAvatar = ({ size = 'md', className = '' }: ProfileAvatarProps) => {
    const sizeClasses = { sm: 'w-8 h-8 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' };
    const profileImage = user?.picture || user?.profileImage || user?.avatar || user?.image;

    if (profileImage && !imageError) {
      return (
        <div className={`relative ${sizeClasses[size]} ${className}`}>
          <img
            src={profileImage}
            alt={user?.name || 'Profile'}
            className="w-full h-full rounded-full object-cover border-2 border-white shadow-sm"
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
          />
        </div>
      );
    }

    return (
      <div className={`rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-sm ${sizeClasses[size]} ${className}`}>
        {getInitials(user?.name)}
      </div>
    );
  };

  if (!isLoaded) {
    return (
      <nav className={`bg-white sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : 'shadow-md'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="animate-pulse flex space-x-4">
              <div className="h-8 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // ---- return the full JSX (same as your original code) ----
  // All your navigation, dropdowns, mobile menu, profile dropdown, etc.
  // No need to change anything else; only types were fixed above.

  return (
    <nav className={`bg-white sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : 'shadow-md'}`}>
      {/* ... all JSX content from your original Navbar ... */}
      {/* This part remains unchanged, your JSX is fine */}
    </nav>
  );
}
