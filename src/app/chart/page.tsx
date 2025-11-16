'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  MapPin,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  Users,
  Building2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

interface Report {
  _id: string;
  reporter: {
    name: string;
    email: string;
  };
  description: string;
  location?: {
    city?: string;
    district?: string;
    province?: string;
    address?: string;
  };
  status: string;
  createdAt: string;
}

interface AreaData {
  name: string;
  reports: number;
  percentage: number;
}

interface StatusData {
  name: string;
  value: number;
  percentage: number;
}

interface TimelineData {
  date: string;
  reports: number;
}

// Add a more flexible type for Recharts data
type ChartData = Record<string, any>;

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const COLORS = {
  primary: ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'],
  status: {
    submitted: '#FCD34D',
    'in-progress': '#60A5FA',
    resolved: '#34D399'
  },
  danger: ['#EF4444', '#F87171', '#FCA5A5', '#FECACA', '#FEE2E2'],
  success: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5']
};

export default function AnalyticsDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'overview' | 'cities' | 'districts' | 'provinces'>('overview');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('all');

  // Analytics data
  const [cityData, setCityData] = useState<AreaData[]>([]);
  const [districtData, setDistrictData] = useState<AreaData[]>([]);
  const [provinceData, setProvinceData] = useState<AreaData[]>([]);
  const [statusData, setStatusData] = useState<StatusData[]>([]);
  const [timelineData, setTimelineData] = useState<TimelineData[]>([]);

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    if (reports.length > 0) {
      calculateAnalytics();
    }
  }, [reports, timeRange]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/reports?limit=1000`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store'
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const text = await response.text();
      if (!text) throw new Error('Empty response');
      
      const data = JSON.parse(text);
      
      if (data.success && Array.isArray(data.reports)) {
        setReports(data.reports);
      } else {
        throw new Error(data.error || 'Failed to fetch reports');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to load');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const filterReportsByTimeRange = (allReports: Report[]) => {
    if (timeRange === 'all') return allReports;
    
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (timeRange) {
      case '7d':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        cutoffDate.setDate(now.getDate() - 90);
        break;
    }
    
    return allReports.filter(r => new Date(r.createdAt) >= cutoffDate);
  };

  const calculateAnalytics = () => {
    const filteredReports = filterReportsByTimeRange(reports);
    const total = filteredReports.length;

    // City Analytics
    const cityCount: Record<string, number> = {};
    filteredReports.forEach(r => {
      const city = r.location?.city || 'Unknown';
      cityCount[city] = (cityCount[city] || 0) + 1;
    });
    
    const cities = Object.entries(cityCount)
      .map(([name, reports]) => ({
        name,
        reports,
        percentage: (reports / total) * 100
      }))
      .sort((a, b) => b.reports - a.reports)
      .slice(0, 10);
    setCityData(cities);

    // District Analytics
    const districtCount: Record<string, number> = {};
    filteredReports.forEach(r => {
      const district = r.location?.district || 'Unknown';
      districtCount[district] = (districtCount[district] || 0) + 1;
    });
    
    const districts = Object.entries(districtCount)
      .map(([name, reports]) => ({
        name,
        reports,
        percentage: (reports / total) * 100
      }))
      .sort((a, b) => b.reports - a.reports)
      .slice(0, 10);
    setDistrictData(districts);

    // Province Analytics
    const provinceCount: Record<string, number> = {};
    filteredReports.forEach(r => {
      const province = r.location?.province || 'Unknown';
      provinceCount[province] = (provinceCount[province] || 0) + 1;
    });
    
    const provinces = Object.entries(provinceCount)
      .map(([name, reports]) => ({
        name,
        reports,
        percentage: (reports / total) * 100
      }))
      .sort((a, b) => b.reports - a.reports);
    setProvinceData(provinces);

    // Status Analytics
    const statusCount: Record<string, number> = {};
    filteredReports.forEach(r => {
      const status = r.status || 'submitted';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });
    
    const statuses = Object.entries(statusCount)
      .map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count,
        percentage: (count / total) * 100
      }));
    setStatusData(statuses);

    // Timeline Analytics (Last 30 days)
    const timeline: Record<string, number> = {};
    const last30Days = filterReportsByTimeRange(reports).filter(r => {
      const reportDate = new Date(r.createdAt);
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - 30);
      return reportDate >= daysAgo;
    });

    last30Days.forEach(r => {
      const date = new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      timeline[date] = (timeline[date] || 0) + 1;
    });

    const timelineArray = Object.entries(timeline)
      .map(([date, reports]) => ({ date, reports }))
      .slice(-14); // Last 14 days
    setTimelineData(timelineArray);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-blue-600 font-medium">
            Reports: {payload[0].value}
          </p>
          {payload[0].payload.percentage && (
            <p className="text-gray-600 text-sm">
              {payload[0].payload.percentage.toFixed(1)}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom label renderer for pie charts
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index
  }: any) => {
    if (!statusData[index]) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-sm font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4 mx-auto"></div>
          <p className="text-gray-700 text-lg font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Error Loading Data</h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <button
            onClick={fetchReports}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
          >
            <RefreshCw className="w-5 h-5" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const filteredReports = filterReportsByTimeRange(reports);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-gray-600 mt-1">Comprehensive insights into report data</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Time Range Filter */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="all">All Time</option>
              </select>
              
              <button
                onClick={fetchReports}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center gap-2 transition shadow-lg shadow-blue-200"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 font-medium">Total Reports</p>
              <div className="bg-blue-100 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{filteredReports.length}</p>
            <p className="text-sm text-gray-500 mt-1">Across all regions</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 font-medium">Cities</p>
              <div className="bg-green-100 p-2 rounded-lg">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{cityData.length}</p>
            <p className="text-sm text-gray-500 mt-1">Active locations</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 font-medium">Districts</p>
              <div className="bg-purple-100 p-2 rounded-lg">
                <Building2 className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{districtData.length}</p>
            <p className="text-sm text-gray-500 mt-1">Reporting districts</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 font-medium">Provinces</p>
              <div className="bg-orange-100 p-2 rounded-lg">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{provinceData.length}</p>
            <p className="text-sm text-gray-500 mt-1">Coverage areas</p>
          </div>
        </div>

        {/* View Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'cities', label: 'Cities', icon: MapPin },
              { id: 'districts', label: 'Districts', icon: Building2 },
              { id: 'provinces', label: 'Provinces', icon: Users }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedView(tab.id as any)}
                className={`flex-1 min-w-[120px] px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition ${
                  selectedView === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview View */}
        {selectedView === 'overview' && (
          <div className="space-y-8">
            {/* Timeline Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                Reports Timeline (Last 14 Days)
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="reports" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Status Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Status Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData as ChartData[]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS.primary[index % COLORS.primary.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Top 5 Provinces</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={provinceData.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="reports" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Cities View */}
        {selectedView === 'cities' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-blue-600" />
                Top 10 Cities by Report Count
              </h2>
              <ResponsiveContainer width="100%" height={500}>
                <BarChart data={cityData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" stroke="#6B7280" />
                  <YAxis dataKey="name" type="category" width={150} stroke="#6B7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="reports" fill="#3B82F6" radius={[0, 8, 8, 0]}>
                    {cityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.primary[index % COLORS.primary.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">City Distribution</h2>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={cityData.slice(0, 8) as ChartData[]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="reports"
                  >
                    {cityData.slice(0, 8).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.primary[index % COLORS.primary.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Districts View */}
        {selectedView === 'districts' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-purple-600" />
                Top 10 Districts by Report Count
              </h2>
              <ResponsiveContainer width="100%" height={500}>
                <BarChart data={districtData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" angle={-45} textAnchor="end" height={100} />
                  <YAxis stroke="#6B7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="reports" fill="#8B5CF6" radius={[8, 8, 0, 0]}>
                    {districtData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.primary[index % COLORS.primary.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">District Distribution</h2>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={districtData.slice(0, 8) as ChartData[]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="reports"
                  >
                    {districtData.slice(0, 8).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.primary[index % COLORS.primary.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Provinces View */}
        {selectedView === 'provinces' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Users className="w-6 h-6 text-orange-600" />
                All Provinces by Report Count
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={provinceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" stroke="#6B7280" />
                  <YAxis dataKey="name" type="category" width={120} stroke="#6B7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="reports" fill="#F97316" radius={[0, 8, 8, 0]}>
                    {provinceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.primary[index % COLORS.primary.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Province Distribution</h2>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={provinceData as ChartData[]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="reports"
                  >
                    {provinceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.primary[index % COLORS.primary.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Detailed Statistics</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    {selectedView === 'cities' ? 'City' : selectedView === 'districts' ? 'District' : 'Province'}
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Reports</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Percentage</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Distribution</th>
                </tr>
              </thead>
              <tbody>
                {(selectedView === 'cities' ? cityData : selectedView === 'districts' ? districtData : provinceData).map((item, index) => (
                  <tr key={item.name} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 font-bold rounded-full">
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{item.name}</td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900">{item.reports}</td>
                    <td className="py-3 px-4 text-right text-gray-600">{item.percentage.toFixed(2)}%</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
