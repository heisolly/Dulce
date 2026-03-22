"use client";

import React, { useState } from "react";
import { useCartStore, CartItem } from "@/store/cartStore";
import { formatNaira } from "@/lib/paystack";
import { motion, AnimatePresence } from "framer-motion";
import CheckoutModal from "@/components/CheckoutModal";

/* Custom SVGs */
const BagIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
    <line x1="3" x2="21" y1="6" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="4" y1="4" x2="18" y2="18"/><line x1="18" y1="4" x2="4" y2="18"/>
  </svg>
);
const MinusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="2" y1="7" x2="12" y2="7"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="7" y1="2" x2="7" y2="12"/><line x1="2" y1="7" x2="12" y2="7"/>
  </svg>
);
const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="2" y1="9" x2="16" y2="9"/><polyline points="10 3 16 9 10 15"/>
  </svg>
);

import { usePathname } from "next/navigation";

const SideCart = () => {
  const pathname = usePathname();
  const { isOpen: isCartOpen, closeCart, items, updateQuantity, removeItem, totalPrice, orderType, setOrderType } = useCartStore();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  if (pathname.startsWith("/admin")) return null;

  const subtotal = totalPrice();
  const deliveryFee = orderType === "delivery" ? 2500 : 0;
  const total = subtotal + deliveryFee;

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCart}
              className="fixed inset-0 z-[60] bg-[#2D1B14]/50 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 280 }}
              className="fixed top-0 right-0 h-full w-full max-w-[480px] z-[70] bg-[#FEF7F1] shadow-[−24px_0_80px_rgba(45,27,20,0.2)] flex flex-col"
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-[#BF5933]/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-[#BF5933] text-[#FEF7F1] rounded-2xl flex items-center justify-center">
                    <BagIcon />
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl font-bold text-[#2D1B14] uppercase leading-none">Your Order</h2>
                    <p className="font-body text-[11px] text-[#2D1B14]/35 font-medium mt-0.5">{items.length} item{items.length !== 1 ? "s" : ""} selected</p>
                  </div>
                </div>
                <button onClick={closeCart} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#BF5933]/8 text-[#2D1B14]/40 hover:text-[#2D1B14] transition-all">
                  <CloseIcon />
                </button>
              </div>

              {/* Order type tabs */}
              <div className="px-8 pt-5">
                <div className="bg-[#2D1B14]/5 p-1.5 rounded-2xl grid grid-cols-3 gap-1">
                  {(["pickup", "delivery", "dine-in"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setOrderType(type)}
                      className={`py-3 rounded-xl font-body text-[11px] font-bold uppercase tracking-wider transition-all duration-200 ${
                        orderType === type
                          ? "bg-[#BF5933] text-[#FEF7F1] shadow-md"
                          : "text-[#2D1B14]/40 hover:text-[#2D1B14]"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-4 opacity-40 py-20">
                    <div className="text-[80px] animate-wiggle">🛍️</div>
                    <p className="font-heading text-xl font-bold uppercase text-[#2D1B14]">Your order is empty</p>
                    <button onClick={closeCart} className="font-body text-sm font-semibold text-[#BF5933] underline underline-offset-4">
                      Browse the menu
                    </button>
                  </div>
                ) : (
                  items.map((cartItem: CartItem) => (
                    <motion.div
                      key={cartItem.cartId}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      className="relative flex items-center gap-4 bg-white rounded-[20px] p-4 border border-[#BF5933]/8"
                    >
                      {/* Emoji thumb */}
                      <div className="w-14 h-14 bg-[#FEF7F1] rounded-[16px] flex items-center justify-center text-3xl flex-shrink-0 border border-[#BF5933]/8">
                        {cartItem.item.emoji || "🥐"}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-heading text-base font-bold uppercase text-[#2D1B14] leading-tight truncate">
                            {cartItem.item.name}
                          </h4>
                          <button
                            onClick={() => removeItem(cartItem.cartId)}
                            className="text-[#2D1B14]/20 hover:text-[#BF5933] transition-colors flex-shrink-0 mt-0.5"
                          >
                            <CloseIcon />
                          </button>
                        </div>
                        <p className="font-body text-sm font-semibold text-[#BF5933] mt-0.5">
                          {formatNaira(cartItem.item.price + cartItem.modifierPrice)}
                        </p>

                        {/* Modifier tags */}
                        {Object.keys(cartItem.selectedModifiers).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {Object.values(cartItem.selectedModifiers).map((v, vi) => (
                              <span key={vi} className="font-body text-[9px] font-semibold uppercase tracking-wider bg-[#BF5933]/8 text-[#BF5933] px-2 py-0.5 rounded-full">
                                {String(v)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Qty controls */}
                      <div className="flex items-center gap-1 bg-[#BF5933]/6 rounded-xl p-1 flex-shrink-0">
                        <button
                          onClick={() => updateQuantity(cartItem.cartId, cartItem.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#BF5933] hover:bg-[#BF5933] hover:text-[#FEF7F1] transition-all"
                        >
                          <MinusIcon />
                        </button>
                        <span className="w-6 text-center font-heading text-sm font-bold text-[#2D1B14]">{cartItem.quantity}</span>
                        <button
                          onClick={() => updateQuantity(cartItem.cartId, cartItem.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#BF5933] hover:bg-[#BF5933] hover:text-[#FEF7F1] transition-all"
                        >
                          <PlusIcon />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer totals */}
              {items.length > 0 && (
                <div className="px-8 py-6 border-t border-[#BF5933]/10 bg-white/60 backdrop-blur-sm space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-body text-sm font-medium text-[#2D1B14]/50">Subtotal</span>
                      <span className="font-body text-sm font-semibold text-[#2D1B14]">{formatNaira(subtotal)}</span>
                    </div>
                    {orderType === "delivery" && (
                      <div className="flex justify-between items-center">
                        <span className="font-body text-sm font-medium text-[#2D1B14]/50">Delivery fee</span>
                        <span className="font-body text-sm font-semibold text-[#2D1B14]">{formatNaira(deliveryFee)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-3 border-t border-[#BF5933]/10">
                      <span className="font-heading text-base font-bold uppercase text-[#2D1B14]">Total</span>
                      <span className="font-heading text-2xl font-bold text-[#BF5933]">{formatNaira(total)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setCheckoutOpen(true)}
                    className="w-full bg-[#BF5933] text-[#FEF7F1] font-body text-base font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#B15E3E] active:scale-95 transition-all shadow-[0_12px_32px_rgba(191,89,51,0.25)]"
                  >
                    Checkout <ArrowIcon />
                  </button>

                  <p className="text-center font-body text-[10px] font-medium text-[#2D1B14]/25 uppercase tracking-wider">
                    Secure payment via Paystack
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </>
  );
};

export default SideCart;
