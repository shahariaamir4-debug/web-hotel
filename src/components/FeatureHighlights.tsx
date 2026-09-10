import React from 'react';
import { motion } from 'motion/react';
import { 
  Building, 
  Banknote, 
  Headphones, 
  BadgeCheck, 
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { WaveDivider } from './WaveDivider';

const FEATURES = [
  {
    icon: Building,
    title: 'Verified Luxury Suites',
    description: 'Every suite and villa is individually inspected for exceptional acoustics, private heated pools, and architectural serenity.',
    badge: '100% Inspected',
    color: 'emerald'
  },
  {
    icon: Banknote,
    title: 'Pay at Hotel (No Advance)',
    description: 'Zero upfront card charges. Book instantly with peace of mind and pay with cash or card upon arrival at the front desk.',
    badge: '★ Zero Advance',
    highlight: true,
    color: 'emerald'
  },
  {
    icon: Headphones,
    title: '24/7 Dedicated Concierge',
    description: 'Private butler services, midnight room dining, private yacht transfers, and luggage care available around the clock.',
    badge: '24/7 Service',
    color: 'emerald'
  },
  {
    icon: BadgeCheck,
    title: 'Best Rate & Free Cancel',
    description: 'Direct sanctuary booking with complimentary chef-curated breakfast and penalty-free cancellation up to 24h before arrival.',
    badge: 'Direct Benefit',
    color: 'emerald'
  }
];

export const FeatureHighlights: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Top Figma Vector Art Wave Divider transitioning smoothly from dark hero into clean white */}
      <div className="bg-[#03150f] -mt-0.5">
        <WaveDivider
          variant="dark-to-white"
          height={120}
          className="text-white"
        />
      </div>

      <div className="bg-white text-slate-900 pt-6 pb-0">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Section Header with Reveal Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>The Antix Standard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Curated Luxury, Seamless Booking
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Engineered around unmatched peace of mind with 100% pay on arrival flexibility.
          </p>
        </motion.div>

        {/* 4 Feature Cards with Staggered Reveal Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className={`relative rounded-3xl p-7 transition-all flex flex-col justify-between ${
                  feature.highlight
                    ? 'bg-gradient-to-b from-emerald-50 to-white border-2 border-emerald-500 shadow-xl shadow-emerald-500/10'
                    : 'bg-slate-50/80 border border-slate-200/90 hover:border-emerald-500/50 hover:bg-white shadow-md hover:shadow-xl'
                }`}
              >
                {/* Badge Tag */}
                <div className={`absolute -top-3 right-6 text-[11px] font-extrabold px-3 py-1 rounded-full shadow-sm ${
                  feature.highlight 
                    ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {feature.badge}
                </div>

                <div>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-md ${
                    feature.highlight
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-slate-200 text-emerald-600'
                  }`}>
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {feature.title}
                  </h3>

                  <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified Standard</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </section>

      {/* Decorative Wave Divider ("Dheo") transitioning from White to Forest Green */}
      <WaveDivider
        variant="white-to-forest"
        height={120}
        className="text-[#072d20]"
      />
      </div>
    </div>
  );
};
