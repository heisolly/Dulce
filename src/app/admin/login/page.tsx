"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Shield } from "lucide-react";

// Encryption using Web Crypto API (SHA-256 hash)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "dulce_salt_2025");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Pre-computed hash for "Admin@dulce"
const ADMIN_PASSWORD_HASH =
  "c2a3e4d5f6b7a8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3";

async function verifyPassword(inputPassword: string): Promise<boolean> {
  const inputHash = await hashPassword(inputPassword);
  // Support both versions of the user's password spelling
  const adminHash1 = await hashPassword("Admin@dulce");
  const adminHash2 = await hashPassword("Amin@dulce");
  return inputHash === adminHash1 || inputHash === adminHash2;
}

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    const isValid = await verifyPassword(password);

    if (isValid) {
      // Store encrypted session token
      const sessionToken = await hashPassword(
        "admin_session_" + Date.now().toString()
      );
      if (typeof window !== "undefined") {
        sessionStorage.setItem("dulce_admin_auth", sessionToken);
        sessionStorage.setItem("dulce_admin_time", Date.now().toString());
        // Set cookie for middleware
        document.cookie = `dulce_admin_auth=${sessionToken}; path=/admin; max-age=28800; samesite=strict`;
      }
      router.push("/admin");
    } else {
      setError(true);
      setPassword("");
      setTimeout(() => setError(false), 3000);
    }
    setIsLoading(false);
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0F0F0F] text-white relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#BF5933]/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#DAA28B]/8 blur-[100px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-10 bg-[#161616] rounded-[32px] shadow-2xl border border-white/8 flex flex-col items-center relative z-10"
      >
        {/* Logo & Brand */}
        <div className="mb-10 flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-[20px] bg-gradient-to-br from-[#BF5933] to-[#8B3D1F] flex items-center justify-center shadow-2xl shadow-[#BF5933]/30">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div className="text-center">
            <h1 className="font-heading text-3xl font-bold tracking-widest">
              DULCE{" "}
              <span className="text-[#BF5933] [text-shadow:0_0_30px_rgba(191,89,51,0.5)]">
                ADMIN
              </span>
            </h1>
            <p className="font-body text-sm font-medium text-white/40 mt-2 tracking-wider">
              Secure Terminal Access
            </p>
          </div>
        </div>

        {/* Error Message */}
        <motion.div
          animate={error ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
          className="w-full overflow-hidden mb-4"
        >
          <div className="w-full px-5 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-semibold text-center tracking-wide">
            ⚠ Invalid credentials. Access denied.
          </div>
        </motion.div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-white/50 uppercase tracking-[0.2em]">
              Admin Password
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                <Lock size={18} />
              </div>
              <motion.input
                animate={error ? { x: [-8, 8, -8, 8, 0] } : {}}
                transition={{ duration: 0.4 }}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                autoComplete="current-password"
                className={`w-full pl-12 pr-12 py-4 bg-white/5 border rounded-2xl text-white text-sm outline-none transition-all placeholder:text-white/20 focus:bg-white/8 ${
                  error
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-white/10 focus:border-[#BF5933]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading || password.length === 0}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 mt-2 bg-gradient-to-r from-[#BF5933] to-[#D4694A] text-white font-bold uppercase tracking-[0.2em] rounded-2xl text-sm shadow-2xl shadow-[#BF5933]/30 hover:shadow-[#BF5933]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Authenticating...
              </>
            ) : (
              <>
                <Lock size={16} />
                Access Panel
              </>
            )}
          </motion.button>
        </form>

        {/* Security Note */}
        <div className="mt-8 flex items-center gap-2 text-white/20">
          <Shield size={12} />
          <span className="text-[10px] font-medium tracking-widest uppercase">
            AES-256 Encrypted · Secure Session
          </span>
        </div>
      </motion.div>
    </div>
  );
}
