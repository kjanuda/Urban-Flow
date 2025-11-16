"use client";
import { useState, useEffect, FormEvent, KeyboardEvent } from "react";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import Image from 'next/image';
import headerImage2 from '../../../../public/clm.jpg';

// Add Google Accounts type declarations
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (element: HTMLElement | null, options: {
            theme: string;
            size: string;
            width: number;
            text: string;
            shape: string;
          }) => void;
        };
      };
    };
  }
}

export default function UserLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize Google Sign-In
  useEffect(() => {
    const initGoogleAuth = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: "1081185265333-9lvptt012gd6riu429jd7apskgp9mjli.apps.googleusercontent.com",
          callback: handleGoogleLogin,
        });
        window.google.accounts.id.renderButton(
          document.getElementById("googleSignInButton"),
          {
            theme: "outline",
            size: "large",
            width: 340,
            text: "continue_with",
            shape: "rectangular",
          }
        );
      }
    };

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initGoogleAuth;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Handle Google Login
  const handleGoogleLogin = async (response: { credential: string }) => {
    setLoading(true);
    setMsg({ text: "", type: "" });

    try {
      const res = await fetch("https://cityreg.onrender.com/api/auth/user/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId: response.credential }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setMsg({ text: "✅ Login successful! Redirecting...", type: "success" });
        setTimeout(() => {
          window.location.href = "/user/profile";
        }, 1500);
      } else {
        setMsg({ text: data.message || "Google login failed", type: "error" });
      }
    } catch (err) {
      setMsg({ text: "Server connection error", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Handle Email/Password Login
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "" });

    if (!form.email || !form.password) {
      setMsg({ text: "Please fill in all fields", type: "error" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://cityreg.onrender.com/api/auth/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setMsg({ text: "Login successful! Redirecting...", type: "success" });
        setTimeout(() => {
          window.location.href = "/user/profile";
        }, 1500);
      } else {
        setMsg({ text: data.message || "Login failed", type: "error" });
      }
    } catch (err) {
      setMsg({ text: "Server connection error", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit(e as unknown as FormEvent);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Side - Background Image with Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black">
        <Image
          src={headerImage2}
          alt="Urban Flow Background"
          fill
          className="object-cover"
          priority
        />
        
        {/* Sharp Black Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50 z-10"></div>
        
        {/* Additional dark vignette for edge sharpness */}
        <div className="absolute inset-0 shadow-inner z-10" style={{boxShadow: 'inset 0 0 60px rgba(0,0,0,0.8)'}}></div>

        {/* Content */}
        <div className="relative z-20 flex flex-col justify-between p-8 sm:p-12 lg:p-16 text-white w-full h-full">
          {/* Logo */}
          <div>
            <p className="text-sm font-semibold text-gray-300">Urban Flow</p>
          </div>

          {/* Main Text */}
          <div className="space-y-4 sm:space-y-6 animate-fadeInUp">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Hello<br />Urban Flow!👋
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-200 max-w-md leading-relaxed">
              Experience seamless urban living. Navigate your city with ease and discover everything you need in one place!
            </p>
          </div>

          {/* Footer */}
          <div className="text-gray-400 text-xs sm:text-sm">
            © 2025 Urban Flow. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen lg:min-h-auto">
        <div className="w-full max-w-sm sm:max-w-md">
          {/* Mobile Header Logo */}
          <div className="lg:hidden mb-6 sm:mb-8">
            <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center mb-4 shadow-md">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                <path d="M16 8L16 24M24 16L8 16M22 10L10 22M22 22L10 10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Urban Flow</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-6 sm:mt-8 mb-3">Welcome Back!</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Don't have an account?{" "}
              <a href="/user/register" className="text-gray-900 font-semibold hover:text-gray-700 transition underline">
                Create a new account now.
              </a>
              <br />
              <span className="text-xs sm:text-sm text-gray-500 mt-1 block">It's FREE! Takes less than a minute.</span>
            </p>
          </div>

          {/* Alert Message */}
          {msg.text && (
            <div
              className={`mb-6 p-3 sm:p-4 rounded-lg flex items-start gap-3 animate-slideDown ${
                msg.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {msg.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              )}
              <p className="text-xs sm:text-sm font-medium">{msg.text}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Email Input */}
            <div className="group">
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onKeyPress={handleKeyPress}
                className="w-full px-0 py-2 sm:py-3 border-0 border-b-2 border-gray-300 focus:border-gray-900 focus:ring-0 outline-none transition text-gray-900 placeholder-gray-400 bg-transparent text-sm sm:text-base"
                placeholder="hisalim.ux@gmail.com"
                disabled={loading}
                required
              />
              <div className="h-0.5 w-0 bg-gray-900 group-focus-within:w-full transition-all duration-300"></div>
            </div>

            {/* Password Input */}
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyPress={handleKeyPress}
                className="w-full px-0 py-2 sm:py-3 border-0 border-b-2 border-gray-300 focus:border-gray-900 focus:ring-0 outline-none transition text-gray-900 placeholder-gray-400 bg-transparent text-sm sm:text-base"
                placeholder="Password"
                disabled={loading}
                required
              />
              <div className="h-0.5 w-0 bg-gray-900 group-focus-within:w-full transition-all duration-300"></div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-6 sm:mt-8 text-sm sm:text-base shadow-md hover:shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Signing in...</span>
                  <span className="sm:hidden">Signing...</span>
                </span>
              ) : (
                "Login Now"
              )}
            </button>

            {/* Google Sign-In Button */}
            <div className="flex justify-center pt-2 sm:pt-4">
              <div id="googleSignInButton" className="w-full"></div>
            </div>

            {/* Forgot Password */}
            <div className="text-center pt-2">
              <span className="text-gray-500 text-xs sm:text-sm">Forget password? </span>
              <a href="/user/forgot-password" className="text-gray-900 font-semibold hover:text-gray-700 transition underline text-xs sm:text-sm">
                Click here
              </a>
            </div>
          </form>
        </div>
      </div>

      {/* Tailwind animations */}
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.6s ease-out;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out 0.2s both;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
