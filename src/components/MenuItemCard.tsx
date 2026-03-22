"use client";

import React, { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { formatNaira } from "@/lib/paystack";
import { motion, AnimatePresence } from "framer-motion";
import { MenuItem } from "@/data/menu";

/* ── Micro-icons ──────────────────────────────────────── */
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
    <line x1="7" y1="1" x2="7" y2="13" />
    <line x1="1" y1="7" x2="13" y2="7" />
  </svg>
);
const ChevronIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 2 9 6.5 3 11" />
  </svg>
);
const CloseIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="2" y1="2" x2="11" y2="11" />
    <line x1="11" y1="2" x2="2" y2="11" />
  </svg>
);
const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6">
    <path d="M6 10.5S1 7.3 1 4.2a2.6 2.6 0 0 1 5-.9 2.6 2.6 0 0 1 5 .9C11 7.3 6 10.5 6 10.5Z" />
  </svg>
);

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const [showCustomize, setShowCustomize]       = useState(false);
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, any>>({});
  const [added, setAdded]                        = useState(false);

  const addToCart = useCartStore((s) => s.addItem);
  const openCart  = useCartStore((s) => s.openCart);

  const handleAddToCart = () => {
    const cartModifiers: Record<string, string | boolean> = {};
    let extraPrice = 0;
    Object.entries(selectedModifiers).forEach(([key, opt]: [string, any]) => {
      cartModifiers[key] = opt.label ?? opt.value ?? String(opt);
      if (typeof opt.price === "number") extraPrice += opt.price;
    });
    addToCart(item, cartModifiers, extraPrice);
    openCart();
    setShowCustomize(false);
    setSelectedModifiers({});

    /* Flash feedback */
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const toggleModifier = (modId: string, option: any) => {
    setSelectedModifiers((prev) => {
      const next = { ...prev };
      if (next[modId]?.value === option.value) delete next[modId];
      else next[modId] = option;
      return next;
    });
  };

  const hasModifiers = !!item.modifiers?.length;

  return (
    <motion.article
      layout
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative bg-white rounded-[28px] overflow-hidden flex flex-col h-full border border-[#BF5933]/8 shadow-[0_2px_16px_rgba(45,27,20,0.06)] hover:shadow-[0_20px_56px_rgba(191,89,51,0.16)] hover:border-[#BF5933]/22 transition-all duration-500"
    >

      {/* ── Emoji / Image area ────────────────────────── */}
      <div className="relative h-48 bg-gradient-to-br from-[#FEF7F1] to-[#F5E8DC] flex items-center justify-center overflow-hidden">

        {/* Background decorative ring */}
        <div className="absolute w-36 h-36 rounded-full bg-[#BF5933]/5 blur-2xl" />

        {/* Emoji or Image */}
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <motion.span
            className="relative text-[90px] select-none z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 drop-shadow-sm"
            role="img"
            aria-label={item.name}
          >
            {item.emoji ?? "🥗"}
          </motion.span>
        )}

        {/* Chef's Pick badge */}
        {item.isFavorite && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#BF5933] text-[#FEF7F1] px-3 py-1.5 rounded-xl shadow-lg">
            <HeartIcon filled />
            <span className="font-heading text-[9px] font-black uppercase tracking-wider">
              Chef&apos;s Pick
            </span>
          </div>
        )}

        {/* Price tag — top right */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#BF5933] font-heading text-sm font-black rounded-xl px-3 py-1.5 shadow-sm border border-[#BF5933]/8">
          {formatNaira(item.price)}
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col p-6 gap-3">
        {/* Title */}
        <h3 className="font-heading text-lg font-black uppercase text-[#2D1B14] leading-tight tracking-tight group-hover:text-[#BF5933] transition-colors duration-300">
          {item.name}
        </h3>

        {/* Description */}
        <p className="font-body text-[13px] text-[#2D1B14]/45 leading-relaxed line-clamp-2 flex-1">
          {item.description}
        </p>

        {/* Modifier tags preview */}
        {hasModifiers && !showCustomize && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {item.modifiers!.map((mod) => (
              <span
                key={mod.id}
                className="font-body text-[10px] uppercase tracking-wider text-[#BF5933]/60 bg-[#BF5933]/6 px-2.5 py-1 rounded-lg font-semibold"
              >
                {mod.name}
              </span>
            ))}
          </div>
        )}

        {/* ── CTA / Customize area ── */}
        <div className="mt-2">
          <AnimatePresence mode="wait">
            {!showCustomize ? (
              <motion.button
                key="add"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                onClick={hasModifiers ? () => setShowCustomize(true) : handleAddToCart}
                className={[
                  "w-full flex items-center justify-center gap-2 font-heading text-[11px] font-black uppercase tracking-[0.3em] py-3.5 rounded-2xl transition-all duration-300 active:scale-95",
                  added
                    ? "bg-green-500 text-white shadow-[0_6px_24px_rgba(34,197,94,0.3)]"
                    : "bg-[#BF5933] text-[#FEF7F1] hover:bg-[#a84d2a] shadow-[0_8px_28px_rgba(191,89,51,0.28)] hover:shadow-[0_12px_36px_rgba(191,89,51,0.38)]",
                ].join(" ")}
              >
                {added ? (
                  <>
                    <span>✓</span>
                    <span>Added!</span>
                  </>
                ) : hasModifiers ? (
                  <>
                    <span>Customize</span>
                    <ChevronIcon />
                  </>
                ) : (
                  <>
                    <span>Add to Order</span>
                    <PlusIcon />
                  </>
                )}
              </motion.button>
            ) : (
              <motion.div
                key="customize"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {item.modifiers?.map((mod) => (
                  <div key={mod.id}>
                    <p className="font-heading text-[9px] font-black uppercase tracking-[0.4em] text-[#2D1B14]/35 mb-2.5">
                      {mod.name}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {mod.options.map((opt) => {
                        const active = selectedModifiers[mod.id]?.value === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => toggleModifier(mod.id, opt)}
                            className={[
                              "px-3.5 py-1.5 rounded-xl font-body text-[10px] font-bold uppercase tracking-wider border transition-all duration-200",
                              active
                                ? "bg-[#BF5933] text-[#FEF7F1] border-[#BF5933] shadow-md"
                                : "bg-transparent text-[#BF5933] border-[#BF5933]/20 hover:border-[#BF5933]/50 hover:bg-[#BF5933]/8",
                            ].join(" ")}
                          >
                            {opt.label}
                            {opt.price ? (
                              <span className="ml-1 opacity-60">+{formatNaira(opt.price)}</span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Confirm / Cancel */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => { setShowCustomize(false); setSelectedModifiers({}); }}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#2D1B14]/6 text-[#2D1B14]/40 hover:text-[#2D1B14]/70 hover:bg-[#2D1B14]/10 transition-all flex-shrink-0"
                  >
                    <CloseIcon />
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#BF5933] text-[#FEF7F1] font-heading text-[10px] font-black uppercase tracking-[0.3em] py-3 rounded-xl hover:bg-[#a84d2a] active:scale-95 transition-all duration-200 shadow-md"
                  >
                    Add to Order <PlusIcon />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.article>
  );
}
