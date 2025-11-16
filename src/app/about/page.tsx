import React from 'react';
import { Users, Code, Brain, Palette, MapPin, Shield, CheckCircle } from 'lucide-react';
import headerImage2 from '../../../public/prt.jpg';

const OurTeam = () => {
  const teams = [
    {
      icon: Code,
      title: "Software Engineers",
      description: "Our engineering team works on the backend, frontend, and database, ensuring high accuracy, fast performance, and seamless integration with Google Maps and AI systems."
    },
    {
      icon: Brain,
      title: "AI & Data Specialists",
      description: "The AI team focuses on intelligent data retrieval, missing-data prediction, office information enrichment, and analytics for the city leaderboard."
    },
    {
      icon: Palette,
      title: "UI/UX Designers",
      description: "Designers ensure that the platform is simple, clear, and accessible for all Sri Lankans, from mobile users to administrators."
    }
  ];

  const researchTeams = [
    {
      icon: MapPin,
      title: "Location & Mapping Research",
      description: "This team continuously validates Sri Lankan Divisional Secretariat databases, city boundaries, and local administrative structures to ensure precise office detection."
    },
    {
      icon: Users,
      title: "Public Service Coordination",
      description: "Helps align the platform with real government workflows—Divisional Secretariats, Local Councils, Disaster Management Offices, and more."
    }
  ];

  const qaFeatures = [
    "Rigorous testing",
    "Security validation",
    "API reliability checks",
    "Data protection",
    "Performance optimization"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[35vh] sm:h-[40vh] md:h-[45vh] lg:h-[50vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={headerImage2.src}
            alt="Our Team"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative h-full flex items-center justify-center px-3 sm:px-4 md:px-6 bg-black/50">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3 sm:mb-4 px-2">
              Our Team
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-3xl mx-auto px-3 sm:px-4">
              A passionate team of innovators dedicated to improving public services and building a smarter Sri Lanka
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Mission Statement */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100 mb-8 sm:mb-12 md:mb-16">
          <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
            The City Problem Reporter project is built by a passionate team of innovators dedicated to improving public services and building a smarter Sri Lanka. Our mission is to use technology to strengthen the connection between citizens and local authorities, helping create cleaner, safer, and more efficient cities for everyone.
          </p>
        </div>

        {/* Project Leadership */}
        <div className="mb-8 sm:mb-12 md:mb-16">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-1 h-6 sm:h-8 bg-cyan-500 rounded-full"></div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Project Leadership</h2>
          </div>
          
          <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg text-white">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Users className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Januda Janandith</h3>
                <p className="text-base sm:text-lg md:text-xl font-semibold text-white/90 mb-3 sm:mb-4">Founder & Lead Engineer</p>
                <p className="text-sm sm:text-base leading-relaxed">
                  The visionary behind City Problem Reporter, responsible for system architecture, backend development, AI integration, and overall direction of the platform.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Development Team */}
        <div className="mb-8 sm:mb-12 md:mb-16">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-1 h-6 sm:h-8 bg-cyan-500 rounded-full"></div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Core Development Team</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {teams.map((team, index) => (
              <div
                key={index}
                className="bg-white rounded-lg sm:rounded-xl p-5 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-cyan-50 flex items-center justify-center mb-3 sm:mb-4 text-cyan-600">
                  <team.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                  {team.title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {team.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Research & City Operations Team */}
        <div className="mb-8 sm:mb-12 md:mb-16">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-1 h-6 sm:h-8 bg-cyan-500 rounded-full"></div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Research & City Operations Team</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            {researchTeams.map((team, index) => (
              <div
                key={index}
                className="bg-white rounded-lg sm:rounded-xl p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-cyan-50 flex items-center justify-center mb-3 sm:mb-4 text-cyan-600">
                  <team.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                  {team.title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {team.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Assurance & Security Team */}
        <div>
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-1 h-6 sm:h-8 bg-cyan-500 rounded-full"></div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Quality Assurance & Security Team</h2>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border border-gray-100">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4 sm:mb-6">
                  Ensures the system is safe, reliable, and accurate:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {qaFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 sm:gap-3">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      
        
        
     
    </div>
  );
};

export default OurTeam;