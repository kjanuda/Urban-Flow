import React from 'react';

function Benefits() {
  const benefits = [
    {
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="24" cy="12" r="4" />
          <path d="M24 16c-4 0-6 3-6 8v8h12v-8c0-5-2-8-6-8z" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 15c-2.5 0-4 2-4 5v8h8v-8c0-3-1.5-5-4-5z" />
          <circle cx="36" cy="12" r="3" />
          <path d="M36 15c-2.5 0-4 2-4 5v8h8v-8c0-3-1.5-5-4-5z" />
        </svg>
      ),
      title: "Real-Time Problem Reporting",
      description: "Citizens can instantly report city issues such as roadblocks, waste problems, or broken infrastructure using live GPS location, ensuring faster detection and response."
    },
    {
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="8" y="10" width="32" height="28" rx="2" />
          <path d="M8 16h32" />
          <rect x="12" y="20" width="6" height="14" />
          <rect x="21" y="22" width="6" height="12" />
          <rect x="30" y="18" width="6" height="16" />
        </svg>
      ),
      title: "Accurate Office Connection",
      description: "Automatically identifies the nearest Divisional Secretariat Office and provides official contact details — including address, phone, email, and website — ensuring reports reach the correct authority."
    },
    {
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="24" cy="14" r="5" />
          <path d="M12 38c0-8 5.4-12 12-12s12 4 12 12" />
          <path d="M28 22c2 2 5 3 8 3s6-1 8-3" />
          <circle cx="38" cy="20" r="3" />
        </svg>
      ),
      title: "AI-Powered Data Completion",
      description: "Uses Google Gemini AI to intelligently fill missing information, such as unavailable contact details or email addresses, providing complete accuracy and reliability."
    },
    {
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="24" cy="24" r="16" />
          <path d="M24 16v8l6 4" />
        </svg>
      ),
      title: "Smart Distance and Time Estimation",
      description: "Calculates real road distance and travel time using the Google Distance Matrix API, improving logistical planning for problem resolution."
    },
    {
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M24 6l4 8h8l6.5 6.5-3.5 3.5L32 20l-8-4-8 4-2.5 3.5L12 20l6.5-6.5h8l4-8z" />
          <path d="M24 32v8" />
          <path d="M19 40h10" />
        </svg>
      ),
      title: "Accountability Through Leaderboards",
      description: "Introduces a City Problem Solving Leaderboard that ranks cities, districts, and provinces by issue resolution speed and efficiency — promoting competition, accountability, and better governance."
    },
    {
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="16" cy="20" r="5" />
          <circle cx="32" cy="20" r="5" />
          <path d="M16 25c-4 0-6 2-6 6v8h12v-8c0-4-2-6-6-6z" />
          <path d="M32 25c-4 0-6 2-6 6v8h12v-8c0-4-2-6-6-6z" />
          <circle cx="24" cy="8" r="4" />
          <path d="M24 12c-3 0-5 2-5 5v6h10v-6c0-3-2-5-5-5z" />
        </svg>
      ),
      title: "Citizen Engagement & Transparency",
      description: "Allows people to see which cities respond the fastest and solve the most problems, increasing trust, transparency, and community participation."
    },
    {
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="8" y="12" width="6" height="24" />
          <rect x="18" y="8" width="6" height="28" />
          <rect x="28" y="16" width="6" height="20" />
          <path d="M6 38h36" />
        </svg>
      ),
      title: "Data-Driven Governance",
      description: "Authorities gain access to valuable analytics on problem frequency, location patterns, and performance, helping them make informed, evidence-based decisions."
    },
    {
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M24 6l12 7v14c0 10-12 14-12 14s-12-4-12-14v-14l12-7z" />
          <path d="M24 18l-6 6l6 6l6-6z" />
        </svg>
      ),
      title: "Encourages Smart City Development",
      description: "Transforms traditional problem reporting into a smart civic management ecosystem, making cities more connected, efficient, and sustainable."
    },
    {
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="6" y="6" width="36" height="36" rx="2" />
          <rect x="12" y="12" width="24" height="24" rx="1" />
          <rect x="18" y="18" width="12" height="12" rx="1" />
        </svg>
      ),
      title: "Scalable & Future-Ready",
      description: "Easily extendable to include photo uploads, auto email notifications, dashboards, and AI-based prediction of future urban issues."
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-cyan-50 rounded-2xl mb-6">
            <svg className="w-8 h-8 text-cyan-500" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M24 6l12 7v14c0 10-12 14-12 14s-12-4-12-14v-14l12-7z" />
              <path d="M24 18l-6 6l6 6l6-6z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Project Benefits Summary
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Revolutionizing city problem reporting with cutting-edge technology and smart governance solutions
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-200"
            >
              {/* Icon Container */}
              <div className="inline-flex p-4 rounded-xl bg-cyan-50 mb-6 group-hover:bg-cyan-100 transition-colors duration-300 text-cyan-500">
                {benefit.icon}
              </div>

              {/* Number Badge */}
              <div className="mb-4">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500 text-white font-bold text-sm">
                  {index + 1}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 bg-cyan-500 text-white font-semibold rounded-xl hover:bg-cyan-600 transition-colors duration-300">
              Get Started Today
            </button>
            <button className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-300 border-2 border-gray-300">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Benefits;