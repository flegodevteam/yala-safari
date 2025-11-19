import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FiLock } from "react-icons/fi";
import { apiEndpoints } from "../config/api";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("you@yalasafari.com");
  const [password, setPassword] = useState("");
  const [rememberDevice, setRememberDevice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Get the page user was trying to access before login
  const from = location.state?.from || '/dashboard';

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch(apiEndpoints.admin.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        console.log("Login successful, storing token and navigating to:", from);
        localStorage.setItem("adminToken", data.token);
        
        // Store admin info if available
        if (data.admin) {
          localStorage.setItem("adminInfo", JSON.stringify({
            name: data.admin.name,
            email: data.admin.email,
            role: data.admin.role,
          }));
        }
        
        toast.success("Login successful!");
        navigate(from, { replace: true });
      } else {
        console.log("Login failed:", data.message);
        setErrorMsg(data.message || "Invalid email or password");
        toast.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("Network error. Please try again.");
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    toast.info("Please contact system administrator to reset password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4 py-10 sm:px-6 lg:px-12">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row rounded-[32px] border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl bg-[#0b140f]/70">
        {/* Left Panel - Information Panel */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-[#034123]/85 via-[#026042]/85 to-[#038873]/85 p-10 lg:p-12 flex flex-col justify-between">
          <div>
            {/* YALA VIBE ADMIN Badge */}
            <span className="inline-block px-4 py-1.5 bg-[#4ade80]/20 backdrop-blur-md text-[#4ade80] text-xs font-semibold rounded-full border border-[#4ade80]/40 shadow-lg">
              YALA VIBE ADMIN
            </span>
            
            {/* Main Title */}
            <h1 className="mt-8 text-4xl sm:text-5xl font-bold text-white leading-tight">
              Enterprise Command Center<br />for Safari Operations
            </h1>
            
            {/* Description */}
            <p className="mt-6 text-base sm:text-lg text-white/90 leading-relaxed max-w-lg">
              Coordinate field teams, manage guest experiences, and safeguard financial operations — all from a zero-trust secured control hub.
            </p>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-white/95">
          <div className="w-full max-w-md p-8 lg:p-12 space-y-8">
          {/* ADMIN ACCESS ONLY Badge */}
          <span className="inline-block px-4 py-1.5 bg-[#4ade80]/15 backdrop-blur-md text-[#4ade80] text-xs font-semibold rounded-full border border-[#4ade80]/30 shadow-md">
            ADMIN ACCESS ONLY
          </span>

          {/* Authenticate to continue */}
          <div>
            <h2 className="text-4xl font-bold text-[#1f2937] mb-3">
              Authenticate to continue
            </h2>
            <p className="text-[#4b5563] text-base leading-relaxed">
              Your session is encrypted and monitored. Use assigned enterprise credentials to enter.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50/80 backdrop-blur-sm border-2 border-red-300/60 text-red-700 px-4 py-3 rounded-xl text-sm font-medium shadow-md">
              {errorMsg}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            {/* WORK EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#1f2937] mb-2"
              >
                WORK EMAIL
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 placeholder-[#9ca3af] text-[#1f2937] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] focus:bg-white sm:text-sm transition-all duration-300 shadow-sm"
                placeholder="you@yalasafari.com"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-[#1f2937]"
                >
                  PASSWORD
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm font-medium text-[#034123] hover:text-[#026042] transition-colors duration-300"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 placeholder-[#9ca3af] text-[#1f2937] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] focus:bg-white sm:text-sm transition-all duration-300 shadow-sm"
                placeholder="Enter your password"
              />
            </div>

            {/* Remember this device */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="h-4 w-4 text-[#034123] focus:ring-[#034123] border-[#d1d5db]/60 rounded cursor-pointer bg-white/90 backdrop-blur-sm"
              />
              <label htmlFor="remember-me" className="ml-3 block text-sm text-[#4b5563] cursor-pointer">
                Remember this device
              </label>
            </div>

            {/* Secure Sign In Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center items-center py-4 px-8 border border-transparent text-base font-semibold rounded-xl text-white bg-[#034123] hover:bg-[#026042] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#034123]/50 transition-all duration-300 shadow-xl hover:shadow-2xl backdrop-blur-sm ${
                  isLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <FiLock className="w-5 h-5 mr-2" />
                    Secure Sign In
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security Footer */}
          <div className="pt-6 border-t border-[#e5e7eb]">
            <p className="text-xs text-[#9ca3af] text-center leading-relaxed">
              Encrypted via TLS 1.3 · ISO 27001 compliant · Continuous anomaly detection
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default AdminLogin;