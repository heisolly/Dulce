"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, CreditCard, CheckCircle2, MessageSquare, Star } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatNaira, initiatePaystackPayment } from "@/lib/paystack";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * CheckoutModal for Golden Crust.
 * Features the playful brand palette, Fredoka/Nunito typography, and Paystack integration.
 * Updated with the new Rust/Cream palette (#BF5933, #FEF7F1, #DAA28B).
 */
export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, totalPrice, orderType, clearCart, closeCart } = useCartStore();
  
  const [step, setStep] = useState<"details" | "processing" | "success">("details");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  const subtotal = totalPrice();
  const deliveryFee = orderType === "delivery" ? 2500 : 0;
  const total = subtotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("processing");

    initiatePaystackPayment({
      amount: total,
      email: formData.email,
      name: formData.name,
      phone: formData.phone,
      onSuccess: (ref) => {
        setStep("success");
        setTimeout(() => {
          clearCart();
          onClose();
          closeCart();
        }, 6000);
      },
      onClose: () => {
        setStep("details");
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          {/* Backdrop Overlay Detail blur highlight decor */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#BF5933]/60 backdrop-blur-md"
          />

          {/* Modal Header Details Content Content detail decor highlight */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="relative bg-[#FEF7F1] max-w-2xl w-full rounded-[64px] shadow-[0_32px_64px_rgba(191,89,51,0.25)] overflow-hidden flex flex-col max-h-[90vh] border-8 border-[#BF5933]/5"
          >
            {/* Header Content Detail Title highlight */}
            <div className="p-10 border-b-4 border-dashed border-[#BF5933]/5 flex items-center justify-between bg-white/40">
              <h2 className="text-4xl font-heading text-[#BF5933] uppercase leading-none tracking-tighter pt-1">
                {step === "success" ? "Confirmed" : "CHECKOUT"}
              </h2>
              {step !== "processing" && (
                <button 
                  onClick={onClose}
                  className="p-3 hover:bg-[#BF5933]/5 rounded-full transition-colors group"
                >
                  <X size={28} className="text-[#BF5933]/40 group-hover:text-[#BF5933] transition-colors" />
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-10 md:p-16">
              {step === "details" && (
                <form onSubmit={handleSubmit} className="space-y-12">
                  {/* Order Total Detail Highlight Section Promo highlight detail highlight */}
                  <div className="bg-white p-10 rounded-[48px] border-4 border-[#BF5933]/5 shadow-xl space-y-8 relative overflow-hidden group">
                    <div className="flex justify-between items-end border-b-2 border-dashed border-[#BF5933]/10 pb-8">
                      <div>
                        <p className="text-[10px] font-heading font-black uppercase tracking-[0.4em] text-[#DAA28B] mb-3">Grand Total</p>
                        <p className="text-5xl font-heading font-black text-[#BF5933] leading-none tracking-tighter group-hover:scale-105 transition-transform origin-left">{formatNaira(total)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-heading font-black uppercase tracking-[0.4em] text-[#BF5933]/30 mb-3">Ritual Type</p>
                        <p className="text-sm font-heading font-black text-[#BF5933] uppercase tracking-widest">{orderType.replace("-", " ")}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-[#BF5933]/30 text-[10px] font-heading font-black uppercase tracking-[0.3em]">
                      <Lock size={14} strokeWidth={3} /> Securely processed via Paystack
                    </div>

                    {/* Decorative Background Icon */}
                    <div className="absolute -top-6 -right-6 opacity-5 text-[#BF5933] rotate-12">
                       <Star size={120} strokeWidth={0.5} />
                    </div>
                  </div>

                  {/* Customer Information detail layout highlight details section detail check */}
                  <div className="space-y-10">
                    <h3 className="text-xs font-heading font-black uppercase tracking-[0.4em] text-[#BF5933]/30">Your Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                        <label className="text-[10px] font-heading font-black uppercase tracking-[0.3em] text-[#BF5933]/50 ml-4">Full Name</label>
                        <input
                          required
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Baker's Name"
                          className="w-full bg-white border-4 border-[#BF5933]/5 rounded-[24px] p-5 text-sm font-body font-bold text-[#BF5933] focus:ring-8 focus:ring-[#BF5933]/5 focus:border-[#BF5933]/20 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-heading font-black uppercase tracking-[0.3em] text-[#BF5933]/50 ml-4">WhatsApp</label>
                        <input
                          required
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="080 0000 0000"
                          className="w-full bg-white border-4 border-[#BF5933]/5 rounded-[24px] p-5 text-sm font-body font-bold text-[#BF5933] focus:ring-8 focus:ring-[#BF5933]/5 focus:border-[#BF5933]/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-heading font-black uppercase tracking-[0.3em] text-[#BF5933]/50 ml-4">Email Address</label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="ritual@goldencrust.com"
                        className="w-full bg-white border-4 border-[#BF5933]/5 rounded-[24px] p-5 text-sm font-body font-bold text-[#BF5933] focus:ring-8 focus:ring-[#BF5933]/5 focus:border-[#BF5933]/20 outline-none transition-all"
                      />
                    </div>

                    {orderType === "delivery" && (
                      <div className="space-y-3">
                        <label className="text-[10px] font-heading font-black uppercase tracking-[0.3em] text-[#BF5933]/50 ml-4">Delivery Address</label>
                        <textarea
                          required
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          placeholder="House No, Street Name..."
                          rows={3}
                          className="w-full bg-white border-4 border-[#BF5933]/5 rounded-[24px] p-5 text-sm font-body font-bold text-[#BF5933] focus:ring-8 focus:ring-[#BF5933]/5 focus:border-[#BF5933]/20 outline-none transition-all resize-none"
                        />
                      </div>
                    )}

                    <div className="space-y-3">
                      <label className="text-[10px] font-heading font-black uppercase tracking-[0.3em] text-[#BF5933]/50 ml-4">Instructions (Optional)</label>
                      <input
                        type="text"
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        placeholder="Allergies, door codes, etc."
                        className="w-full bg-white border-4 border-[#BF5933]/5 rounded-[24px] p-5 text-sm font-body font-bold text-[#BF5933] focus:ring-8 focus:ring-[#BF5933]/5 focus:border-[#BF5933]/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-8 bg-[#BF5933] text-[#FEF7F1] rounded-full font-heading text-xl font-black uppercase tracking-widest flex items-center justify-center gap-4 hover:translate-y-[-4px] active:scale-95 transition-all shadow-[0_16px_32px_rgba(191,89,51,0.25)]"
                  >
                    <CreditCard size={22} strokeWidth={3} /> Place Order
                  </button>
                </form>
              )}

              {step === "processing" && (
                <div className="py-24 flex flex-col items-center justify-center text-center space-y-10">
                  <div className="relative">
                    <div className="w-24 h-24 border-8 border-[#BF5933]/10 border-t-[#BF5933] rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Lock size={32} className="text-[#BF5933]" strokeWidth={3} />
                    </div>
                  </div>
                  <div className="space-y-5">
                    <h4 className="text-4xl font-heading text-[#BF5933] uppercase leading-none tracking-tighter">Securing your treats...</h4>
                    <p className="text-base font-body font-bold text-[#B15E3E]/50 max-w-sm mx-auto italic">Please stay with us while we process your secure ritual payment via Paystack.</p>
                  </div>
                </div>
              )}

              {step === "success" && (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-12">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 10, stiffness: 100 }}
                    className="w-40 h-40 bg-[#BF5933]/10 text-[#BF5933] rounded-full flex items-center justify-center shadow-inner"
                  >
                    <CheckCircle2 size={84} strokeWidth={1} />
                  </motion.div>
                  
                  <div className="space-y-5">
                    <h4 className="text-5xl font-heading text-[#BF5933] uppercase leading-none tracking-tighter">Your Golden Moment is near!</h4>
                    <p className="font-body text-xl font-bold text-[#B15E3E]/60 leading-relaxed max-w-md mx-auto italic">
                      Thank you for choosing Golden Crust, {formData.name.split(" ")[0]}. 
                      Our artisanal bakers are already preheating the oven for you.
                    </p>
                  </div>

                  <div className="bg-white p-10 rounded-[48px] border-4 border-[#BF5933]/5 shadow-xl w-full divide-y-4 divide-dashed divide-[#BF5933]/5 space-y-8">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-[11px] font-heading font-black uppercase tracking-[0.4em] text-[#BF5933]/30">Order Reference</span>
                      <span className="text-base font-heading font-black text-[#BF5933]">CRUST-{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between items-center pt-8 pb-2">
                      <span className="text-[11px] font-heading font-black uppercase tracking-[0.4em] text-[#BF5933]/30">Estimated Prep Time</span>
                      <span className="text-base font-heading font-black text-[#BF5933]">25 - 45 MINS</span>
                    </div>
                  </div>

                  <a 
                    href={`https://wa.me/2347000000000?text=Hi Golden Crust! I just placed an order (Ref: CRUST-REF). Can't wait for the magic!`}
                    target="_blank"
                    className="flex items-center gap-4 text-[#DAA28B] font-heading text-xs font-black uppercase tracking-[0.3em] hover:gap-6 transition-all group"
                  >
                    Track via WhatsApp <MessageSquare size={20} fill="currentColor" className="group-hover:scale-110 transition-transform" />
                  </a>
                  
                  <p className="text-[10px] font-heading font-black text-[#BF5933]/20 uppercase tracking-[0.4em] mt-16 animate-pulse">
                    Returning to sanctuary in moments...
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
