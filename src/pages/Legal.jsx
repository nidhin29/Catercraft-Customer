import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, FileText, RefreshCw, ChevronRight } from "lucide-react";

const Legal = () => {
  const [activeTab, setActiveTab] = useState("terms");

  const policies = {
    terms: {
      title: "Terms of Service",
      icon: <FileText className="w-5 h-5" />,
      content: [
        {
          h: "1. Acceptance of Terms",
          p: "By accessing and using CaterCraft, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services."
        },
        {
          h: "2. Service Description",
          p: "CaterCraft provides a platform to connect customers with premium catering partners. We facilitate bookings, payments, and communication but the quality of food and service is the responsibility of the individual catering partner."
        },
        {
          h: "3. User Accounts",
          p: "Users are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account."
        },
        {
          h: "4. Pricing and Payment",
          p: "All prices are listed in INR. Payments are processed securely via Razorpay. Booking is only confirmed upon successful payment verification."
        }
      ]
    },
    privacy: {
      title: "Privacy Policy",
      icon: <Shield className="w-5 h-5" />,
      content: [
        {
          h: "Data Collection",
          p: "We collect information you provide during registration and booking, including name, email, phone number, and event details."
        },
        {
          h: "How We Use Data",
          p: "Your data is used to process bookings, provide real-time updates via Socket.io, and improve our services. We do not sell your data to third parties."
        },
        {
          h: "Security",
          p: "We implement industry-standard security measures, including HTTPS encryption and secure token-based authentication to protect your information."
        }
      ]
    }
  };

  return (
    <div className="pt-32 pb-20 px-4 max-w-5xl mx-auto min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
          Legal & Policies
        </h1>
        <p className="text-gray-400">Everything you need to know about using the CaterCraft platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="md:col-span-1 space-y-2">
          {Object.entries(policies).map(([key, policy]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                activeTab === key 
                ? "bg-primary/20 border-primary/50 text-white shadow-lg shadow-primary/10" 
                : "bg-white/5 border-white/5 text-gray-500 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                {policy.icon}
                <span className="font-bold text-sm">{policy.title}</span>
              </div>
              {activeTab === key && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-8 md:p-12"
          >
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              {policies[activeTab].icon}
              {policies[activeTab].title}
            </h2>

            <div className="space-y-10">
              {policies[activeTab].content.map((item, i) => (
                <div key={i} className="space-y-3">
                  <h3 className="text-lg font-bold text-white/90">{item.h}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                    {item.p}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 text-xs text-gray-600">
              Last Updated: May 2026 • © CaterCraft Technologies
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Legal;
