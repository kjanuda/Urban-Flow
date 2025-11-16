'use client';

import { useState, useEffect } from 'react';
import {
  Mail,
  Building2,
  FileText,
  Download,
  Eye,
  Search,
  RotateCcw,
  AlertCircle,
  MapPin,
  CheckCircle,
  XCircle,
  ChevronRight,
  Filter,
  ArrowLeft,
  BarChart3,
  AlertTriangle,
  MessageSquare,
  Send,
  User,
  Clock,
  Badge,
  Loader2,
  Menu,
  X
} from 'lucide-react';

const API_URL = 'https://city-process.onrender.com';

export default function ComprehensiveReportsDashboard() {
  const [reports, setReports] = useState([]);
  const [cityGroups, setCityGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [expandedReportId, setExpandedReportId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [provinceFilter, setProvinceFilter] = useState('all');
  const [resolutionFilter, setResolutionFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const citiesPerPage = 10;

  // Analytics
  const [topCities, setTopCities] = useState([]);
  const [topDistricts, setTopDistricts] = useState([]);
  const [topProvinces, setTopProvinces] = useState([]);
  const [bestCities, setBestCities] = useState([]);
  const [bestDistricts, setBestDistricts] = useState([]);
  const [bestProvinces, setBestProvinces] = useState([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    activeIssues: 0,
    resolvedIssues: 0,
    citiesAffected: 0
  });

  // Comment states
  const [publicCommentText, setPublicCommentText] = useState({});
  const [publicCommentName, setPublicCommentName] = useState({});
  const [publicCommentEmail, setPublicCommentEmail] = useState({});
  const [submittingComment, setSubmittingComment] = useState({});

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    groupReportsByCity();
    calculateAnalytics();
  }, [reports, searchQuery, statusFilter, cityFilter, districtFilter, provinceFilter, resolutionFilter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/reports?limit=200`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store'
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      if (data.success && Array.isArray(data.reports)) {
        setReports(data.reports);
      } else {
        throw new Error(data.error || 'Failed to fetch reports');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = () => {
    if (reports.length === 0) {
      setStats({ totalReports: 0, activeIssues: 0, resolvedIssues: 0, citiesAffected: 0 });
      return;
    }

    const cityStats = {};
    const districtStats = {};
    const provinceStats = {};
    let activeCount = 0;
    let resolvedCount = 0;

    reports.forEach(report => {
      const city = report.location?.city || 'Unknown';
      const district = report.location?.district || 'Unknown';
      const province = report.location?.province || 'Unknown';

      if (!cityStats[city]) cityStats[city] = { total: 0, resolved: 0 };
      if (!districtStats[district]) districtStats[district] = { total: 0, resolved: 0 };
      if (!provinceStats[province]) provinceStats[province] = { total: 0, resolved: 0 };

      cityStats[city].total++;
      districtStats[district].total++;
      provinceStats[province].total++;

      const isResolved = report.resolutionStatus === 'resolved' || report.status === 'resolved';
      if (isResolved) {
        cityStats[city].resolved++;
        districtStats[district].resolved++;
        provinceStats[province].resolved++;
        resolvedCount++;
      } else {
        activeCount++;
      }
    });

    const total = reports.length;

    setStats({
      totalReports: total,
      activeIssues: activeCount,
      resolvedIssues: resolvedCount,
      citiesAffected: Object.keys(cityStats).length
    });

    // Top problem areas
    const cities = Object.entries(cityStats).map(([name, data]) => ({
      name,
      count: data.total,
      percentage: (data.total / total) * 100
    })).sort((a, b) => b.count - a.count);

    const districts = Object.entries(districtStats).map(([name, data]) => ({
      name,
      count: data.total,
      percentage: (data.total / total) * 100
    })).sort((a, b) => b.count - a.count);

    const provinces = Object.entries(provinceStats).map(([name, data]) => ({
      name,
      count: data.total,
      percentage: (data.total / total) * 100
    })).sort((a, b) => b.count - a.count);

    setTopCities(cities.slice(0, 5));
    setTopDistricts(districts.slice(0, 5));
    setTopProvinces(provinces.slice(0, 5));

    // Best performing (least active issues)
    setBestCities(cities.filter(c => c.name !== 'Unknown').slice(-5).reverse());
    setBestDistricts(districts.filter(d => d.name !== 'Unknown').slice(-5).reverse());
    setBestProvinces(provinces.filter(p => p.name !== 'Unknown').slice(-5).reverse());
  };

  const groupReportsByCity = () => {
    let filteredReports = reports;

    // Apply resolution filter FIRST - this is key
    if (resolutionFilter === 'resolved') {
      filteredReports = filteredReports.filter(r => 
        r.resolutionStatus === 'resolved' || r.status === 'resolved'
      );
    } else if (resolutionFilter === 'active') {
      filteredReports = filteredReports.filter(r => 
        r.resolutionStatus !== 'resolved' && r.status !== 'resolved'
      );
    } else if (resolutionFilter === 'all') {
      // Show all reports - no filter
    } else {
      // Default: show only ACTIVE (unresolved) issues
      filteredReports = filteredReports.filter(r => 
        r.resolutionStatus !== 'resolved' && r.status !== 'resolved'
      );
    }

    if (statusFilter !== 'all') {
      filteredReports = filteredReports.filter(r => r.status === statusFilter);
    }

    if (cityFilter !== 'all') {
      filteredReports = filteredReports.filter(r => 
        (r.location?.city || 'Unknown') === cityFilter
      );
    }

    if (districtFilter !== 'all') {
      filteredReports = filteredReports.filter(r => 
        (r.location?.district || 'Unknown') === districtFilter
      );
    }

    if (provinceFilter !== 'all') {
      filteredReports = filteredReports.filter(r => 
        (r.location?.province || 'Unknown') === provinceFilter
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredReports = filteredReports.filter(report => {
        return (
          report.reporter?.name?.toLowerCase().includes(query) ||
          report.reporter?.email?.toLowerCase().includes(query) ||
          report.description?.toLowerCase().includes(query) ||
          report.location?.address?.toLowerCase().includes(query) ||
          report.location?.city?.toLowerCase().includes(query) ||
          report.location?.district?.toLowerCase().includes(query) ||
          report.location?.province?.toLowerCase().includes(query)
        );
      });
    }

    const grouped = filteredReports.reduce((acc, report) => {
      const city = report.location?.city || 'Unknown';
      if (!acc[city]) acc[city] = [];
      acc[city].push(report);
      return acc;
    }, {});

    const groups = Object.entries(grouped)
      .map(([city, cityReports]) => ({
        city,
        reports: cityReports.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
        count: cityReports.length
      }))
      .sort((a, b) => b.count - a.count);

    setCityGroups(groups);
  };

  const submitPublicComment = async (reportId) => {
    const commentKey = `${reportId}-comment`;
    const nameKey = `${reportId}-name`;
    const emailKey = `${reportId}-email`;

    const text = publicCommentText[commentKey]?.trim();
    const name = publicCommentName[nameKey]?.trim();
    const email = publicCommentEmail[emailKey]?.trim();

    if (!text || !name || !email) {
      alert('Please fill in all fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email');
      return;
    }

    setSubmittingComment(prev => ({ ...prev, [commentKey]: true }));

    try {
      const report = reports.find(r => r._id === reportId);
      if (!report) return;

      const updatedReport = {
        ...report,
        publicComments: [
          ...(report.publicComments || []),
          { 
            name, 
            email, 
            text, 
            timestamp: new Date().toISOString(),
            _id: Date.now().toString()
          }
        ]
      };

      setReports(reports.map(r => r._id === reportId ? updatedReport : r));
      setPublicCommentText(prev => ({ ...prev, [commentKey]: '' }));
      setPublicCommentName(prev => ({ ...prev, [nameKey]: '' }));
      setPublicCommentEmail(prev => ({ ...prev, [emailKey]: '' }));
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to submit comment');
    } finally {
      setSubmittingComment(prev => ({ ...prev, [commentKey]: false }));
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return 'bg-green-900 text-green-200';
      case 'in-progress':
        return 'bg-blue-900 text-blue-200';
      default:
        return 'bg-yellow-900 text-yellow-200';
    }
  };

  const getResolutionStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'resolving':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'arranging':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getUniqueValues = (field) => {
    const values = new Set();
    reports.forEach(report => {
      const value = report.location?.[field] || 'Unknown';
      if (value && value !== 'Unknown') values.add(value);
    });
    return Array.from(values).sort();
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setCityFilter('all');
    setDistrictFilter('all');
    setProvinceFilter('all');
    setResolutionFilter('all');
    setSearchQuery('');
    setCurrentPage(1);
    setMobileFiltersOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-900 text-center mb-2">Connection Error</h2>
          <p className="text-red-700 text-center mb-4">{error}</p>
          <button
            onClick={fetchReports}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // City List View
  if (!selectedCity) {
    return (
      <div className="min-h-screen bg-gray-50">
      {/* Header with Background Image */}
      <div className="relative bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(https://ik.imagekit.io/9dtagplxz/image.png?updatedAt=1763101964714)'}}>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 sm:mb-3 drop-shadow-lg">
                Reports Dashboard
              </h1>
              <p className="text-gray-200 text-base sm:text-lg lg:text-xl drop-shadow-md">
                Monitor and analyze problem areas across regions
              </p>
            </div>
            <BarChart3 className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-white/90 drop-shadow-lg" />
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 sm:p-4 lg:p-5 border border-white/30 shadow-xl hover:bg-white/25 transition-all duration-300 hover:scale-105">
              <p className="text-gray-200 text-xs sm:text-sm lg:text-base font-medium">Total Reports</p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-1 sm:mt-2 drop-shadow-lg">
                {stats.totalReports}
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 sm:p-4 lg:p-5 border border-white/30 shadow-xl hover:bg-white/25 transition-all duration-300 hover:scale-105">
              <p className="text-gray-200 text-xs sm:text-sm lg:text-base font-medium">🔴 Active Issues</p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-1 sm:mt-2 drop-shadow-lg">
                {stats.activeIssues}
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 sm:p-4 lg:p-5 border border-white/30 shadow-xl hover:bg-white/25 transition-all duration-300 hover:scale-105">
              <p className="text-gray-200 text-xs sm:text-sm lg:text-base font-medium">🟢 Resolved</p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-1 sm:mt-2 drop-shadow-lg">
                {stats.resolvedIssues}
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 sm:p-4 lg:p-5 border border-white/30 shadow-xl hover:bg-white/25 transition-all duration-300 hover:scale-105">
              <p className="text-gray-200 text-xs sm:text-sm lg:text-base font-medium">Cities w/ Active Issues</p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-1 sm:mt-2 drop-shadow-lg">
                {stats.citiesAffected}
              </p>
            </div>
          </div>
        </div>
      </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Analytics Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Analytics Overview</h2>
              <div className="text-xs sm:text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                📊 Live Data - Updates Automatically
              </div>
            </div>
            
            {/* Info Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-gray-800 font-medium mb-1">
                    🎯 How It Works:
                  </p>
                  <p className="text-xs sm:text-sm text-gray-700">
                    When an admin <span className="font-bold text-green-700">resolves an issue</span>, it's automatically removed from the active problem count. 
                    Cities with all issues resolved will <span className="font-bold text-blue-700">disappear from problem areas</span> and appear in best performing areas!
                  </p>
                </div>
              </div>
            </div>
            
            {/* Top Problem Areas */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Most Active Issues (Unresolved)</h3>
                  <p className="text-xs text-gray-600 mt-0.5">These areas need attention - counts update when admins resolve issues</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Cities */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                  <h4 className="font-semibold text-sm text-gray-700 mb-3">🔴 Cities</h4>
                  <div className="space-y-2">
                    {topCities.length > 0 ? (
                      topCities.map((city, idx) => (
                        <div key={city.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-xs font-bold bg-red-100 text-red-700 rounded px-2 py-1 min-w-[24px] text-center">
                              {idx + 1}
                            </span>
                            <span className="text-sm text-gray-900 truncate">{city.name}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="w-12 sm:w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-red-500"
                                style={{ width: `${city.percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-gray-900 min-w-[28px] text-right">
                              {city.count}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-4">🎉 No active issues!</p>
                    )}
                  </div>
                </div>

                {/* Districts */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                  <h4 className="font-semibold text-sm text-gray-700 mb-3">🟠 Districts</h4>
                  <div className="space-y-2">
                    {topDistricts.length > 0 ? (
                      topDistricts.map((district, idx) => (
                        <div key={district.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-xs font-bold bg-orange-100 text-orange-700 rounded px-2 py-1 min-w-[24px] text-center">
                              {idx + 1}
                            </span>
                            <span className="text-sm text-gray-900 truncate">{district.name}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="w-12 sm:w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-orange-500"
                                style={{ width: `${district.percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-gray-900 min-w-[28px] text-right">
                              {district.count}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-4">🎉 No active issues!</p>
                    )}
                  </div>
                </div>

                {/* Provinces */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                  <h4 className="font-semibold text-sm text-gray-700 mb-3">🟡 Provinces</h4>
                  <div className="space-y-2">
                    {topProvinces.length > 0 ? (
                      topProvinces.map((province, idx) => (
                        <div key={province.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-xs font-bold bg-yellow-100 text-yellow-700 rounded px-2 py-1 min-w-[24px] text-center">
                              {idx + 1}
                            </span>
                            <span className="text-sm text-gray-900 truncate">{province.name}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="w-12 sm:w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-yellow-500"
                                style={{ width: `${province.percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-gray-900 min-w-[28px] text-right">
                              {province.count}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-4">🎉 No active issues!</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Best Performing Areas */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Best Performing Areas (Fewest Active Issues)</h3>
                  <p className="text-xs text-gray-600 mt-0.5">Cities doing well with minimal unresolved problems</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Cities */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                  <h4 className="font-semibold text-sm text-gray-700 mb-3">🟢 Cities</h4>
                  <div className="space-y-2">
                    {bestCities.length > 0 ? (
                      bestCities.map((city, idx) => (
                        <div key={city.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-xs font-bold bg-green-100 text-green-700 rounded px-2 py-1 min-w-[24px] text-center">
                              {idx + 1}
                            </span>
                            <span className="text-sm text-gray-900 truncate">{city.name}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="w-12 sm:w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-500"
                                style={{ width: `${city.percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-gray-900 min-w-[28px] text-right">
                              {city.count}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-4">No data available</p>
                    )}
                  </div>
                </div>

                {/* Districts */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                  <h4 className="font-semibold text-sm text-gray-700 mb-3">🟢 Districts</h4>
                  <div className="space-y-2">
                    {bestDistricts.length > 0 ? (
                      bestDistricts.map((district, idx) => (
                        <div key={district.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-xs font-bold bg-green-100 text-green-700 rounded px-2 py-1 min-w-[24px] text-center">
                              {idx + 1}
                            </span>
                            <span className="text-sm text-gray-900 truncate">{district.name}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="w-12 sm:w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-500"
                                style={{ width: `${district.percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-gray-900 min-w-[28px] text-right">
                              {district.count}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-4">No data available</p>
                    )}
                  </div>
                </div>

                {/* Provinces */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                  <h4 className="font-semibold text-sm text-gray-700 mb-3">🟢 Provinces</h4>
                  <div className="space-y-2">
                    {bestProvinces.length > 0 ? (
                      bestProvinces.map((province, idx) => (
                        <div key={province.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-xs font-bold bg-green-100 text-green-700 rounded px-2 py-1 min-w-[24px] text-center">
                              {idx + 1}
                            </span>
                            <span className="text-sm text-gray-900 truncate">{province.name}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="w-12 sm:w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-500"
                                style={{ width: `${province.percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-gray-900 min-w-[28px] text-right">
                              {province.count}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-4">No data available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Filters & Search</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear All</span>
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                  className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  {mobileFiltersOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className={`${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
              {/* Info about default view */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-xs sm:text-sm text-yellow-800">
                  ℹ️ <span className="font-bold">By default, only active (unresolved) issues are shown.</span> Use the Resolution filter to view resolved issues or all reports.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-4">
                {/* Resolution Status */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Resolution Status
                  </label>
                  <select
                    value={resolutionFilter}
                    onChange={(e) => {
                      setResolutionFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-gray-900 bg-white font-medium"
                  >
                    <option value="all">📊 All Issues</option>
                    <option value="active">🔴 Active Only (Default)</option>
                    <option value="resolved">✅ Resolved Only</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-gray-900 bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="submitted">Submitted</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <select
                    value={cityFilter}
                    onChange={(e) => {
                      setCityFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-gray-900 bg-white"
                  >
                    <option value="all">All Cities</option>
                    {getUniqueValues('city').map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    District
                  </label>
                  <select
                    value={districtFilter}
                    onChange={(e) => {
                      setDistrictFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-gray-900 bg-white"
                  >
                    <option value="all">All Districts</option>
                    {getUniqueValues('district').map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>

                {/* Province */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Province
                  </label>
                  <select
                    value={provinceFilter}
                    onChange={(e) => {
                      setProvinceFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-gray-900 bg-white"
                  >
                    <option value="all">All Provinces</option>
                    {getUniqueValues('province').map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 sm:top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, location..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-gray-900 bg-white"
                />
              </div>

              {/* Active Filters */}
              {(statusFilter !== 'all' || cityFilter !== 'all' || districtFilter !== 'all' || 
                provinceFilter !== 'all' || resolutionFilter !== 'all' || searchQuery) && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200">
                  <span className="text-xs sm:text-sm text-gray-600">Active:</span>
                  {resolutionFilter !== 'all' && (
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                      {resolutionFilter}
                    </span>
                  )}
                  {statusFilter !== 'all' && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {statusFilter}
                    </span>
                  )}
                  {cityFilter !== 'all' && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                      {cityFilter}
                    </span>
                  )}
                  {districtFilter !== 'all' && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                      {districtFilter}
                    </span>
                  )}
                  {provinceFilter !== 'all' && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                      {provinceFilter}
                    </span>
                  )}
                  {searchQuery && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                      "{searchQuery}"
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* City Groups List */}
          {cityGroups.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 sm:p-12 text-center">
              <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-base sm:text-lg">No reports found</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 sm:space-y-4">
                {cityGroups
                  .slice((currentPage - 1) * citiesPerPage, currentPage * citiesPerPage)
                  .map((group) => {
                    const resolved = group.reports.filter(r => 
                      r.resolutionStatus === 'resolved' || r.status === 'resolved'
                    ).length;
                    const active = group.count - resolved;
                    const hasAdminResponse = group.reports.some(r => 
                      r.adminActions && r.adminActions.length > 0
                    );

                    return (
                      <div
                        key={group.city}
                        className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition cursor-pointer"
                        onClick={() => setSelectedCity(group.city)}
                      >
                        <div className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-3">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                              <div>
                                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                                  {group.city}
                                </h2>
                                {group.reports[0]?.location && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {group.reports[0].location.district || 'Unknown'} • {group.reports[0].location.province || 'Unknown'}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              {hasAdminResponse && (
                                <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 text-xs sm:text-sm font-semibold rounded-full flex items-center gap-1">
                                  <Badge className="w-3 h-3" />
                                  Admin Response
                                </span>
                              )}
                              {resolved > 0 && (
                                <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 text-xs sm:text-sm font-semibold rounded-full">
                                  ✓ {resolved}
                                </span>
                              )}
                              {active > 0 && resolutionFilter !== 'resolved' && (
                                <span className="px-2 sm:px-3 py-1 bg-yellow-100 text-yellow-700 text-xs sm:text-sm font-semibold rounded-full">
                                  ⚠ {active}
                                </span>
                              )}
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                            </div>
                          </div>

                          {/* Preview Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                            {group.reports.slice(0, 4).map((report) => (
                              <div key={report._id} className="border border-gray-200 rounded-lg p-2 sm:p-3 hover:border-blue-300 transition">
                                {report.photoUrl ? (
                                  <div className="relative w-full h-20 sm:h-24 bg-gray-100 rounded mb-2 overflow-hidden">
                                    <img 
                                      src={report.photoUrl} 
                                      alt={report.description} 
                                      className="w-full h-full object-cover" 
                                    />
                                    {(report.resolutionStatus === 'resolved' || report.status === 'resolved') && (
                                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                        <CheckCircle className="w-6 h-6 text-white" />
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="w-full h-20 sm:h-24 bg-gray-100 rounded mb-2 flex items-center justify-center">
                                    <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                                  </div>
                                )}
                                <p className="text-xs font-medium text-gray-900 line-clamp-2 mb-1">
                                  {report.description}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {new Date(report.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            ))}
                            {group.count > 4 && (
                              <div className="border border-gray-200 rounded-lg p-2 sm:p-3 bg-gray-50 flex items-center justify-center">
                                <div className="text-center">
                                  <p className="text-xl sm:text-2xl font-bold text-gray-700">
                                    +{group.count - 4}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">more</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Pagination */}
              {cityGroups.length > citiesPerPage && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between bg-white rounded-lg border border-gray-200 p-4 gap-4">
                  <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                    Showing <span className="font-semibold">{(currentPage - 1) * citiesPerPage + 1}</span> to{' '}
                    <span className="font-semibold">{Math.min(currentPage * citiesPerPage, cityGroups.length)}</span> of{' '}
                    <span className="font-semibold">{cityGroups.length}</span> cities
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      Prev
                    </button>
                    <span className="text-xs sm:text-sm text-gray-600 px-2">
                      {currentPage}/{Math.ceil(cityGroups.length / citiesPerPage)}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => 
                        Math.min(Math.ceil(cityGroups.length / citiesPerPage), prev + 1)
                      )}
                      disabled={currentPage === Math.ceil(cityGroups.length / citiesPerPage)}
                      className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium ${
                        currentPage === Math.ceil(cityGroups.length / citiesPerPage)
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // City Detail View
  const selectedGroup = cityGroups.find(g => g.city === selectedCity);
  if (!selectedGroup) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <button
            onClick={() => {
              setSelectedCity(null);
              setExpandedReportId(null);
            }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-3 sm:mb-4 font-medium"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Back to Cities</span>
          </button>
          <div className="flex items-center gap-2 sm:gap-3">
            <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{selectedCity}</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                {selectedGroup.count} {selectedGroup.count === 1 ? 'report' : 'reports'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="space-y-4 sm:space-y-6">
          {selectedGroup.reports.map((report) => {
            const isResolved = report.resolutionStatus === 'resolved' || report.status === 'resolved';
            const isExpanded = expandedReportId === report._id;
            const adminUpdates = report.adminActions?.filter(a => a.actionType !== 'photo_upload') || [];
            const commentKey = `${report._id}-comment`;

            return (
              <div 
                key={report._id} 
                className={`bg-white rounded-lg border-2 overflow-hidden transition ${
                  isResolved ? 'border-green-200 shadow-md' : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                {/* Report Header */}
                <div
                  className={`p-4 sm:p-6 cursor-pointer transition ${
                    isResolved ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setExpandedReportId(isExpanded ? null : report._id)}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Thumbnail */}
                    {report.photoUrl && (
                      <div className="relative w-20 h-20 sm:w-28 sm:h-28 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={report.photoUrl} 
                          alt={report.description} 
                          className="w-full h-full object-cover" 
                        />
                        {isResolved && (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start gap-2 mb-2">
                        {isResolved && (
                          <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                            RESOLVED
                          </span>
                        )}
                        {report.resolutionStatus && !isResolved && (
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold border-2 ${
                            getResolutionStatusColor(report.resolutionStatus)
                          }`}>
                            {report.resolutionStatus.toUpperCase()}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2">
                        {report.description}
                      </p>

                      <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="truncate max-w-[120px] sm:max-w-none">
                            {report.reporter?.name}
                          </span>
                        </div>
                        {report.assignedAdminName && (
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">
                            <Badge className="w-3 h-3" />
                            <span className="truncate max-w-[100px] sm:max-w-none">
                              {report.assignedAdminName}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mt-2 sm:mt-3">
                        {adminUpdates.length > 0 && (
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                            {adminUpdates.length} Updates
                          </span>
                        )}
                        {report.publicComments?.length > 0 && (
                          <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium">
                            {report.publicComments.length} Comments
                          </span>
                        )}
                      </div>
                    </div>

                    <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 flex-shrink-0 text-xs sm:text-sm">
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">{isExpanded ? 'Hide' : 'View'}</span>
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t-2 border-gray-200 bg-gray-50 p-4 sm:p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                      {/* Photos */}
                      <div className="lg:col-span-1">
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                          Evidence Photos
                        </h3>
                        <div className="space-y-3">
                          {report.photoUrl && (
                            <div>
                              <p className="text-xs text-gray-500 font-medium mb-2">Original Report</p>
                              <div className="w-full h-40 sm:h-48 bg-gray-200 rounded-lg overflow-hidden">
                                <img src={report.photoUrl} alt="Report" className="w-full h-full object-cover" />
                              </div>
                              <button
                                onClick={() => window.open(report.photoUrl, '_blank')}
                                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                              >
                                <Download className="w-4 h-4" />
                                Download
                              </button>
                            </div>
                          )}

                          {report.evidencePhotos?.length > 0 && (
                            <div>
                              <p className="text-xs text-gray-500 font-medium mb-2">
                                Admin Evidence ({report.evidencePhotos.length})
                              </p>
                              <div className="grid grid-cols-2 gap-2">
                                {report.evidencePhotos.map((photo, idx) => (
                                  <div 
                                    key={idx} 
                                    className="relative h-20 sm:h-24 bg-gray-200 rounded-lg overflow-hidden group cursor-pointer"
                                    onClick={() => window.open(photo.url, '_blank')}
                                  >
                                    <img src={photo.url} alt="Evidence" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition flex items-center justify-center">
                                      <div className="text-white opacity-0 group-hover:opacity-100 text-center text-xs p-1">
                                        <p className="font-medium truncate">{photo.uploadedBy}</p>
                                        <p>{new Date(photo.uploadedAt).toLocaleDateString()}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="lg:col-span-2 space-y-4">
                        {/* Location */}
                        {report.location?.address && (
                          <div>
                            <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-2 flex items-center gap-1 uppercase tracking-wide">
                              <MapPin className="w-4 h-4" /> Location
                            </h3>
                            <div className="bg-white rounded-lg border border-gray-300 p-3 sm:p-4">
                              <p className="text-sm sm:text-base text-gray-900 font-semibold mb-3">
                                {report.location.address}
                              </p>
                              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                <div className="p-2 sm:p-3 bg-blue-50 rounded-lg text-center">
                                  <p className="text-xs text-gray-600 font-bold uppercase mb-1">City</p>
                                  <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                                    {report.location.city || 'N/A'}
                                  </p>
                                </div>
                                <div className="p-2 sm:p-3 bg-purple-50 rounded-lg text-center">
                                  <p className="text-xs text-gray-600 font-bold uppercase mb-1">District</p>
                                  <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                                    {report.location.district || 'N/A'}
                                  </p>
                                </div>
                                <div className="p-2 sm:p-3 bg-orange-50 rounded-lg text-center">
                                  <p className="text-xs text-gray-600 font-bold uppercase mb-1">Province</p>
                                  <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                                    {report.location.province || 'N/A'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Reporter */}
                        <div>
                          <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-2 flex items-center gap-1 uppercase tracking-wide">
                            <User className="w-4 h-4" /> Reporter
                          </h3>
                          <div className="bg-white rounded-lg border border-gray-300 p-3 sm:p-4">
                            <p className="font-bold text-gray-900 text-sm sm:text-base">
                              {report.reporter?.name}
                            </p>
                            <a 
                              href={`mailto:${report.reporter?.email}`} 
                              className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm mt-2 inline-flex items-center gap-1"
                            >
                              <Mail className="w-3 h-3" />
                              {report.reporter?.email}
                            </a>
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                            Description
                          </h3>
                          <div className="bg-white rounded-lg border border-gray-300 p-3 sm:p-4">
                            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                              {report.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Admin Updates */}
                    {adminUpdates.length > 0 && (
                      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-300 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="bg-blue-600 rounded-full p-1.5">
                            <Badge className="w-4 h-4 text-white" />
                          </div>
                          <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wide">
                            Official Admin Response
                          </h3>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          {adminUpdates.map((action, idx) => (
                            <div key={idx} className="bg-white rounded-lg border-l-4 border-blue-600 p-3 sm:p-4 shadow-sm">
                              <div className="flex items-start justify-between mb-2 gap-2">
                                <div className="flex items-start gap-2 flex-1">
                                  <div className="bg-blue-100 rounded-full p-1.5 flex-shrink-0">
                                    <User className="w-4 h-4 text-blue-700" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-bold text-gray-900 text-sm sm:text-base">
                                      {action.adminName}
                                    </p>
                                    <p className="text-xs text-blue-700 font-medium">
                                      {action.adminPosition || 'Administrator'}
                                    </p>
                                  </div>
                                </div>
                                <span className="text-xs text-gray-500 flex items-center gap-1 flex-shrink-0">
                                  <Clock className="w-3 h-3" />
                                  <span className="hidden sm:inline">
                                    {new Date(action.timestamp).toLocaleString()}
                                  </span>
                                  <span className="sm:hidden">
                                    {new Date(action.timestamp).toLocaleDateString()}
                                  </span>
                                </span>
                              </div>

                              {action.actionType === 'comment' && action.comment && (
                                <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                                  <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
                                    {action.comment}
                                  </p>
                                </div>
                              )}

                              {action.actionType === 'status_update' && action.statusChange && (
                                <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                                    <span className="text-gray-600">Status Updated:</span>
                                    <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded line-through">
                                      {action.statusChange.from}
                                    </span>
                                    <span className="text-gray-400">→</span>
                                    <span className="px-2 py-1 bg-blue-600 text-white rounded font-bold">
                                      {action.statusChange.to}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {action.actionType === 'resolution' && (
                                <div className="mt-3 bg-green-50 border border-green-300 rounded-lg p-3">
                                  <div className="flex items-center gap-2 text-xs sm:text-sm text-green-800 font-bold">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <span>✅ This issue has been successfully resolved!</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Offices */}
                    {report.offices?.length > 0 && (
                      <div className="mb-4 sm:mb-6">
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-3 flex items-center gap-2 uppercase tracking-wide">
                          <Building2 className="w-4 h-4" /> Notified Offices
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                          {report.offices.map((office) => (
                            <div key={office._id} className="bg-white rounded-lg border border-gray-300 p-2 sm:p-3">
                              <p className="font-bold text-gray-900 text-xs sm:text-sm truncate">
                                {office.name}
                              </p>
                              <p className="text-xs text-gray-600 mt-1 uppercase font-medium">
                                {office.type}
                              </p>
                              <a 
                                href={`mailto:${office.email}`} 
                                className="text-xs text-blue-600 hover:text-blue-700 mt-2 inline-block truncate max-w-full"
                              >
                                {office.email}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Email Status */}
                    {report.emailsSent?.length > 0 && (
                      <div className="mb-4 sm:mb-6">
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                          Email Status
                        </h3>
                        <div className="space-y-1 sm:space-y-2">
                          {report.emailsSent.map((email, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs sm:text-sm bg-white rounded border border-gray-200 p-2">
                              {email.status === 'success' ? (
                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                              ) : (
                                <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 flex-shrink-0" />
                              )}
                              <span className="text-gray-700 flex-1 truncate">{email.email}</span>
                              <span className="text-gray-500 capitalize text-xs flex-shrink-0">
                                {email.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Public Comments */}
                    <div className="border-t-2 border-gray-300 pt-4 sm:pt-6">
                      <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 uppercase tracking-wide">
                        <MessageSquare className="w-4 h-4" /> Public Comments ({report.publicComments?.length || 0})
                      </h3>

                      {/* Comments List */}
                      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 max-h-96 overflow-y-auto">
                        {(!report.publicComments || report.publicComments.length === 0) ? (
                          <p className="text-gray-500 text-xs sm:text-sm text-center py-4 sm:py-6 bg-gray-100 rounded-lg">
                            No comments yet. Be the first!
                          </p>
                        ) : (
                          report.publicComments.map((comment, idx) => (
                            <div key={idx} className="bg-white rounded-lg border border-gray-300 p-3 sm:p-4">
                              <div className="flex items-start justify-between mb-2 gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-gray-900 text-xs sm:text-sm truncate">
                                    {comment.name}
                                  </p>
                                  <p className="text-xs text-gray-600 truncate">{comment.email}</p>
                                </div>
                                <span className="text-xs text-gray-500 flex-shrink-0">
                                  {new Date(comment.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                                {comment.text}
                              </p>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Add Comment Form */}
                 {/* Add Comment Form */}
/* Add Comment Form - CORRECTED VERSION */
<div className="bg-white rounded-xl shadow-lg p-6 mt-6">
  <h3 className="text-xl font-bold text-black mb-4">
    Share Your Thoughts
  </h3>
  
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
    <div>
      <label className="block text-sm font-semibold text-black mb-2">
        Your Name *
      </label>
      <input
        type="text"
        placeholder="Enter your name"
        value={publicCommentName[`${report._id}-name`] || ''}
        onChange={(e) => 
          setPublicCommentName(prev => ({ 
            ...prev, 
            [`${report._id}-name`]: e.target.value 
          }))
        }
        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    
    <div>
      <label className="block text-sm font-semibold text-black mb-2">
        Your Email *
      </label>
      <input
        type="email"
        placeholder="Enter your email"
        value={publicCommentEmail[`${report._id}-email`] || ''}
        onChange={(e) => 
          setPublicCommentEmail(prev => ({ 
            ...prev, 
            [`${report._id}-email`]: e.target.value 
          }))
        }
        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
  
  <div className="mb-4">
    <label className="block text-sm font-semibold text-black mb-2">
      Share your thoughts *
    </label>
    <textarea
      placeholder="Write your comment here..."
      value={publicCommentText[commentKey] || ''}
      onChange={(e) => 
        setPublicCommentText(prev => ({ 
          ...prev, 
          [commentKey]: e.target.value 
        }))
      }
      rows={3}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
    />
  </div>
  
  <button
    onClick={() => submitPublicComment(report._id)}
    disabled={
      submittingComment[commentKey] ||
      !publicCommentText[commentKey]?.trim() ||
      !publicCommentName[`${report._id}-name`]?.trim() ||
      !publicCommentEmail[`${report._id}-email`]?.trim()
    }
    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 text-white py-2 sm:py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition text-sm"
  >
    {submittingComment[commentKey] ? (
      <>
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-white">Submitting...</span>
      </>
    ) : (
      <>
        <Send className="w-4 h-4" />
        <span className="text-white">Submit Comment</span>
      </>
    )}
  </button>


                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}