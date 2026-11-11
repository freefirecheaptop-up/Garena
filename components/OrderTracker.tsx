'use client';

import React, { useState } from 'react';
import { Search, Loader2, CheckCircle2, Clock, AlertCircle, ArrowRight, Gem } from 'lucide-react';
import { OrderRecord } from '@/lib/packages';

interface OrderTrackerProps {
  onSelectOrder: (order: OrderRecord) => void;
}

export default function OrderTracker({ onSelectOrder }: OrderTrackerProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<OrderRecord[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim();
    if (!clean) return;

    setLoading(true);
    setSearched(true);
    setErrorMessage(null);

    try {
      const isOrderId = clean.toUpperCase().startsWith('FF-');
      const param = isOrderId ? `id=${encodeURIComponent(clean)}` : `uid=${encodeURIComponent(clean)}`;
      const res = await fetch(`/api/orders?${param}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'No matching orders found.');
      }

      setResults(data.orders || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Search failed.';
      setErrorMessage(msg);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Paid & Delivered
          </span>
        );
      case 'verifying':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 animate-pulse">
            <Clock className="w-3 h-3 text-blue-600" />
            Verifying UTR
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3 text-red-600" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3 text-amber-600" />
            Pending Payment
          </span>
        );
    }
  };

  return (
    <section id="track-order" className="scroll-mt-16 py-12 bg-white border-b border-zinc-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <div className="text-xs font-bold text-[#E60012] uppercase tracking-widest">
            Order Status Lookup
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 uppercase tracking-tight">
            Track Free Fire Top-Up Order
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600">
            Enter your Order ID (e.g. <code>FF-1077-94182</code>) or your Free Fire Player UID to view real-time delivery status.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Order ID or Player UID..."
              className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-300 rounded-lg text-sm text-zinc-900 focus:outline-none focus:border-zinc-800 focus:bg-white transition-all font-mono"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-3 bg-[#E60012] hover:bg-[#c70010] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 cursor-pointer disabled:bg-zinc-300"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
          </button>
        </form>

        {/* Results Container */}
        {searched && (
          <div className="space-y-4">
            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center text-xs text-red-700">
                {errorMessage}
              </div>
            )}

            {!errorMessage && results.length === 0 && (
              <div className="p-8 bg-zinc-50 border border-zinc-200 rounded-xl text-center text-xs text-zinc-500">
                No orders found for &quot;{query}&quot;. Please verify the Order ID or Player UID.
              </div>
            )}

            {results.length > 0 && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                  Found {results.length} Order{results.length > 1 ? 's' : ''}
                </div>

                {results.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 sm:p-5 bg-zinc-50 border border-zinc-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-zinc-300 transition-colors"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-zinc-900 text-sm">
                          {order.id}
                        </span>
                        {getStatusBadge(order.paymentStatus)}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-600">
                        <span>
                          UID: <strong className="font-mono text-zinc-900">{order.playerUid}</strong>
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 font-semibold text-zinc-800">
                          <Gem className="w-3.5 h-3.5 text-[#E60012]" />
                          {order.packageName} ({order.totalDiamonds}💎)
                        </span>
                        <span>·</span>
                        <span className="font-mono font-bold text-[#E60012]">
                          ₹{order.discountedPrice}
                        </span>
                      </div>

                      <div className="text-[11px] text-zinc-400 font-mono">
                        Date: {new Date(order.createdAt).toLocaleString()}
                        {order.utrReference && ` · UTR: ${order.utrReference}`}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectOrder(order)}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-zinc-100 text-zinc-900 text-xs font-bold rounded-lg border border-zinc-300 shadow-xs transition-colors shrink-0"
                    >
                      View Details & UTR
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
