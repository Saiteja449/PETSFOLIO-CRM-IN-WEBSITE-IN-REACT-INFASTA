import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cat, Eye, EyeOff, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("alex@petsfolio.com");
  const [password, setPassword] = useState("password123");
  const [role, setRole] = useState("Sales Manager");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all standard credentials.");
      return;
    }

    // Call Context login integration
    const result = login(email, password, role);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError("Invalid credential validation. Please try again.");
    }
  };

  const handleDemoFill = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setRole(demoRole);
    setPassword("password123");
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

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-medium text-brand-primary/70 mb-1.5">
                Select Workspace Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-3 outline-none"
              >
                <option value="Sales Manager">
                  Sales Manager (Alex Mercer)
                </option>
                <option value="Sales Representative">
                  Sales Representative
                </option>
              </select>
            </div>

            {/* Email Address */}
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
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-brand-primary/70 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-brand-light border border-brand-secondary text-brand-primary text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-3 pr-10 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-brand-primary/70 hover:text-brand-primary"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-brand-light font-bold py-3 px-4 rounded-xl transition-colors mt-2"
            >
              <Lock size={18} />
              Sign In to System
            </button>
          </form>

          <hr className="border-brand-secondary my-8" />

          {/* Demonstration Quick Fills */}
          <div className="text-center">
            <span className="text-xs font-bold text-brand-primary/70 tracking-wider uppercase block mb-4">
              QUICK ACCESS DEMO ACCOUNTS
            </span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() =>
                  handleDemoFill("alex@petsfolio.com", "Sales Manager")
                }
                className="flex-1 py-2 px-3 border border-brand-secondary text-brand-primary hover:bg-brand-secondary/30 rounded-lg text-xs font-medium transition-colors"
              >
                Sales Manager
              </button>
              <button
                type="button"
                onClick={() =>
                  handleDemoFill("sarah@petsfolio.com", "Sales Representative")
                }
                className="flex-1 py-2 px-3 border border-brand-secondary text-brand-primary hover:bg-brand-secondary/30 rounded-lg text-xs font-medium transition-colors"
              >
                Sales Rep
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
