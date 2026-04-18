import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useFetch from "../hooks/useFetch";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/apiClient";
import ServiceCard from "../components/ServiceCard";
import Footer from "../components/Footer";
import ServiceProfileModal from "../components/ServiceProfileModal";
import { 
  Search, SlidersHorizontal, Calendar, X, Loader2, CheckCircle2, 
  ArrowRight, ChevronRight, Trophy, Star, ShieldCheck, Utensils
} from "lucide-react";

const Home = () => {
  const { user } = useAuth();
  const { data: services, loading, error } = useFetch("/api/v1/booking/Customer/view-all-services");
  const { data: reviews, loading: reviewsLoading } = useFetch("/api/v1/review/featured");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredServices = services?.filter(s => {
    const matchesSearch = s.service_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (s.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeCategory === "All") return matchesSearch;
    
    return matchesSearch && s.service_group?.toLowerCase() === activeCategory.toLowerCase();
  });

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to book a service");
      return;
    }
    setBookingLoading(true);
    try {
      await apiClient("/api/v1/booking/Customer/book-service", {
        method: "POST",
        body: JSON.stringify({
          service_id: selectedService._id,
          email_id_customer: user.email,
          datetime: new Date(bookingDate).toISOString(),
        }),
      });
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        setSelectedService(null);
        setIsBooking(false);
      }, 3000);
    } catch (err) {
      alert(err.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  const steps = [
    { title: "Select Service", desc: "Browse through our curated list of premium caterers.", icon: Search },
    { title: "Choose Date", desc: "Select your event date and get an instant quote.", icon: Calendar },
    { title: "Confirm & Pay", desc: "Pay a secure deposit to block the caterer's calendar.", icon: ShieldCheck },
  ];

  return (
    <div className="pt-28">
      <div className="px-4 max-w-7xl mx-auto">
        {/* HERO SECTION */}
        <section className="mt-12 mb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8">
              <span className="text-[10px] font-black uppercase tracking-widest">India's #1 Catering Marketplace</span>
            </div>
            
            <h1 className="text-6xl md:text-9xl font-black mb-8 leading-none tracking-tighter">
              Dine With <br />
              <span className="bg-gradient-to-r from-primary via-white to-accent bg-clip-text text-transparent">Distinction.</span>
            </h1>
            
            <p className="text-gray-500 text-lg md:text-2xl max-w-2xl mx-auto mb-16 font-medium leading-relaxed">
              Unlock access to the world's most exclusive caterers, tailored to make your next landmark event truly unforgettable.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-4xl mx-auto glass-card p-2 rounded-2xl border-white/10 shadow-2xl shadow-primary/5">
              <div className="relative w-full">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for cuisines, events, or chefs..."
                  className="w-full bg-transparent border-none h-16 pl-16 focus:ring-0 text-lg placeholder:text-gray-600"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                onClick={() => document.getElementById('explore').scrollIntoView({ behavior: 'smooth' })}
                className="glass-button h-16 px-12 whitespace-nowrap bg-white text-black hover:bg-white/90 font-black uppercase tracking-widest text-xs cursor-pointer"
              >
                Find Services
              </button>
            </div>
          </motion.div>
        </section>

        {/* MARKETPLACE GRID */}
        <section className="mb-24 mt-12 pt-12 border-t border-white/5" id="explore">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div>
              <h2 className="text-4xl font-black tracking-tighter text-white">Curated Marketplace</h2>
            </div>
            
            {/* Category Pills */}
            <div className="flex overflow-x-auto gap-3 pb-2 md:pb-0 scrollbar-hide">
              {[
                { name: "All", icon: <SlidersHorizontal className="w-4 h-4" /> },
                { name: "Wedding", icon: <Trophy className="w-4 h-4" /> },
                { name: "Corporate", icon: <ShieldCheck className="w-4 h-4" /> },
                { name: "Parties", icon: <Utensils className="w-4 h-4" /> },
                { name: "Global", icon: <Star className="w-4 h-4 text-primary" /> }
              ].map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                    activeCategory === cat.name
                      ? "bg-white text-black border-white shadow-xl shadow-white/10"
                      : "bg-white/5 text-gray-400 border-white/5 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  {cat.icon}
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <div key={i} className="glass-card h-80 animate-pulse bg-white/5" />)}
            </div>
          ) : error ? (
            <div className="text-center py-20 glass-card">
              <p className="text-accent mb-4">{error}</p>
              <button onClick={() => window.location.reload()} className="text-primary hover:underline">Try Again</button>
            </div>
          ) : filteredServices?.length === 0 ? (
            <div className="text-center py-20 glass-card">
              <Utensils className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No services found</h3>
              <p className="text-gray-500">Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices?.map((service) => (
                <ServiceCard 
                  key={service._id} 
                  service={service} 
                  onBook={() => setSelectedService(service)}
                />
              ))}
            </div>
          )}
        </section>

        {/* CUSTOMER VOICES (REVIEWS) */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-4xl font-black tracking-tighter text-white">Customer Voices</h2>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviewsLoading ? (
              [1, 2, 3].map(i => <div key={i} className="glass-card h-64 animate-pulse bg-white/5" />)
            ) : reviews?.length > 0 ? (
              reviews.map((review, i) => (
                <motion.div
                  key={review._id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card p-8 flex flex-col relative overflow-hidden group border-white/5"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Utensils className="w-20 h-20 rotate-12" />
                  </div>
                  
                  <p className="text-lg italic text-gray-300 font-medium leading-relaxed mb-8 relative z-10">
                    "{review.message}"
                  </p>

                  <div className="mt-auto flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-black text-xs text-white uppercase">
                        {review.customer?.fullName?.charAt(0) || "U"}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{review.customer?.fullName || "Verified User"}</h4>
                        <div className="flex items-center gap-1 text-[10px] text-primary">
                          {[...Array(5)].map((_, starIndex) => (
                            <Star 
                              key={starIndex} 
                              className={`w-2 h-2 ${starIndex < review.rating ? "fill-primary" : "fill-transparent text-gray-600"}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-[10px] font-black text-primary uppercase tracking-tighter px-2 py-1 bg-primary/10 rounded border border-primary/20">
                      {review.service?.service_name || "Premium Experience"}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">
                Be the first to share your experience!
              </div>
            )}
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="mb-24">
          <div className="glass-card p-12 md:p-20 bg-gradient-to-br from-primary/20 to-accent/10 relative overflow-hidden text-center border-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to Plan Your Feast?</h2>
              <p className="text-gray-300 text-lg mb-10 max-w-xl mx-auto">
                Join thousands of customers who trust CaterCraft for their most important events.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="glass-button bg-white text-black hover:bg-white/90 px-10 h-14">Get Started</button>
                <button className="glass-card bg-transparent border-white/20 px-10 h-14 hover:bg-white/5 transition-colors">Our Policies</button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />

      {/* DISCOVERY & BOOKING MODALS */}
      <AnimatePresence mode="wait">
        {selectedService && !isBooking && (
          <ServiceProfileModal
            key="profile"
            service={selectedService}
            onClose={() => setSelectedService(null)}
            onBookInit={() => setIsBooking(true)}
          />
        )}

        {selectedService && isBooking && (
          <div key="booking" className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setSelectedService(null); setIsBooking(false); }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="glass-card w-full max-w-lg p-10 relative z-[130] border-white/10"
            >
              <button 
                onClick={() => setIsBooking(false)}
                className="absolute top-6 left-6 p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-all flex items-center gap-2 text-xs font-bold"
              >
                <ArrowRight className="w-4 h-4 rotate-180" /> Back
              </button>

              <button 
                onClick={() => { setSelectedService(null); setIsBooking(false); }}
                className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              {bookingSuccess ? (
                <div className="text-center py-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30"
                  >
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                  </motion.div>
                  <h2 className="text-2xl font-black italic mb-2 tracking-tight uppercase">Booking Requested!</h2>
                  <p className="text-gray-400 text-sm">Our partner will review your selection shortly. Keep track via your dashboard.</p>
                </div>
              ) : (
                <div className="pt-8">
                  <div className="mb-8">
                    <p className="text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-1">Step 02: Selection</p>
                    <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">{selectedService.service_name}</h2>
                    <p className="text-gray-500 text-sm font-medium mt-1 uppercase tracking-widest">₹{selectedService.rate} Reservation Deposit</p>
                  </div>

                  <form onSubmit={handleBook} className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Event Date & Time</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                        <input
                          type="datetime-local"
                          required
                          min={new Date().toISOString().slice(0, 16)}
                          className="glass-input pl-14 h-16 bg-white/5 border-white/10 focus:border-primary/50"
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="glass-button w-full h-16 flex items-center justify-center gap-3 text-sm bg-white text-black hover:bg-white/90 font-black uppercase tracking-widest"
                    >
                      {bookingLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                        <>Complete Booking Selection <ChevronRight className="w-4 h-4" /></>
                      )}
                    </button>
                    <p className="text-[10px] text-gray-500 text-center font-bold px-4 uppercase tracking-tighter">
                      By proceeding, you agree to our premium service level agreements and partial refund policies.
                    </p>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
