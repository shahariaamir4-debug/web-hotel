import React from 'react';
import { motion } from 'motion/react';
import { Star, Sparkles, Quote } from 'lucide-react';
import { REVIEWS } from '../data/rooms';
import { WaveDivider } from './WaveDivider';

export const ReviewsSection: React.FC = () => {
  return (
    <div className="bg-white text-slate-900 pt-8 pb-0 overflow-hidden">
      <section id="reviews" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header with Reveal Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AUTHENTIC GUEST VOICES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            What Our Guests Say
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Over 25,000 travelers praise our architectural serenity and effortless pay-at-check-in hospitality.
          </p>
        </motion.div>

        {/* Testimonials 3 Column Grid with Staggered Reveal Animation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="bg-slate-50/80 rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-400/80 hover:bg-white transition-all flex flex-col justify-between"
            >
              <div>
                {/* Guest Profile Row */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {review.name}
                    </h4>
                    <div className="flex items-center gap-0.5 mt-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <Quote className="w-6 h-6 text-emerald-300/60 shrink-0" />
                </div>

                {/* Review Comment */}
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  "{review.comment}"
                </p>
              </div>

              {/* Stay Verification Tag */}
              <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="text-emerald-700 font-semibold">{review.stayedRoom || 'Signature Suite'}</span>
                <span>Verified Stay</span>
              </div>
            </motion.div>
          ))}
        </div>

      </section>

      {/* Decorative Wave Divider ("Dheo") leading into CTA Banner (Forest Green) */}
      <WaveDivider
        variant="white-to-forest"
        height={120}
        className="text-[#072d20]"
      />
    </div>
  );
};
