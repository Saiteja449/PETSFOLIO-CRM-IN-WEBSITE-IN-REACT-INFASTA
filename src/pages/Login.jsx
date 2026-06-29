import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cat, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    const result = await login(email?.toLowerCase(), password);
    setLoading(false);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message || "Invalid credentials. Please try again.");
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

          <form onSubmit={handleLogin} noValidate className="space-y-6">
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

            <div>
              <label className="block text-xs font-medium text-brand-primary/70 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter your password"
                  className={`w-full bg-brand-light border text-brand-primary text-sm rounded-lg block p-3 pr-10 outline-none transition-colors ${
                    error
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-brand-secondary focus:ring-teal-500 focus:border-teal-500"
                  }`}
                  disabled={loading}
                />
                <div 
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={18} className="text-brand-primary/40 hover:text-teal-500 transition-colors" />
                  ) : (
                    <Eye size={18} className="text-brand-primary/40 hover:text-teal-500 transition-colors" />
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-brand-light font-bold py-3 px-4 rounded-xl transition-colors mt-2 disabled:opacity-70"
            >
              <Lock size={18} />
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
