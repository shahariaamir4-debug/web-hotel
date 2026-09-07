import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Sparkles, 
  Banknote, 
  AlertCircle,
  Clock,
  Phone,
  Mail,
  User as UserIcon,
  ShieldCheck,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useHotel } from '../context/HotelContext';

export const BookingModal: React.FC = () => {
  const { 
    bookingRoom, 
    setBookingRoom, 
    createBooking, 
    setActiveVoucher,
    user 
  } = useHotel();

  // Tomorrow as default check-in, +2 days as default check-out
  const getTodayPlusDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const [checkIn, setCheckIn] = useState(() => getTodayPlusDays(1));
  const [checkOut, setCheckOut] = useState(() => getTodayPlusDays(3));
  const [guestsCount, setGuestsCount] = useState(2);
  const [guestName, setGuestName] = useState(user?.displayName || '');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [specialRequests, setSpecialRequests] = useState('');
  const [arrivalTime, setArrivalTime] = useState('2:00 PM - 4:00 PM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!bookingRoom) return null;

  // Calculate nights
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const diffTime = d2.getTime() - d1.getTime();
  const calculatedNights = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));
  const roomTotal = bookingRoom.pricePerNight * calculatedNights;
  const taxesIncluded = Math.round(roomTotal * 0.12);
  const grandTotal = roomTotal + taxesIncluded;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!guestName.trim()) {
      setErrorMsg('Please enter primary guest full name.');
      return;
    }
    if (!guestPhone.trim()) {
      setErrorMsg('Please provide a contact phone number for arrival confirmation.');
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      setErrorMsg('Check-out date must be after check-in date.');
      return;
    }

    try {
      setIsSubmitting(true);

      const newBooking = await createBooking({
        userId: user?.uid || `guest_${Date.now()}`,
        userEmail: guestEmail.trim() || user?.email || 'guest@antixhotel.com',
        guestName: guestName.trim(),
        guestPhone: guestPhone.trim(),
        roomId: bookingRoom.id,
        roomTitle: bookingRoom.title,
        roomType: bookingRoom.categoryLabel,
        roomImage: bookingRoom.image,
        checkIn,
        checkOut,
        nights: calculatedNights,
        guestsCount,
        specialRequests: specialRequests.trim(),
        paymentMethod: 'pay_on_arrival',
        totalPrice: grandTotal,
        currency: 'USD'
      });

      // Confetti celebratory explosion
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }

      // Close booking modal and open Voucher
      setBookingRoom(null);
      setActiveVoucher(newBooking);

    } catch (err: unknown) {
      console.error('Booking failed:', err);
      setErrorMsg('Could not process reservation. Please try again or call the front desk.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-2xl bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6"
      >
        {/* Modal Header (Crisp White with Emerald Accent) */}
        <div className="p-6 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-300/80 flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  DIRECT RESERVATION
                </span>
                <span className="text-xs text-slate-500 font-medium">• No Prepayment</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 mt-0.5">
                Reserve {bookingRoom.title}
              </h3>
            </div>
          </div>

          <button
            id="btn-close-booking-modal"
            onClick={() => setBookingRoom(null)}
            className="w-9 h-9 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Room Snapshot */}
        <div className="p-4 sm:p-6 bg-slate-50/50 border-b border-slate-200/90 flex items-center gap-4">
          <img
            src={bookingRoom.image}
            alt={bookingRoom.title}
            className="w-20 h-20 sm:w-24 sm:h-20 rounded-2xl object-cover shrink-0 border border-slate-200 shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-md">
                {bookingRoom.categoryLabel}
              </span>
              <span className="text-xs text-slate-500 font-medium truncate">
                {bookingRoom.location}
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-900 truncate mt-1">
              {bookingRoom.title}
            </h4>
            <div className="text-xs font-semibold text-slate-700 mt-1">
              <span className="text-sm font-black text-slate-900">${bookingRoom.pricePerNight}</span>{' '}
              <span className="text-slate-500 font-normal">/ night</span>
            </div>
          </div>
        </div>

        {/* Guaranteed Pay on Arrival Highlight Card */}
        <div className="mx-4 sm:mx-6 mt-4 p-4 bg-emerald-50 border border-emerald-300/80 rounded-2xl flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Banknote className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <span className="font-extrabold text-emerald-950 text-sm block">
              100% Cash / Card on Arrival Guarantee
            </span>
            <span className="text-emerald-800 font-medium leading-relaxed">
              No advance credit card deduction today. Pay comfortably at our front desk upon check-in.
            </span>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Dates & Guests Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Check-in Date
              </label>
              <input
                id="input-checkin"
                type="date"
                required
                value={checkIn}
                min={getTodayPlusDays(0)}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full text-xs font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 outline-emerald-600 focus:border-emerald-600 focus:bg-white shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Check-out Date
              </label>
              <input
                id="input-checkout"
                type="date"
                required
                value={checkOut}
                min={checkIn}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full text-xs font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 outline-emerald-600 focus:border-emerald-600 focus:bg-white shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Number of Guests
              </label>
              <select
                id="select-guests"
                value={guestsCount}
                onChange={(e) => setGuestsCount(Number(e.target.value))}
                className="w-full text-xs font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 outline-emerald-600 focus:border-emerald-600 focus:bg-white shadow-2xs cursor-pointer"
              >
                {Array.from({ length: bookingRoom.maxGuests }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n} className="bg-white text-slate-900">
                    {n} Guest{n > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Guest Personal Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Guest Name *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  id="input-guest-name"
                  type="text"
                  required
                  placeholder="e.g. Johnathan Doe"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full text-xs font-medium text-slate-900 bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 outline-emerald-600 focus:border-emerald-600 focus:bg-white shadow-2xs placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number (for Arrival Voucher) *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  id="input-guest-phone"
                  type="tel"
                  required
                  placeholder="e.g. +1 (555) 019-2834"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full text-xs font-medium text-slate-900 bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 outline-emerald-600 focus:border-emerald-600 focus:bg-white shadow-2xs placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address (for Digital Confirmation)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  id="input-guest-email"
                  type="email"
                  placeholder="name@example.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full text-xs font-medium text-slate-900 bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 outline-emerald-600 focus:border-emerald-600 focus:bg-white shadow-2xs placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Estimated Arrival Time
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <select
                  id="select-arrival-time"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className="w-full text-xs font-medium text-slate-900 bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 outline-emerald-600 focus:border-emerald-600 focus:bg-white shadow-2xs cursor-pointer"
                >
                  <option value="12:00 PM - 2:00 PM">12:00 PM - 2:00 PM (Early Check-in request)</option>
                  <option value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM (Standard Check-in)</option>
                  <option value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM</option>
                  <option value="6:00 PM - 9:00 PM">6:00 PM - 9:00 PM (Evening)</option>
                  <option value="Late Night (After 9 PM)">Late Night (After 9:00 PM)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Special Requests (Optional)
            </label>
            <input
              id="input-special-requests"
              type="text"
              placeholder="e.g. High floor, airport pickup, honeymoon setup, extra pillows"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="w-full text-xs font-medium text-slate-900 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 outline-emerald-600 focus:border-emerald-600 focus:bg-white shadow-2xs placeholder:text-slate-400"
            />
          </div>

          {/* Price Summary Breakdown */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>${bookingRoom.pricePerNight} × {calculatedNights} Night{calculatedNights > 1 ? 's' : ''}</span>
              <span className="font-bold text-slate-900">${roomTotal}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Resort Service Fee & Hospitality Taxes (12%)</span>
              <span className="font-bold text-slate-900">${taxesIncluded}</span>
            </div>
            <div className="pt-2.5 border-t border-slate-200 flex justify-between items-baseline">
              <div>
                <span className="text-sm font-black text-slate-900 block">
                  Total Payable at Front Desk
                </span>
                <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Zero advance fee today • Pay on arrival
                </span>
              </div>
              <span className="text-2xl font-black text-emerald-700">
                ${grandTotal} USD
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="btn-confirm-reservation"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-xl shadow-emerald-700/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Confirm Reservation (Pay on Arrival)</span>
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-slate-500">
            By confirming, your suite is officially secured. A printable digital voucher will be generated instantly.
          </p>

        </form>
      </motion.div>
    </div>
  );
};
