import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, ArrowLeft, Loader2, RefreshCw } from "lucide-react";

const OTPVerify = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(30);
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const { verifyOtp, sendOtp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length < 6) return;

    setError("");
    setLoading(true);
    try {
      await verifyOtp(email, otpString);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || resending) return;
    setResending(true);
    setError("");
    try {
      await sendOtp(email);
      setTimer(30);
    } catch (err) {
      setError(err.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-accent/10 rounded-full blur-[100px] animate-pulse" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-8 relative z-10"
      >
        <button 
          onClick={() => navigate("/register")}
          className="absolute top-6 left-6 p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-4 border border-primary/30">
            <ShieldCheck className="text-primary w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Verify Email
          </h1>
          <p className="text-gray-400 mt-2 text-center text-sm">
            We've sent a 6-digit code to <br />
            <span className="text-white font-medium">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength={1}
                className="w-12 h-14 bg-white/5 border border-white/10 rounded-xl text-center text-2xl font-bold text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-accent text-sm text-center font-medium bg-accent/10 py-2 rounded-lg"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading || otp.join("").length < 6}
            className="glass-button w-full flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Continue"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm mb-4">Didn't receive the code?</p>
          <button
            onClick={handleResend}
            disabled={timer > 0 || resending}
            className={`flex items-center justify-center gap-2 mx-auto text-sm font-black uppercase tracking-widest transition-all ${
              timer > 0 ? "text-gray-600 grayscale" : "text-primary hover:text-primary-hover"
            }`}
          >
            {resending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className={`w-4 h-4 ${timer === 0 ? "animate-bounce" : ""}`} />
            )}
            Resend Code {timer > 0 && `(${timer}s)`}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OTPVerify;
