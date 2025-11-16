"use client";
import { useState } from "react";
import { Mail, AlertCircle, CheckCircle2, Lock, ArrowRight } from "lucide-react";
import headerImage2 from '../../../../public/clm1.jpg';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "" });

    if (!email) {
      setMsg({ text: "Please enter your email address", type: "error" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMsg({ text: data.message, type: "success" });
        setSubmitted(true);
        setEmail("");
      } else {
        setMsg({ text: data.message || "Request failed", type: "error" });
      }
    } catch (err) {
      setMsg({ text: "Server connection error", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-0">
      {/* Left Side - Form */}
      <div className="bg-white flex flex-col justify-center px-6 py-12 lg:px-12 lg:py-0">
        <div className="max-w-sm mx-auto w-full">
          {/* Logo */}
          <div className="mb-6 lg:mb-8">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">Urban Flow</span>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8 lg:mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">Reset Password</h1>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          {/* Alert Message */}
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

          {/* Form or Success State */}
          {!submitted ? (
            <div className="space-y-4">
              {/* Email Input */}
              <div className="flex items-center border-2 border-gray-300 rounded-lg px-4 py-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-black focus-within:border-transparent transition">
                <Mail className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-sm bg-transparent"
                  placeholder="you@example.com"
                  disabled={loading}
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 focus:ring-4 focus:ring-gray-400 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base mt-6"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Sending Link...</span>
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Check Your Email</h3>
              <p className="text-sm text-gray-600 mb-6">
                We've sent a password reset link to your email. It will expire in 1 hour.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setMsg({ text: "", type: "" });
                }}
                className="text-black hover:text-gray-700 font-medium text-sm underline"
              >
                Send another link
              </button>
            </div>
          )}

          {/* Links */}
          <div className="space-y-3 mt-6 text-center text-sm">
            <p className="text-gray-600">
              Remember your password?{" "}
              <a href="/user/login" className="text-black hover:text-gray-700 font-semibold">
                Sign in
              </a>
            </p>
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a href="/user/register" className="text-black hover:text-gray-700 font-semibold">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
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

        {/* Content */}
        <div className="relative z-10 text-center px-8">
          <div className="w-24 h-24 mx-auto mb-8 opacity-80">
            <div className="w-full h-full bg-black/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Lock className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Secure Reset</h2>
          <p className="text-gray-700 text-base">Keep your account safe and secure</p>
        </div>
      </div>
    </div>
  );
}