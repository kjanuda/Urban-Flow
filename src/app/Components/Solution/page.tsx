import React from 'react';
import { MapPin, Brain, Building2, Clock, Trophy, Eye } from 'lucide-react';

const Solution = () => {
  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Real-Time GPS Reporting",
      description: "Citizens report problems instantly using GPS technology. Issues like road damage, waste management, or broken streetlights are logged with precise location data."
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Data Completion",
      description: "Google Gemini AI automatically fills missing or incomplete data, ensuring reliability and accuracy across all reports and submissions."
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Smart Office Identification",
      description: "System automatically identifies the nearest Divisional Secretariat Office with complete contact information including address, phone, email, and website."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Distance & Time Calculation",
      description: "Google Distance Matrix API calculates actual road distances and travel times, enabling faster response and better coordination between authorities."
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Performance Leaderboards",
      description: "Districts and cities are ranked based on issue-solving performance, promoting accountability and healthy competition among local authorities."
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Citizen Progress Tracking",
      description: "Track the status of reported issues in real-time, enhancing transparency, building civic trust, and keeping citizens engaged throughout the resolution process."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            City Problem Reporter Solution
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A smart, technology-driven solution to manage and solve city-related problems efficiently. 
            Connecting citizens, local authorities, and data systems through an intelligent platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg text-blue-600">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

       

        
          </div>
        </div>

      
  );
};

export default Solution;