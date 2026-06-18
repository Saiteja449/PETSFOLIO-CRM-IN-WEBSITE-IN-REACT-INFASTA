import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cat, Eye, EyeOff, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { login, sendOtp } = useAuth();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    const result = await sendOtp(email);
    setLoading(false);

    if (result.success) {
      setStep(2);
      setMessage(result.message || "OTP has been sent to your email.");
    } else {
      setError(result.message || "Failed to send OTP.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    setLoading(true);
    const result = await login(email?.toLowerCase(), otp);
    setLoading(false);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message || "Invalid OTP. Please try again.");
      setOtp("");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-brand-light p-4"
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 50%, rgba(20, 184, 166, 0.08) 0%, transparent 60%)",
      }}
    >
      <div className="max-w-md w-full bg-brand-light border border-brand-secondary rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="p-6 sm:p-10">
          {/* Logo & Subtitle */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-full bg-teal-500/15 flex items-center justify-center mb-3">
              <Cat className="text-teal-500 w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-brand-primary text-center mb-1">
              Petsfolio
            </h1>
            <p className="text-brand-primary/70 font-medium text-sm text-center">
              Sales Operating System & CRM login
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-500 border border-red-500/20 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-teal-500/10 text-teal-600 border border-teal-500/20 p-3 rounded-lg mb-6 text-sm">
              {message}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOtp} noValidate className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-brand-primary/70 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. alex@petsfolio.com"
                  className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-3 outline-none"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-brand-light font-bold py-3 px-4 rounded-xl transition-colors mt-2 disabled:opacity-70"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} noValidate className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-brand-primary/70 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-gray-100 border border-brand-secondary text-brand-primary/60 text-sm rounded-lg block p-3 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-brand-primary/70 mb-1.5">
                  One-Time Password (OTP)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Enter 6-digit OTP"
                    className={`w-full bg-brand-light border text-brand-primary text-sm rounded-lg block p-3 pr-10 outline-none tracking-widest transition-colors ${
                      error
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-brand-secondary focus:ring-teal-500 focus:border-teal-500"
                    }`}
                    disabled={loading}
                    maxLength={6}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Lock size={18} className="text-brand-primary/40" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-brand-light font-bold py-3 px-4 rounded-xl transition-colors mt-2 disabled:opacity-70"
              >
                {loading ? "Verifying..." : "Verify & Sign In"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtp("");
                  setError("");
                  setMessage("");
                }}
                className="w-full text-center text-xs font-medium text-teal-600 hover:text-teal-700 mt-4"
              >
                Use a different email address
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
