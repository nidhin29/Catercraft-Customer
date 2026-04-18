import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/apiClient";
import {
  Clock, CheckCircle2, XCircle, CreditCard,
  ExternalLink, Loader2, ArrowRight, Package
} from "lucide-react";
import { io } from "socket.io-client";

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(null);

  const fetchBookings = async () => {
    try {
      const data = await apiClient(`/api/v1/booking/User/view-bookings?customer_email=${user.email}`);
      setBookings(data.data || []);
    } catch (err) {
      console.error("Fetch bookings error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();

    // Socket.io Real-time updates
    const socket = io("http://localhost:8000");

    socket.on("connect", () => {
      console.log("Connected to real-time updates");
    });

    // Backend emits: booking_status_updated_${email}
    socket.on(`booking_status_updated_${user.email}`, (data) => {
      // Re-fetch bookings on update to get latest data including populated fields
      fetchBookings();
    });

    // Legacy/Dummy event support
    socket.on("booking_update", (updatedBooking) => {
      setBookings(prev => prev.map(b => b._id === updatedBooking._id ? updatedBooking : b));
    });

    return () => socket.disconnect();
  }, [user.email]);

  const handlePayment = async (booking) => {
    setPayLoading(booking._id);
    try {
      const orderData = await apiClient("/api/v1/payment/create-order", {
        method: "POST",
        body: JSON.stringify({ booking_id: booking._id }),
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: "CaterCraft",
        description: `Service Payment for ${booking.service?.service_name || "Catering Service"}`,
        order_id: orderData.data.id,
        handler: async function (response) {
          try {
            await apiClient("/api/v1/payment/verify-payment", {
              method: "POST",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            alert("Payment Verified Successfully!");
            fetchBookings(); // Refresh UI
          } catch (err) {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user.fullName,
          email: user.email,
        },
        theme: {
          color: "#6366f1",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err.message || "Payment initiation failed");
    } finally {
      setPayLoading(null);
    }
  };

  const getStatusInfo = (workStatus, paymentStatus) => {
    if (paymentStatus === "Paid") return { label: "Confirmed", color: "text-green-500 bg-green-500/10 border-green-500/20" };
    switch (workStatus) {
      case "Approved": return { label: "Approved", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" };
      case "Finished": return { label: "Completed", color: "text-purple-500 bg-purple-500/10 border-purple-500/20" };
      default: return { label: "Pending Review", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" };
    }
  };

  return (
    <div className="pt-28 pb-20 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
          <p className="text-gray-400">Track your event requests and pending payments</p>
        </div>
        <div className="glass-card px-6 py-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
            <Package className="text-primary w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Bookings</p>
            <p className="text-xl font-bold">{bookings.length}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card h-64 animate-pulse bg-white/5" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 glass-card">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="text-gray-600 w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No bookings yet</h2>
          <p className="text-gray-400 mb-8">Start exploring premium catering services for your events.</p>
          <button className="glass-button">Browse Services</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {bookings.map((booking) => {
              const statusInfo = getStatusInfo(booking.work_status, booking.payment_status);
              return (
                <motion.div
                  key={booking._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card p-6 flex flex-col relative overflow-hidden group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black border ${statusInfo.color} uppercase tracking-widest`}>
                      {statusInfo.label}
                    </div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">REF: {booking._id.slice(-6)}</span>
                  </div>

                  <h3 className="text-xl font-black mb-1 group-hover:text-primary transition-colors">
                    {booking.service?.service_name || "Premium Service"}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-6">
                    <Clock className="w-3 h-3" />
                    {new Date(booking.datetime).toLocaleDateString(undefined, {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </div>

                  <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Base Rate</span>
                      <span className="font-black text-white">₹{booking.service?.rate || "---"}</span>
                    </div>

                    {booking.work_status === "Approved" && booking.payment_status === "Unpaid" ? (
                      <button
                        onClick={() => handlePayment(booking)}
                        disabled={payLoading === booking._id}
                        className="glass-button py-2 px-6 text-xs flex items-center gap-2 bg-white text-black hover:bg-white/90"
                      >
                        {payLoading === booking._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4" />
                            Pay Now
                          </>
                        )}
                      </button>
                    ) : (
                      <div className={`flex items-center gap-1 font-bold text-xs ${booking.payment_status === "Paid" ? "text-green-500" : "text-gray-500"}`}>
                        {booking.payment_status === "Paid" ? (
                          <><CheckCircle2 className="w-4 h-4" /> Done</>
                        ) : (
                          <><Clock className="w-4 h-4" /> Processing</>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
