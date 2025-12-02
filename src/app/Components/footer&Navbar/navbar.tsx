'use client';
import { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Search, 
  User, 
  LogOut, 
  Settings, 
  LayoutDashboard,
  Building2,
  Lightbulb,
  Megaphone,
  Users,
  Shield,
  Battery,
  FileText,
  Award,
  MessageCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

interface UserData {
  name?: string;
  email?: string;
  role?: string;
  picture?: string;
  profileImage?: string;
  avatar?: string;
  image?: string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    checkAuthStatus();
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e?.key === 'adminToken' || e?.key === 'admin' || e?.key === 'token' || e?.key === 'user' || !e?.key) {
        checkAuthStatus();
      }
    };

    const handleAuthChange = () => {
      checkAuthStatus();
    };

    const handleAdminLogin = () => {
      setTimeout(() => {
        checkAuthStatus();
      }, 100);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('adminLogin', handleAdminLogin);

    const interval = setInterval(() => {
      checkAuthStatus();
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('adminLogin', handleAdminLogin);
      clearInterval(interval);
    };
  }, []);

  const checkAuthStatus = () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

      if (adminToken) {
        const adminData = typeof window !== 'undefined' ? localStorage.getItem('admin') : null;
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
        const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
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
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          
          const decoded = JSON.parse(jsonPayload);
          const userData: UserData = {
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

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin');
    }
    setIsAuthenticated(false);
    setUser(null);
    setUserRole(null);
    setProfileOpen(false);
    setImageError(false);
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('authChange'));
      window.location.href = '/';
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n.charAt(0).toUpperCase()).join('').slice(0, 2);
  };

  const getProfileLink = () => {
    return userRole === 'admin' ? '/admin/profile' : '/user/profile';
  };

  const getDashboardLink = () => {
    return userRole === 'admin' ? '/admin/dashboard' : '/user/dashboard';
  };

  const getSettingsLink = () => {
    return userRole === 'admin' ? '/admin/settings' : '/user/settings';
  };

  const ProfileAvatar = ({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) => {
    const sizeClasses = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-9 h-9 text-sm',
      lg: 'w-12 h-12 text-base'
    };

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
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-sm ${className}`}>
        {getInitials(user?.name)}
      </div>
    );
  };

  const NavLink = ({ href, icon: Icon, children, onClick }: any) => (
    <a
      href={href}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
        setIsOpen(false);
      }}
      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg mx-2 transition-colors duration-200"
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm font-medium">{children}</span>
    </a>
  );

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

  return (
    <nav className={`bg-white sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : 'shadow-md'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="/" className="flex-shrink-0">
            <div className="flex flex-col cursor-pointer">
              <span className="text-xl font-bold text-gray-800 leading-5">Urban Flow</span>
              <span className="text-xs text-gray-500 font-medium">Smart Cities</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* ABOUT */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 rounded-lg hover:bg-blue-50">
                <Building2 className="w-4 h-4" />
                ABOUT
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left">
                <a href="/mission" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-t-xl transition">
                  <Award className="w-4 h-4" />
                  <span>Our Mission</span>
                </a>
                <a href="/about" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-b-xl transition">
                  <Users className="w-4 h-4" />
                  <span>Our Team</span>
                </a>
              </div>
            </div>

            {/* SOLUTIONS */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 rounded-lg hover:bg-blue-50">
                <Lightbulb className="w-4 h-4" />
                SOLUTIONS
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left">
                <a href="/solutions/smart-cities" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-t-xl transition">
                  <Building2 className="w-4 h-4" />
                  <span>Smart Cities</span>
                </a>
                <a href="/solutions/energy" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
                  <Battery className="w-4 h-4" />
                  <span>Energy Solutions</span>
                </a>
                <a href="/solutions/infrastructure" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-b-xl transition">
                  <Settings className="w-4 h-4" />
                  <span>Infrastructure</span>
                </a>
              </div>
            </div>

            {/* ADVOCACY */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 rounded-lg hover:bg-blue-50">
                <Megaphone className="w-4 h-4" />
                ADVOCACY
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left">
                <a href="/advocacy/policy" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-t-xl transition">
                  <FileText className="w-4 h-4" />
                  <span>Policy & Reform</span>
                </a>
                <a href="/advocacy/campaigns" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
                  <Megaphone className="w-4 h-4" />
                  <span>Campaigns</span>
                </a>
                <a href="/advocacy/community" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-b-xl transition">
                  <MessageCircle className="w-4 h-4" />
                  <span>Community</span>
                </a>
              </div>
            </div>

            {/* REPORT DASHBOARD - NEW */}
            <a 
              href="/PublicProblem" 
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 rounded-lg hover:bg-blue-50 group"
            >
              <AlertCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
              REPORTS
              <span className="ml-1 px-2 py-0.5 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
                Live
              </span>
            </a>

            {/* Search */}
            <div className="relative" ref={searchRef}>
              <button 
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-gray-500 hover:text-blue-600 transition-all duration-200 rounded-lg hover:bg-blue-50"
              >
                <Search className="w-5 h-5" />
              </button>
              
              {searchOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 p-2">
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search solutions, articles, resources..."
                      className="flex-1 bg-transparent border-none focus:outline-none text-sm"
                      autoFocus
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Authentication Section */}
            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-blue-600 transition-all duration-200 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-100"
                >
                  <ProfileAvatar size="md" />
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{user?.name || 'User'}</span>
                    <span className="text-xs text-gray-500">{userRole === 'admin' ? 'Administrator' : 'Community Member'}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <ProfileAvatar size="lg" />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-800 truncate">{user?.name}</div>
                          <div className="text-sm text-gray-500 truncate">{user?.email}</div>
                          <div className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            {userRole === 'admin' ? 'Administrator' : 'Verified Member'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Links */}
                    <div className="py-2">
                      <a
                        href={getProfileLink()}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                      >
                        <User className="w-4 h-4" />
                        <span>My Profile</span>
                      </a>
                      <a
                        href={getDashboardLink()}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                      </a>
                      <a
                        href={getSettingsLink()}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </a>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 p-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative group">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-white text-gray-700 rounded-lg hover:shadow-lg transition-all duration-200 font-medium border border-gray-200 hover:border-blue-500 hover:text-blue-600 shadow-md">
                  <Users className="w-4 h-4" />
                  JOIN US
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <a href="/user/login" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-t-xl transition">
                    <User className="w-4 h-4" />
                    <span>User Login</span>
                  </a>
                  <a href="/admin/login" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-b-xl transition">
                    <Shield className="w-4 h-4" />
                    <span>Admin Login</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-blue-600 transition rounded-lg hover:bg-blue-50"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div ref={mobileMenuRef} className="lg:hidden py-4 border-t border-gray-200 bg-white max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Search Bar */}
            <div className="px-4 mb-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-1 bg-transparent border-none focus:outline-none text-sm"
                />
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1">
              <div className="px-4 py-2 font-semibold text-gray-500 text-xs uppercase tracking-wider">Navigation</div>
              
              <NavLink href="/mission" icon={Award}>
                Our Mission
              </NavLink>
              
              <NavLink href="/about" icon={Users}>
                Our Team
              </NavLink>
              
              <NavLink href="/solutions/smart-cities" icon={Building2}>
                Smart Cities
              </NavLink>
              
              <NavLink href="/solutions/energy" icon={Battery}>
                Energy Solutions
              </NavLink>
              
              <NavLink href="/solutions/infrastructure" icon={Settings}>
                Infrastructure
              </NavLink>
              
              <NavLink href="/advocacy/policy" icon={FileText}>
                Policy & Reform
              </NavLink>
              
              <NavLink href="/advocacy/campaigns" icon={Megaphone}>
                Campaigns
              </NavLink>
              
              <NavLink href="/advocacy/community" icon={MessageCircle}>
                Community
              </NavLink>
            </div>

            {/* Report Dashboard - Highlighted */}
            <div className="mt-4 px-4">
              <a 
                href="/PublicProblem"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">Report Dashboard</div>
                    <div className="text-xs text-gray-600">View public problems</div>
                  </div>
                </div>
                <div className="px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
                  Live
                </div>
              </a>
            </div>

            {/* Authentication Section */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <ProfileAvatar size="lg" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 truncate">{user?.name}</div>
                        <div className="text-sm text-gray-500 truncate">{user?.email}</div>
                        <div className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          {userRole === 'admin' ? 'Administrator' : 'Verified Member'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1 mt-2">
                    <div className="px-4 py-2 font-semibold text-gray-500 text-xs uppercase tracking-wider">Account</div>
                    
                    <NavLink href={getProfileLink()} icon={User}>
                      My Profile
                    </NavLink>
                    
                    <NavLink href={getDashboardLink()} icon={LayoutDashboard}>
                      Dashboard
                    </NavLink>
                    
                    <NavLink href={getSettingsLink()} icon={Settings}>
                      Settings
                    </NavLink>
                    
                    <div className="px-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 w-full"
                      >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="px-4 py-2 font-semibold text-gray-500 text-xs uppercase tracking-wider">Account</div>
                  
                  <NavLink href="/user/login" icon={User}>
                    User Login
                  </NavLink>
                  
                  <NavLink href="/admin/login" icon={Shield}>
                    Admin Login
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}