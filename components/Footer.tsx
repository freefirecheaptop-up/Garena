'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, ShieldCheck, Lock, ExternalLink } from 'lucide-react';
import { OFFICIAL_RUPAYEX_URL } from '@/lib/packages';

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-zinc-400 border-t border-[#242424] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#242424]">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-[#E60012] flex items-center justify-center text-white">
                <Flame className="w-5 h-5 fill-white text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold tracking-wider text-base text-white uppercase leading-none">
                  FREE FIRE <span className="text-[#E60012]">TOP-UP</span>
                </span>
                <span className="text-[9px] tracking-widest text-zinc-500 font-semibold uppercase">
                  50% REDUCED PRICE STORE
                </span>
              </div>
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              Official-inspired fast Free Fire Diamond top-up store. Direct numeric Player UID delivery, 50% discount on every diamond tier, and secure payment checkout via Rupayex.
            </p>

            <div className="flex items-center gap-2 text-zinc-400 text-xs pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% Secure • No Account Credentials Required</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <div className="font-bold text-white uppercase tracking-wider text-xs">
              Quick Navigation
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#packages" className="hover:text-white transition-colors">
                  Diamond Packages (50% OFF)
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-white transition-colors">
                  Why Choose Us
                </a>
              </li>
              <li>
                <a href="#payment-guide" className="hover:text-white transition-colors">
                  Payment Instructions
                </a>
              </li>
              <li>
                <a href="#track-order" className="hover:text-white transition-colors">
                  Track Order Status
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Payment & Security */}
          <div className="md:col-span-4 space-y-3">
            <div className="font-bold text-white uppercase tracking-wider text-xs">
              Payment Gateway Partner
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
              All transactions are processed through India’s certified payment gateway:
            </p>
            <div className="p-3 bg-[#1C1C1C] border border-[#2A2A2A] rounded-lg space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                  <Lock className="w-3.5 h-3.5 text-[#E60012]" />
                  Rupayex Gateway
                </span>
                <a
                  href={OFFICIAL_RUPAYEX_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#E60012] hover:underline flex items-center gap-1 font-semibold"
                >
                  Payme 1077 <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="text-[11px] text-zinc-400">
                Supports Google Pay, PhonePe, Paytm, BHIM, UPI, and RuPay Cards.
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white hover:underline"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
                Staff / Admin Management Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 space-y-3 text-[11px] text-zinc-400 leading-relaxed">
          <p>
            <strong>Disclaimer:</strong> Free Fire and Garena are registered trademarks of Garena International. This website is an independent e-commerce recharge platform providing authorized player UID top-up services via regional distributor allocation. All game assets, character designs, and trademarks belong to their respective copyright holders.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#1F1F1F]">
            <div>
              &copy; {new Date().getFullYear()} Free Fire Diamond Top-Up Store. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-zinc-400">
              <span>50% Flat Discount Active</span>
              <span>·</span>
              <span>Rupayex Certified</span>
              <span>·</span>
              <span>Direct Server Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
