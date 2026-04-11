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
  ArrowRight, Users, Trophy, Star, ShieldCheck, Utensils
} from "lucide-react";

const Home = () => {
  const { user } = useAuth();
  const { data: services, loading, error } = useFetch("/Customer/view-all-services");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const DUMMY_SERVICES = [
    {
      _id: "dummy-1",
      service_name: "Royal Wedding Feast",
      rate: 1499,
      duration: "8 Hours",
      description: "A truly regal experience for your wedding day. Our royal wedding feast includes an exquisite multi-course dinner with live cooking stations, dedicated butlers, and a master chef overseeing every detail of your celebration. From delicate amuse-bouches to spectacular dessert spreads, we craft an unforgettable culinary journey.",
      owner_email: "signature.platters@catercraft.in",
      imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800"
    },
    {
      _id: "dummy-2",
      service_name: "Corporate Excellence Summit",
      rate: 899,
      duration: "5 Hours",
      description: "Impress clients and colleagues alike with our premium corporate catering designed for executive summits and high-stakes business gatherings. Features a sophisticated international cold buffet, finger food stations, and artisan coffee bar.",
      owner_email: "executive.bites@catercraft.in",
      imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800"
    },
    {
      _id: "dummy-3",
      service_name: "Gourmet Birthday Party",
      rate: 650,
      duration: "4 Hours",
      description: "Turn any birthday celebration into a gourmet affair. Our party package includes themed food stations, interactive dessert counters, handcrafted mocktails and a personalised celebration cake from our award-winning pastry team.",
      owner_email: "festive.tables@catercraft.in",
      imageUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=800"
    },
    {
      _id: "dummy-4",
      service_name: "Global Cuisine Experience",
      rate: 1200,
      duration: "6 Hours",
      description: "Travel the world through taste at your event. Our global cuisine experience brings together the finest international culinary traditions — from Italian antipasti to Japanese teppanyaki, Mexican street food to French patisserie — all curated by our world-traveled chef collective.",
      owner_email: "worldkitchen@catercraft.in",
      imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800"
    },
    {
      _id: "dummy-5",
      service_name: "Bridal Cocktail Evening",
      rate: 980,
      duration: "5 Hours",
      description: "Celebrate love in style with our intimate bridal cocktail evening package. Features a curated selection of premium canapés, artisan cocktails and mocktails, and an elegant grazing table designed to delight your guests all evening long.",
      owner_email: "signature.platters@catercraft.in",
      imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800"
    },
    {
      _id: "dummy-6",
      service_name: "Executive Boardroom Lunch",
      rate: 550,
      duration: "2 Hours",
      description: "A refined and time-efficient catering solution for executive decision-makers. Our boardroom lunch delivers a curated three-course meal with precision service — allowing your team to focus on what truly matters while we handle the rest.",
      owner_email: "executive.bites@catercraft.in",
      imageUrl: "https://images.unsplash.com/photo-1547573854-74d2a71d0826?q=80&w=800"
    },
  ];

  const allServices = [...(services || []), ...(services?.length ? [] : DUMMY_SERVICES)];

  const filteredServices = allServices.filter(s => {
    const matchesSearch = s.service_name.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeCategory === "All") return matchesSearch;
    
    const content = (s.service_name + " " + (s.description || "")).toLowerCase();
    const keywords = {
      Wedding: ["wedding", "marriage", "royal", "bridal"],
      Corporate: ["corporate", "office", "business", "summit", "formal", "executive", "boardroom"],
      Parties: ["party", "celebration", "birthday", "soiree", "anniversary", "cocktail"],
      Global: ["global", "international", "cuisine", "world", "continental", "chinese", "italian"]
    }[activeCategory] || [];
    
    return matchesSearch && keywords.some(k => content.includes(k));
  });

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to book a service");
      return;
    }
    setBookingLoading(true);
    try {
      await apiClient("/Customer/book-service", {
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

  const testimonials = [
    { name: "Arjun Mehta", role: "Event Architect", text: "The quality of caterers on CaterCraft is unmatched. Truly premium services.", stars: 5 },
    { name: "Sarah Khan", role: "Marketing Head", text: "Seamless booking process for our annual corporate gala. 10/10 would recommend.", stars: 5 },
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
            {[
              { 
                name: "Anjali Sharma", 
                role: "Wedding Architect", 
                text: "The Signature Platters' molecular gastronomy was the talk of our wedding. Truly world-class services that redefined the event.",
                event: "Signature Wedding"
              },
              { 
                name: "David Miller", 
                role: "Operations Head", 
                text: "Professional, punctual, and most importantly—divine taste. CaterCraft for our corporate summit was a game changer.",
                event: "Annual Business Summit"
              },
              { 
                name: "Priya Kapoor", 
                role: "Food Critic", 
                text: "An absolute masterclass in flavor and presentation. The attention to detail provided for our soirée was breathtaking.",
                event: "Luxury Soirée"
              }
            ].map((review, i) => (
              <motion.div
                key={i}
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
                  "{review.text}"
                </p>

                <div className="mt-auto flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-black text-xs text-white">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{review.name}</h4>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{review.role}</p>
                    </div>
                  </div>
                  <div className="text-[10px] font-black text-primary uppercase tracking-tighter px-2 py-1 bg-primary/10 rounded border border-primary/20">
                    {review.event}
                  </div>
                </div>
              </motion.div>
            ))}
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
