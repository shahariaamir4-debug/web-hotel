import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bed, 
  Bath, 
  Maximize2, 
  Users, 
  Heart, 
  ArrowRight, 
  Star, 
  Sparkles, 
  Banknote,
  Eye,
  CheckCircle2,
  Search,
  MapPin,
  Hotel,
  RotateCcw
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import { Room, RoomCategory } from '../types';
import { WaveDivider } from './WaveDivider';

const CATEGORIES: { id: RoomCategory; label: string }[] = [
  { id: 'all', label: 'All Suites & Rooms' },
  { id: 'villa', label: 'Ocean Villas' },
  { id: 'deluxe', label: 'Deluxe Suites' },
  { id: 'presidential', label: 'Presidential' },
  { id: 'penthouse', label: 'Penthouses' },
];

export const RoomGrid: React.FC = () => {
  const { 
    filteredRooms, 
    favorites, 
    toggleFavorite, 
    setSelectedRoom, 
    setBookingRoom,
    searchFilters,
    setSearchFilters
  } = useHotel();

  const [activeCategory, setActiveCategory] = useState<RoomCategory>('all');

  const handleCategoryChange = (cat: RoomCategory) => {
    setActiveCategory(cat);
    setSearchFilters(prev => ({
      ...prev,
      roomType: cat === 'all' ? 'all' : cat
    }));
  };

  const handleResetFilters = () => {
    setActiveCategory('all');
    setSearchFilters({
      location: 'all',
      roomType: 'all',
      checkIn: '',
      checkOut: '',
      priceRange: 'all',
      guests: 2
    });
  };

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
            onClick={() => handleCategoryChange('all')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-900 transition-colors cursor-pointer w-fit group"
          >
            <span>View All Sanctuaries</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </motion.div>

        {/* 
          ========================================================================
          HOTEL SEARCH & FILTER CONSOLE (TRANSFERRED TO BOOKING / ROOMS SECTION)
          ========================================================================
        */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 bg-gradient-to-r from-emerald-950 via-[#072d20] to-emerald-950 p-4 sm:p-6 rounded-3xl text-white shadow-xl border border-emerald-800/60"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-emerald-800/50">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
              <Search className="w-4 h-4 text-emerald-400" />
              <span>Filter Available Rooms & Rates</span>
            </div>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer w-fit"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Location / Wing */}
            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-[#041c14] border border-emerald-800/70 hover:border-emerald-500 transition-colors">
              <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-emerald-300/80">
                  Resort Wing
                </label>
                <select
                  id="filter-location"
                  value={searchFilters.location}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full bg-transparent text-xs font-bold text-white focus:outline-hidden cursor-pointer"
                >
                  <option value="all" className="bg-slate-900 text-white">All Resort Wings</option>
                  <option value="ocean" className="bg-slate-900 text-white">Oceanfront Wing</option>
                  <option value="skyline" className="bg-slate-900 text-white">Skyline Tower</option>
                  <option value="lagoon" className="bg-slate-900 text-white">Lagoon Cabana Area</option>
                  <option value="presidential" className="bg-slate-900 text-white">Presidential Garden</option>
                </select>
              </div>
            </div>

            {/* Room Category */}
            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-[#041c14] border border-emerald-800/70 hover:border-emerald-500 transition-colors">
              <Hotel className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-emerald-300/80">
                  Category
                </label>
                <select
                  id="filter-room-type"
                  value={searchFilters.roomType}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setSearchFilters(prev => ({ ...prev, roomType: val }));
                    setActiveCategory(val === 'all' ? 'all' : val);
                  }}
                  className="w-full bg-transparent text-xs font-bold text-white focus:outline-hidden cursor-pointer"
                >
                  <option value="all" className="bg-slate-900 text-white">All Suites & Villas</option>
                  <option value="villa" className="bg-slate-900 text-white">Ocean Villa</option>
                  <option value="deluxe" className="bg-slate-900 text-white">Deluxe Suite</option>
                  <option value="presidential" className="bg-slate-900 text-white">Presidential Suite</option>
                  <option value="penthouse" className="bg-slate-900 text-white">Skyline Penthouse</option>
                </select>
              </div>
            </div>

            {/* Nightly Rate */}
            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-[#041c14] border border-emerald-800/70 hover:border-emerald-500 transition-colors">
              <Banknote className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-emerald-300/80">
                  Nightly Rate
                </label>
                <select
                  id="filter-price-range"
                  value={searchFilters.priceRange}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                  className="w-full bg-transparent text-xs font-bold text-white focus:outline-hidden cursor-pointer"
                >
                  <option value="all" className="bg-slate-900 text-white">Any Price Range</option>
                  <option value="under300" className="bg-slate-900 text-white">Under $300 / night</option>
                  <option value="300to500" className="bg-slate-900 text-white">$300 – $500 / night</option>
                  <option value="500plus" className="bg-slate-900 text-white">$500+ / Luxury Exclusive</option>
                </select>
              </div>
            </div>

            {/* Guests Count */}
            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-[#041c14] border border-emerald-800/70 hover:border-emerald-500 transition-colors">
              <Users className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-emerald-300/80">
                  Guests
                </label>
                <select
                  id="filter-guests"
                  value={searchFilters.guests}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, guests: Number(e.target.value) }))}
                  className="w-full bg-transparent text-xs font-bold text-white focus:outline-hidden cursor-pointer"
                >
                  <option value={1} className="bg-slate-900 text-white">1 Guest</option>
                  <option value={2} className="bg-slate-900 text-white">2 Guests (Standard)</option>
                  <option value={3} className="bg-slate-900 text-white">3 Guests</option>
                  <option value={4} className="bg-slate-900 text-white">4+ Guests (Suite / Villa)</option>
                </select>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Category Filter Tabs with Reveal Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar"
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-700/20 border border-emerald-600 scale-105'
                    : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </motion.div>

        {/* Rooms Grid */}
        {filteredRooms.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-300 p-8">
            <p className="text-base text-slate-700 font-semibold">
              No suites found matching your search filters.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchFilters({
                  location: 'all',
                  roomType: 'all',
                  checkIn: '',
                  checkOut: '',
                  priceRange: 'all',
                  guests: 2
                });
              }}
              className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-600 transition-colors cursor-pointer shadow-md"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredRooms.map((room, idx) => {
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
                        {/* Rating & Location */}
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider truncate">
                            {room.location}
                          </div>
                          <div className="flex items-center gap-1 text-xs font-bold text-slate-800 shrink-0">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{room.rating}</span>
                            <span className="text-slate-500 font-normal">({room.reviewCount})</span>
                          </div>
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
