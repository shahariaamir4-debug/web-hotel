import React from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  Heart, 
  CalendarCheck, 
  LogIn, 
  LogOut, 
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';

export const Navbar: React.FC = () => {
  const { 
    user, 
    login, 
    logout, 
    favorites, 
    bookings, 
    setIsMyBookingsOpen, 
    setIsFavoritesOpen,
    authLoading 
  } = useHotel();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const confirmedBookingsCount = bookings.filter(b => b.status === 'confirmed').length;

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#041912]/95 backdrop-blur-xl border-b border-emerald-950/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            id="brand-logo"
            onClick={() => scrollToSection('hero')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-950/60 group-hover:scale-105 transition-transform border border-emerald-400/40">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-2xl tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                  Antix
                </span>
                <span className="font-display font-light text-2xl tracking-tight text-emerald-300">
                  Hotel
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-emerald-200/70">
                Luxury & Grandeur
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-200">
            <button 
              id="nav-link-home"
              onClick={() => scrollToSection('hero')}
              className="text-white hover:text-emerald-300 transition-colors cursor-pointer"
            >
              Home
            </button>
            <button 
              id="nav-link-rooms"
              onClick={() => scrollToSection('featured-rooms')}
              className="hover:text-emerald-300 transition-colors cursor-pointer"
            >
              Rooms & Suites
            </button>
            <button 
              id="nav-link-why"
              onClick={() => scrollToSection('why-antix')}
              className="hover:text-emerald-300 transition-colors cursor-pointer"
            >
              Why Antix
            </button>
            <button 
              id="nav-link-how"
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-emerald-300 transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button 
              id="nav-link-reviews"
              onClick={() => scrollToSection('reviews')}
              className="hover:text-emerald-300 transition-colors cursor-pointer"
            >
              Reviews
            </button>
          </nav>

          {/* Action Controls */}
          <div className="flex items-center gap-3">
            
            {/* Wishlist Button */}
            <button
              id="btn-favorites"
              onClick={() => setIsFavoritesOpen(true)}
              className="relative p-2.5 rounded-full text-slate-200 hover:text-rose-400 hover:bg-rose-500/10 border border-emerald-900/60 transition-colors cursor-pointer"
              title="Saved Favorites"
            >
              <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* My Bookings Button */}
            <button
              id="btn-my-bookings"
              onClick={() => setIsMyBookingsOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold text-slate-100 hover:text-emerald-300 hover:bg-emerald-950/70 border border-emerald-800/60 transition-colors cursor-pointer"
              title="View your reservations"
            >
              <CalendarCheck className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">My Bookings</span>
              {confirmedBookingsCount > 0 && (
                <span className="bg-emerald-600 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full">
                  {confirmedBookingsCount}
                </span>
              )}
            </button>

            {/* Auth Button */}
            {authLoading ? (
              <div className="w-8 h-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
            ) : user ? (
              <div className="flex items-center gap-2 pl-1">
                <div className="flex items-center gap-2 bg-[#06241a] border border-emerald-800/60 rounded-full py-1 pl-1 pr-3">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover border border-emerald-500/40"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-emerald-800 text-emerald-100 flex items-center justify-center font-bold text-xs">
                      {user.displayName?.[0] || 'U'}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-slate-100 max-w-[90px] truncate hidden sm:inline">
                    {user.displayName?.split(' ')[0] || 'Guest'}
                  </span>
                  <button
                    id="btn-logout"
                    onClick={logout}
                    className="text-slate-400 hover:text-rose-400 transition-colors p-0.5 ml-0.5 cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                id="btn-google-login"
                onClick={login}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold text-slate-100 hover:text-white hover:bg-emerald-950/80 border border-emerald-800/60 transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-emerald-400" />
                <span>Sign in</span>
              </button>
            )}

            {/* Primary CTA Book Now button */}
            <motion.button
              id="btn-navbar-book-now"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => scrollToSection('featured-rooms')}
              className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-black bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-950/60 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Book Room</span>
            </motion.button>

            {/* Mobile Menu Toggle */}
            <button
              id="btn-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-200 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-emerald-900 bg-[#052118] px-4 pt-3 pb-6 space-y-3 shadow-2xl">
          <div className="flex flex-col space-y-2 text-base font-semibold text-slate-100">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-left px-3 py-2 rounded-lg hover:bg-emerald-900/40"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('featured-rooms')}
              className="text-left px-3 py-2 rounded-lg hover:bg-emerald-900/40"
            >
              Rooms & Suites
            </button>
            <button
              onClick={() => scrollToSection('why-antix')}
              className="text-left px-3 py-2 rounded-lg hover:bg-emerald-900/40"
            >
              Why Choose Antix
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-left px-3 py-2 rounded-lg hover:bg-emerald-900/40"
            >
              How It Works (Pay on Arrival)
            </button>
            <button
              onClick={() => scrollToSection('reviews')}
              className="text-left px-3 py-2 rounded-lg hover:bg-emerald-900/40"
            >
              Guest Reviews
            </button>
          </div>

          <div className="pt-2 border-t border-emerald-900 flex flex-col gap-2">
            {!user && (
              <button
                onClick={login}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-emerald-800 text-sm font-bold text-slate-100 bg-emerald-950/60"
              >
                <LogIn className="w-4 h-4 text-emerald-400" />
                <span>Sign in with Google</span>
              </button>
            )}
            <button
              onClick={() => scrollToSection('featured-rooms')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-center text-sm shadow-lg shadow-emerald-950/60"
            >
              Reserve Room (Pay at Check-in)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
