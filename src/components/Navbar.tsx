"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { usePathname } from "next/navigation";

/** Custom SVG icons */
const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <line x1="3" x2="21" y1="6" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const MenuBars = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="4" y1="7" x2="20" y2="7" />
    <line x1="4" y1="17" x2="14" y2="17" />
  </svg>
);

const CloseIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="6" y1="6" x2="22" y2="22" />
    <line x1="22" y1="6" x2="6" y2="22" />
  </svg>
);

const navLinks = [
  { name: "Menu", href: "/menu", subtitle: "Artisanal Bakes & Coffee", emoji: "🥐" },
  { name: "Reservations", href: "/reservations", subtitle: "Secure Your Table", emoji: "🕯️" },
  { name: "Blog", href: "/blog", subtitle: "Stories & Insights", emoji: "✍️" },
  { name: "Contact", href: "/contact", subtitle: "Say Hello", emoji: "💌" },
  { name: "Our Story", href: "/#our-story", subtitle: "The Golden Process", emoji: "🌿" },
];
export default function Navbar() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);

  useEffect(() => {
    if (sidebarOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [sidebarOpen]);
  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      {/* ── Universal Floating Navbar ──────────────── */}
      <div className="fixed top-0 left-0 right-0 z-50 pt-5 px-4 md:px-8 pointer-events-none">
        <motion.nav
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[1400px] mx-auto pointer-events-auto"
        >
          <div className="flex items-center justify-between bg-[#2D1B14] rounded-2xl md:rounded-[20px] px-6 lg:px-8 py-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-white/5">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0 group">
              <div className="relative group-hover:scale-105 transition-transform duration-500" style={{ height: "30px", width: "100px", position: "relative" }}>
                <Image src="/assets/logo.png" alt="Dulce Logo" fill sizes="100px" className="object-contain" priority />
              </div>
            </Link>

            {/* Center links */}
            <div className="hidden lg:flex items-center gap-8 xl:gap-10">
              {navLinks.map((l) => {
                const isActive = pathname === l.href;
                return (
                  <Link
                    key={l.name}
                    href={l.href}
                    className={`font-body text-[11px] xl:text-[12px] uppercase tracking-[0.14em] font-bold transition-all duration-300 relative group/link ${
                      isActive ? "text-[#FEF7F1]" : "text-[#FEF7F1]/50 hover:text-[#FEF7F1]"
                    }`}
                  >
                    {l.name}
                    <span 
                      className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-[1.5px] bg-[#BF5933] transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover/link:w-[40%]"
                      }`} 
                    />
                  </Link>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 lg:gap-6">
              {/* Bag Icon */}
              <button onClick={toggleCart} className="relative text-[#FEF7F1]/60 hover:text-[#FEF7F1] transition-all flex items-center justify-center p-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#BF5933] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* RESERVE button */}
              <Link
                href="/reservations"
                className="hidden sm:flex items-center justify-center bg-[#BF5933] text-[#FEF7F1] px-5 py-2.5 rounded-[12px] font-heading text-[10px] xl:text-[11px] font-black uppercase tracking-[0.18em] hover:bg-[#DAA28B] hover:text-[#2D1B14] transition-all"
              >
                RESERVE
              </Link>

              {/* Hamburger */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex flex-col items-center justify-center w-10 h-10 rounded-full border border-white/10 text-[#FEF7F1]/70 hover:bg-white/5 hover:text-[#FEF7F1] hover:border-white/30 transition-all gap-[4px]"
              >
                <div className="w-3.5 h-[1.5px] bg-currentColor rounded" />
                <div className="w-3.5 h-[1.5px] bg-currentColor rounded" />
              </button>
            </div>
          </div>
        </motion.nav>
      </div>

      {/* ── 4. Ultra-Luxury Full-Screen Menu Overlay ──────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] bg-[#150C09] flex flex-col md:flex-row"
          >
            {/* Left side – decorative image (hidden on mobile) */}
            <div className="hidden md:block relative w-1/2 h-full overflow-hidden bg-[#2D1B14]">
              <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <Image
                  src="/assets/SaveGram.App_639497783_18093782330473296_5334377840370386583_n.jpg"
                  alt="Dulce Atmosphere"
                  fill
                  className="object-cover opacity-60"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#150C09]/80 via-[#150C09]/20 to-transparent" />
                <div className="absolute inset-0 bg-[#BF5933]/10 mix-blend-overlay" />
              </motion.div>
              
              <div className="absolute bottom-16 left-16 z-10 max-w-sm">
                <p className="font-heading text-[10px] font-black uppercase tracking-[0.5em] text-[#DAA28B]/80 mb-4">Golden Crust</p>
                <p className="font-luxury text-3xl text-[#FEF7F1] leading-snug">
                  An exclusive hideaway. <br />
                  <span className="font-script lowercase text-[#DAA28B] text-4xl italic">Hand-laminated</span> precision.
                </p>
              </div>
            </div>

            {/* Right side – Menu links */}
            <div className="relative w-full md:w-1/2 h-full flex flex-col px-8 md:px-16 xl:px-24">
              
              {/* Close button & Logo top bar */}
              <div className="flex items-center justify-between pt-10 pb-4">
                <Link href="/" onClick={() => setSidebarOpen(false)} className="relative block md:hidden" style={{ height: "40px", width: "120px" }}>
                  <Image src="/assets/logo.png" alt="Dulce" fill className="object-contain" />
                </Link>
                <div className="hidden md:block" /> {/* spacer */}

                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-[#DAA28B] hover:bg-[#DAA28B]/10 hover:rotate-90 transition-all duration-500 group"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Main links list */}
              <div className="flex-1 flex flex-col justify-center gap-6 sm:gap-8">
                {navLinks.map((l, i) => (
                  <motion.div
                    key={l.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setSidebarOpen(false)}
                      className="group flex flex-col self-start transition-all"
                    >
                      <div className="flex items-baseline gap-4 md:gap-6">
                        <span className="font-script text-2xl md:text-3xl text-[#DAA28B] italic opacity-60 group-hover:opacity-100 transition-opacity">
                          0{i + 1}
                        </span>
                        <span className="font-luxury text-[clamp(40px,6vw,72px)] text-[#FEF7F1] group-hover:text-[#DAA28B] transition-colors leading-none tracking-tight">
                          {l.name}
                        </span>
                      </div>
                      <span className="font-heading text-[9px] md:text-[11px] uppercase tracking-[0.4em] text-white/30 ml-10 md:ml-14 mt-3 group-hover:text-white/60 transition-colors">
                        {l.subtitle}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Bottom footer area */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.7 }}
                className="pt-8 pb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-8 border-t border-white/5"
              >
                <div>
                  <p className="font-heading text-[10px] font-black uppercase tracking-[0.4em] text-[#DAA28B] mb-3">Reservations</p>
                  <a href="tel:07049162291" className="font-body text-white/70 hover:text-white transition-colors text-sm">
                    070 491 62291
                  </a>
                  <p className="font-body text-white/40 text-xs mt-1">Open daily 8AM – 8PM</p>
                </div>

                <div className="flex gap-4">
                  <a href="https://instagram.com/dulcecafeng" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-[#DAA28B] transition-colors font-heading text-[11px] uppercase tracking-widest font-black">
                    Instagram
                  </a>
                  <a href="mailto:hello@dulcecafe.ng" className="text-white/30 hover:text-[#DAA28B] transition-colors font-heading text-[11px] uppercase tracking-widest font-black">
                    Email
                  </a>
                </div>
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
