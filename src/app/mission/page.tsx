import React from 'react';
import { CheckCircle, Users, BarChart3, Eye, Heart, Target } from 'lucide-react';
import headerImage2 from '../../../public/port.jpg';

export default function Mission() {
  const goals = [
    {
      icon: Users,
      title: "Strengthen citizen involvement",
      description: "Give every Sri Lankan—urban or rural—a simple, mobile-friendly way to report issues such as garbage problems, potholes, broken street lights, flooding, drainage issues, and more."
    },
    {
      icon: Target,
      title: "Support government efficiency",
      description: "Provide local authorities with real-time issue data, automated location detection, and smart dashboards to help them respond faster and allocate resources better."
    },
    {
      icon: BarChart3,
      title: "Build data-driven smart cities & villages",
      description: "Use analytics and province/district/city leaderboards to identify high-problem areas, reward improvements, and make long-term planning easier."
    },
    {
      icon: Eye,
      title: "Promote transparency & public trust",
      description: "Allow citizens to track the progress of their reports and see how quickly their council responds—ensuring accountability and reducing delays."
    },
    {
      icon: Heart,
      title: "Improve public health & environmental quality",
      description: "Faster resolution of waste issues, water leaks, mosquito breeding areas, unsafe roads, and pollution helps create a safer, healthier Sri Lanka."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <div className="relative h-[40vh] sm:h-[50vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={headerImage2.src}
            alt="Sri Lankan cityscape"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative h-full flex items-center justify-center px-4 bg-black/50">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center">
            Our Mission
          </h1>
        </div>
      </div>

      {/* Goal Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-12 sm:mb-16">

          {/* Mission description */}
          <p className="text-base sm:text-lg text-gray-700 max-w-4xl mx-auto mb-6 sm:mb-8 px-2">
            Empowering Sri Lankans to build cleaner, safer, and well-managed cities and villages 
            by allowing people to instantly report issues and enabling authorities to respond 
            quickly and transparently.
          </p>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">Our Goal</h2>

          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            Create a unified digital bridge between the public and local government—
            Municipal Councils, Urban Councils, Pradeshiya Sabhas, District Secretariats,
            and Provincial Councils—so every community can benefit from faster problem-solving
            and improved public services.
          </p>
        </div>

        {/* Goals Cards */}
        <div className="space-y-6 sm:space-y-8">
          {goals.map((goal, index) => (
            <div
              key={index}
              className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-5 sm:p-6 lg:p-8 flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <div className="bg-gray-100 p-3 sm:p-4 rounded-lg sm:rounded-xl flex-shrink-0">
                  <goal.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-black" />
                </div>
                <div className="flex-1 w-full">
                  <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5 sm:mt-1" />
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{goal.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">{goal.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={headerImage2.src}
            alt="Sri Lankan landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-blue-900/90"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Together, We Build a Better Sri Lanka
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8">
            Join thousands of citizens and local authorities working together 
            to create cleaner, safer, and more livable communities across our 
            beautiful island.
          </p>
          <button className="bg-white text-blue-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:bg-blue-50 transition-colors duration-300 shadow-lg">
            Start Reporting Issues
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">9+</div>
              <div className="text-sm sm:text-base text-gray-600">Provinces Connected</div>
            </div>
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">25+</div>
              <div className="text-sm sm:text-base text-gray-600">Districts Covered</div>
            </div>
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-2">300+</div>
              <div className="text-sm sm:text-base text-gray-600">Local Authorities</div>
            </div>
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-bold text-orange-600 mb-2">22M</div>
              <div className="text-sm sm:text-base text-gray-600">Citizens Empowered</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}