import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { User, Mail, ShieldCheck, BadgeCheck, Loader2, Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { user, updateProfile, fetchProfile } = useAuth();
    const navigate = useNavigate();
    const [fullName, setFullName] = useState(user?.fullName || "");
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        if (user) {
            setFullName(user.fullName);
        }
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setMessage({ type: "", text: "" });

        try {
            await updateProfile(fullName);
            setMessage({ type: "success", text: "Profile updated successfully!" });
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        } catch (error) {
            setMessage({ type: "error", text: error.message || "Failed to update profile" });
        } finally {
            setIsUpdating(false);
        }
    };

    if (!user) return null;

    return (
        <div className="pt-28 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-white transition-all mb-8 font-bold text-sm"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* AVATAR & QUICK INFO */}
                    <div className="lg:col-span-1">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card p-8 text-center"
                        >
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-6 flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-primary/20">
                                {user.fullName.charAt(0)}
                            </div>
                            <h2 className="text-xl font-black text-white mb-1 uppercase tracking-tighter italic">
                                {user.fullName}
                            </h2>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-4">
                                Customer Account
                            </p>
                            
                            {user.isEmailVerified ? (
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-500 text-[10px] font-black uppercase tracking-widest">
                                    <BadgeCheck className="w-3 h-3" /> Verified
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-[10px] font-black uppercase tracking-widest">
                                    <ShieldCheck className="w-3 h-3" /> Pending Verification
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* EDIT FORM */}
                    <div className="lg:col-span-2">
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-card p-10"
                        >
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                    <User className="text-primary w-5 h-5" />
                                </div>
                                <h3 className="text-2xl font-black text-white italic">ACCOUNT SETTINGS</h3>
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="glass-input pl-14 h-16 bg-white/5 border-white/10 focus:border-primary/50 text-white font-medium"
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3 opacity-60">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email Address (Read Only)</label>
                                    <div className="relative">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                        <input
                                            type="email"
                                            value={user.email}
                                            disabled
                                            className="glass-input pl-14 h-16 bg-white/5 border-white/5 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                {message.text && (
                                    <div className={`p-4 rounded-xl text-sm font-bold ${
                                        message.type === "success" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                                    }`}>
                                        {message.text}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isUpdating || fullName === user.fullName}
                                    className="glass-button w-full h-16 flex items-center justify-center gap-3 bg-white text-black hover:bg-white/90 font-black uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <><Save className="w-5 h-5" /> Update Profile</>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
