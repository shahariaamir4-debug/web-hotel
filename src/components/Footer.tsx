import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  ArrowUp, 
  CheckCircle2, 
  Compass, 
  Award,
  Send,
  CalendarCheck,
  CreditCard,
  Wifi,
  UtensilsCrossed
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [localTime, setLocalTime] = useState('');

  // Live Resort Time (Maldives / Bali GMT+5 time)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format to GMT+5 for the tropical sanctuary
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Indian/Maldives'
      };
      try {
        setLocalTime(new Intl.DateTimeFormat('en-US', options).format(now));
      } catch {
        setLocalTime(now.toLocaleTimeString());
      }
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 3000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#020e0a] text-slate-300 relative overflow-hidden border-t border-emerald-950/80">
      
      {/* Ambient Atmospheric Lighting */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[300px] bg-emerald-500/5 blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-teal-500/5 blur-[200px] pointer-events-none" />

      {/* 
        ========================================================================
        1. VIP NEWSLETTER & PRIVATE TRAVEL CLUB SECTION
        ========================================================================
      */}
      <div className="border-b border-emerald-900/40 bg-gradient-to-b from-[#03150f] to-[#020e0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="relative rounded-3xl bg-gradient-to-r from-[#041c14] via-[#06291e] to-[#041c14] p-8 sm:p-12 border border-emerald-500/30 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Newsletter Pitch */}
            <div className="max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3 shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Antix Private Guest Circle</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Unlock Private Offers & Complimentary Perks
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Join our discerning guest registry to receive seasonal villa release announcements, private yacht charter privileges, and complimentary sunset dining vouchers.
              </p>
            </div>

            {/* Newsletter Form */}
            <div className="w-full lg:w-auto shrink-0">
              {isSubscribed ? (
                <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-emerald-900/60 border border-emerald-400 text-emerald-200 text-sm font-bold shadow-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  <span>Welcome to the Private Circle! Exclusive voucher sent.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full sm:w-[420px]">
                  <input
                    id="input-footer-email"
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your VIP email address..."
                    className="flex-1 px-4 py-3.5 rounded-2xl bg-[#020e0a]/90 border border-emerald-800 text-sm text-white placeholder-slate-400 focus:outline-hidden focus:border-emerald-400 shadow-inner"
                  />
                  <button
                    id="btn-footer-subscribe"
                    type="submit"
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-950 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    <span>Join Circle</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
              
              <div className="flex items-center justify-center lg:justify-start gap-4 mt-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> No spam ever
                </span>
                <span>•</span>
                <span>Unsubscribe anytime with 1-click</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 
        ========================================================================
        2. MULTI-COLUMN LUXURY DIRECTORY & RESORT SECTION
        ========================================================================
      */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-16 border-b border-emerald-950/80">
          
          {/* Column 1: Brand & Philosophy (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div 
              onClick={() => scrollToSection('hero')} 
              className="flex items-center gap-3 cursor-pointer group inline-flex"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-xl shadow-emerald-950 border border-emerald-400/40 group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-black text-2xl tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                    Antix
                  </span>
                  <span className="font-display font-light text-2xl tracking-tight text-emerald-300">
                    Hotel
                  </span>
                </div>
                <p className="text-[10px] uppercase tracking-widest font-extrabold text-emerald-400/80">
                  Luxury Resort & Sanctuaries
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal max-w-sm">
              Antix Hotel is an internationally acclaimed architectural sanctuary nestled along pristine ocean waters. Designed with bespoke natural stone, heated infinity lagoons, and an uncompromising commitment to guest serenity.
            </p>

            {/* Pay at Hotel Guarantee Highlight Pill */}
            <div className="p-3.5 rounded-2xl bg-[#041c14] border border-emerald-800/60 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-700/80 text-white flex items-center justify-center shrink-0 mt-0.5">
                <CreditCard className="w-4 h-4 text-emerald-200" />
              </div>
              <div>
                <span className="text-xs font-black text-emerald-200 block">
                  100% Cash / Card on Arrival Guarantee
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Zero online advance payment. Reserve now, settle peacefully when you check in.
                </p>
              </div>
            </div>

            {/* Prestigious Hospitality Accreditations */}
            <div className="flex items-center gap-4 pt-1">
              <div className="px-3 py-1 rounded-lg bg-emerald-950/70 border border-emerald-800/50 text-[10px] font-bold text-amber-300 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Forbes 5-Star Certified</span>
              </div>
              <div className="px-3 py-1 rounded-lg bg-emerald-950/70 border border-emerald-800/50 text-[10px] font-bold text-emerald-300">
                Condé Nast Gold List
              </div>
            </div>
          </div>

          {/* Column 2: Accommodations & Suites (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white font-black text-sm uppercase tracking-wider border-b border-emerald-900/50 pb-2">
              Suites & Villas
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => scrollToSection('featured-rooms')} className="hover:text-emerald-300 transition-colors cursor-pointer text-left">
                  Overwater Ocean Villa
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('featured-rooms')} className="hover:text-emerald-300 transition-colors cursor-pointer text-left">
                  Presidential Penthouse
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('featured-rooms')} className="hover:text-emerald-300 transition-colors cursor-pointer text-left">
                  Lagoon Glass Residence
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('featured-rooms')} className="hover:text-emerald-300 transition-colors cursor-pointer text-left">
                  Sunset Horizon Suite
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('featured-rooms')} className="hover:text-emerald-300 transition-colors cursor-pointer text-left">
                  Private Pool Villa
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('featured-rooms')} className="hover:text-emerald-300 transition-colors cursor-pointer text-left">
                  Urban Executive Retreat
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Resort Experiences (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white font-black text-sm uppercase tracking-wider border-b border-emerald-900/50 pb-2">
              Experiences
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Michelin Sea Dining</span>
              </li>
              <li className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Private Yacht Charters</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Holistic Ocean Spa</span>
              </li>
              <li className="flex items-center gap-2">
                <Wifi className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Starlink High-Speed</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>24/7 Butler Service</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white font-black text-sm uppercase tracking-wider border-b border-emerald-900/50 pb-2">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => scrollToSection('hero')} className="hover:text-emerald-300 transition-colors cursor-pointer">
                  Sanctuary Overview
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('why-antix')} className="hover:text-emerald-300 transition-colors cursor-pointer">
                  Why Choose Antix
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('how-it-works')} className="hover:text-emerald-300 transition-colors cursor-pointer">
                  How Booking Works
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('reviews')} className="hover:text-emerald-300 transition-colors cursor-pointer">
                  Verified Guest Reviews
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('featured-rooms')} className="hover:text-emerald-300 transition-colors cursor-pointer">
                  Live Suite Availability
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Front Desk & Live Sanctuary Time (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white font-black text-sm uppercase tracking-wider border-b border-emerald-900/50 pb-2">
              Direct Contact
            </h4>
            
            {/* Live Clock Widget */}
            <div className="p-3 rounded-xl bg-[#041c14] border border-emerald-800/50 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                <Clock className="w-3.5 h-3.5 animate-spin duration-[10000ms]" />
                <span className="text-[10px] uppercase tracking-wider">Sanctuary Local Time</span>
              </div>
              <div className="font-mono text-sm font-black text-white">
                {localTime || '11:45:00 AM'}
              </div>
              <span className="text-[10px] text-slate-400">Maldives / GMT+5 (28°C Sunny)</span>
            </div>

            <ul className="space-y-2 text-xs text-slate-300 pt-1">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-bold">+1 (800) 492-ANTIX</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">concierge@antixhotel.com</span>
              </li>
              <li className="flex items-start gap-2 text-[11px] text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Paradise Atoll Cove, Ocean Pavilion 01</span>
              </li>
            </ul>
          </div>

        </div>

        {/* 
          ========================================================================
          3. FOOTER ACTIONS & BACK TO TOP
          ========================================================================
        */}
        <div className="pt-8 pb-6 flex justify-center">
          <button
            id="btn-footer-back-to-top"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#041c14] hover:bg-[#06291e] border border-emerald-500/40 text-emerald-200 text-xs font-bold transition-all shadow-lg hover:scale-105 cursor-pointer"
          >
            <span>Return to Top</span>
            <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>

        {/* 
          ========================================================================
          4. LEGAL & COPYRIGHT BAR
          ========================================================================
        */}
        <div className="pt-8 border-t border-emerald-950/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Antix Hotel & Resort Global Hospitality Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[11px]">
            <span className="hover:text-emerald-300 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-emerald-300 cursor-pointer transition-colors">Terms of Sanctuary Stay</span>
            <span className="hover:text-emerald-300 cursor-pointer transition-colors">Pay at Desk Policy</span>
            <span className="hover:text-emerald-300 cursor-pointer transition-colors">Accessibility</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
