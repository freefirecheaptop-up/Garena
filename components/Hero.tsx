'use client';

import React from 'react';
import Image from 'next/image';
import { Zap, ShieldCheck, Gem, ArrowDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-[#111111] text-white overflow-hidden border-b border-[#242424]">
      {/* Background Accent Grid */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline and Highlights */}
          <div className="lg:col-span-7 space-y-6">
            {/* Editorial Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#242424] border border-red-900/60 rounded text-xs font-semibold text-zinc-200">
              <span className="w-2 h-2 rounded-full bg-[#E60012]" />
              <span className="tracking-wider uppercase">Official-Inspired Fast Top-Up</span>
              <span className="text-zinc-500">·</span>
              <span className="text-red-400 font-bold">FLAT 50% OFF TODAY</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase leading-none text-white">
                FREE FIRE <span className="text-[#E60012]">DIAMOND</span> TOP-UP STORE
              </h1>
              <p className="text-base sm:text-lg text-zinc-300 max-w-2xl font-normal leading-relaxed">
                Direct in-game diamond recharge delivered instantly into your Free Fire account using your Player UID. Every diamond package is discounted by exactly 50%.
              </p>
            </div>

            {/* Value Highlights Pill Strip */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-3 text-center">
                <div className="text-xs text-zinc-400 font-medium">Original Prices</div>
                <div className="text-base sm:text-lg font-bold text-zinc-300 line-through">₹80 - ₹1600</div>
              </div>
              <div className="bg-red-950/40 border border-red-700/60 rounded-lg p-3 text-center">
                <div className="text-xs text-red-300 font-medium">New 50% Off Price</div>
                <div className="text-base sm:text-lg font-extrabold text-[#E60012]">₹40 - ₹800</div>
              </div>
              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-3 text-center">
                <div className="text-xs text-zinc-400 font-medium">Diamond Bonus</div>
                <div className="text-base sm:text-lg font-bold text-white">+10% Free</div>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#uid-input"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#E60012] hover:bg-[#c70010] active:scale-95 text-white font-bold text-sm tracking-wider uppercase rounded-md shadow-lg shadow-red-900/30 transition-all"
              >
                <Zap className="w-4 h-4 fill-white" />
                Start Instant Top-Up
                <ArrowDown className="w-4 h-4" />
              </a>
              <a
                href="#packages"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#242424] hover:bg-[#2e2e2e] text-zinc-200 font-semibold text-sm rounded-md border border-zinc-700 transition-colors"
              >
                <Gem className="w-4 h-4 text-red-500" />
                View 50% Price List
              </a>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-4 border-t border-[#242424] flex flex-wrap items-center gap-6 text-xs text-zinc-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Player UID only (No password)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Instant Server Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>Official Rupayex Gateway</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Graphic */}
          <div className="lg:col-span-5">
            <div className="relative rounded-xl overflow-hidden border border-[#2c2c2c] bg-[#161616] shadow-2xl">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/assets/hero-diamond.jpg"
                  alt="Free Fire Radiant Diamond Top-Up"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                  priority
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-black/30" />
              </div>

              {/* Floating Highlight Overlay Card */}
              <div className="p-4 bg-[#181818] border-t border-[#2A2A2A] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-red-900/40 border border-red-700/60 flex items-center justify-center text-red-400">
                    <Gem className="w-5 h-5 fill-red-500 text-red-500" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-400 font-semibold uppercase">Instant Delivery</div>
                    <div className="text-sm font-bold text-white">100% Guaranteed Credit</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 bg-[#E60012] text-white text-xs font-black tracking-wider uppercase rounded">
                    50% DISCOUNT
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
