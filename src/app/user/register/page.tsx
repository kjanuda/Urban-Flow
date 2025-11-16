"use client";
import { useState, useEffect, FormEvent, KeyboardEvent } from "react";
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import headerImage2 from '../../../../public/clm1.jpg';

export default function UserRegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: "", color: "" });

  // Background image - replace with your actual image URL
  const headerImage = "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=1200&fit=crop";

  useEffect(() => {
    if (!form.password) {
      setPasswordStrength({ score: 0, text: "", color: "" });
      return;
    }

    let score = 0;
    if (form.password.length >= 8) score++;
    if (form.password.length >= 12) score++;
    if (/[a-z]/.test(form.password) && /[A-Z]/.test(form.password)) score++;
    if (/\d/.test(form.password)) score++;
    if (/[^a-zA-Z0-9]/.test(form.password)) score++;

    const strengths = [
      { text: "Very Weak", color: "bg-red-500" },
      { text: "Weak", color: "bg-orange-500" },
      { text: "Fair", color: "bg-yellow-500" },
      { text: "Good", color: "bg-blue-500" },
      { text: "Strong", color: "bg-green-500" },
    ];

    setPasswordStrength({ score, ...strengths[score] });
  }, [form.password]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "" });

    if (!form.name || !form.email || !form.password) {
      setMsg({ text: "Please fill in all fields", type: "error" });
      setLoading(false);
      return;
    }

    if (form.name.length < 2) {
      setMsg({ text: "Name must be at least 2 characters", type: "error" });
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setMsg({ text: "Password must be at least 6 characters", type: "error" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://cityreg.onrender.com/api/auth/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMsg({ text: "✅ Account created successfully! Redirecting...", type: "success" });
        setTimeout(() => {
          window.location.href = "/user/login";
        }, 1500);
      } else {
        setMsg({ text: data.message || "Registration failed", type: "error" });
      }
    } catch (err) {
      setMsg({ text: "Server connection error", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      handleSubmit(e as unknown as FormEvent);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-0">
      <div className="bg-white flex flex-col justify-center px-6 py-12 lg:px-12 lg:py-0">
        <div className="max-w-sm mx-auto w-full">
          <div className="mb-6 lg:mb-8">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">Urban Flow</span>
            </div>
          </div>

          <div className="mb-8 lg:mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">Sign up</h1>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Create an account to start exploring the city and access exclusive urban services
            </p>
          </div>

          {msg.text && (
            <div
              className={`mb-5 p-3 rounded-lg flex items-start gap-2 text-sm ${
                msg.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {msg.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              )}
              <p className="font-medium">{msg.text}</p>
            </div>
          )}

          <button className="w-full bg-white text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-100 transition mb-4 flex items-center justify-center gap-2 text-sm sm:text-base border border-gray-200 shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-gray-600 font-medium text-xs">or sign up using email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-700 placeholder-gray-400 text-sm hover:border-gray-400"
              placeholder="Full name"
              disabled={loading}
            />

            <div className="flex items-center border-2 border-gray-300 rounded-lg px-4 py-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent transition">
              <Mail className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onKeyPress={handleKeyPress}
                className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-sm bg-transparent"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            <div className="flex items-center border-2 border-gray-300 rounded-lg px-4 py-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent transition">
              <Lock className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyPress={handleKeyPress}
                className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-sm bg-transparent"
                placeholder="Create a password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 transition p-0.5"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {form.password && (
              <div className="flex gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      i < passwordStrength.score ? passwordStrength.color : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 focus:ring-4 focus:ring-gray-400 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base mt-6"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Signing up...</span>
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <a href="/user/login" className="text-purple-600 hover:text-purple-700 font-semibold">
              Sign in
            </a>
          </p>
        </div>
      </div>

      <div 
        className="hidden lg:flex items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage: `url(${headerImage2.src || headerImage2})`,
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
        }}
      >
        {/* Gradient overlay: Sharp on right, faded to white on left */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent"></div>
        
        {/* Dark filter for sharpness and contrast on right side */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.95), rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.5) 100%)',
            mixBlendMode: 'multiply'
          }}
        ></div>

        <div className="relative z-10 text-center px-8">
          <div className="w-32 h-32 mx-auto mb-12 opacity-70">
            <svg viewBox="0 0 200 200" className="w-full h-full animate-float">
              <circle cx="100" cy="100" r="80" fill="rgba(255,255,255,0.1)" />
              <circle cx="100" cy="100" r="60" fill="rgba(255,255,255,0.15)" />
              <circle cx="100" cy="100" r="40" fill="rgba(255,255,255,0.1)" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Welcome to Urban Flow</h2>
          <p className="text-white/80 text-lg">Start your journey today</p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-40px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
