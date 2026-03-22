"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Search,
  ShoppingCart,
  Plus,
  Filter,
  CreditCard,
  Banknote,
  X,
  Check,
  ChevronDown,
  RefreshCcw,
  Clock,
  Printer,
  ChevronRight,
  User,
  ConciergeBell
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

type ViewType = "list" | "selection";

export default function OrdersManagement() {
  const [activeView, setActiveView] = useState<ViewType>("list");
  
  // List View State
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Selection/POS View State
  const [categories, setCategories] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [cart, setCart] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingMenu, setLoadingMenu] = useState(true);
  
  // Modals
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<string>("card");

  useEffect(() => {
    if (activeView === "list") {
      fetchOrders();
    } else {
      fetchMenu();
    }
  }, [activeView]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*, tables(*), order_items(*, menu_items(*))")
      .order("created_at", { ascending: false });
    
    if (error) console.error("Error fetching orders:", error);
    else setOrders(data || []);
    setLoadingOrders(false);
  };

  const fetchMenu = async () => {
    setLoadingMenu(true);
    const [catRes, itemRes] = await Promise.all([
      supabase.from("categories").select("*"),
      supabase.from("menu_items").select("*, categories(name)").eq("status", "active"),
    ]);
    
    setCategories(catRes.data || []);
    setMenuItems(itemRes.data || []);
    setLoadingMenu(false);
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    if (!error) fetchOrders();
  };

  // Cart Functions
  const addToCart = (item: any) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          const newQty = Math.max(0, i.qty + delta);
          return { ...i, qty: newQty };
        }
        return i;
      }).filter((i) => i.qty > 0)
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handlePinSubmit = () => {
    if (pin.length === 6) {
      setIsPinModalOpen(false);
      setIsPaymentModalOpen(true);
      setPin("");
    } else {
      alert("Invalid PIN. Please enter a 6-digit PIN.");
      setPin("");
    }
  };

  const handleCheckout = async () => {
    // Create actual order in DB
    const orderPayload = {
      total_amount: cartTotal,
      status: "completed",
    };
    
    const { data: orderData, error: orderErr } = await supabase.from("orders").insert([orderPayload]).select().single();
    if (orderErr) {
      alert(orderErr.message);
      return;
    }
    
    // Add items
    const itemsPayload = cart.map(item => ({
      order_id: orderData.id,
      menu_item_id: item.id,
      quantity: item.qty,
      price_at_order: item.price
    }));
    await supabase.from("order_items").insert(itemsPayload);

    setIsPaymentModalOpen(false);
    setCart([]);
    alert("Payment successful! Order completed.");
    setActiveView("list");
  };

  const filteredOrders = orders.filter(
    (o) => statusFilter === "all" || o.status === statusFilter
  );

  const filteredMenu = menuItems.filter(
    (item) =>
      (activeCategory === "all" || item.category_id === activeCategory) &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full font-body h-[calc(100vh-theme(spacing.24))] md:h-[calc(100vh-theme(spacing.16))] relative">
      {/* ── Header ── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#FEF7F1] tracking-wider flex items-center gap-3">
            <ConciergeBell size={24} className="text-[#BF5933]" />
            Orders & POS
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Manage incoming orders or process new sales
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-white/5 rounded-xl p-1 border border-white/8">
            {(["list", "selection"] as ViewType[]).map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-5 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all ${
                  activeView === view
                    ? "bg-[#BF5933] text-white shadow-lg shadow-[#BF5933]/30"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {view === "list" ? "Active Orders" : "Point of Sale"}
              </button>
            ))}
          </div>
          {activeView === "list" && (
            <button
              onClick={fetchOrders}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all"
            >
              <RefreshCcw size={16} />
            </button>
          )}
        </div>
      </header>

      {/* ── Content Area ── */}
      <div className="flex-1 w-full flex flex-col min-h-0 overflow-hidden">
        {activeView === "list" ? (
          // ── LIST VIEW ──
          <div className="flex-1 flex flex-col gap-5 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#1E1E1E] p-4 rounded-2xl border border-white/8">
              <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 [&::-webkit-scrollbar]:hidden">
                <span className="text-xs font-bold text-white/30 uppercase tracking-widest mr-2 flex-shrink-0 flex items-center gap-1.5"><Filter size={14}/> Filter</span>
                {["all", "pending", "in_process", "served", "completed", "cancelled"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
                      statusFilter === status
                        ? "bg-[#BF5933]/10 border-[#BF5933]/50 text-[#BF5933]"
                        : "bg-white/5 border-transparent text-white/50 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {status.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {loadingOrders ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-64 bg-white/5 rounded-2xl border border-white/8 animate-pulse" />
                  ))
                ) : filteredOrders.length === 0 ? (
                  <div className="col-span-full py-20 text-center text-white/30 flex flex-col items-center justify-center">
                    <ConciergeBell size={48} className="mb-4 opacity-20" />
                    <p className="font-medium">No orders found.</p>
                  </div>
                ) : (
                  filteredOrders.map((order) => {
                    const statusMap: Record<string, { cls: string, label: string }> = {
                      pending: { cls: "bg-orange-500/10 text-orange-400 border-orange-500/20", label: "Pending" },
                      in_process: { cls: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", label: "In Kitchen" },
                      served: { cls: "bg-[#BF5933]/10 text-[#BF5933] border-[#BF5933]/20", label: "Served" },
                      completed: { cls: "bg-green-500/10 text-green-400 border-green-500/20", label: "Completed" },
                      cancelled: { cls: "bg-red-500/10 text-red-400 border-red-500/20", label: "Cancelled" },
                    };
                    const statusInfo = statusMap[order.status || "pending"] || { cls: "bg-white/10 text-white", label: order.status };

                    return (
                      <div key={order.id} className="bg-[#1E1E1E] rounded-2xl p-5 border border-white/8 hover:border-white/15 transition-all flex flex-col group relative overflow-hidden">
                        {/* Status bar top */}
                        <div className={`absolute top-0 left-0 right-0 h-1 ${statusInfo.cls.split(' ')[0]}`} />
                        
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest block mb-1">Order ID</span>
                            <span className="text-[#FEF7F1] font-mono text-sm block">#{order.id.slice(0, 8).toUpperCase()}</span>
                          </div>
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${statusInfo.cls}`}>
                            {statusInfo.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-white/4 border border-white/5">
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#DAA28B]">
                            <User size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">
                              {order.tables?.table_number ? `Table ${order.tables.table_number}` : "Guest / Takeaway"}
                            </p>
                            <p className="text-[10px] text-white/50 flex items-center gap-1 mt-0.5">
                              <Clock size={10} /> 
                              {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>

                        <div className="flex-1 mb-5">
                          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                            Order Items <span className="bg-white/10 px-1.5 py-0.5 rounded text-white">{order.order_items?.length || 0}</span>
                          </p>
                          <div className="space-y-2">
                            {order.order_items?.slice(0, 3).map((item: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center text-sm">
                                <span className="text-white/70 overflow-hidden text-ellipsis whitespace-nowrap">
                                  <span className="text-[#DAA28B] font-bold mr-2">{item.quantity}x</span>
                                  {item.menu_items?.name || "Unknown Item"}
                                </span>
                                <span className="text-white font-medium ml-2">${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                            {(order.order_items?.length || 0) > 3 && (
                              <p className="text-xs text-white/30 italic mt-2">+ {(order.order_items?.length || 0) - 3} more items...</p>
                            )}
                          </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-white/8 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Total Amount</p>
                            <p className="text-xl font-bold text-[#BF5933]">${order.total_amount?.toFixed(2) || "0.00"}</p>
                          </div>
                          
                          {/* Quick Actions Dropdown wrapper */}
                          <div className="relative group/action">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-white transition-colors border border-white/10 group-hover/action:border-white/20">
                              Update Status <ChevronDown size={14} className="text-white/50" />
                            </button>
                            <div className="absolute right-0 bottom-full mb-2 w-40 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl overflow-hidden opacity-0 pointer-events-none group-hover/action:opacity-100 group-hover/action:pointer-events-auto transition-all translate-y-2 group-hover/action:translate-y-0 z-10 flex flex-col">
                              {["pending", "in_process", "served", "completed", "cancelled"].map((s) => (
                                <button
                                  key={s}
                                  onClick={() => handleUpdateOrderStatus(order.id, s)}
                                  className={`px-4 py-2.5 text-xs font-bold text-left transition-colors uppercase tracking-wider ${
                                                    order.status === s 
                                                      ? "bg-[#BF5933]/20 text-[#BF5933] cursor-default" 
                                                      : "text-white/60 hover:text-white hover:bg-white/5"
                                                  }`}
                                >
                                  {s.replace("_", " ")}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        ) : (
          // ── POS / SELECTION VIEW ──
          <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
            {/* Menu Side */}
            <div className="flex-1 flex flex-col gap-5 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1E1E1E] p-4 rounded-2xl border border-white/8 flex-shrink-0">
                <div className="relative flex-1 max-w-md">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-[#BF5933] transition-all"
                  />
                </div>
                {/* Category Dropdown mimicking styling */}
                <div className="relative">
                  <select
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                    className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-sm font-bold text-white outline-none focus:border-[#BF5933] uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <option value="all" className="bg-[#1A1A1A]">ALL CATEGORIES</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#1A1A1A]">{c.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 pr-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {loadingMenu ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="aspect-[4/5] bg-white/5 rounded-2xl animate-pulse" />
                    ))
                  ) : filteredMenu.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-white/30">No items available.</div>
                  ) : (
                    filteredMenu.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => addToCart(item)}
                        className="bg-[#1A1A1A] border border-white/5 hover:border-[#BF5933]/50 rounded-2xl overflow-hidden cursor-pointer group transition-all hover:shadow-xl hover:shadow-[#BF5933]/5 flex flex-col"
                      >
                        <div className="h-32 w-full relative bg-white/5 overflow-hidden">
                          <Image
                            src={item.image_url || "/assets/SaveGram.App_652044208_18096602171473296_7123593077978161000_n.jpg"}
                            alt={item.name}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                          <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                            <span className="text-white font-bold text-sm">${item.price}</span>
                          </div>
                        </div>
                        <div className="flex-1 p-3 flex flex-col justify-between">
                          <div>
                            <p className="font-semibold text-[#FEF7F1] text-sm line-clamp-2 leading-tight">
                              {item.name}
                            </p>
                            <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider truncate">
                              {item.categories?.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Cart Side */}
            <div className={`
              ${cart.length > 0 ? "h-[350px] lg:h-auto" : "h-[100px] lg:h-auto"}
              lg:w-[320px] xl:w-[380px] bg-[#1A1A1A] border border-white/8 rounded-[28px] flex flex-col overflow-hidden transition-all duration-300 flex-shrink-0
            `}>
              <div className="p-5 border-b border-white/5 bg-[#1E1E1E] flex items-center justify-between">
                <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                  <ShoppingCart size={18} className="text-[#DAA28B]" /> Current Order
                </h3>
                <span className="bg-white/10 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                  {cart.reduce((s, i) => s + i.qty, 0)} Items
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10">
                {cart.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-white/30">
                    <ShoppingCart size={40} className="mb-4 opacity-20" />
                    <p className="text-sm font-medium">Select items from the menu to add them to the cart</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex flex-col bg-white/4 p-3 rounded-xl border border-white/5 gap-3">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-semibold text-white/90 text-sm truncate">{item.name}</span>
                        <span className="font-bold text-[#DAA28B] whitespace-nowrap">${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-white/30">${item.price} each</span>
                        <div className="flex items-center gap-3 bg-black/30 rounded-lg p-1 border border-white/5">
                          <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded flex items-center justify-center bg-white/5 hover:bg-white/10 text-white transition-colors">-</button>
                          <span className="text-sm font-bold w-4 text-center text-white">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded flex items-center justify-center bg-[#BF5933]/20 hover:bg-[#BF5933]/40 text-[#BF5933] transition-colors">+</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="bg-[#1E1E1E] border-t border-white/5 p-5 flex flex-col gap-4">
                <div className="flex justify-between items-center text-white/60 text-sm">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-white/60 text-sm">
                  <span>Tax (0%)</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between items-center font-bold pb-2 border-b border-white/5">
                  <span className="text-lg text-white">Total</span>
                  <span className="text-2xl text-[#BF5933]">${cartTotal.toFixed(2)}</span>
                </div>
                <button
                  disabled={cart.length === 0}
                  onClick={() => setIsPinModalOpen(true)}
                  className="w-full py-4 bg-[#BF5933] text-white font-bold uppercase tracking-widest rounded-xl hover:bg-[#D4694A] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(191,89,51,0.3)] shadow-[#BF5933]/30"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── PIN Entry Modal ── */}
      <AnimatePresence>
        {isPinModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPinModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#181818] border border-white/10 rounded-[32px] p-8 max-w-sm w-full relative z-10 shadow-2xl">
              <button onClick={() => setIsPinModalOpen(false)} className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-white/5 rounded-full"><X size={16} /></button>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-heading font-bold text-white tracking-widest uppercase mb-2">Auth Required</h3>
                <p className="text-sm text-white/40">Enter 6-digit staff PIN</p>
              </div>
              
              <div className="mb-8">
                <input 
                  type="password" 
                  readOnly 
                  value={pin.padEnd(6, '•')} 
                  className="w-full text-center text-4xl tracking-[1em] font-mono bg-black/40 border border-white/5 py-4 rounded-xl text-[#BF5933] outline-none" 
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button key={num} onClick={() => setPin(p => p.length < 6 ? p + num : p)} className="py-4 bg-white/5 hover:bg-white/10 rounded-xl text-xl font-bold text-white transition-colors">{num}</button>
                ))}
                <button onClick={() => setPin("")} className="py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-bold uppercase text-xs tracking-wider">Clear</button>
                <button onClick={() => setPin(p => p.length < 6 ? p + 0 : p)} className="py-4 bg-white/5 hover:bg-white/10 rounded-xl text-xl font-bold text-white transition-colors">0</button>
                <button onClick={() => setPin(p => p.slice(0, -1))} className="py-4 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-white/50 text-xs uppercase tracking-wider transition-colors">Del</button>
              </div>
              
              <button 
                onClick={handlePinSubmit} 
                disabled={pin.length !== 6}
                className="w-full mt-6 py-4 bg-[#BF5933] text-white font-bold uppercase tracking-widest rounded-xl hover:bg-[#D4694A] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                Verify & Continue <ChevronRight size={18} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Payment Method Modal ── */}
      <AnimatePresence>
        {isPaymentModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPaymentModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#181818] border border-white/10 rounded-[32px] p-8 max-w-md w-full relative z-10 shadow-2xl">
              <button onClick={() => setIsPaymentModalOpen(false)} className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-white/5 rounded-full"><X size={16} /></button>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-heading font-bold text-white tracking-widest uppercase mb-2">Complete Payment</h3>
                <p className="text-3xl font-bold text-[#BF5933]">${cartTotal.toFixed(2)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                  onClick={() => setSelectedPayment("card")}
                  className={`p-6 rounded-2xl flex flex-col items-center justify-center gap-4 transition-all border-2 ${
                    selectedPayment === "card" 
                      ? "border-[#BF5933] bg-[#BF5933]/10 text-white" 
                      : "border-white/5 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <CreditCard size={32} className={selectedPayment === "card" ? "text-[#BF5933]" : ""} />
                  <span className="font-bold text-sm tracking-widest uppercase">Card</span>
                </button>
                <button
                  onClick={() => setSelectedPayment("cash")}
                  className={`p-6 rounded-2xl flex flex-col items-center justify-center gap-4 transition-all border-2 ${
                    selectedPayment === "cash" 
                      ? "border-[#BF5933] bg-[#BF5933]/10 text-white" 
                      : "border-white/5 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Banknote size={32} className={selectedPayment === "cash" ? "text-[#BF5933]" : ""} />
                  <span className="font-bold text-sm tracking-widest uppercase">Cash</span>
                </button>
              </div>

              <button 
                onClick={handleCheckout} 
                className="w-full py-4 bg-[#4ade80] text-[#111] font-bold uppercase tracking-widest rounded-xl hover:bg-[#22c55e] transition-all shadow-[0_0_20px_rgba(74,222,128,0.2)] flex items-center justify-center gap-2"
              >
                <Check size={18} /> Confirm Payment
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
