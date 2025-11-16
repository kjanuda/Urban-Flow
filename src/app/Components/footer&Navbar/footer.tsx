'use client';

import React, { useState } from 'react';
import { Mail, Send } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <footer 
      className="text-white relative"
      style={{
        backgroundImage: 'url(/ct.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80" />
      
      {/* Main Footer Content */}
      <div className="border-t border-gray-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Top Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-12">
            {/* Left - Links */}
            <div className="flex flex-wrap gap-6 md:gap-8">
              <a href="#" className="text-sm font-medium hover:text-gray-300 transition-colors">
                Careers
              </a>
              <a href="#" className="text-sm font-medium hover:text-gray-300 transition-colors">
                Government Partners
              </a>
              <a href="#" className="text-sm font-medium hover:text-gray-300 transition-colors">
                Authorized Partner
              </a>
              <a href="#" className="text-sm font-medium hover:text-gray-300 transition-colors">
                Privacy & Legal
              </a>
              <a href="#" className="text-sm font-medium hover:text-gray-300 transition-colors">
                Privacy Preferences
              </a>
            </div>

            {/* Right - Newsletter Signup */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <span className="text-sm font-medium text-gray-300 whitespace-nowrap">
                Interested in staying up to date with City Reporter?
              </span>
              <form onSubmit={handleSignUp} className="flex gap-3">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="px-4 py-2 bg-transparent border-b border-white text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-300 transition-colors min-w-0 sm:w-auto"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                >
                  {isSubmitting ? 'Sending...' : 'SIGN UP'}
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 my-8" />

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Left - Logo and Copyright */}
            <div className="flex items-center gap-4">
              <a href="#" className="text-white hover:text-gray-300 transition-colors">
                <span className="text-2xl font-bold">UR</span>
              </a>
              <div className="text-xs text-gray-400">
                <p>© 2025 UrbanFlow</p>
                <p className="mt-1">
                  Transforming urban governance through citizen engagement.{' '}
                  <a href="#" className="hover:text-white transition-colors">
                    Visit our website
                  </a>
                </p>
              </div>
            </div>

            {/* Right - Legal Links */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-400">
              <p>
                Project, Idea & Design by h{' '}
                <a href="https://kjanuda.netlify.app/" className="text-white hover:text-gray-300 transition-colors font-medium">
                  Januda J Kodithuwakku
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;