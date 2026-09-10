import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bed, 
  Bath, 
  Maximize2, 
  Users, 
  Heart, 
  ArrowRight, 
  Sparkles, 
  Banknote,
  Eye,
  RotateCcw,
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import { Room } from '../types';
import { WaveDivider } from './WaveDivider';

export const RoomGrid: React.FC = () => {
  const { 
    rooms,
    favorites, 
    toggleFavorite, 
    setSelectedRoom, 
    setBookingRoom
  } = useHotel();

  // 1. Dynamic price boundary & tier calculation derived automatically from active room inventory
  const { minBound, maxBound, stepSize, priceTiers, lowestActualPrice, highestActualPrice } = useMemo(() => {
    if (!rooms || rooms.length === 0) {
      return {
        minBound: 100,
        maxBound: 1000,
        stepSize: 10,
        priceTiers: [],
        lowestActualPrice: 100,
        highestActualPrice: 1000,
      };
    }

    const prices = rooms.map(r => r.pricePerNight);
    const rawMin = Math.min(...prices);
    const rawMax = Math.max(...prices);
    const spread = Math.max(1, rawMax - rawMin);

    // Auto-scale rounding unit according to the price scale magnitude
    const unit = spread > 1500 ? 100 : spread > 400 ? 50 : spread > 100 ? 25 : 10;
    
    // Auto-compute boundaries rounded to nearest clean step
    const minBound = Math.max(0, Math.floor(rawMin / unit) * unit);
    const maxBound = Math.ceil(rawMax / unit) * unit;
    const stepSize = Math.max(5, Math.round(unit / 5));

    // Dynamic statistical tiers generated automatically from actual price distribution
    const tiers: Array<{ id: string; label: string; min: number; max: number; count: number }> = [
      {
        id: 'all',
        label: 'All Rates',
        min: minBound,
        max: maxBound,
        count: rooms.length,
      }
    ];

    if (spread >= 60) {
      const tier1Threshold = Math.round((rawMin + spread * 0.35) / unit) * unit;
      const tier2Threshold = Math.round((rawMin + spread * 0.70) / unit) * unit;

      const budgetRooms = rooms.filter(r => r.pricePerNight < tier1Threshold);
      const midRooms = rooms.filter(r => r.pricePerNight >= tier1Threshold && r.pricePerNight <= tier2Threshold);
      const luxuryRooms = rooms.filter(r => r.pricePerNight > tier2Threshold);

      if (budgetRooms.length > 0) {
        tiers.push({
          id: 'budget',
          label: `Economy (< $${tier1Threshold})`,
          min: minBound,
          max: tier1Threshold - 1,
          count: budgetRooms.length,
        });
      }

      if (midRooms.length > 0) {
        tiers.push({
          id: 'mid',
          label: `Mid-Tier ($${tier1Threshold} – $${tier2Threshold})`,
          min: tier1Threshold,
          max: tier2Threshold,
          count: midRooms.length,
        });
      }

      if (luxuryRooms.length > 0) {
        tiers.push({
          id: 'luxury',
          label: `Luxury ($${tier2Threshold}+)`,
          min: tier2Threshold,
          max: maxBound,
          count: luxuryRooms.length,
        });
      }
    }

    return {
      minBound,
      maxBound,
      stepSize,
      priceTiers: tiers,
      lowestActualPrice: rawMin,
      highestActualPrice: rawMax,
    };
  }, [rooms]);

  // Selected range state (null indicates default auto-calibrated boundaries)
  const [customMin, setCustomMin] = useState<number | null>(null);
  const [customMax, setCustomMax] = useState<number | null>(null);
  const [activeTierId, setActiveTierId] = useState<string>('all');
  const [sortByPrice, setSortByPrice] = useState<'default' | 'asc' | 'desc'>('default');

  const effectiveMin = customMin !== null ? Math.max(minBound, customMin) : minBound;
  const effectiveMax = customMax !== null ? Math.min(maxBound, customMax) : maxBound;

  const isFilterActive = (customMin !== null && customMin > minBound) || 
                         (customMax !== null && customMax < maxBound) || 
                         activeTierId !== 'all';

  const handleSelectTier = (tier: { id: string; min: number; max: number }) => {
    setActiveTierId(tier.id);
    if (tier.id === 'all') {
      setCustomMin(null);
      setCustomMax(null);
    } else {
      setCustomMin(tier.min);
      setCustomMax(tier.max);
    }
  };

  const handleSliderChange = (newMax: number) => {
    setActiveTierId('custom');
    setCustomMax(newMax);
  };

  const handleMinInputChange = (val: string) => {
    setActiveTierId('custom');
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      setCustomMin(minBound);
    } else {
      setCustomMin(Math.max(minBound, Math.min(num, effectiveMax)));
    }
  };

  const handleMaxInputChange = (val: string) => {
    setActiveTierId('custom');
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      setCustomMax(maxBound);
    } else {
      setCustomMax(Math.min(maxBound, Math.max(num, effectiveMin)));
    }
  };

  const handleResetFilter = () => {
    setActiveTierId('all');
    setCustomMin(null);
    setCustomMax(null);
    setSortByPrice('default');
  };

  // Pure dynamic price filtering & sorting
  const finalProcessedRooms = useMemo(() => {
    let list = rooms.filter(room => {
      return room.pricePerNight >= effectiveMin && room.pricePerNight <= effectiveMax;
    });

    if (sortByPrice === 'asc') {
      list = [...list].sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (sortByPrice === 'desc') {
      list = [...list].sort((a, b) => b.pricePerNight - a.pricePerNight);
    }

    return list;
  }, [rooms, effectiveMin, effectiveMax, sortByPrice]);

  return (
    <div className="bg-white text-slate-900 pt-6 pb-0 overflow-hidden">
      <section id="featured-rooms" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Section Header with Reveal Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>ANTIX CURATED COLLECTION</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Featured Rooms & Suites
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Handcrafted for architectural tranquility and 100% pay-on-arrival peace of mind.
            </p>
          </div>

          <button
            onClick={handleResetFilter}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-900 transition-colors cursor-pointer w-fit group"
          >
            <span>View All Sanctuaries</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </motion.div>

        {/* 
          ========================================================================
          PRICE FILTER ONLY (CLEAN & MINIMALIST)
          ========================================================================
        */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Filter by Nightly Rate</span>
                  {isFilterActive && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Active Filter
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-500">
                  Resort inventory rates auto-calibrated from <strong className="text-slate-700 font-bold">${lowestActualPrice}</strong> to <strong className="text-slate-700 font-bold">${highestActualPrice}</strong> / night
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
              {/* Sort selector */}
              <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-bold">
                <ArrowUpDown className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <select
                  value={sortByPrice}
                  onChange={(e) => setSortByPrice(e.target.value as 'default' | 'asc' | 'desc')}
                  className="bg-transparent text-xs font-bold text-slate-700 focus:outline-hidden cursor-pointer"
                  title="Sort suites by price"
                >
                  <option value="default">Sort: Recommended</option>
                  <option value="asc">Price: Low to High</option>
                  <option value="desc">Price: High to Low</option>
                </select>
              </div>

              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
                Showing <strong className="text-emerald-700 font-extrabold">{finalProcessedRooms.length}</strong> of {rooms.length} Suites
              </span>

              {(isFilterActive || sortByPrice !== 'default') && (
                <button
                  onClick={handleResetFilter}
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl cursor-pointer"
                  title="Reset price filter"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Dynamic Auto-Calibrated Statistical Presets */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {priceTiers.map((tier) => {
              const isSelected = activeTierId === tier.id;
              return (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => handleSelectTier(tier)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20 scale-102 font-extrabold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <span>{tier.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {tier.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Slider and Custom Range Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
            {/* Slider Column */}
            <div className="lg:col-span-7">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
                  Max Nightly Budget:
                </span>
                <span className="font-extrabold text-emerald-700 text-sm">
                  ${effectiveMax} / night
                </span>
              </div>
              <input
                type="range"
                min={minBound}
                max={maxBound}
                step={stepSize}
                value={effectiveMax}
                onChange={(e) => handleSliderChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-1">
                <span>${minBound} min</span>
                <span>${Math.round((minBound + maxBound) / 2)}</span>
                <span>${maxBound} max</span>
              </div>
            </div>

            {/* Custom Min / Max Direct Inputs */}
            <div className="lg:col-span-5 flex flex-wrap sm:flex-nowrap items-center justify-start lg:justify-end gap-2 text-xs">
              <span className="font-bold text-slate-500 text-[11px]">Range:</span>
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-2xs">
                <span className="text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  min={minBound}
                  max={effectiveMax}
                  step={stepSize}
                  value={customMin ?? ''}
                  placeholder={minBound.toString()}
                  onChange={(e) => handleMinInputChange(e.target.value)}
                  className="w-14 text-xs font-bold text-slate-800 focus:outline-hidden"
                  title="Min budget"
                />
              </div>
              <span className="text-slate-400 font-bold">–</span>
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-2xs">
                <span className="text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  min={effectiveMin}
                  max={maxBound}
                  step={stepSize}
                  value={customMax ?? ''}
                  placeholder={maxBound.toString()}
                  onChange={(e) => handleMaxInputChange(e.target.value)}
                  className="w-14 text-xs font-bold text-slate-800 focus:outline-hidden"
                  title="Max budget"
                />
              </div>
              <span className="text-[11px] text-slate-500 font-medium">/ night</span>
            </div>
          </div>
        </motion.div>

        {/* Rooms Grid */}
        {finalProcessedRooms.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-300 p-8">
            <p className="text-base text-slate-700 font-semibold">
              No suites found within the selected price range.
            </p>
            <button
              onClick={handleResetFilter}
              className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-600 transition-colors cursor-pointer shadow-md inline-flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Price Filter</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {finalProcessedRooms.map((room, idx) => {
                const isFav = favorites.includes(room.id);
                return (
                  <motion.div
                    key={room.id}
                    layout
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.55, delay: (idx % 3) * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -8, transition: { duration: 0.25 } }}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-emerald-500 shadow-md hover:shadow-2xl transition-all flex flex-col group"
                  >
                    
                    {/* Card Image Wrapper */}
                    <div className="relative aspect-[16/11] overflow-hidden bg-slate-100">
                      <img
                        src={room.image}
                        alt={room.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />

                      {/* Tag Badge */}
                      {room.badge && (
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wide shadow-md ${room.badgeColor || 'bg-emerald-700 text-white'}`}>
                            {room.badge}
                          </span>
                        </div>
                      )}

                      {/* Favorite Button */}
                      <button
                        id={`btn-fav-${room.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(room.id);
                        }}
                        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 flex items-center justify-center text-slate-600 hover:text-rose-500 shadow-md transition-transform active:scale-90 cursor-pointer"
                        title={isFav ? 'Remove from favorites' : 'Save to favorites'}
                      >
                        <Heart
                          className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`}
                        />
                      </button>

                      {/* Pay on Arrival Banner Over Image */}
                      <div className="absolute bottom-3 left-3 bg-emerald-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] font-bold text-emerald-300 flex items-center gap-1.5 border border-emerald-500/40 shadow-lg">
                        <Banknote className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Pay at Check-in (Cash/Card)</span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      
                      <div>
                        {/* Location */}
                        <div className="mb-1.5">
                          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider truncate">
                            {room.location}
                          </span>
                        </div>

                        {/* Room Title */}
                        <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                          {room.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                          {room.subtitle}
                        </p>

                        {/* Specs Row */}
                        <div className="grid grid-cols-4 gap-1 py-3.5 my-4 border-y border-slate-100 text-slate-700">
                          <div className="flex items-center gap-1.5 text-xs font-medium">
                            <Bed className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{room.beds} Beds</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-medium">
                            <Bath className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{room.baths} Baths</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-medium">
                            <Maximize2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{room.sqft} sqft</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-medium">
                            <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{room.maxGuests} Max</span>
                          </div>
                        </div>
                      </div>

                      {/* Price & Action Buttons */}
                      <div className="pt-2">
                        <div className="flex items-baseline justify-between mb-4">
                          <div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-2xl font-black text-slate-900">
                                ${room.pricePerNight}
                              </span>
                              <span className="text-xs font-medium text-slate-500">/ night</span>
                            </div>
                            {room.originalPricePerNight && (
                              <span className="text-xs text-slate-400 line-through">
                                ${room.originalPricePerNight} / night
                              </span>
                            )}
                          </div>

                          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                            Zero Advance
                          </span>
                        </div>

                        {/* Action buttons */}
                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            id={`btn-details-${room.id}`}
                            onClick={() => setSelectedRoom(room)}
                            className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                            <span>Details</span>
                          </button>

                          <button
                            id={`btn-book-${room.id}`}
                            onClick={() => setBookingRoom(room)}
                            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white shadow-lg shadow-emerald-700/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            <span>Reserve Room</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

      </section>

      {/* Decorative Wave Divider ("Dheo") leading into How It Works (Forest Green) */}
      <WaveDivider
        variant="white-to-forest"
        height={95}
        className="text-[#072d20]"
      />
    </div>
  );
};
