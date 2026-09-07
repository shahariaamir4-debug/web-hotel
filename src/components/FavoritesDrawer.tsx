import React from 'react';
import { motion } from 'motion/react';
import { X, Heart, Trash2, ArrowRight } from 'lucide-react';
import { useHotel } from '../context/HotelContext';

export const FavoritesDrawer: React.FC = () => {
  const { 
    isFavoritesOpen, 
    setIsFavoritesOpen, 
    favorites, 
    rooms, 
    toggleFavorite, 
    setBookingRoom
  } = useHotel();

  if (!isFavoritesOpen) return null;

  const favoriteRooms = rooms.filter((r) => favorites.includes(r.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsFavoritesOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-screen max-w-md bg-white text-slate-900 border-l border-slate-200 shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="p-6 bg-slate-50 border-b border-slate-200 text-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center border border-rose-200">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Saved Favorites</h3>
                <p className="text-xs text-slate-500 font-medium">
                  {favoriteRooms.length} {favoriteRooms.length === 1 ? 'Suite' : 'Suites'} Saved
                </p>
              </div>
            </div>

            <button
              id="btn-close-favorites"
              onClick={() => setIsFavoritesOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {favoriteRooms.length === 0 ? (
              <div className="text-center py-16 text-slate-500 space-y-3">
                <Heart className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-800">No Favorites Saved</p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Click the heart icon on any suite or villa to save it here for comparison.
                </p>
              </div>
            ) : (
              favoriteRooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-3.5 hover:border-emerald-500 transition-all group"
                >
                  <img
                    src={room.image}
                    alt={room.title}
                    className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      {room.categoryLabel}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 truncate mt-1">
                      {room.title}
                    </h4>
                    <div className="text-xs font-black text-slate-900 mt-0.5">
                      ${room.pricePerNight} <span className="text-slate-500 font-normal">/ night</span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => {
                          setIsFavoritesOpen(false);
                          setBookingRoom(room);
                        }}
                        className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                      >
                        Book Now
                      </button>
                      <button
                        onClick={() => toggleFavorite(room.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
