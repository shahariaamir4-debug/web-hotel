import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  CalendarCheck, 
  Receipt, 
  Banknote, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import { Booking } from '../types';

export const MyBookingsDrawer: React.FC = () => {
  const { 
    isMyBookingsOpen, 
    setIsMyBookingsOpen, 
    bookings, 
    cancelBooking, 
    setActiveVoucher,
    user,
    login 
  } = useHotel();

  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);

  if (!isMyBookingsOpen) return null;

  const handleViewVoucher = (booking: Booking) => {
    setActiveVoucher(booking);
    setIsMyBookingsOpen(false);
  };

  const handleConfirmCancel = async (id: string) => {
    await cancelBooking(id);
    setCancelTargetId(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsMyBookingsOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-screen max-w-md bg-white text-slate-900 border-l border-slate-200 shadow-2xl flex flex-col"
        >
          {/* Drawer Header (Crisp White with Emerald Accent) */}
          <div className="p-6 bg-slate-50 border-b border-slate-200 text-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-300">
                <CalendarCheck className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">My Reservations</h3>
                <p className="text-xs text-slate-500 font-medium">
                  {bookings.length} {bookings.length === 1 ? 'Stay' : 'Stays'} Booked
                </p>
              </div>
            </div>

            <button
              id="btn-close-my-bookings"
              onClick={() => setIsMyBookingsOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sync / Auth Banner */}
          {!user && (
            <div className="bg-emerald-50 border-b border-emerald-200 p-3.5 px-6 flex items-center justify-between text-xs">
              <div className="text-emerald-950 font-medium">
                Sign in with Google to sync your bookings across devices!
              </div>
              <button
                onClick={login}
                className="font-bold text-emerald-700 hover:text-emerald-800 underline ml-2 shrink-0 cursor-pointer"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Bookings List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {bookings.length === 0 ? (
              <div className="text-center py-16 text-slate-500 space-y-3">
                <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-800">No Reservations Yet</p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Explore our luxury suites and lock in your dream stay with guaranteed zero advance payment.
                </p>
                <button
                  onClick={() => {
                    setIsMyBookingsOpen(false);
                    const el = document.getElementById('featured-rooms');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-600 transition-colors cursor-pointer shadow-md"
                >
                  Browse Rooms
                </button>
              </div>
            ) : (
              bookings.map((booking) => {
                const isCancelled = booking.status === 'cancelled';
                return (
                  <div
                    key={booking.id || booking.bookingReference}
                    className={`rounded-2xl p-4 border transition-all ${
                      isCancelled 
                        ? 'bg-slate-50 border-slate-200 opacity-60' 
                        : 'bg-white border-slate-200 shadow-md hover:border-emerald-500'
                    }`}
                  >
                    {/* Top Row: Ref ID + Status */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {booking.bookingReference}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          isCancelled
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {isCancelled ? 'Cancelled' : 'Confirmed • Pay at Hotel'}
                      </span>
                    </div>

                    {/* Room Thumbnail & Title */}
                    <div className="flex items-center gap-3 my-2">
                      <img
                        src={booking.roomImage}
                        alt={booking.roomTitle}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {booking.roomTitle}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">
                          {booking.nights} Night{booking.nights > 1 ? 's' : ''} • {booking.guestsCount} Guest{booking.guestsCount > 1 ? 's' : ''}
                        </p>
                        <div className="text-xs font-bold text-emerald-700 mt-0.5">
                          ${booking.totalPrice} USD due at front desk
                        </div>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 bg-slate-50 p-2.5 rounded-xl mt-3 border border-slate-200">
                      <div>
                        <span className="font-bold text-slate-500 block">Check-in</span>
                        <span className="font-semibold">{booking.checkIn}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-500 block">Check-out</span>
                        <span className="font-semibold">{booking.checkOut}</span>
                      </div>
                    </div>

                    {/* Guest Name & Payment note */}
                    <div className="text-[11px] text-slate-600 mt-2 flex items-center justify-between">
                      <span>Guest: <strong className="text-slate-900">{booking.guestName}</strong></span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <Banknote className="w-3.5 h-3.5" /> Pay at check-in
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleViewVoucher(booking)}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>View Voucher</span>
                      </button>

                      {!isCancelled && (
                        <button
                          onClick={() => setCancelTargetId(booking.id || null)}
                          className="py-1.5 px-3 rounded-lg text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>

                    {/* Confirm Cancellation Dialog */}
                    {cancelTargetId === booking.id && (
                      <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-2">
                        <div className="flex items-center gap-2 text-rose-900 font-bold">
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>Cancel this reservation?</span>
                        </div>
                        <p className="text-rose-700 text-[11px]">
                          Free cancellation. Your room hold will be released immediately.
                        </p>
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            onClick={() => setCancelTargetId(null)}
                            className="px-2.5 py-1 rounded-md bg-white border border-slate-300 text-slate-700 font-bold text-[11px] cursor-pointer"
                          >
                            Keep Stay
                          </button>
                          <button
                            onClick={() => handleConfirmCancel(booking.id!)}
                            className="px-2.5 py-1 rounded-md bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-700 cursor-pointer shadow-xs"
                          >
                            Confirm Cancel
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
