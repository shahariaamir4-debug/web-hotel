import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useHotel } from '../context/HotelContext';

export const WriteReviewModal: React.FC = () => {
  const { isWriteReviewOpen, setIsWriteReviewOpen, addReview, rooms } = useHotel();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [guestName, setGuestName] = useState('');
  const [stayedRoom, setStayedRoom] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isWriteReviewOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !comment.trim()) {
      setError('Please provide your name and review details.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await addReview({
        name: guestName.trim(),
        rating,
        stayedRoom: stayedRoom.trim() || (rooms[0]?.title || 'Oceanfront Suite'),
        comment: comment.trim(),
        verified: true
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIsWriteReviewOpen(false);
        setGuestName('');
        setComment('');
        setStayedRoom('');
        setRating(5);
      }, 1500);
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden text-slate-900"
        >
          {/* Close button */}
          <button
            onClick={() => setIsWriteReviewOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Share Your Experience</h3>
              <p className="text-xs text-slate-500">Your feedback helps fellow travelers and our resort team.</p>
            </div>
          </div>

          {success ? (
            <div className="py-10 text-center space-y-3">
              <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto animate-bounce" />
              <h4 className="text-lg font-bold text-slate-900">Thank You For Your Review!</h4>
              <p className="text-xs text-slate-500">Your authentic review has been recorded and is live on our platform.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Overall Rating *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (hoverRating || rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 cursor-pointer transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            active ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="text-xs font-bold text-emerald-700 ml-2">
                    {rating} of 5 Stars
                  </span>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Samantha Vance"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Suite Stayed In */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Suite / Villa Stayed In
                </label>
                <select
                  value={stayedRoom}
                  onChange={(e) => setStayedRoom(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-emerald-600 cursor-pointer"
                >
                  <option value="">Select suite or villa...</option>
                  {rooms.map((r) => (
                    <option key={r.id} value={r.title}>
                      {r.title} ({r.categoryLabel})
                    </option>
                  ))}
                  <option value="Signature Luxury Suite">Other Signature Suite</option>
                </select>
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Review & Experience *
                </label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe your stay, the hospitality, pay on arrival experience, amenities..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsWriteReviewOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Submit Review</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
