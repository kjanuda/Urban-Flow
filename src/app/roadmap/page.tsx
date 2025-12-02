import React from 'react';
import { Camera, MessageSquare, Mic, MapPin, Bell, CheckCircle, Clock, User, Building2, Brain, Eye, Send, FileText, RefreshCw } from 'lucide-react';

export default function SmartCityFlowchart() {
  const steps = [
    {
      id: 1,
      icon: <Eye className="w-8 h-8" />,
      title: "See Problem",
      description: "Citizen notices issues like broken roads, garbage piles, streetlight failures, flooding, or water leaks in their neighborhood.",
      position: "top-0 left-0",
      angle: -45,
      color: "#FBBF24"
    },
    {
      id: 2,
      icon: <Camera className="w-8 h-8" />,
      title: "Report via App",
      description: "Open the mobile app and report by taking a photo, typing a description, or recording a voice message. Location is captured automatically.",
      position: "top-0 right-0",
      angle: 45,
      color: "#FB923C"
    },
    {
      id: 3,
      icon: <Brain className="w-8 h-8" />,
      title: "AI Analysis",
      description: "The system uses AI to identify the problem type, extract location data, and automatically route to the correct regional office.",
      position: "top-1/2 right-0 -translate-y-1/2",
      angle: 90,
      color: "#F472B6"
    },
    {
      id: 4,
      icon: <Send className="w-8 h-8" />,
      title: "Send to Office",
      description: "The nearest regional office receives the complete report immediately with all photos, descriptions, and location details.",
      position: "bottom-0 right-0",
      angle: 135,
      color: "#C084FC"
    },
    {
      id: 5,
      icon: <User className="w-8 h-8" />,
      title: "Officer Login",
      description: "Regional office staff securely logs into the admin dashboard to view and manage all reported issues in their jurisdiction.",
      position: "bottom-0 left-1/2 -translate-x-1/2",
      angle: 180,
      color: "#60A5FA"
    },
    {
      id: 6,
      icon: <FileText className="w-8 h-8" />,
      title: "View Issues",
      description: "Officers can see all city issues with detailed information including photos, exact locations, citizen descriptions, and priority levels.",
      position: "bottom-0 left-0",
      angle: 225,
      color: "#22D3EE"
    },
    {
      id: 7,
      icon: <RefreshCw className="w-8 h-8" />,
      title: "Update Status",
      description: "Officers change the status from Pending to In Progress to Completed as work progresses on each reported issue.",
      position: "top-1/2 left-0 -translate-y-1/2",
      angle: 270,
      color: "#2DD4BF"
    },
    {
      id: 8,
      icon: <Bell className="w-8 h-8" />,
      title: "Auto Notify",
      description: "Citizens receive automatic push notifications for every status update, keeping them informed throughout the resolution process.",
      position: "top-0 left-1/2 -translate-x-1/2",
      angle: 315,
      color: "#4ADE80"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-6 sm:py-12 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 sm:mb-3">SmartCity Reporter</h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600">Complete System Workflow</p>
        </div>

        {/* Desktop Diagram - Hidden on Mobile */}
        <div className="relative w-full hidden md:block" style={{ minHeight: '900px' }}>
          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="w-56 h-56 lg:w-64 lg:h-64 bg-white rounded-full shadow-2xl flex items-center justify-center border-8 border-gray-200 relative">
              {/* Decorative dots around circle */}
              <div className="absolute inset-0 rounded-full">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 bg-gray-300 rounded-full"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${i * 30}deg) translateY(-${130}px) translateX(-50%)`,
                    }}
                  />
                ))}
              </div>
              <div className="text-center p-4 z-10">
                <div className="text-5xl lg:text-6xl mb-3">🏙️</div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-1">SmartCity</h3>
                <p className="text-gray-600 text-sm">Reporter System</p>
              </div>
            </div>
          </div>

          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ minHeight: '900px' }}>
            {steps.map((step, index) => {
              const centerX = 50;
              const centerY = 50;
              const radius = 35;
              const angle = (step.angle * Math.PI) / 180;
              const endX = centerX + radius * Math.cos(angle);
              const endY = centerY + radius * Math.sin(angle);
              
              return (
                <line
                  key={index}
                  x1={`${centerX}%`}
                  y1={`${centerY}%`}
                  x2={`${endX}%`}
                  y2={`${endY}%`}
                  stroke="#CBD5E1"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              );
            })}
          </svg>

          {/* Step Cards */}
          {/* Top Left */}
          <div className="absolute top-4 left-4 w-60 lg:w-72">
            <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-yellow-400 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 bg-yellow-400 text-white p-3 rounded-lg">
                  {steps[0].icon}
                </div>
                <div>
                  <div className="bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full inline-block mb-1">STEP 1</div>
                  <h3 className="font-bold text-gray-800 text-lg">{steps[0].title}</h3>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{steps[0].description}</p>
            </div>
          </div>

          {/* Top Right */}
          <div className="absolute top-4 right-4 w-60 lg:w-72">
            <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-orange-400 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 bg-orange-400 text-white p-3 rounded-lg">
                  {steps[1].icon}
                </div>
                <div>
                  <div className="bg-orange-400 text-white text-xs font-bold px-2 py-1 rounded-full inline-block mb-1">STEP 2</div>
                  <h3 className="font-bold text-gray-800 text-lg">{steps[1].title}</h3>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{steps[1].description}</p>
            </div>
          </div>

          {/* Right Middle */}
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 w-60 lg:w-72">
            <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-pink-400 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 bg-pink-400 text-white p-3 rounded-lg">
                  {steps[2].icon}
                </div>
                <div>
                  <div className="bg-pink-400 text-white text-xs font-bold px-2 py-1 rounded-full inline-block mb-1">STEP 3</div>
                  <h3 className="font-bold text-gray-800 text-lg">{steps[2].title}</h3>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{steps[2].description}</p>
            </div>
          </div>

          {/* Bottom Right */}
          <div className="absolute bottom-4 right-4 w-60 lg:w-72">
            <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-purple-400 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 bg-purple-400 text-white p-3 rounded-lg">
                  {steps[3].icon}
                </div>
                <div>
                  <div className="bg-purple-400 text-white text-xs font-bold px-2 py-1 rounded-full inline-block mb-1">STEP 4</div>
                  <h3 className="font-bold text-gray-800 text-lg">{steps[3].title}</h3>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{steps[3].description}</p>
            </div>
          </div>

          {/* Bottom Center */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-60 lg:w-72">
            <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-blue-400 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 bg-blue-400 text-white p-3 rounded-lg">
                  {steps[4].icon}
                </div>
                <div>
                  <div className="bg-blue-400 text-white text-xs font-bold px-2 py-1 rounded-full inline-block mb-1">STEP 5</div>
                  <h3 className="font-bold text-gray-800 text-lg">{steps[4].title}</h3>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{steps[4].description}</p>
            </div>
          </div>

          {/* Bottom Left */}
          <div className="absolute bottom-4 left-4 w-60 lg:w-72">
            <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-cyan-400 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 bg-cyan-400 text-white p-3 rounded-lg">
                  {steps[5].icon}
                </div>
                <div>
                  <div className="bg-cyan-400 text-white text-xs font-bold px-2 py-1 rounded-full inline-block mb-1">STEP 6</div>
                  <h3 className="font-bold text-gray-800 text-lg">{steps[5].title}</h3>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{steps[5].description}</p>
            </div>
          </div>

          {/* Left Middle */}
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 w-60 lg:w-72">
            <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-teal-400 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 bg-teal-400 text-white p-3 rounded-lg">
                  {steps[6].icon}
                </div>
                <div>
                  <div className="bg-teal-400 text-white text-xs font-bold px-2 py-1 rounded-full inline-block mb-1">STEP 7</div>
                  <h3 className="font-bold text-gray-800 text-lg">{steps[6].title}</h3>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{steps[6].description}</p>
            </div>
          </div>

          {/* Top Center */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-60 lg:w-72">
            <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-green-400 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 bg-green-400 text-white p-3 rounded-lg">
                  {steps[7].icon}
                </div>
                <div>
                  <div className="bg-green-400 text-white text-xs font-bold px-2 py-1 rounded-full inline-block mb-1">STEP 8</div>
                  <h3 className="font-bold text-gray-800 text-lg">{steps[7].title}</h3>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{steps[7].description}</p>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Vertical Flow */}
        <div className="md:hidden space-y-4">
          {/* Center Circle for Mobile */}
          <div className="flex justify-center mb-6">
            <div className="w-40 h-40 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-gray-200">
              <div className="text-center p-3">
                <div className="text-4xl mb-2">🏙️</div>
                <h3 className="text-lg font-bold text-gray-800">SmartCity</h3>
                <p className="text-gray-600 text-xs">Reporter System</p>
              </div>
            </div>
          </div>

          {/* Step Cards for Mobile */}
          {steps.map((step, index) => (
            <div key={step.id} className="bg-white rounded-xl shadow-lg p-4 border-l-4" style={{
              borderColor: step.color
            }}>
              <div className="flex items-start gap-3 mb-2">
                <div className="flex-shrink-0 text-white p-2.5 rounded-lg" style={{
                  backgroundColor: step.color
                }}>
                  {React.cloneElement(step.icon, { className: 'w-6 h-6' })}
                </div>
                <div className="flex-1">
                  <div className="text-white text-xs font-bold px-2 py-0.5 rounded-full inline-block mb-1" style={{
                    backgroundColor: step.color
                  }}>
                    STEP {index + 1}
                  </div>
                  <h3 className="font-bold text-gray-800 text-base">{step.title}</h3>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Summary Section */}
        <div className="mt-12 sm:mt-24 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-5 sm:p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <User className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold">For Citizens</h3>
            </div>
            <ul className="space-y-1.5 sm:space-y-2 text-sm">
              <li>✓ Easy reporting with photos & voice</li>
              <li>✓ Real-time progress tracking</li>
              <li>✓ Automatic notifications</li>
              <li>✓ Make your city better</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-5 sm:p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <Building2 className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold">For Officers</h3>
            </div>
            <ul className="space-y-1.5 sm:space-y-2 text-sm">
              <li>✓ Centralized issue dashboard</li>
              <li>✓ Complete details & photos</li>
              <li>✓ Easy status updates</li>
              <li>✓ Auto-citizen notifications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}