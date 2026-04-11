import React from "react";
import { motion } from "framer-motion";
import { Star, MapPin, IndianRupee, Clock } from "lucide-react";

const ServiceCard = ({ service, onBook }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="glass-card overflow-hidden group"
    >
      <div className="relative h-56 overflow-hidden group">
        <img
          src={service.imageUrl || "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800"}
          alt={service.service_name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
            {service.service_name}
          </h3>
          <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">
            By {service.owner_email?.split('@')[0].replace(/[^a-zA-Z]/g, ' ')}
          </p>
          <div className="flex items-center text-primary font-bold text-lg">
            <IndianRupee className="w-4 h-4" />
            <span>{service.rate}</span>
          </div>
        </div>

        <p className="text-gray-400 text-sm line-clamp-2 mb-4">
          {service.description || "Premium catering services tailored for your special events and corporate gatherings."}
        </p>

        <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>48h notice</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>Pan India</span>
          </div>
        </div>

        <button
          onClick={() => onBook(service)}
          className="glass-button w-full bg-white text-black hover:bg-white/90 font-black uppercase tracking-widest text-[10px]"
        >
          Explore Experience
        </button>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
