import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Bed, 
  Bath, 
  Maximize2, 
  Users, 
  Check, 
  Banknote, 
  Sparkles, 
  Heart,
  ShieldCheck
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';

export const RoomDetailsModal: React.FC = () => {
  const { 
    selectedRoom, 
    setSelectedRoom, 
    setBookingRoom, 
    favorites, 
    toggleFavorite 
  } = useHotel();

  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!selectedRoom) return null;

  const isFav = favorites.includes(selectedRoom.id);
  const images = selectedRoom.gallery && selectedRoom.gallery.length > 0 
    ? selectedRoom.gallery 
    : [selectedRoom.image];

  const handleBookNow = () => {
    const roomToBook = selectedRoom;
    setSelectedRoom(null);
    setBookingRoom(roomToBook);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-3xl bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[90vh] flex flex-col"
      >
        {/* Top Sticky Header */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded uppercase tracking-wider">
                {selectedRoom.categoryLabel}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium truncate">
                {selectedRoom.location}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {selectedRoom.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(selectedRoom.id)}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-500 text-slate-500 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            <button
              id="btn-close-room-details"
              onClick={() => setSelectedRoom(null)}
              className="w-10 h-10 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Main Photo Gallery */}
          <div className="space-y-3">
            <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 relative shadow-sm border border-slate-200">
              <img
                src={images[activeImageIdx] || selectedRoom.image}
                alt={selectedRoom.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-medium">
                Photo {activeImageIdx + 1} of {images.length}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activeImageIdx === idx 
                        ? 'border-emerald-600 scale-95 shadow-xs' 
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Specs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-700">
            <div className="flex items-center gap-2.5">
              <Bed className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="text-[11px] text-slate-500 block">Bedrooms</span>
                <span className="text-xs font-bold text-slate-900">{selectedRoom.beds} King Beds</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Bath className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="text-[11px] text-slate-500 block">Bathrooms</span>
                <span className="text-xs font-bold text-slate-900">{selectedRoom.baths} Marble Baths</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Maximize2 className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="text-[11px] text-slate-500 block">Living Space</span>
                <span className="text-xs font-bold text-slate-900">{selectedRoom.sqft} sq.ft</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Users className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="text-[11px] text-slate-500 block">Max Capacity</span>
                <span className="text-xs font-bold text-slate-900">{selectedRoom.maxGuests} Guests</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-1.5">Overview</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {selectedRoom.description}
            </p>
          </div>

          {/* Room Amenities & Highlights */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3">Suite Highlights & Amenities</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {selectedRoom.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hotel Policies & Pay on Arrival Notice */}
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Banknote className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <span className="font-extrabold text-emerald-950 block text-sm">
                  Pay at Check-in Guarantee
                </span>
                <p className="text-emerald-800 mt-0.5">
                  Book online with zero advance charges. Pay with cash or card when you arrive at Antix Hotel reception desk.
                </p>
              </div>
            </div>
          </div>

          {/* Check-in / Check-out Times */}
          <div className="flex items-center gap-6 text-xs text-slate-500 border-t border-slate-200 pt-4">
            <div>
              <span className="font-bold text-slate-800">Check-in:</span> {selectedRoom.checkInTime}
            </div>
            <div>
              <span className="font-bold text-slate-800">Check-out:</span> {selectedRoom.checkOutTime}
            </div>
            <div>
              <span className="font-bold text-slate-800">Cancellation:</span> Free up to 24h
            </div>
          </div>

        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                ${selectedRoom.pricePerNight}
              </span>
              <span className="text-xs text-slate-500 font-medium">/ night</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700">
              No prepayment required
            </span>
          </div>

          <button
            id="btn-details-book-now"
            onClick={handleBookNow}
            className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-xl shadow-emerald-700/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Book Room (Pay at Hotel)</span>
          </button>
        </div>

      </motion.div>
    </div>
  );
};
