'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is it completely safe to top-up using only my Free Fire Player UID?',
      a: 'Yes, 100% safe. We only require your public numeric Player UID (e.g. 1077889123). We never ask for your game password, Facebook, Google, or VK login credentials. Your account credentials remain entirely confidential with you.',
    },
    {
      q: 'Why are all diamond packages discounted by 50%?',
      a: 'We operate through direct wholesale promotional allocation agreements with regional esports distributor networks. This allows us to pass on a flat 50% discount to players on every single pack while preserving 100% of the authentic in-game diamonds and bonuses.',
    },
    {
      q: 'How do I pay using the Rupayex payment gateway?',
      a: 'When you click "PAY NOW", our store opens the official Rupayex payment link (https://rupayex.net/payme/1077). You can complete the transaction using any Indian UPI app (Google Pay, PhonePe, Paytm, BHIM, Cred) or debit/credit card.',
    },
    {
      q: 'What is a UTR and why is it needed for verification?',
      a: 'A UTR (Unique Transaction Reference) is a 12-digit numeric tracking code provided by your bank/UPI app upon successful payment. Submitting this reference allows our automated verification system to instantly match your payment with your order and dispatch the diamonds.',
    },
    {
      q: 'How long does it take for diamonds to appear in Free Fire?',
      a: 'Typically between 1 and 5 minutes after transaction verification. The diamonds are credited straight to your in-game vault without requiring you to re-log or restart your device.',
    },
    {
      q: 'Can I track my order status if I close the checkout tab?',
      a: 'Yes. Every order is assigned a unique Order ID (e.g. FF-1077-XXXXX). You can visit the "Track Order" section on our homepage at any time and enter your Order ID or Player UID to view live status.',
    },
  ];

  return (
    <section id="faq" className="scroll-mt-16 py-14 bg-[#F5F5F5] border-b border-zinc-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E60012] uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 uppercase tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 font-normal">
            Everything you need to know about our Free Fire 50% discount top-up store
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-zinc-200 rounded-xl overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-zinc-900 hover:text-[#E60012] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#E60012]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
