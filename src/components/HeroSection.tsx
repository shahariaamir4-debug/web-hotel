import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight,
  Star,
  Banknote,
  ShieldCheck
} from 'lucide-react';
import { WaveDivider } from './WaveDivider';

export const HeroSection: React.FC = () => {
  const scrollToRooms = () => {
    const el = document.getElementById('featured-rooms');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-[85vh] sm:min-h-[90vh] w-full flex flex-col justify-between overflow-hidden"
    >
      {/* 
        ========================================================================
        1. FULL-WIDTH STATIC BACKGROUND IMAGE (NO BLINKING / NO ANIMATE-PULSE)
        ========================================================================
      */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2600&q=85"
          alt="Paradise Luxury Sanctuary Resort by the Ocean"
          className="w-full h-full object-cover object-center transform scale-100"
        />

        {/* Sophisticated cinematic lighting and gradient overlays for pristine readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/60" />
        <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-emerald-500/10 blur-[140px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-teal-500/15 blur-[150px]" />
      </div>

      {/* 
        ========================================================================
        2. CLEAN HERO CONTENT OVERLAID DIRECTLY ON BACKGROUND
        ========================================================================
      */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32 sm:pt-40 pb-16 flex-1 flex flex-col justify-center">
        
        <div className="max-w-3xl">
          
          {/* Subtle Top Architectural Tag */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-xs font-semibold mb-6 shadow-xl"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-emerald-300 font-bold uppercase tracking-wider text-[11px]">ANTIX RESORT & VILLAS</span>
            <span className="text-white/40">•</span>
            <div className="flex items-center gap-1 text-amber-300 font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.98 Ultra-Luxury</span>
            </div>
          </motion.div>

          {/* 
            USER MANDATE EXACT TEXT DIRECTLY ON BACKGROUND:
            "(Discover Spaces That Feel Like Paradise)"
          */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.05] drop-shadow-2xl font-display"
          >
            Discover Spaces <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-white">
              That Feel Like Paradise
            </span>
          </motion.h1>

          {/* Key Trust Highlights & Instant Exploration Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <button
              id="btn-hero-explore-rooms"
              onClick={scrollToRooms}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-sm sm:text-base shadow-2xl shadow-emerald-950/60 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-3 cursor-pointer"
            >
              <span>Explore Available Stays</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 text-emerald-300 text-xs sm:text-sm font-bold shadow-lg">
              <Banknote className="w-4 h-4 text-emerald-400" />
              <span>Zero Prepayment • 100% Pay at Hotel</span>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-black/50 backdrop-blur-md border border-white/15 text-slate-200 text-xs sm:text-sm font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Free 24h Cancellation</span>
            </div>
          </motion.div>

        </div>

      </div>

      {/* 
        ========================================================================
        3. LUMINOUS WAVE DIVIDER TRANSITIONING HERO TO WHITE SECTION
        ========================================================================
      */}
      <div className="relative z-10 w-full mt-auto">
        <WaveDivider
          variant="dark-to-white"
          height={95}
          className="text-white"
        />
      </div>

    </section>
  );
};
