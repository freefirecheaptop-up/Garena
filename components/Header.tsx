'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Flame, ShieldCheck, Search, ShieldAlert, Menu, X } from 'lucide-react';

interface HeaderProps {
  onOpenTracker?: () => void;
}

export default function Header({ onOpenTracker }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#111111] border-b border-[#242424] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single Brand Wordmark */}
        <Link href="/" className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group">
          <div className="w-9 h-9 rounded-md bg-[#E60012] flex items-center justify-center text-white shadow-sm shadow-red-900/30 group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 fill-white text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-wider text-base text-white uppercase leading-none">
              FREE FIRE <span className="text-[#E60012]">TOP-UP</span>
            </span>
            <span className="text-[10px] tracking-widest text-zinc-400 font-semibold uppercase leading-tight">
              50% OFF STORE
            </span>
          </div>
        </Link>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-300">
          <a
            href="#packages"
            className="hover:text-white hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
          >
            Diamond Packages
          </a>
          <a
            href="#how-it-works"
            className="hover:text-white hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
          >
            How It Works
          </a>
          <a
            href="#why-us"
            className="hover:text-white hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
          >
            Why Choose Us
          </a>
          <a
            href="#payment-guide"
            className="hover:text-white hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
          >
            Rupayex Guide
          </a>
          <a
            href="#track-order"
            onClick={(e) => {
              if (onOpenTracker) {
                e.preventDefault();
                onOpenTracker();
              }
            }}
            className="hover:text-white hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5 text-zinc-400" />
            Track Order
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action + Admin Link */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/admin"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-[#242424] hover:bg-[#333333] border border-zinc-700 rounded-md transition-colors whitespace-nowrap"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
            Admin Portal
          </Link>
          <a
            href="#uid-input"
            className="px-4 py-2 text-xs sm:text-sm font-bold tracking-wide uppercase text-white bg-[#E60012] hover:bg-[#cc0010] active:scale-95 rounded-md shadow-sm transition-all whitespace-nowrap shrink-0"
          >
            Recharge Now
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#181818] border-b border-[#242424] px-4 pt-3 pb-5 space-y-3">
          <a
            href="#packages"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-zinc-200 hover:text-white py-1.5"
          >
            Diamond Packages (50% OFF)
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-zinc-200 hover:text-white py-1.5"
          >
            How It Works
          </a>
          <a
            href="#why-us"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-zinc-200 hover:text-white py-1.5"
          >
            Why Choose Us
          </a>
          <a
            href="#payment-guide"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-zinc-200 hover:text-white py-1.5"
          >
            Rupayex Payment Guide
          </a>
          <a
            href="#track-order"
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenTracker) onOpenTracker();
            }}
            className="block text-sm font-medium text-zinc-200 hover:text-white py-1.5"
          >
            Track Order Status
          </a>
          <div className="pt-2 border-t border-[#242424]">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-300 hover:text-white py-1"
            >
              <ShieldAlert className="w-4 h-4 text-red-500" />
              Open Admin Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
