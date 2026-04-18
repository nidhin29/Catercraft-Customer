import React from "react";
import { motion } from "framer-motion";
import { X, Clock, IndianRupee, Utensils, ChevronRight, Info } from "lucide-react";

const ServiceProfileModal = ({ service, onClose, onBookInit }) => {
  if (!service) return null;

  const heroImage = service.imageUrl || "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200";

  const starters = service.menu?.starters || [];
  const mainCourse = service.menu?.main_course || [];
  const desserts = service.menu?.desserts || [];
  const inclusions = service.whats_included || [];

  const hasGastronomy = starters.length > 0 || mainCourse.length > 0 || desserts.length > 0;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 40 }}
        transition={{ type: "spring", damping: 26, stiffness: 280 }}
        className="relative z-10 w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e0e] shadow-2xl flex flex-col"
      >
        {/* HERO IMAGE — full width top banner */}
        <div className="relative h-56 md:h-72 w-full flex-shrink-0 overflow-hidden">
          <img src={heroImage} alt={service.service_name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-black/30 to-transparent" />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black rounded-full transition-all"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Service name on image bottom */}
          <div className="absolute bottom-6 left-8">
            <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-1">
              By {service.owner_email?.split("@")[0].replace(/[^a-zA-Z]/g, " ")}
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase leading-none">
              {service.service_name}
            </h1>
          </div>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10">
          {/* Price + Duration pills */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-bold text-white">
              <IndianRupee className="w-4 h-4 text-primary" />
              ₹{service.rate}
              <span className="text-gray-500 text-xs font-medium">/ event</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-bold text-gray-300">
              <Clock className="w-4 h-4 text-gray-500" />
              {service.duration || "4 Hours"}
            </div>
          </div>

          {/* Description */}
          {service.description && (
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
              {service.description}
            </p>
          )}

          {/* Menu */}
          {hasGastronomy && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Utensils className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-black uppercase tracking-widest text-white">The Gastronomy</h3>
              </div>
              <div className="space-y-6">
                {[
                  { label: "Starters", items: starters },
                  { label: "Main Course", items: mainCourse },
                  { label: "Desserts", items: desserts },
                ]
                  .filter((section) => section.items.length > 0)
                  .map((section, i) => (
                    <div key={i}>
                      <p className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-widest mb-3">
                        <ChevronRight className="w-3 h-3" /> {section.label}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {section.items.map((item, j) => (
                          <span
                            key={j}
                            className="px-3 py-1.5 bg-white/5 border border-white/8 rounded-lg text-sm text-gray-400"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Inclusions */}
          {inclusions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-5">
                <Info className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-black uppercase tracking-widest text-white">What's Included</h3>
              </div>
              <ul className="grid grid-cols-2 gap-3">
                {inclusions.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Extra bottom padding so content clears the sticky bar */}
          <div className="h-4" />
        </div>

        {/* STICKY FOOTER — sits outside scroll area */}
        <div className="flex-shrink-0 flex items-center justify-between px-8 py-5 border-t border-white/5 bg-[#0e0e0e]">
          <div>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-0.5">Estimated Investment</p>
            <p className="text-2xl font-black text-white">₹{service.rate}</p>
          </div>
          <button
            onClick={() => onBookInit(service)}
            className="glass-button px-10 py-4 bg-white text-black hover:bg-white/90 font-black uppercase tracking-widest text-xs"
          >
            Secure This Service
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ServiceProfileModal;
