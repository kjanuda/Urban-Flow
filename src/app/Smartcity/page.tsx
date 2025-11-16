import React from 'react';
import { 
  MapPin, 
  Navigation, 
  Brain, 
  Route, 
  Award, 
  Eye, 
  BarChart3, 
  Bell,
  Zap,
  Target,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import headerImage2 from '../../../public/center.jpg';

const Solutions = () => {
  const solutions = [
    {
      icon: MapPin,
      number: "1",
      title: "Real-Time Issue Reporting",
      description: "Citizens can instantly report city problems using GPS, photos, and descriptions.",
      solves: ["Delayed reporting", "Missing information", "Miscommunication with offices"],
      impact: "Transforms manual complaints into fast, digital problem reporting."
    },
    {
      icon: Navigation,
      number: "2",
      title: "Automatic Nearest Office Detection",
      description: "Using Google Maps APIs, the system finds the closest Divisional Secretariat or Local Council.",
      solves: ["Citizens not knowing the correct office", "Wrong office complaints", "Time wasted searching"],
      impact: "Provides faster routing of issues to the right authority."
    },
    {
      icon: Brain,
      number: "3",
      title: "AI-Powered Information Completion",
      description: "If official data is missing (email, phone, website), the system uses Google Gemini AI to fill in gaps.",
      solves: ["Outdated or incomplete office databases", "Missing contact details", "Manual verification delays"],
      impact: "Ensures always-accurate, AI-enhanced city information."
    },
    {
      icon: Route,
      number: "4",
      title: "Road Distance & Travel-Time Calculation",
      description: "Using Google Distance Matrix, users see real road distance and estimated travel time.",
      solves: ["Wrong distance (straight-line)", "Confusion about travel time", "Inaccurate problem routing"],
      impact: "Exact travel-based routing for officials and citizens."
    },
    {
      icon: Award,
      number: "5",
      title: "Smart City Leaderboard System",
      description: "Cities, districts, and provinces are ranked based on problems solved, response time, and efficiency score.",
      solves: ["Lack of accountability", "No performance measurement", "Slow problem resolution"],
      impact: "Creates healthy competition, improves government efficiency."
    },
    {
      icon: Eye,
      number: "6",
      title: "Transparency & Public Engagement",
      description: "Citizens can track issue status: Pending → In Progress → Solved",
      solves: ["Lack of transparency", "No citizen feedback", "Trust issues"],
      impact: "Builds trust between citizens and authorities."
    },
    {
      icon: BarChart3,
      number: "7",
      title: "City-Level Data Insights",
      description: "The platform analyzes problem hotspots, frequent issues, time-to-resolution, and city performance patterns.",
      solves: ["No data for decision-making", "No analytics for city planning", "Inefficient resource allocation"],
      impact: "Supports data-driven planning for Sri Lankan cities."
    },
    {
      icon: Bell,
      number: "8",
      title: "Digital Communication & Notifications",
      description: "Authorities receive email alerts instantly. Citizens are notified when issues are solved.",
      solves: ["Slow communication", "No feedback loops", "Manual follow-up"],
      impact: "Improves communication speed and efficiency."
    }
  ];

  const highlights = [
    { icon: Zap, title: "Efficiency", description: "Lightning-fast problem reporting and routing" },
    { icon: Target, title: "Accountability", description: "Performance tracking and public leaderboards" },
    { icon: TrendingUp, title: "Transparency", description: "Real-time status updates for every issue" }
  ];

  const benefits = [
    "Faster problem reporting",
    "Correct office identification",
    "AI-assisted information",
    "Real road-distance routing",
    "Transparent issue tracking",
    "Performance-based city ranking",
    "Data-driven governance"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative min-h-[50vh] sm:min-h-[55vh] md:min-h-[60vh] lg:min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={headerImage2.src}
            alt="Smart City"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        <div className="relative w-full py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="text-center max-w-6xl mx-auto">
            <div className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 bg-blue-600 text-white rounded-full text-[10px] xs:text-xs sm:text-sm font-bold uppercase tracking-wider mb-3 sm:mb-4 md:mb-6 lg:mb-8">
              SOLUTIONS for Smart Cities
            </div>
            <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white leading-tight mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-8 px-2">
              Building a Smarter, Safer, and More Connected Sri Lanka
            </h1>
            <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-white/95 max-w-4xl mx-auto px-3 sm:px-4 leading-relaxed">
              As Sri Lanka continues to urbanize, cities must adopt smarter, more efficient systems to manage public services. The City Problem Reporter platform delivers modern digital solutions that help make cities more liveable, responsive, and citizen-focused.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-10 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8">
        {/* Solutions Grid */}
        <div className="space-y-8 sm:space-y-10 md:space-y-12 lg:space-y-16 mb-12 sm:mb-16 md:mb-20 lg:mb-24">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className={`flex flex-col lg:flex-row gap-5 sm:gap-6 md:gap-8 items-start ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Icon & Number Side */}
              <div className="flex-shrink-0 w-full lg:w-64 xl:w-72">
                <div className="bg-gradient-to-br from-gray-100 to-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-xl border border-gray-200">
                  <div className="flex items-center justify-center mb-4 sm:mb-5">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                      <solution.icon className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-300 mb-2 sm:mb-3">
                      {solution.number}
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-black leading-tight">
                      {solution.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="flex-1 w-full">
                <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border-2 border-gray-200 hover:border-blue-600 transition-all duration-300">
                  <p className="text-sm sm:text-base md:text-lg text-gray-800 leading-relaxed mb-4 sm:mb-5 md:mb-6">
                    {solution.description}
                  </p>

                  <div className="mb-4 sm:mb-5 md:mb-6">
                    <h4 className="text-xs sm:text-sm font-bold text-black mb-3 flex items-center gap-2">
                      <div className="w-1 h-4 sm:h-5 bg-black rounded-full"></div>
                      What it solves:
                    </h4>
                    <ul className="space-y-2">
                      {solution.solves.map((solve, idx) => (
                        <li key={idx} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700">
                          <span className="text-black mt-0.5 font-bold">✗</span>
                          {solve}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-50 rounded-lg sm:rounded-xl p-4 sm:p-5 border-2 border-blue-600">
                    <h4 className="text-xs sm:text-sm font-bold text-black mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      Smart City Impact:
                    </h4>
                    <p className="text-xs sm:text-sm md:text-base text-gray-800 font-medium leading-relaxed">
                      {solution.impact}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Highlights Grid */}
        <div className="mb-12 sm:mb-16 md:mb-20 lg:mb-24">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-black mb-8 sm:mb-10 md:mb-12">
            Key Highlights
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-7 md:p-8 shadow-xl border-2 border-gray-200 text-center hover:border-blue-600 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-black flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                  <highlight.icon className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black mb-2 sm:mb-3">
                  {highlight.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Why City Problem Reporter Box */}
        <div className="bg-black rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl mb-12 sm:mb-16 md:mb-20 lg:mb-24">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white text-center mb-6 sm:mb-8 md:mb-10 leading-tight">
            Why City Problem Reporter Is a Smart City Solution
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 flex items-center gap-3 hover:bg-blue-600 transition-all duration-300 group"
              >
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 group-hover:text-white flex-shrink-0 transition-colors duration-300" />
                <span className="text-sm sm:text-base text-white font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Vision Statement */}
        <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-xl border-2 border-gray-200 mb-12 sm:mb-16 md:mb-20 lg:mb-24">
          <div className="text-center max-w-5xl mx-auto">
            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-5 sm:mb-6 md:mb-8">
              <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4 sm:mb-5 md:mb-6 leading-tight">
              The Future of Smart Governance in Sri Lanka
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-800 leading-relaxed">
              City Problem Reporter represents the future of public service delivery in Sri Lanka. By combining GPS technology, AI intelligence, and data analytics, we're creating a platform where citizens are empowered, authorities are accountable, and cities become truly smart. This is more than technology—it's a movement toward transparent, efficient, and citizen-centric governance that will transform how Sri Lankans interact with their local governments for generations to come.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0">
            <img
              src={headerImage2.src}
              alt="Join Smart Cities"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/80"></div>
          </div>

          <div className="relative py-10 sm:py-12 md:py-16 lg:py-20 px-5 sm:px-6 md:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-5 md:mb-6 leading-tight">
              Ready to Build a Smarter Sri Lanka?
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/95 max-w-3xl mx-auto mb-6 sm:mb-7 md:mb-8 leading-relaxed">
              Join thousands of citizens making their cities better, one report at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-2xl mx-auto">
              <button className="bg-blue-600 text-white px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base md:text-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg w-full sm:w-auto">
                Report a Problem
              </button>
              <button className="bg-white text-black border-2 border-white px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base md:text-lg hover:bg-gray-100 transition-colors duration-300 w-full sm:w-auto">
                Learn More About Features
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Solutions;