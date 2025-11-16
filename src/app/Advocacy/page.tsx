import React from 'react';
import { 
  Megaphone,
  Trash2,
  Leaf,
  Shield,
  Smartphone,
  Users,
  Target,
  TrendingUp,
  Award,
  BarChart3,
  CheckCircle
} from 'lucide-react';
import headerImage2 from '../../../public/prt.jpg';

const Advocacy = () => {
  const purposes = [
    "Strengthen public understanding of civic issues",
    "Promote responsible behavior",
    "Motivate citizens to report and solve problems",
    "Build partnerships between communities and government",
    "Drive national-level change with local action"
  ];

  const campaigns = [
    {
      icon: Trash2,
      title: "Cleanliness & Waste Management Campaigns",
      items: [
        "Reduce plastic waste",
        "School and community clean-up drives",
        "Promote proper waste segregation",
        "Anti-littering awareness"
      ]
    },
    {
      icon: Leaf,
      title: "Environmental Protection Campaigns",
      items: [
        "Tree planting initiatives",
        "Protect rivers, beaches, and wetlands",
        "Air quality improvement programs",
        "Sustainable lifestyle promotions"
      ]
    },
    {
      icon: Shield,
      title: "Safety & Public Health Campaigns",
      items: [
        "Dengue awareness programs",
        "Safe city and road safety campaigns",
        "Sanitation improvement projects",
        "Disaster preparedness awareness"
      ]
    },
    {
      icon: Smartphone,
      title: "Digital & Smart City Awareness Campaigns",
      items: [
        "Promote digital reporting of problems",
        "Encourage smart city participation",
        "Technology for community development",
        "Workshops for students and youth"
      ]
    },
    {
      icon: Users,
      title: "Youth & Community Engagement Campaigns",
      items: [
        "Youth leadership for city improvement",
        "Volunteer recruitment",
        "Eco-friendly school competitions",
        "Community empowerment events"
      ]
    }
  ];

  const features = [
    {
      icon: Users,
      title: "Community Participation",
      description: "Every campaign is designed to involve the public, from children to elders."
    },
    {
      icon: Target,
      title: "Government Collaboration",
      description: "Local councils and environmental authorities support campaign activities."
    },
    {
      icon: BarChart3,
      title: "Impact Tracking",
      description: "Live dashboards show: Number of campaigns, Participants, Waste removed, Trees planted, Areas cleaned"
    },
    {
      icon: Award,
      title: "Recognition & Awards",
      description: "Top-performing cities, schools, and individuals receive: Certificates, Digital badges, Leaderboard rankings"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative min-h-[50vh] sm:min-h-[55vh] md:min-h-[60vh] lg:min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={headerImage2.src}
            alt="Advocacy Campaigns"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/75"></div>
        </div>

        <div className="relative w-full py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="text-center max-w-6xl mx-auto">
            <div className="flex items-center justify-center mb-4 sm:mb-6 md:mb-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                <Megaphone className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
              </div>
            </div>
            <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white leading-tight mb-3 sm:mb-4 md:mb-5 lg:mb-6 px-2">
              Advocacy & Public Campaigns
            </h1>
            <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-white/95 max-w-4xl mx-auto px-3 sm:px-4 leading-relaxed">
              Empowering communities across Sri Lanka to take action, raise awareness, and drive real change.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-10 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8">
        {/* Introduction */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-xl mb-10 sm:mb-12 md:mb-16 lg:mb-20 border-2 border-gray-200">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-4 sm:mb-5 md:mb-6">
              Connecting Communities for Change
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
              Our Advocacy Campaigns connect citizens, schools, organizations, and local authorities to create stronger, cleaner, safer, and smarter cities. Through awareness, education, and community engagement, we inspire people to solve local issues and support nationwide transformation.
            </p>
          </div>
        </div>

        {/* Purpose Section */}
        <div className="mb-10 sm:mb-12 md:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-black mb-6 sm:mb-8 md:mb-10">
            Purpose of Advocacy Campaigns
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {purposes.map((purpose, index) => (
              <div
                key={index}
                className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg border-2 border-gray-200 hover:border-blue-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <p className="text-sm sm:text-base text-gray-800 font-medium leading-relaxed">
                    {purpose}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Types of Campaigns */}
        <div className="mb-10 sm:mb-12 md:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-black mb-8 sm:mb-10 md:mb-12">
            Types of Campaigns
          </h2>
          <div className="space-y-6 sm:space-y-8">
            {campaigns.map((campaign, index) => (
              <div
                key={index}
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden hover:shadow-2xl hover:border-blue-600 transition-all duration-300"
              >
                <div className="bg-gradient-to-r from-black to-gray-800 p-5 sm:p-6 md:p-8">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <campaign.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                      {campaign.title}
                    </h3>
                  </div>
                </div>
                <div className="p-5 sm:p-6 md:p-8 bg-gray-50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {campaign.items.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 sm:gap-3">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                        <p className="text-xs sm:text-sm md:text-base text-gray-800">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-10 sm:mb-12 md:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-black mb-8 sm:mb-10 md:mb-12">
            Key Features of Campaigns
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-7 md:p-8 shadow-lg border-2 border-gray-200 hover:border-blue-600 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-black mb-2 sm:mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0">
            <img
              src={headerImage2.src}
              alt="Join Campaign"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/80"></div>
          </div>

          <div className="relative py-10 sm:py-12 md:py-16 lg:py-20 px-5 sm:px-6 md:px-8 text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-5 sm:mb-6 md:mb-8 shadow-lg">
              <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-5 md:mb-6 leading-tight">
              Join the Movement for Change
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/95 max-w-3xl mx-auto mb-6 sm:mb-7 md:mb-8 leading-relaxed">
              Be part of nationwide campaigns that are transforming communities across Sri Lanka. Your participation makes a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-2xl mx-auto">
              <button className="bg-blue-600 text-white px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base md:text-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg w-full sm:w-auto">
                Start a Campaign
              </button>
              <button className="bg-white text-black border-2 border-white px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base md:text-lg hover:bg-gray-100 transition-colors duration-300 w-full sm:w-auto">
                View Active Campaigns
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advocacy;