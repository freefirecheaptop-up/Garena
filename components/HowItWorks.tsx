'use client';

import React from 'react';
import { UserCheck, Gem, CreditCard, Zap } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Enter Player UID',
      desc: 'Input your 8 to 12-digit numeric Free Fire Player ID. We never ask for your game password or login credentials.',
      icon: UserCheck,
    },
    {
      num: '02',
      title: 'Select Diamond Pack',
      desc: 'Choose your desired diamond pack. Every single package includes our flat 50% price reduction with full bonus diamonds.',
      icon: Gem,
    },
    {
      num: '03',
      title: 'Pay via Rupayex',
      desc: 'Click Pay Now to securely complete payment on Rupayex supporting UPI, Google Pay, PhonePe, Paytm, and RuPay cards.',
      icon: CreditCard,
    },
    {
      num: '04',
      title: 'Instant Credit',
      desc: 'Submit your transaction reference UTR. Once verified, diamonds are credited directly into your in-game vault.',
      icon: Zap,
    },
  ];

  return (
    <section id="how-it-works" className="scroll-mt-16 py-12 bg-[#F5F5F5] border-y border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#E60012] uppercase tracking-widest">
            <span>Seamless 4-Step Process</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 uppercase tracking-tight">
            How The 50% Top-Up Works
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 font-normal">
            Safe, fast, and automated diamond recharge directly into your Free Fire account
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-white border border-zinc-200 rounded-xl p-6 relative hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-zinc-100 group-hover:bg-[#E60012] text-zinc-800 group-hover:text-white flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black text-zinc-200 group-hover:text-red-200 transition-colors font-mono">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-base font-bold text-zinc-900 uppercase tracking-tight mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
