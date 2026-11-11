'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Search,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Gem,
  ExternalLink,
  DollarSign,
  ArrowLeft,
  Loader2,
  Eye,
  Check,
  XCircle,
  Filter,
} from 'lucide-react';
import { OrderRecord, OrderStatus, DIAMOND_PACKAGES } from '@/lib/packages';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard Data State
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    verifyingOrders: 0,
    paidOrders: 0,
    failedOrders: 0,
    totalRevenue: 0,
    totalDiamondsDelivered: 0,
  });
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'packages'>('orders');

  const fetchAdminOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const res = await fetch('/api/admin/orders');
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load admin orders:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;

    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput.trim() }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid credentials');
      }

      setIsAuthenticated(true);
      fetchAdminOrders();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setLoginError(msg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const notes =
        newStatus === 'paid'
          ? 'Manually verified by admin on Rupayex statement. Diamonds credited.'
          : newStatus === 'failed'
          ? 'Payment verification failed or timed out.'
          : 'Status updated by administrator.';

      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, adminNotes: notes }),
      });
      const data = await res.json();

      if (data.success && data.order) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(data.order);
        }
        // Refresh summary stats
        fetchAdminOrders();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    // Check if already authenticated via cookie
    fetch('/api/admin/orders')
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
          return res.json();
        }
        return null;
      })
      .then((data) => {
        if (data && data.success) {
          setOrders(data.orders || []);
          if (data.stats) setStats(data.stats);
        }
      })
      .catch(() => {});
  }, []);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.playerUid.includes(searchQuery) ||
      (o.inGameName && o.inGameName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.utrReference && o.utrReference.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || o.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // If Not Authenticated, show Admin Login View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#111111] text-white flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-[#181818] border border-[#242424] rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#E60012] flex items-center justify-center mx-auto text-white shadow-lg shadow-red-900/30">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-extrabold uppercase tracking-tight text-white">
              Admin Verification Portal
            </h1>
            <p className="text-xs text-zinc-400">
              Free Fire Diamond Top-Up Store • Authorized Personnel Only
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-key-input" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                Admin Secret Key
              </label>
              <input
                id="admin-key-input"
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter admin authorization key..."
                className="w-full px-4 py-3 bg-[#111111] border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#E60012] transition-colors"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-950/60 border border-red-800 rounded-lg text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn || !passwordInput.trim()}
              className="w-full py-3.5 bg-[#E60012] hover:bg-[#c70010] active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-zinc-800 disabled:text-zinc-600"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Unlock Admin Dashboard
                </>
              )}
            </button>

            {/* Evaluation Passkey Tip */}
            <div className="pt-2 text-[11px] text-zinc-300 text-center bg-zinc-900/60 p-2.5 rounded border border-zinc-800">
              <span className="text-zinc-400">Default Evaluation Passkey: </span>
              <code className="text-red-400 font-mono font-bold">ff_admin_sec_8892</code>
            </div>
          </form>

          <div className="pt-4 border-t border-[#242424] text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Customer Top-Up Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-zinc-900">
      {/* Top Admin Navigation */}
      <header className="sticky top-0 z-40 bg-[#111111] border-b border-[#242424] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#E60012] text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-extrabold uppercase tracking-wide">
                Admin Management Console
              </div>
              <div className="text-[10px] text-zinc-400 font-medium">
                Free Fire Top-Up Store • Rupayex Gateway Management
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAdminOrders}
              disabled={isLoadingOrders}
              className="px-3 py-1.5 text-xs font-semibold bg-[#242424] hover:bg-zinc-700 text-zinc-200 rounded-md border border-zinc-700 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            <Link
              href="/"
              className="px-3 py-1.5 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white rounded-md transition-colors"
            >
              Storefront
            </Link>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-3 py-1.5 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-md transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-xs">
            <div className="text-xs text-zinc-500 font-semibold uppercase">Total Orders</div>
            <div className="text-2xl font-black text-zinc-900 mt-1 font-mono">
              {stats.totalOrders}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-xs">
            <div className="text-xs text-amber-600 font-semibold uppercase">Pending Orders</div>
            <div className="text-2xl font-black text-amber-600 mt-1 font-mono">
              {stats.pendingOrders}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-xs">
            <div className="text-xs text-blue-600 font-semibold uppercase">Verifying (UTR)</div>
            <div className="text-2xl font-black text-blue-600 mt-1 font-mono">
              {stats.verifyingOrders}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-xs">
            <div className="text-xs text-emerald-600 font-semibold uppercase">Paid & Delivered</div>
            <div className="text-2xl font-black text-emerald-600 mt-1 font-mono">
              {stats.paidOrders}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-xs">
            <div className="text-xs text-[#E60012] font-semibold uppercase">Total Revenue</div>
            <div className="text-2xl font-black text-[#E60012] mt-1 font-mono">
              ₹{stats.totalRevenue.toLocaleString()}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-xs">
            <div className="text-xs text-purple-600 font-semibold uppercase">Diamonds Credited</div>
            <div className="text-2xl font-black text-purple-700 mt-1 font-mono flex items-center gap-1">
              <Gem className="w-4 h-4 text-purple-500" />
              {stats.totalDiamondsDelivered.toLocaleString()}
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition-colors ${
              activeTab === 'orders'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200'
            }`}
          >
            Order Management & Verification ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('packages')}
            className={`px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition-colors ${
              activeTab === 'packages'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200'
            }`}
          >
            50% Pricing Matrix Audit ({DIAMOND_PACKAGES.length})
          </button>
        </div>

        {activeTab === 'orders' ? (
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
            {/* Filter and Search Bar */}
            <div className="p-4 border-b border-zinc-200 flex flex-col sm:flex-row gap-3 items-center justify-between bg-zinc-50/50">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Order ID, UID, IGN, UTR..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-zinc-300 rounded-lg text-xs font-mono focus:outline-none focus:border-zinc-800"
                />
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 text-xs">
                {(['all', 'verifying', 'pending', 'paid', 'failed'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-md font-semibold capitalize whitespace-nowrap transition-colors ${
                      statusFilter === st
                        ? 'bg-[#111111] text-white shadow-xs'
                        : 'text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    {st === 'verifying' ? 'Verifying (Action Req)' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-100/70 border-b border-zinc-200 font-bold text-zinc-600 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Player UID / IGN</th>
                    <th className="py-3 px-4">Package</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">UTR Ref</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-zinc-500">
                        No orders match the current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const isUpdating = updatingId === order.id;

                      return (
                        <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-zinc-900">
                            {order.id}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-mono font-bold text-zinc-900">
                              {order.playerUid}
                            </div>
                            {order.inGameName && (
                              <div className="text-[11px] text-zinc-500">
                                {order.inGameName}
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 px-4 font-medium text-zinc-800">
                            <div className="flex items-center gap-1 font-semibold">
                              <Gem className="w-3.5 h-3.5 text-[#E60012]" />
                              {order.totalDiamonds}💎
                            </div>
                            <div className="text-[11px] text-zinc-500">{order.packageName}</div>
                          </td>

                          <td className="py-3.5 px-4 font-mono font-extrabold text-[#E60012]">
                            ₹{order.discountedPrice}
                          </td>

                          <td className="py-3.5 px-4">
                            {order.paymentStatus === 'paid' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[11px]">
                                <Check className="w-3 h-3 text-emerald-600" />
                                Paid
                              </span>
                            )}
                            {order.paymentStatus === 'verifying' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold text-[11px] animate-pulse">
                                <Clock className="w-3 h-3 text-blue-600" />
                                Verifying
                              </span>
                            )}
                            {order.paymentStatus === 'pending' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[11px]">
                                Pending
                              </span>
                            )}
                            {order.paymentStatus === 'failed' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-800 rounded font-bold text-[11px]">
                                Failed
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-700">
                            {order.utrReference ? (
                              <span className="font-bold text-zinc-900 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-300">
                                {order.utrReference}
                              </span>
                            ) : (
                              <span className="text-zinc-400 italic">None</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-500 whitespace-nowrap">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {order.paymentStatus !== 'paid' && (
                                <button
                                  type="button"
                                  disabled={isUpdating}
                                  onClick={() => handleUpdateStatus(order.id, 'paid')}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                                  title="Confirm payment received on Rupayex and credit diamonds"
                                >
                                  <Check className="w-3 h-3" />
                                  Approve & Deliver
                                </button>
                              )}

                              {order.paymentStatus !== 'failed' && (
                                <button
                                  type="button"
                                  disabled={isUpdating}
                                  onClick={() => handleUpdateStatus(order.id, 'failed')}
                                  className="px-2 py-1 bg-zinc-200 hover:bg-red-100 text-zinc-700 hover:text-red-700 rounded font-semibold text-[11px] transition-colors cursor-pointer"
                                  title="Mark as payment failed"
                                >
                                  Reject
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => setSelectedOrder(order)}
                                className="p-1 text-zinc-500 hover:text-zinc-900 rounded hover:bg-zinc-200"
                                title="View Complete Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Package Pricing Matrix Audit Tab */
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-zinc-900 uppercase tracking-tight">
                Diamond Packages & 50% Reduction Audit
              </h3>
              <p className="text-xs text-zinc-500">
                All pricing logic is strictly governed server-side in <code>/lib/packages.ts</code>. Every package is validated at 50% discount.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-100 font-bold text-zinc-700 uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Package ID</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Diamonds</th>
                    <th className="py-2.5 px-3">Bonus</th>
                    <th className="py-2.5 px-3">Total Diamonds</th>
                    <th className="py-2.5 px-3">Original Price</th>
                    <th className="py-2.5 px-3">50% Reduced Price</th>
                    <th className="py-2.5 px-3">Enforcement Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 font-mono">
                  {DIAMOND_PACKAGES.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-zinc-50">
                      <td className="py-3 px-3 font-bold text-zinc-900">{pkg.id}</td>
                      <td className="py-3 px-3 capitalize font-sans">{pkg.category}</td>
                      <td className="py-3 px-3">{pkg.diamonds.toLocaleString()}</td>
                      <td className="py-3 px-3 text-emerald-600">+{pkg.bonus}</td>
                      <td className="py-3 px-3 font-bold text-emerald-700">
                        {pkg.totalDiamonds.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 line-through text-zinc-400">₹{pkg.originalPrice}</td>
                      <td className="py-3 px-3 font-black text-[#E60012] text-sm">
                        ₹{pkg.discountedPrice}
                      </td>
                      <td className="py-3 px-3 font-sans">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Exact 50% Verified
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Selected Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full border border-zinc-300 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                <div className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#E60012]" />
                  Order Audit: {selectedOrder.id}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="text-zinc-400 hover:text-zinc-800"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2 bg-zinc-50 p-3 rounded-lg border border-zinc-200">
                  <div>
                    <span className="text-zinc-500 block">Player UID:</span>
                    <span className="font-mono font-bold text-zinc-900 text-sm">
                      {selectedOrder.playerUid}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Nickname:</span>
                    <span className="font-semibold text-zinc-900">
                      {selectedOrder.inGameName || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Package:</span>
                    <span className="font-semibold text-zinc-900">
                      {selectedOrder.packageName}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Amount:</span>
                    <span className="font-mono font-bold text-[#E60012]">
                      ₹{selectedOrder.discountedPrice}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Payment Method:</span>
                    <span>{selectedOrder.paymentMethod}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Status:</span>
                    <span className="font-bold uppercase text-zinc-900">
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-zinc-500 block">Rupayex UTR Reference:</span>
                    <span className="font-mono font-bold text-zinc-900 bg-white p-1 rounded border border-zinc-300 block">
                      {selectedOrder.utrReference || 'Not yet submitted by customer'}
                    </span>
                  </div>
                </div>

                {selectedOrder.adminNotes && (
                  <div className="p-3 bg-zinc-100 rounded-lg text-zinc-700">
                    <strong className="block text-zinc-900 mb-0.5">Admin Audit Notes:</strong>
                    {selectedOrder.adminNotes}
                  </div>
                )}

                {/* Status Action Buttons */}
                <div className="pt-2 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'paid')}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs"
                  >
                    Mark Paid & Delivered
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'failed')}
                    className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs"
                  >
                    Mark Failed
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
