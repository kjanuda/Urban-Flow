import React from 'react';
import { 
  Construction,
  Lightbulb,
  Leaf,
  Building2,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import headerImage2 from '../../../public/Sus.jpg';

const Infrastructure = () => {
  const solutions = [
    {
      icon: Construction,
      number: "1",
      title: "Road & Transport Infrastructure",
      description: "Real-time reporting of:",
      issues: [
        "Damaged roads",
        "Potholes",
        "Blocked lanes",
        "Unsafe junctions",
        "Bridge issues"
      ],
      impact: "Ensures faster maintenance, improves road safety, and reduces travel delays."
    },
    {
      icon: Lightbulb,
      number: "2",
      title: "Public Utilities & Services",
      description: "Citizens can report problems related to:",
      issues: [
        "Streetlights",
        "Water supply",
        "Drainage systems",
        "Electricity poles",
        "Waste collection"
      ],
      impact: "Allows authorities to respond quickly and maintain smooth city operations."
    },
    {
      icon: Leaf,
      number: "3",
      title: "Environmental Infrastructure",
      description: "Supports monitoring of:",
      issues: [
        "Illegal garbage dumping",
        "Flood risks",
        "Drain blockages",
        "Air/water pollution sources"
      ],
      impact: "Improves environmental protection and keeps neighborhoods clean."
    },
    {
      icon: Building2,
      number: "4",
      title: "Municipal & Community Facilities",
      description: "Covers issues in:",
      issues: [
        "Public parks",
        "Bus stands",
        "Public toilets",
        "Playgrounds",
        "Community centers"
      ],
      impact: "Enhances community well-being and ensures better living standards."
    },
    {
      icon: AlertTriangle,
      number: "5",
      title: "Safety & Emergency Infrastructure",
      description: "Reporting for urgent issues like:",
      issues: [
        "Fallen trees",
        "Landslide-prone areas",
        "Broken traffic signs",
        "Damaged footpaths",
        "Hazardous zones"
      ],
      impact: "Enables quick action to prevent accidents and protect citizens."
    }
  ];

  const benefits = [
    "Improves quality of life",
    "Reduces accidents and delays",
    "Helps authorities prioritize repairs",
    "Ensures transparent public service",
    "Makes Sri Lankan cities smarter and more responsive"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative min-h-[50vh] sm:min-h-[55vh] md:min-h-[60vh] lg:min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={headerImage2.src}
            alt="Infrastructure Solutions"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        <div className="relative w-full py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="text-center max-w-6xl mx-auto">
            <div className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 bg-blue-600 text-white rounded-full text-[10px] xs:text-xs sm:text-sm font-bold uppercase tracking-wider mb-3 sm:mb-4 md:mb-6 lg:mb-8">
              Infrastructure Solutions
            </div>
            <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white leading-tight mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-8 px-2">
              Building Smart Infrastructure for Sri Lanka
            </h1>
            <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-white/95 max-w-4xl mx-auto px-3 sm:px-4 leading-relaxed">
              A strong and well-managed infrastructure is essential for creating smart, safe, and efficient cities. The City Problem Reporter provides modern digital tools to help authorities monitor, manage, and improve critical infrastructure across Sri Lanka—faster and more transparently.
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
                  <p className="text-sm sm:text-base md:text-lg text-gray-800 leading-relaxed mb-4 sm:mb-5 md:mb-6 font-semibold">
                    {solution.description}
                  </p>

                  <div className="mb-4 sm:mb-5 md:mb-6">
                    <ul className="space-y-2">
                      {solution.issues.map((issue, idx) => (
                        <li key={idx} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700">
                          <span className="text-blue-600 mt-0.5 font-bold">•</span>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-50 rounded-lg sm:rounded-xl p-4 sm:p-5 border-2 border-blue-600">
                    <h4 className="text-xs sm:text-sm font-bold text-black mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      How it helps:
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

        {/* Why These Infrastructure Solutions Matter */}
        <div className="bg-black rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl mb-12 sm:mb-16 md:mb-20 lg:mb-24">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white text-center mb-6 sm:mb-8 md:mb-10 leading-tight">
            Why These Infrastructure Solutions Matter
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

        {/* Call to Action */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0">
            <img
              src={headerImage2.src}
              alt="Report Infrastructure Issues"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/80"></div>
          </div>

          <div className="relative py-10 sm:py-12 md:py-16 lg:py-20 px-5 sm:px-6 md:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-5 md:mb-6 leading-tight">
              Help Build Better Infrastructure
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/95 max-w-3xl mx-auto mb-6 sm:mb-7 md:mb-8 leading-relaxed">
              Report infrastructure issues in your area and help authorities respond faster to create safer, smarter cities across Sri Lanka.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-2xl mx-auto">
              <button className="bg-blue-600 text-white px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base md:text-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg w-full sm:w-auto">
                Report an Issue
              </button>
              <button className="bg-white text-black border-2 border-white px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base md:text-lg hover:bg-gray-100 transition-colors duration-300 w-full sm:w-auto">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Infrastructure;