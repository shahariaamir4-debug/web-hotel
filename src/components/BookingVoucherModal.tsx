import React from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  CheckCircle2, 
  Printer, 
  Banknote, 
  QrCode,
  ShieldCheck,
  Building2,
  Calendar,
  Clock
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';

export const BookingVoucherModal: React.FC = () => {
  const { activeVoucher, setActiveVoucher, setIsMyBookingsOpen } = useHotel();

  if (!activeVoucher) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleOpenMyBookings = () => {
    setActiveVoucher(null);
    setIsMyBookingsOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-xl bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6"
      >
        {/* Success Header Banner */}
        <div className="p-6 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-widest font-extrabold text-emerald-100">
                Reservation Confirmed
              </span>
              <h3 className="text-lg sm:text-xl font-black">
                Your Sanctuary is Secured!
              </h3>
            </div>
          </div>

          <button
            id="btn-close-voucher"
            onClick={() => setActiveVoucher(null)}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Voucher Body (Crisp White Paper Aesthetic) */}
        <div className="p-6 sm:p-8 space-y-6" id="printable-voucher">
          
          {/* Brand & Reference Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-sm shadow-xs">
                AH
              </div>
              <div>
                <span className="font-display font-black text-slate-900 text-lg">Antix Hotel</span>
                <p className="text-[10px] text-emerald-700 uppercase tracking-widest font-bold">Official Guest Pass</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
                Booking Reference
              </div>
              <div className="text-base font-black text-emerald-800 font-mono tracking-wider">
                {activeVoucher.bookingReference}
              </div>
            </div>
          </div>

          {/* Reserved Room Banner */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center gap-4">
            <img
              src={activeVoucher.roomImage}
              alt={activeVoucher.roomTitle}
              className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200 shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2 py-0.5 rounded">
                {activeVoucher.roomType}
              </span>
              <h4 className="text-base font-bold text-slate-900 truncate mt-1">
                {activeVoucher.roomTitle}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {activeVoucher.nights} Night{activeVoucher.nights > 1 ? 's' : ''} • {activeVoucher.guestsCount} Guest{activeVoucher.guestsCount > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Guest & Schedule Info Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4.5 rounded-2xl border border-slate-200">
            <div>
              <span className="text-slate-500 font-semibold block">Primary Guest</span>
              <span className="text-slate-900 font-bold text-sm block mt-0.5">{activeVoucher.guestName}</span>
              <span className="text-slate-600 mt-0.5 block">{activeVoucher.guestPhone}</span>
            </div>

            <div>
              <span className="text-slate-500 font-semibold block">Settlement Method</span>
              <span className="text-emerald-800 font-bold text-xs bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-md inline-block mt-1">
                Pay on Arrival (Cash/Card)
              </span>
            </div>

            <div>
              <span className="text-slate-500 font-semibold block">Check-in</span>
              <span className="text-slate-900 font-bold mt-0.5 block">{activeVoucher.checkIn} (From 2:00 PM)</span>
            </div>

            <div>
              <span className="text-slate-500 font-semibold block">Check-out</span>
              <span className="text-slate-900 font-bold mt-0.5 block">{activeVoucher.checkOut} (Until 12:00 PM)</span>
            </div>
          </div>

          {/* Amount to Pay upon Arrival Highlight */}
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-emerald-950 uppercase tracking-wide">
                  Amount Due at Reception Desk
                </div>
                <div className="text-xs text-emerald-800 font-medium">
                  Settle by cash or credit card when checking in
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-black text-emerald-800">
                ${activeVoucher.totalPrice}
              </div>
              <div className="text-[10px] text-emerald-700 font-bold">USD (Taxes Included)</div>
            </div>
          </div>

          {/* Simulated QR Code for Quick Check-in */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-white rounded-lg p-1 border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                <QrCode className="w-10 h-10 text-slate-900" />
              </div>
              <div>
                <div className="font-bold text-slate-900">Desk Check-in Barcode</div>
                <div className="text-slate-500 text-[11px]">Show this voucher to the front desk agent upon arrival</div>
              </div>
            </div>
            <div className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded border border-emerald-300">
              ACTIVE VOUCHER
            </div>
          </div>

        </div>

        {/* Modal Action Buttons */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            id="btn-voucher-print"
            onClick={handlePrint}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Official Voucher</span>
          </button>

          <button
            id="btn-voucher-my-bookings"
            onClick={handleOpenMyBookings}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs shadow-md shadow-emerald-700/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>View in My Reservations</span>
          </button>
        </div>

      </motion.div>
    </div>
  );
};
