import React from "react";
import { UtensilsCrossed, Mail, Phone, MapPin, ShieldCheck, Scale, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="glass-card mt-20 border-t-0 rounded-b-none p-10 md:p-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-6 flex flex-col items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
              <UtensilsCrossed className="text-primary w-6 h-6" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              CaterCraft
            </span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs text-center">
            Elevating your corporate events and private celebrations with India's most curated catering network. Excellence in every morsel.
          </p>
          <div className="flex gap-4">
            {/* Social icons removed for stability */}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h4 className="text-lg font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-gray-400 text-center">
            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><Link to="/#services" className="hover:text-primary transition-colors">Explore Services</Link></li>
            <li><Link to="/dashboard" className="hover:text-primary transition-colors">My Bookings</Link></li>
            <li><Link to="/profile" className="hover:text-primary transition-colors">Profile Settings</Link></li>
          </ul>
        </div>

        <div className="flex flex-col items-center">
          <h4 className="text-lg font-bold mb-6">Contact Us</h4>
          <ul className="space-y-4 text-gray-400">
            <li className="flex items-center gap-3 justify-center">
              <Phone className="w-5 h-5 text-primary" />
              <span>{import.meta.env.VITE_PHONE_NUMBER}</span>
            </li>
            <li className="flex items-center gap-3 justify-center">
              <Mail className="w-5 h-5 text-primary" />
              <span>{import.meta.env.VITE_EMAIL_ADDRESS}</span>
            </li>
            <li className="flex items-center gap-3 justify-center">
              <MapPin className="w-5 h-5 text-primary" />
              <span>{import.meta.env.VITE_ADDRESS}</span>
            </li>
          </ul>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} CaterCraft Technologies. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
