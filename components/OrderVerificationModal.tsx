'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  X,
  Send,
  Loader2,
  Gem,
} from 'lucide-react';
import { OrderRecord, OFFICIAL_RUPAYEX_URL } from '@/lib/packages';

interface OrderVerificationModalProps {
  order: OrderRecord;
  onClose: () => void;
  onOrderUpdated: (updated: OrderRecord) => void;
}

export default function OrderVerificationModal({
  order,
  onClose,
  onOrderUpdated,
}: OrderVerificationModalProps) {
  const [utrInput, setUtrInput] = useState(order.utrReference || '');
  const [isSubmittingUtr, setIsSubmittingUtr] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [utrError, setUtrError] = useState<string | null>(null);

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`);
      const data = await res.json();
      if (data.success && data.order) {
        onOrderUpdated(data.order);
      }
    } catch (err) {
      console.error('Error refreshing order status:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSubmitUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrInput.trim()) {
      setUtrError('Please enter your Rupayex Transaction Reference / UTR.');
      return;
    }
    setIsSubmittingUtr(true);
    setUtrError(null);

    try {
      const res = await fetch(`/api/orders/${order.id}/utr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ utr: utrInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit transaction reference.');
      }
      onOrderUpdated(data.order);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error submitting reference.';
      setUtrError(msg);
    } finally {
      setIsSubmittingUtr(false);
    }
  };

  const getStatusBadge = () => {
    switch (order.paymentStatus) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            PAID & DELIVERED
          </span>
        );
      case 'verifying':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full border border-blue-300 animate-pulse">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            PAYMENT VERIFYING
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full border border-red-300">
            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            PAYMENT FAILED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            PENDING PAYMENT
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-zinc-300 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="bg-[#111111] text-white p-5 flex items-center justify-between border-b border-[#242424]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E60012] flex items-center justify-center text-white">
              <Gem className="w-4 h-4 fill-white" />
            </div>
            <div>
              <div className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                Top-Up Order Receipt
              </div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>{order.id}</span>
                <button
                  type="button"
                  onClick={handleCopyOrderId}
                  className="text-zinc-400 hover:text-white transition-colors"
                  title="Copy Order ID"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                {copiedId && <span className="text-[10px] text-emerald-400">Copied!</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefreshStatus}
              disabled={isRefreshing}
              className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
              title="Refresh Status"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">
          {/* Status Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
            <div>
              <div className="text-xs text-zinc-500 font-medium">Current Status</div>
              <div className="mt-1">{getStatusBadge()}</div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs text-zinc-500 font-medium">Total Discounted Price</div>
              <div className="text-xl font-black text-[#E60012] font-mono">
                ₹{order.discountedPrice}
              </div>
            </div>
          </div>

          {/* Detailed Order Metadata */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-zinc-50 p-4 rounded-xl border border-zinc-200">
            <div>
              <span className="text-zinc-500 block">Player UID:</span>
              <span className="font-mono font-bold text-zinc-900 text-sm">{order.playerUid}</span>
            </div>
            {order.inGameName && (
              <div>
                <span className="text-zinc-500 block">Player Nickname:</span>
                <span className="font-semibold text-zinc-900 text-sm">{order.inGameName}</span>
              </div>
            )}
            <div>
              <span className="text-zinc-500 block">Diamond Package:</span>
              <span className="font-semibold text-zinc-900">{order.packageName}</span>
            </div>
            <div>
              <span className="text-zinc-500 block">Diamonds To Credit:</span>
              <span className="font-bold text-emerald-700">
                {order.totalDiamonds.toLocaleString()} 💎
              </span>
            </div>
            <div>
              <span className="text-zinc-500 block">Payment Method:</span>
              <span className="font-medium text-zinc-900">{order.paymentMethod}</span>
            </div>
            <div>
              <span className="text-zinc-500 block">Order Timestamp:</span>
              <span className="font-mono text-zinc-700">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Status Specific Action / Verification View */}
          {order.paymentStatus === 'paid' ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-emerald-900">
                Payment Verified & Diamonds Credited!
              </h3>
              <p className="text-xs text-emerald-800">
                {order.totalDiamonds} diamonds have been credited directly to Free Fire UID: {order.playerUid}. Check your in-game mailbox or vault.
              </p>
              {order.verifiedAt && (
                <div className="text-[11px] text-emerald-600 font-mono">
                  Verified At: {new Date(order.verifiedAt).toLocaleString()}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Payment Instructions Step */}
              <div className="p-4 bg-red-50/40 border border-red-200 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#E60012] uppercase tracking-wider">
                    Step A: Complete Payment on Rupayex
                  </span>
                  <a
                    href={OFFICIAL_RUPAYEX_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#E60012] hover:underline"
                  >
                    Open Payment Page <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-xs text-zinc-600">
                  If the payment page didn&apos;t open automatically, click the link above and pay exactly{' '}
                  <strong className="text-zinc-900 font-mono font-bold">₹{order.discountedPrice}</strong>.
                </p>
              </div>

              {/* UTR Submission Form */}
              <form onSubmit={handleSubmitUtr} className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3">
                <div className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                  Step B: Submit Rupayex UTR / Reference ID
                </div>
                <p className="text-xs text-zinc-500">
                  After completing the payment on Rupayex, copy your 12-digit UTR or Transaction Reference number and submit it below for fast verification:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={utrInput}
                    onChange={(e) => setUtrInput(e.target.value)}
                    placeholder="e.g. RPX-10778891 or 12-digit UPI UTR"
                    className="flex-1 px-3.5 py-2.5 text-xs font-mono bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-zinc-800"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingUtr}
                    className="px-4 py-2.5 bg-[#111111] hover:bg-[#242424] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:bg-zinc-400"
                  >
                    {isSubmittingUtr ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    Submit UTR
                  </button>
                </div>
                {utrError && <p className="text-xs text-red-600">{utrError}</p>}
                {order.utrReference && (
                  <div className="text-[11px] text-zinc-600 font-mono">
                    Submitted UTR: <span className="font-bold text-zinc-900">{order.utrReference}</span>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Admin Verification Note */}
          {order.adminNotes && (
            <div className="p-3 bg-zinc-100 rounded-lg text-xs text-zinc-600">
              <span className="font-semibold text-zinc-800">Support / Verification Log: </span>
              {order.adminNotes}
            </div>
          )}

          {/* Footer Notice */}
          <div className="pt-2 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Direct Garena Server Integration</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-zinc-600 hover:text-zinc-900 font-semibold"
            >
              Close Window
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
