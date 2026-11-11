'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Lock,
  ArrowRight,
  Loader2,
  Gem,
  CheckCircle2,
} from 'lucide-react';
import { DiamondPackage, OFFICIAL_RUPAYEX_URL, OrderRecord } from '@/lib/packages';

interface CheckoutSectionProps {
  playerUid: string;
  isUidValid: boolean;
  inGameName?: string;
  selectedPackage: DiamondPackage | null;
  onOrderCreated: (order: OrderRecord) => void;
}

export default function CheckoutSection({
  playerUid,
  isUidValid,
  inGameName,
  selectedPackage,
  onOrderCreated,
}: CheckoutSectionProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canProceed = isUidValid && selectedPackage !== null;

  const handlePayNow = async () => {
    if (!canProceed || !selectedPackage) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerUid,
          inGameName,
          packageId: selectedPackage.id,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create top-up order.');
      }

      // Order created in pending status!
      // Open Rupayex payment gateway in a new tab so user never loses their order tracking window
      window.open(OFFICIAL_RUPAYEX_URL, '_blank', 'noopener,noreferrer');

      // Pass created order to parent to display tracking & UTR submission screen
      onOrderCreated(data.order);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
        <div className="w-8 h-8 rounded-lg bg-[#E60012] text-white flex items-center justify-center font-extrabold text-sm">
          3
        </div>
        <div>
          <h2 className="text-lg font-bold text-zinc-900 uppercase tracking-tight">
            Checkout & Rupayex Payment
          </h2>
          <p className="text-xs text-zinc-500 font-medium">
            Review order summary and proceed to official Rupayex gateway
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Column: Order Summary */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 pb-2 border-b border-zinc-200">
              Top-Up Order Summary
            </div>

            {/* Player UID Row */}
            <div className="flex items-center justify-between text-sm py-1">
              <span className="text-zinc-600">Player UID:</span>
              <span className="font-mono font-bold text-zinc-900">
                {playerUid ? (
                  isUidValid ? (
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {playerUid}
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">Invalid ({playerUid})</span>
                  )
                ) : (
                  <span className="text-zinc-400 italic">Not entered yet</span>
                )}
              </span>
            </div>

            {/* In-Game Name if provided */}
            {inGameName && (
              <div className="flex items-center justify-between text-sm py-1">
                <span className="text-zinc-600">Player Nickname:</span>
                <span className="font-medium text-zinc-900">{inGameName}</span>
              </div>
            )}

            {/* Selected Package Row */}
            <div className="flex items-center justify-between text-sm py-1">
              <span className="text-zinc-600">Selected Package:</span>
              <span className="font-semibold text-zinc-900">
                {selectedPackage ? (
                  <span className="flex items-center gap-1.5">
                    <Gem className="w-3.5 h-3.5 text-[#E60012]" />
                    {selectedPackage.name}
                  </span>
                ) : (
                  <span className="text-zinc-400 italic">No package selected</span>
                )}
              </span>
            </div>

            {/* Diamonds Delivered */}
            {selectedPackage && (
              <div className="flex items-center justify-between text-sm py-1">
                <span className="text-zinc-600">Total Diamonds:</span>
                <span className="font-bold text-emerald-600">
                  {selectedPackage.totalDiamonds.toLocaleString()} 💎
                  {selectedPackage.bonus > 0 && ` (${selectedPackage.bonus} Bonus)`}
                </span>
              </div>
            )}

            {/* Pricing Breakdown */}
            <div className="pt-3 border-t border-zinc-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Original Catalog Price:</span>
                <span className="line-through font-mono">
                  ₹{selectedPackage ? selectedPackage.originalPrice : 0}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-[#E60012]">
                <span>50% Special Store Discount:</span>
                <span className="font-mono">
                  -₹{selectedPackage ? selectedPackage.originalPrice - selectedPackage.discountedPrice : 0}
                </span>
              </div>

              <div className="flex items-center justify-between text-base font-extrabold text-zinc-900 pt-2 border-t border-zinc-200">
                <span>Total Payable:</span>
                <span className="text-xl font-black text-[#E60012] font-mono">
                  ₹{selectedPackage ? selectedPackage.discountedPrice : 0}
                </span>
              </div>
            </div>
          </div>

          {/* Validation Warnings */}
          {!isUidValid && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Please enter a valid 8-12 digit Free Fire Player UID above to activate checkout.</span>
            </div>
          )}

          {isUidValid && !selectedPackage && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Please select a diamond package from Step 2 above to proceed.</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Right Column: Payment Gateway CTA */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="bg-[#111111] text-white rounded-lg p-5 border border-[#242424] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#E60012]" />
                <span className="font-bold text-sm tracking-wide uppercase">Primary Payment</span>
              </div>
              <span className="text-[10px] font-bold text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                Official Gateway
              </span>
            </div>

            <div className="text-xs text-zinc-300 space-y-1.5 leading-relaxed">
              <p>
                Payments are securely processed via <strong>Rupayex Gateway</strong> supporting all Indian payment methods:
              </p>
              <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] text-zinc-300">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>UPI / QR Code</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Google Pay / PhonePe</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Paytm / BHIM</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>RuPay & Cards</span>
                </div>
              </div>
            </div>

            {/* Official Link Display */}
            <div className="p-2.5 bg-[#1C1C1C] rounded border border-zinc-700 text-[11px] text-zinc-400 font-mono break-all">
              <span className="text-zinc-500">Destination URL:</span> {OFFICIAL_RUPAYEX_URL}
            </div>

            {/* Prominent RED PAY NOW Button */}
            <button
              type="button"
              onClick={handlePayNow}
              disabled={!canProceed || loading}
              className={`w-full py-4 px-6 rounded-md font-black text-base uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg ${
                canProceed && !loading
                  ? 'bg-[#E60012] hover:bg-[#c70010] text-white active:scale-[0.98] shadow-red-900/40 cursor-pointer'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Secure Order...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  PAY NOW ₹{selectedPackage ? selectedPackage.discountedPrice : 0}
                  <ExternalLink className="w-4 h-4 ml-1" />
                </>
              )}
            </button>

            <div className="text-[11px] text-zinc-400 text-center flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Clicking Pay Now opens Rupayex in a secure tab</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
