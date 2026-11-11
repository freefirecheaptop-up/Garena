'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import PlayerUidInput from '@/components/PlayerUidInput';
import DiamondPackages from '@/components/DiamondPackages';
import CheckoutSection from '@/components/CheckoutSection';
import OrderVerificationModal from '@/components/OrderVerificationModal';
import HowItWorks from '@/components/HowItWorks';
import WhyChooseUs from '@/components/WhyChooseUs';
import PaymentGuide from '@/components/PaymentGuide';
import OrderTracker from '@/components/OrderTracker';
import FaqSection from '@/components/FaqSection';
import Footer from '@/components/Footer';
import { DIAMOND_PACKAGES, DiamondPackage, OrderRecord } from '@/lib/packages';

export default function HomePage() {
  // Free Fire Player UID & in-game nickname state
  const [playerUid, setPlayerUid] = useState('');
  const [inGameName, setInGameName] = useState('');
  const [isUidValid, setIsUidValid] = useState(false);

  // Selected Diamond Package (default to the popular 310+31 Diamonds pack: ₹120 instead of ₹240)
  const defaultPackage = DIAMOND_PACKAGES.find((p) => p.id === 'ff-310') || DIAMOND_PACKAGES[0];
  const [selectedPackage, setSelectedPackage] = useState<DiamondPackage | null>(defaultPackage);

  // Active Order Modal
  const [activeOrder, setActiveOrder] = useState<OrderRecord | null>(null);

  const handleOrderCreated = (order: OrderRecord) => {
    setActiveOrder(order);
  };

  const handleOrderUpdated = (updated: OrderRecord) => {
    setActiveOrder(updated);
  };

  const handleScrollToTracker = () => {
    const el = document.getElementById('track-order');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans selection:bg-[#E60012] selection:text-white">
      {/* 1. Header & Navigation */}
      <Header onOpenTracker={handleScrollToTracker} />

      {/* 2. Hero Section */}
      <Hero />

      {/* Main Top-Up Workflow Section */}
      <main className="flex-1">
        <section id="topup" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          {/* Section Lead Banner */}
          <div className="bg-[#111111] text-white p-4 sm:p-5 rounded-2xl border border-[#242424] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#E60012] bg-red-950/60 px-2.5 py-0.5 rounded border border-red-900/60">
                PROMOTIONAL 50% RECHARGE ACTIVE
              </span>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                3-Step Instant Diamond Top-Up
              </h2>
              <p className="text-xs text-zinc-300">
                Follow steps 1, 2, and 3 below. Server-side price verification guarantees your 50% discount.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="text-right">
                <div className="text-[10px] text-zinc-400 uppercase font-semibold">Gateway</div>
                <div className="text-xs font-bold text-white">Rupayex Direct UPI</div>
              </div>
            </div>
          </div>

          {/* STEP 1: Free Fire Player UID Input */}
          <PlayerUidInput
            playerUid={playerUid}
            setPlayerUid={setPlayerUid}
            inGameName={inGameName}
            setInGameName={setInGameName}
            onUidValidated={setIsUidValid}
          />

          {/* STEP 2: Diamond Packages (50% reduced prices) */}
          <DiamondPackages
            selectedPackageId={selectedPackage ? selectedPackage.id : ''}
            onSelectPackage={setSelectedPackage}
          />

          {/* STEP 3: Checkout & Rupayex Payment */}
          <CheckoutSection
            playerUid={playerUid}
            isUidValid={isUidValid}
            inGameName={inGameName}
            selectedPackage={selectedPackage}
            onOrderCreated={handleOrderCreated}
          />
        </section>

        {/* 4. How It Works */}
        <HowItWorks />

        {/* 5. Why Choose Us */}
        <WhyChooseUs />

        {/* 6. Payment Instructions */}
        <PaymentGuide />

        {/* Order Status Lookup Tool */}
        <OrderTracker onSelectOrder={(order) => setActiveOrder(order)} />

        {/* 7. Frequently Asked Questions */}
        <FaqSection />
      </main>

      {/* 8. Professional Footer */}
      <Footer />

      {/* Order Confirmation / Verification Modal */}
      {activeOrder && (
        <OrderVerificationModal
          order={activeOrder}
          onClose={() => setActiveOrder(null)}
          onOrderUpdated={handleOrderUpdated}
        />
      )}
    </div>
  );
}
