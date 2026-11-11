'use client';

import React, { useState } from 'react';
import { Gem, Check, Sparkles, Tag, ShieldCheck } from 'lucide-react';
import { DIAMOND_PACKAGES, DiamondPackage } from '@/lib/packages';

interface DiamondPackagesProps {
  selectedPackageId: string;
  onSelectPackage: (pkg: DiamondPackage) => void;
}

export default function DiamondPackages({
  selectedPackageId,
  onSelectPackage,
}: DiamondPackagesProps) {
  const [filter, setFilter] = useState<'all' | 'standard' | 'membership'>('all');

  const filteredPackages = DIAMOND_PACKAGES.filter((pkg) => {
    if (filter === 'all') return true;
    if (filter === 'standard') return pkg.category === 'standard';
    if (filter === 'membership') return pkg.category === 'membership' || pkg.category === 'pass';
    return true;
  });

  return (
    <div id="packages" className="scroll-mt-20 bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-sm">
      {/* Header and Step Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#E60012] text-white flex items-center justify-center font-extrabold text-sm">
            2
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-900 uppercase tracking-tight flex items-center gap-2">
              Select Diamond Package
              <span className="text-xs px-2 py-0.5 bg-red-100 text-[#E60012] font-black rounded uppercase">
                50% OFF Applied
              </span>
            </h2>
            <p className="text-xs text-zinc-500 font-medium">
              Every package is discounted by exactly 50% with original diamond amounts preserved
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-white text-zinc-900 shadow-sm font-bold'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            All Packages ({DIAMOND_PACKAGES.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('standard')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              filter === 'standard'
                ? 'bg-white text-zinc-900 shadow-sm font-bold'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Diamonds Only
          </button>
          <button
            type="button"
            onClick={() => setFilter('membership')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              filter === 'membership'
                ? 'bg-white text-zinc-900 shadow-sm font-bold'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Passes & VIP
          </button>
        </div>
      </div>

      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filteredPackages.map((pkg) => {
          const isSelected = selectedPackageId === pkg.id;

          return (
            <div
              key={pkg.id}
              onClick={() => onSelectPackage(pkg)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectPackage(pkg);
                }
              }}
              className={`relative cursor-pointer rounded-xl p-5 border text-left transition-all duration-200 select-none ${
                isSelected
                  ? 'border-[#E60012] bg-red-50/20 shadow-md ring-2 ring-[#E60012]/40'
                  : 'border-zinc-200 hover:border-zinc-400 bg-white hover:shadow-sm'
              }`}
            >
              {/* Top Tag or Status */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#E60012] text-white shadow-sm'
                        : 'bg-zinc-100 text-[#E60012]'
                    }`}
                  >
                    <Gem className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      {pkg.category === 'standard' ? 'Fast Top-Up' : 'Special Pass'}
                    </span>
                  </div>
                </div>

                {pkg.tag ? (
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-900 text-white">
                    {pkg.tag}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                    50% OFF
                  </span>
                )}
              </div>

              {/* Diamonds Count */}
              <div className="space-y-1 my-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-zinc-900 tracking-tight">
                    {pkg.diamonds.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-zinc-500 uppercase">Diamonds</span>
                </div>
                {pkg.bonus > 0 ? (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>+{pkg.bonus} Extra Bonus (Total {pkg.totalDiamonds})</span>
                  </div>
                ) : (
                  <div className="text-xs text-zinc-500 font-medium">
                    {pkg.name}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-zinc-400 line-through">
                    Regular: ₹{pkg.originalPrice}
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-extrabold text-[#E60012]">
                      ₹{pkg.discountedPrice}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded">
                      Save ₹{pkg.originalPrice - pkg.discountedPrice}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                    isSelected
                      ? 'bg-[#E60012] border-[#E60012] text-white'
                      : 'border-zinc-300 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Official 50% Price Reduction Guarantee Notice */}
      <div className="mt-6 p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Fixed 50% Price Reduction:</strong> All diamond values remain authentic official in-game currency. Prices are calculated server-side.
          </span>
        </div>
        <div className="text-zinc-400 text-[11px] whitespace-nowrap">
          Official Rupayex Gateway Verified
        </div>
      </div>
    </div>
  );
}
