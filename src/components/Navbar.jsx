import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UtensilsCrossed, LayoutDashboard, Search, LogOut, User } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout(user?.email);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const navLinks = [
    { name: "Explore", path: "/", icon: Search },
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-4 md:px-8 py-4">
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="max-w-7xl mx-auto glass-card flex items-center justify-between px-6 py-3 border-white/5"
      >
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-primary/20 transition-all overflow-hidden p-1">
            <img src="/logo.png" alt="CaterCraft Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            CaterCraft
          </span>
        </Link>

        {/* NAVIGATION */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`flex items-center gap-2 text-sm font-bold transition-all ${
              location.pathname === "/" ? "text-primary" : "text-gray-400 hover:text-white"
            }`}
          >
            <Search className="w-4 h-4" />
            Explore
          </Link>
          
          {user && (
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 text-sm font-bold transition-all ${
                location.pathname === "/dashboard" ? "text-primary" : "text-gray-400 hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          )}
        </div>

        {/* AUTH/PROFILE */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <Link to="/profile" className="hidden md:block text-right group">
                <p className="text-xs font-black text-white group-hover:text-primary transition-colors">{user.fullName}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Account Settings</p>
              </Link>
              <button 
                onClick={handleLogout}
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              className="glass-button px-6 py-2 bg-white text-black hover:bg-white/90"
            >
              Login
            </Link>
          )}
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
