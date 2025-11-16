import React from 'react';
import { CheckCircle, Zap, Target } from 'lucide-react';

const Definition = () => {
  const definitions = [
    {
      title: "What is City Problem Reporting?",
      description: "A smart civic engagement platform that empowers citizens to report urban infrastructure issues in real-time, enabling faster problem identification and resolution across city divisions.",
      icon: <Target className="w-12 h-12" />,
      highlight: "Real-Time Reporting"
    },
    {
      title: "Why Smart Governance Matters",
      description: "Traditional governance systems face delays and communication gaps. Smart governance leverages AI, GPS technology, and data analytics to create transparent, efficient, and citizen-centric urban management.",
      icon: <Zap className="w-12 h-12" />,
      highlight: "Data-Driven Solutions"
    },
    {
      title: "How It Works",
      description: "Citizens report issues via GPS location, the system automatically identifies the nearest Divisional Secretariat Office, AI completes missing data, and authorities track resolution progress through performance leaderboards.",
      icon: <CheckCircle className="w-12 h-12" />,
      highlight: "Seamless Integration"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background Image */}
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <img 
          src="/The-Gateway-to-South-Asia-v3-1920x1050-3.jpg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/30 to-blue-900/30"></div>

        {/* Header Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto py-20">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-full text-cyan-300 text-sm font-semibold uppercase tracking-wider">
              Smart Governance Platform
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Understanding Smart City Solutions
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Transforming urban governance through technology, transparency, and citizen participation
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-16">
        {/* Definitions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {definitions.map((item, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2"
            >
              {/* Content Container */}
              <div className="p-8 bg-white">
                {/* Highlight Tag */}
                <div className="mb-4">
                  <span className="text-sm font-semibold text-cyan-600 uppercase tracking-wider">
                    {item.highlight}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h2>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Definition;