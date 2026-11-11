'use client';

import React from 'react';
import { ExternalLink, CreditCard, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { OFFICIAL_RUPAYEX_URL } from '@/lib/packages';

export default function PaymentGuide() {
  return (
    <section id="payment-guide" className="scroll-mt-16 py-14 bg-[#F5F5F5] border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#E60012] uppercase tracking-widest">
            <span>Rupayex Integration Guide</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 uppercase tracking-tight">
            Official Payment Instructions
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 font-normal">
            Step-by-step payment instructions for seamless checkout and swift verification
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Card */}
          <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-xl p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-900 text-white flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-[#E60012]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900">Official Rupayex Payment Gateway</h3>
                  <p className="text-xs text-zinc-500">Secure Indian Banking & UPI Payment Processing</p>
                </div>
              </div>

              <a
                href={OFFICIAL_RUPAYEX_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#E60012] hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
              >
                Open Rupayex Link <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-red-100 text-[#E60012] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Place Order & Open Gateway</h4>
                  <p className="text-xs text-zinc-600 leading-relaxed mt-0.5">
                    Select your package and enter your Free Fire Player UID above, then click the red <strong>PAY NOW</strong> button. The gateway URL ({OFFICIAL_RUPAYEX_URL}) will open in a secure window.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-red-100 text-[#E60012] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Pay Exact Discounted Amount</h4>
                  <p className="text-xs text-zinc-600 leading-relaxed mt-0.5">
                    Ensure you enter the exact payable amount matching your order (e.g., ₹40, ₹80, ₹120, ₹200, ₹400, or ₹800). Rupayex supports Google Pay, PhonePe, Paytm, BHIM, Cred, and RuPay cards.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-red-100 text-[#E60012] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Locate Your 12-Digit UPI UTR</h4>
                  <p className="text-xs text-zinc-600 leading-relaxed mt-0.5">
                    Upon successful payment, your UPI app provides a 12-digit transaction reference number (labeled as <em>UTR</em>, <em>Ref No.</em>, or <em>Transaction ID</em>).
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-red-100 text-[#E60012] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Submit UTR for Swift Verification</h4>
                  <p className="text-xs text-zinc-600 leading-relaxed mt-0.5">
                    Paste your reference number into our order tracking window. Our verification team confirms the payment against bank records and releases the diamonds immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Tips & Security Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-zinc-200 rounded-xl p-5 space-y-3">
              <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Payment Verification Policy
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                In strict compliance with transparent e-commerce standards, top-up orders are marked as <strong>Paid & Delivered</strong> only after actual bank transaction confirmation.
              </p>
              <div className="pt-2 border-t border-zinc-100 space-y-2 text-xs text-zinc-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>256-bit encrypted SSL checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct UPI routing without hidden charges</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Manual & automated dual verification checks</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-xs text-amber-900">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Important Notice:</span>
                Always double check your Free Fire Player UID before paying. Diamonds delivered to the specified UID cannot be revoked or transferred once credited.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
