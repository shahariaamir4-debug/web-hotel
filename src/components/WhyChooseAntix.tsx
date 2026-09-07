import React from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight, Sparkles, ShieldCheck, Star } from 'lucide-react';
import { WaveDivider } from './WaveDivider';

const REASONS = [
  'Curated collection of ocean villas, penthouses and private-pool suites',
  'Zero prepayment required — settle easily at front desk with cash or card',
  'Complimentary chef-curated gourmet breakfast & private espresso bar',
  'Starlink ultra-high-speed connectivity across the entire resort property',
  'Flexible free cancellation policy up to 24 hours prior to check-in',
  'Recognized with 4.98/5 guest satisfaction across 25,000+ stays'
];

export const WhyChooseAntix: React.FC = () => {
  const scrollToRooms = () => {
    const el = document.getElementById('featured-rooms');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#072d20] text-white pt-6 pb-0 overflow-hidden relative">
      
      {/* Ambient Forest Glow */}
      <div className="absolute top-1/3 left-10 w-96 h-96 rounded-full bg-emerald-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-teal-500/10 blur-[140px] pointer-events-none" />

      <section id="why-antix" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Content with Reveal Animation */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-900/70 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>FOREST & OCEAN SANCTUARY</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                More Than Just <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-200 to-amber-200">
                  A Hotel Stay
                </span>
              </h2>
              <p className="mt-4 text-emerald-100/80 text-base sm:text-lg leading-relaxed">
                We believe hospitality should feel effortless and serene. At Antix Hotel, we deliver tailor-made luxury experiences, soothing coastal architecture, and authentic warmth designed around you.
              </p>
            </div>

            {/* Bullet Checklist with Staggered Animations */}
            <div className="space-y-3.5 pt-2">
              {REASONS.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/60 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-medium text-emerald-50/90 leading-snug">
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <button
                id="btn-why-explore"
                onClick={scrollToRooms}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-sm shadow-xl shadow-emerald-950/60 transition-all cursor-pointer hover:gap-3"
              >
                <span>Explore All Suites</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Right Aesthetic Photo Banner with Reveal Animation */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/30 aspect-[4/3] max-h-[500px]">
              <img
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"
                alt="Antix Hotel Sunlit Living Suite"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-out"
              />
              {/* Forest Green Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#072d20]/95 via-transparent to-transparent" />

              {/* Floating Forest Glass Pill */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#041a13]/85 backdrop-blur-md p-4 rounded-2xl border border-emerald-500/40 shadow-2xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">
                    Antix Signature Sanctuary Lounge
                  </div>
                  <div className="text-[11px] text-emerald-200/80">
                    Handcrafted timber, ocean breezes & panoramic daylight
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-300 font-bold text-xs bg-emerald-950/80 border border-emerald-400/40 px-2.5 py-1 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>4.98</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
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
