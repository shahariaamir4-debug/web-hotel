/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HotelProvider, useHotel } from './context/HotelContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeatureHighlights } from './components/FeatureHighlights';
import { WhyChooseAntix } from './components/WhyChooseAntix';
import { RoomGrid } from './components/RoomGrid';
import { HowItWorks } from './components/HowItWorks';
import { ReviewsSection } from './components/ReviewsSection';
import { CtaBanner } from './components/CtaBanner';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { BookingVoucherModal } from './components/BookingVoucherModal';
import { RoomDetailsModal } from './components/RoomDetailsModal';
import { MyBookingsDrawer } from './components/MyBookingsDrawer';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { WriteReviewModal } from './components/WriteReviewModal';
import { AdminPasscodeModal } from './components/AdminPasscodeModal';
import { AdminPanel } from './components/AdminPanel';

function MainApp() {
  const { isAdminMode, isAdminAuthenticated, isOwner } = useHotel();

  if (isAdminMode && (isAdminAuthenticated || isOwner)) {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen bg-[#041912] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200 font-sans antialiased">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content Sections */}
      <main>
        {/* Hero Section with Live Search Bar */}
        <HeroSection />

        {/* 4 Feature Highlights */}
        <FeatureHighlights />

        {/* Why Choose Antix Hotel */}
        <WhyChooseAntix />

        {/* Featured Rooms & Suites Catalog */}
        <RoomGrid />

        {/* 3-Step Booking Guide with Pay on Arrival Guarantee */}
        <HowItWorks />

        {/* Guest Reviews & Social Proof */}
        <ReviewsSection />

        {/* Bottom CTA Banner */}
        <CtaBanner />
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Interactive Modals & Drawers */}
      <BookingModal />
      <BookingVoucherModal />
      <RoomDetailsModal />
      <MyBookingsDrawer />
      <FavoritesDrawer />
      <WriteReviewModal />
      <AdminPasscodeModal />
    </div>
  );
}

export default function App() {
  return (
    <HotelProvider>
      <MainApp />
    </HotelProvider>
  );
}
