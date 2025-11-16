'use client';

import React from 'react';
import { CheckCircle, Users, TrendingUp, Eye, BarChart3, Zap } from 'lucide-react';

interface ImplementationFeature {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  highlights: string[];
  color: string;
}

const Implementations = () => {
  const features: ImplementationFeature[] = [
    {
      id: 1,
      title: 'Citizen Engagement',
      description:
        'Citizens can easily report city-related problems such as damaged roads, garbage issues, streetlight failures, or water leaks directly from their mobile or web app.',
      icon: <Users className="w-8 h-8" />,
      highlights: [
        'Mobile and web app access',
        'Auto-tagged location & time',
        'Multi-category reporting',
        'Faster response times'
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      title: 'Smart City Governance',
      description:
        'Reported issues are forwarded to the nearest regional or divisional office, ensuring the right department handles them with real-time updates.',
      icon: <TrendingUp className="w-8 h-8" />,
      highlights: [
        'Automatic routing to departments',
        'Real-time notifications',
        'Status tracking (pending/in-progress/resolved)',
        'Reduced workflow delays'
      ],
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 3,
      title: 'Performance Tracking',
      description:
        'A leaderboard system ranks cities, districts, and provinces based on problems reported and resolution speed, motivating better performance.',
      icon: <BarChart3 className="w-8 h-8" />,
      highlights: [
        'Competitive leaderboards',
        'Performance metrics',
        'Resolution speed tracking',
        'Healthy competition incentives'
      ],
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 4,
      title: 'Transparency & Accountability',
      description:
        'Every reported issue is visible to the public, and citizens can track progress until resolution. This builds trust and reduces corruption.',
      icon: <Eye className="w-8 h-8" />,
      highlights: [
        'Public visibility of issues',
        'Real-time progress tracking',
        'Trust building',
        'Corruption reduction'
      ],
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 5,
      title: 'Data-Driven Decision Making',
      description:
        'Analyzing frequently reported issues and locations helps identify patterns for better infrastructure planning, budget allocation, and predicting future challenges.',
      icon: <BarChart3 className="w-8 h-8" />,
      highlights: [
        'Pattern identification',
        'Infrastructure planning',
        'Wise budget allocation',
        'Predictive analytics'
      ],
      color: 'from-indigo-500 to-blue-500'
    },
    {
      id: 6,
      title: 'Community Empowerment',
      description:
        'The platform empowers citizens to take an active role in improving their cities, transforming complaints into collective action.',
      icon: <Zap className="w-8 h-8" />,
      highlights: [
        'Active citizen participation',
        'Collective action',
        'Smart city ecosystem',
        'Community ownership'
      ],
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: 'url(/clm2.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >

      {/* Content Container */}
      <div className="relative z-10">
        {/* Header */}
        <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            How It Works
          </h1>
          <p className="text-lg text-slate-100 max-w-2xl mx-auto drop-shadow-md">
            A practical civic management solution that transforms urban governance through smart technology, citizen engagement, and data-driven decisions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="group relative h-full bg-white/15 backdrop-blur-lg rounded-lg overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-2xl hover:bg-white/20"
              >
                {/* Gradient accent on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                {/* Content */}
                <div className="relative p-6 h-full flex flex-col">
                  {/* Icon */}
                  <div
                    className="mb-4 inline-flex p-3 rounded-lg bg-white/20 backdrop-blur-sm w-fit shadow-lg border border-white/30"
                  >
                    <div className="text-white drop-shadow-lg">{feature.icon}</div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3 drop-shadow-md group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-200 transition-all duration-300">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-100 text-sm mb-6 flex-grow drop-shadow-sm">
                    {feature.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-2">
                    {feature.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-300 mt-0.5 flex-shrink-0 drop-shadow-md" />
                        <span className="text-sm text-slate-100 drop-shadow-sm">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Section */}
        <div className="mt-20 px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/15 backdrop-blur-lg border border-white/20 rounded-lg p-8 hover:bg-white/20 transition-all duration-300">
              <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-md">
                ✨ Project Impact
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-blue-100 mb-2 drop-shadow-md">
                    For Citizens
                  </h3>
                  <ul className="space-y-2 text-slate-100">
                    <li className="flex items-center gap-2 drop-shadow-sm">
                      <span className="w-2 h-2 bg-blue-300 rounded-full" />
                      Easy problem reporting
                    </li>
                    <li className="flex items-center gap-2 drop-shadow-sm">
                      <span className="w-2 h-2 bg-blue-300 rounded-full" />
                      Real-time progress tracking
                    </li>
                    <li className="flex items-center gap-2 drop-shadow-sm">
                      <span className="w-2 h-2 bg-blue-300 rounded-full" />
                      Active voice in governance
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-100 mb-2 drop-shadow-md">
                    For Authorities
                  </h3>
                  <ul className="space-y-2 text-slate-100">
                    <li className="flex items-center gap-2 drop-shadow-sm">
                      <span className="w-2 h-2 bg-blue-300 rounded-full" />
                      Efficient issue management
                    </li>
                    <li className="flex items-center gap-2 drop-shadow-sm">
                      <span className="w-2 h-2 bg-blue-300 rounded-full" />
                      Data-driven insights
                    </li>
                    <li className="flex items-center gap-2 drop-shadow-sm">
                      <span className="w-2 h-2 bg-blue-300 rounded-full" />
                      Performance accountability
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Implementations;