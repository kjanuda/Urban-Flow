'use client';

import React, { useState } from 'react';
import { AlertCircle, Database, Users, Handshake, Wifi, Lock, Zap, DollarSign, ChevronDown, ArrowRight } from 'lucide-react';

interface Challenge {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  solutions: string[];
}

const Challenges = () => {
  const [expandedId, setExpandedId] = useState<number | null>(1);

  const challenges: Challenge[] = [
    {
      id: 1,
      title: 'Data Accuracy',
      description: 'GPS location and user-submitted data may be inaccurate or incomplete, leading to issues being sent to wrong locations.',
      icon: <Database className="w-6 h-6" />,
      solutions: [
        'Implement advanced GPS validation algorithms',
        'Cross-verify data with multiple sources',
        'User feedback mechanism for corrections',
        'Real-time accuracy monitoring'
      ]
    },
    {
      id: 2,
      title: 'User Adoption',
      description: 'Many citizens may be unaware of the platform or reluctant to use digital tools for reporting issues.',
      icon: <Users className="w-6 h-6" />,
      solutions: [
        'Comprehensive public awareness campaigns',
        'Simplified, intuitive user interface',
        'Multilingual platform support',
        'Offline-first mobile app features'
      ]
    },
    {
      id: 3,
      title: 'Government Collaboration',
      description: 'System success depends on active local authority participation. Some offices may delay responses or fail to update statuses.',
      icon: <Handshake className="w-6 h-6" />,
      solutions: [
        'Establish formal government partnerships',
        'Performance accountability metrics',
        'Regular training for officials',
        'Automated escalation for delayed cases'
      ]
    },
    {
      id: 4,
      title: 'Infrastructure Limitations',
      description: 'Rural or underdeveloped areas lack proper internet connectivity, making real-time reporting difficult.',
      icon: <Wifi className="w-6 h-6" />,
      solutions: [
        'SMS-based reporting options',
        'Offline data sync capabilities',
        'Low-bandwidth optimization',
        'Community reporting kiosks'
      ]
    },
    {
      id: 5,
      title: 'Data Management & Privacy',
      description: 'Collecting large volumes of public data requires strong protection measures and safeguarding of user privacy.',
      icon: <Lock className="w-6 h-6" />,
      solutions: [
        'End-to-end encryption protocols',
        'GDPR and data protection compliance',
        'Regular security audits',
        'Anonymous reporting options'
      ]
    },
    {
      id: 6,
      title: 'System Scalability',
      description: 'As more cities join, the platform must handle higher data loads and larger maps while maintaining fast performance.',
      icon: <Zap className="w-6 h-6" />,
      solutions: [
        'Cloud-based distributed architecture',
        'Database optimization and caching',
        'Load balancing strategies',
        'Auto-scaling infrastructure'
      ]
    },
    {
      id: 7,
      title: 'Maintenance & Funding',
      description: 'Continuous updates, technical maintenance, and cloud costs become challenging without sustainable funding or partnerships.',
      icon: <DollarSign className="w-6 h-6" />,
      solutions: [
        'Multi-stakeholder funding model',
        'Government budget allocation',
        'Corporate partnerships and sponsorships',
        'Open-source community contributions'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full border border-slate-200">
            <AlertCircle className="w-5 h-5 text-slate-600" />
            <span className="text-slate-700 font-medium text-sm">Implementation Challenges</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Overcoming Obstacles
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Every innovative solution faces challenges. We've identified key obstacles and developed strategic approaches to ensure successful implementation across all cities.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Challenges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {challenges.map((challenge, index) => (
              <div
                key={challenge.id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-500 overflow-hidden cursor-pointer border border-gray-200 hover:border-slate-300"
                onClick={() => setExpandedId(expandedId === challenge.id ? null : challenge.id)}
              >
                {/* Left accent bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-slate-400 to-slate-200 opacity-60" />

                {/* Content */}
                <div className="pl-6 pr-6 py-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="inline-flex p-3 rounded-lg bg-gray-100 text-slate-600 group-hover:bg-slate-100 transition-colors">
                      {challenge.icon}
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                        expandedId === challenge.id ? 'rotate-180' : ''
                      }`}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-slate-700 transition-colors">
                    {challenge.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {challenge.description}
                  </p>

                  {/* Expandable Solutions */}
                  {expandedId === challenge.id && (
                    <div className="mt-5 pt-5 border-t border-gray-200 animate-in fade-in duration-300">
                      <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-4">
                        Our Solutions
                      </h4>
                      <ul className="space-y-3">
                        {challenge.solutions.map((solution, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{solution}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Strategy Overview */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-12">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-10">
              <h2 className="text-3xl font-bold text-white mb-2">
                Strategic Approach
              </h2>
              <p className="text-slate-200">
                Three-tier mitigation strategy
              </p>
            </div>

            {/* Content */}
            <div className="p-8 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Phase 1 */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-semibold flex items-center justify-center text-sm">
                      1
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Immediate Actions</h3>
                  </div>
                  <ul className="space-y-3">
                    {['Data validation', 'Security setup', 'Partnership talks'].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-600 text-sm">
                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Phase 2 */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-semibold flex items-center justify-center text-sm">
                      2
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Medium Term</h3>
                  </div>
                  <ul className="space-y-3">
                    {['Infrastructure build', 'User training', 'Performance monitoring'].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-600 text-sm">
                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Phase 3 */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-semibold flex items-center justify-center text-sm">
                      3
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Long Term</h3>
                  </div>
                  <ul className="space-y-3">
                    {['System scaling', 'Sustainability', 'Expansion'].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-600 text-sm">
                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-10 pt-8 border-t border-gray-200">
                <p className="text-gray-600 mb-4">
                  Learn more about our comprehensive implementation roadmap and how we address each challenge strategically.
                </p>
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg transition-colors duration-300">
                  View Full Roadmap <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center hover:shadow-sm transition-shadow">
          
            
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center hover:shadow-sm transition-shadow">
           
           
            </div>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Challenges;