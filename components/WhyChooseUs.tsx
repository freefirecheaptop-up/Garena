'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Percent, Zap, Clock, Lock, CheckCircle2 } from 'lucide-react';

export default function WhyChooseUs() {
  const perks = [
    {
      title: '100% Safe & Legitimate',
      desc: 'Top-ups are processed using your public numeric Player UID only. We never require passwords, OTPs, or Facebook/Google logins.',
      icon: ShieldCheck,
    },
    {
      title: 'Flat 50% Price Reduction',
      desc: 'Get double the diamond value. Every standard and pass package is guaranteed at exactly half the regular in-game catalog price.',
      icon: Percent,
    },
    {
      title: 'Instant In-Game Delivery',
      desc: 'Our direct game server routing credits diamonds directly to your inventory within 1-5 minutes after transaction verification.',
      icon: Zap,
    },
    {
      title: 'Official Rupayex Gateway',
      desc: 'Pay directly through India’s trusted payment link supporting all UPI apps (GPay, PhonePe, Paytm, BHIM) with bank-grade encryption.',
      icon: Lock,
    },
    {
      title: '24/7 Automated Queue',
      desc: 'Orders are handled around the clock so you never miss limited-time Free Fire events, incubator spins, or weapon royale drops.',
      icon: Clock,
    },
    {
      title: 'Real-Time Order Tracking',
      desc: 'Check live status of your order anytime using your Order ID or Player UID directly on our portal.',
      icon: CheckCircle2,
    },
  ];

  return (
    <section id="why-us" className="scroll-mt-16 py-14 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Visual Showcase Feature */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-900 shadow-xl">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/assets/diamond-crate.jpg"
                  alt="Tactical Free Fire Diamond Supply Drop"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="inline-block px-2.5 py-0.5 bg-[#E60012] text-[10px] font-black uppercase tracking-wider rounded mb-1">
                    Premium Top-Up Guarantee
                  </div>
                  <div className="text-base font-bold">100% Authentic In-Game Diamonds</div>
                  <div className="text-xs text-zinc-300">
                    Direct server crediting with complete account safety
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-[#E60012]" />
              </div>
              <div className="text-xs text-zinc-700">
                <span className="font-bold text-zinc-900 block">No Account Bans or Penalties</span>
                We use authorized regional game distributor top-up channels. Your game account remains 100% compliant with Garena terms.
              </div>
            </div>
          </div>

          {/* Right Column: Perks Grid */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#E60012] uppercase tracking-widest">
                Trusted by 50,000+ Indian Survivors
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 uppercase tracking-tight">
                Why Top-Up Through Our Store?
              </h2>
              <p className="text-sm text-zinc-600 font-normal">
                Designed exclusively for Free Fire players who demand fast, transparent, and discounted diamond top-ups without risking account security.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {perks.map((perk, i) => {
                const Icon = perk.icon;
                return (
                  <div key={i} className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-colors space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-white border border-zinc-200 text-[#E60012] flex items-center justify-center shadow-xs">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-zinc-900">{perk.title}</h3>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed pl-9">
                      {perk.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
