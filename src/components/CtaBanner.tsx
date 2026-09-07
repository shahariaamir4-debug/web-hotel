import React from 'react';
import { motion } from 'motion/react';
import { Building2, ArrowRight, Sparkles, Banknote } from 'lucide-react';
import { WaveDivider } from './WaveDivider';

export const CtaBanner: React.FC = () => {
  const scrollToRooms = () => {
    const el = document.getElementById('featured-rooms');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#072d20] pt-6 pb-0 overflow-hidden">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#041c14] via-[#0a3827] to-[#041c14] text-white p-8 sm:p-12 shadow-2xl border border-emerald-500/40"
        >
          {/* Subtle decorative background glow */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-950/90 border border-emerald-400/40 flex items-center justify-center shrink-0 text-amber-300 shadow-inner">
                <Building2 className="w-8 h-8 text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-300 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Zero Upfront Payment • 100% Cash / Card on Arrival</span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                  Ready to Experience Paradise?
                </h3>
                <p className="text-emerald-100/80 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
                  Lock in your ocean villa or luxury suite today. Settle your payment peacefully at reception upon check-in.
                </p>
              </div>
            </div>

            <div className="shrink-0 w-full sm:w-auto">
              <button
                id="btn-cta-reserve"
                onClick={scrollToRooms}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-sm shadow-xl shadow-emerald-950/80 transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
              >
                <span>Reserve Your Stay Now</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>

          </div>
        </motion.div>
      </section>

      {/* Decorative Wave Divider ("Dheo") leading into the Dark Footer */}
      <WaveDivider
        variant="forest-to-dark"
        height={90}
        className="text-[#03150f]"
      />
    </div>
  );
};
