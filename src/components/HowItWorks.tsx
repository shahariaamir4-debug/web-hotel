import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  CalendarCheck2, 
  KeyRound, 
  Banknote, 
  Sparkles, 
  ShieldCheck,
  Stamp,
  Award,
  ArrowRight,
  Compass,
  FileCheck2,
  Lock
} from 'lucide-react';
import { WaveDivider } from './WaveDivider';

const HANDCRAFTED_STEPS = [
  {
    stepNumber: '01',
    sealText: 'STEP ONE',
    title: 'Explore & Select Sanctuary',
    subtitle: 'Curated Architectural Sanctuaries',
    description: 'Browse verified beachfront villas, heated infinity pools, and panoramic penthouses tailored to your desired travel dates.',
    stampLabel: 'VERIFIED VILLA',
    accentColor: '#d97706', // Warm Amber Gold
    icon: Compass,
    actionHint: 'View 360° virtual preview'
  },
  {
    stepNumber: '02',
    sealText: 'STEP TWO',
    title: 'Instant Reserve in 30s',
    subtitle: 'Zero Prepayment • No Credit Card Needed',
    description: 'Enter your guest name and dates. We instantly generate an official printable booking voucher with your reservation code.',
    stampLabel: 'ZERO ADVANCE FEE',
    accentColor: '#b45309', // Warm Bronze Amber
    icon: FileCheck2,
    actionHint: 'Instant desk confirmation pass'
  },
  {
    stepNumber: '03',
    sealText: 'STEP THREE',
    title: 'Arrive & Settle at Desk',
    subtitle: '100% Cash or Card upon Check-in',
    description: 'Arrive at the Antix Hotel reception desk, enjoy our signature welcome drink, inspect your suite, then settle with cash or card.',
    stampLabel: 'PAY ON ARRIVAL',
    accentColor: '#92400e', // Deep Warm Amber
    icon: KeyRound,
    actionHint: 'Key handover in 2 minutes'
  }
];

export const HowItWorks: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const scrollToRooms = () => {
    const el = document.getElementById('featured-rooms');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#072d20] text-white pt-10 pb-0 overflow-hidden relative">
      
      {/* Subtle Atmospheric Forest Lighting */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-emerald-400/10 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-teal-400/10 blur-[160px] pointer-events-none" />

      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        
        {/* Section Title & Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-20"
        >
          {/* Handcrafted Artisanal Seal Badge */}
          <div className="inline-flex items-center gap-2 text-[11px] font-black tracking-widest uppercase text-amber-950 bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-200 px-4 py-1.5 rounded-full shadow-lg shadow-black/30 border border-amber-300/80 mb-4">
            <Stamp className="w-3.5 h-3.5 text-amber-900" />
            <span>BESPOKE RESERVATION JOURNEY</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-800" />
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight font-display drop-shadow-md">
            Book Your Luxury Stay in 3 Easy Steps
          </h2>
          
          <p className="mt-4 text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-2xl mx-auto">
            Experience our artisanal, friction-free booking method. No online card details required — pure peace of mind with guaranteed check-in settlement.
          </p>
        </motion.div>

        {/* 
          HANDCRAFTED 3-STEP FLOW:
          - Background of section is Forest Green (#072d20)
          - INSIDE: Handcrafted luxury ivory cards, amber/gold seals, artisanal paper textures, zero forest green inside!
        */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          
          {/* Animated Golden Connector Line along cards on Desktop */}
          <div className="hidden md:block absolute top-1/2 left-[12%] right-[12%] h-[2px] -translate-y-8 pointer-events-none z-0">
            <div className="w-full h-full bg-gradient-to-r from-amber-300/30 via-yellow-200/60 to-amber-300/30" />
            <motion.div 
              animate={{ x: ['0%', '100%', '0%'] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
              className="w-16 h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent -translate-y-[1px] blur-[1px]"
            />
          </div>

          {HANDCRAFTED_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isHovered = hoveredIdx === idx;

            return (
              <motion.div
                key={step.stepNumber}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.65, delay: idx * 0.18, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                whileHover={{ y: -12, transition: { duration: 0.28, ease: 'easeOut' } }}
                className="relative z-10 flex flex-col justify-between bg-[#fffefb] text-slate-900 p-7 sm:p-8 rounded-[32px] border-2 border-amber-200/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] transition-all duration-300 group"
              >
                {/* Decorative Handcrafted Paper Stamp Stitch Header */}
                <div className="flex items-center justify-between pb-5 border-b border-amber-100">
                  
                  {/* Wax Seal / Artisanal Stamped Number */}
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 font-black text-xl shadow-md shadow-amber-500/30 border border-yellow-200 group-hover:rotate-6 transition-transform">
                      <span>{step.stepNumber}</span>
                      <div className="absolute -inset-1 rounded-2xl border border-amber-400/40 pointer-events-none" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 block">
                        {step.sealText}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        Sanctuary Protocol
                      </span>
                    </div>
                  </div>

                  {/* Artisanal Stamped Verification Badge */}
                  <div className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200/80 text-[10px] font-black uppercase tracking-wider text-amber-900">
                    {step.stampLabel}
                  </div>
                </div>

                {/* Handcrafted Center Graphic & Icon */}
                <div className="py-7 flex flex-col items-center text-center">
                  <motion.div
                    animate={isHovered ? { scale: [1, 1.1, 1], rotate: [0, 4, -4, 0] } : {}}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 rounded-full bg-amber-100/80 border-2 border-amber-300 flex items-center justify-center text-amber-800 shadow-inner mb-5 group-hover:bg-amber-200/90 transition-colors"
                  >
                    <Icon className="w-8 h-8 stroke-[2.2]" />
                  </motion.div>

                  <span className="text-xs font-extrabold uppercase tracking-wide text-amber-700 mb-1">
                    {step.subtitle}
                  </span>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-3">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* 
          HANDCRAFTED OFFICIAL CERTIFICATE GUARANTEE (IVORY & WARM GOLD FOIL):
          - No forest green used inside!
        */}
        <motion.div 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-16 sm:mt-20 max-w-4xl mx-auto bg-[#fffdf9] text-slate-900 rounded-[32px] p-6 sm:p-8 border-2 border-amber-300/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] relative overflow-hidden"
        >
          {/* Subtle Golden Certificate Corner Flourishes */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-200/40 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-yellow-200/40 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
            
            {/* Left: Certificate Icon & Official Text */}
            <div className="flex items-start sm:items-center gap-5 text-left">
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/25 border-2 border-yellow-200">
                <ShieldCheck className="w-9 h-9 stroke-[2.2]" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 text-amber-300 flex items-center justify-center text-[10px] font-black border border-amber-300">
                  ✓
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                    ANTIX OFFICIAL PLEDGE
                  </span>
                  <span className="text-xs text-slate-400 font-bold">• Zero Risk Guarantee</span>
                </div>
                
                <h4 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  100% Cash or Card on Arrival Guarantee
                </h4>
                
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-relaxed max-w-xl">
                  Your reservation is held directly by Antix Hotel. No hidden pre-charges or pre-authorization. Settle your balance comfortably upon in-person check-in.
                </p>
              </div>
            </div>

            {/* Right: Action Button to Reserve */}
            <div className="shrink-0 w-full md:w-auto">
              <button
                id="btn-how-it-works-browse"
                onClick={scrollToRooms}
                className="w-full md:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer border border-yellow-200"
              >
                <span>Browse Luxury Rooms</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </motion.div>

      </section>

      {/* Decorative Wave Divider ("Dheo") transitioning from Forest Green to White */}
      <WaveDivider
        variant="forest-to-white"
        height={95}
        className="text-white"
      />
    </div>
  );
};
