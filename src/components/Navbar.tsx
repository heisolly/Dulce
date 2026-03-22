"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { usePathname } from "next/navigation";

/** Custom SVG icons */
const CartIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <line x1="3" x2="21" y1="6" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const MenuBars = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <line x1="4" y1="8" x2="20" y2="8" />
    <line x1="4" y1="16" x2="16" y2="16" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <line x1="8" y1="8" x2="24" y2="24" />
    <line x1="24" y1="8" x2="8" y2="24" />
  </svg>
);

const navLinks = [
  { name: "Menu", href: "/menu", subtitle: "Artisanal Bakes & Coffee" },
  { name: "Our Story", href: "/#our-story", subtitle: "The Golden Process" },
  { name: "Location", href: "/#locations", subtitle: "The Hidden Sanctuary" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (sidebarOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [sidebarOpen]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      {/* ── 1. Absolute Top Header ──────────────── */}
      <nav className="absolute top-0 left-0 right-0 z-40 bg-transparent py-4 mt-2">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div 
              className="relative w-40 sm:w-52 h-14 sm:h-20 group-hover:scale-[1.03] transition-transform duration-500 overflow-hidden"
              style={{ 
                position: "relative", 
                height: "64px", 
                width: "208px",
                display: "block"
              }}
            >
              <Image
                src="/assets/logo.png"
                alt="Dulce Logo"
                fill
                sizes="(max-width: 768px) 160px, 208px"
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Center Links - Luxury DM Sans */}
          <div className="hidden md:flex items-center gap-14">
            {navLinks.map((l) => (
              <Link
                key={l.name}
                href={l.href}
                className="font-body text-[13px] uppercase tracking-[0.1em] font-bold text-[#2D1B14]/80 hover:text-[#BF5933] transition-colors duration-400 relative group/link"
              >
                {l.name}
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-[#BF5933] transition-all duration-400 group-hover/link:w-[60%]" />
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            <button
              onClick={toggleCart}
              className="relative flex justify-center items-center w-10 h-10 rounded-full text-[#2D1B14] hover:text-[#BF5933] transition-transform duration-300 hover:-translate-y-0.5"
            >
              <CartIcon />
              {totalItems > 0 && (
                <span className="absolute -top-0 -right-0 bg-[#BF5933] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setSidebarOpen(true)}
              className="hidden md:flex items-center justify-center bg-[#2D1B14] text-[#FEF7F1] px-7 py-2.5 rounded-full font-heading uppercase tracking-[0.15em] text-[12px] font-semibold transition-all duration-400 shadow-[0_5px_15px_rgba(45,27,20,0.1)] hover:bg-[#BF5933] hover:shadow-[0_8px_25px_rgba(191,89,51,0.25)] hover:-translate-y-0.5"
            >
              Menu
            </button>
            
            {/* Mobile Hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden flex justify-center items-center w-10 h-10 rounded-full bg-[#2D1B14] text-[#FEF7F1] shadow-md active:scale-95 transition-transform"
            >
              <MenuBars />
            </button>
          </div>
        </div>
      </nav>

      {/* ── 2. Scroll-Triggered Floating Nav Pill ──────────────── */}
      <AnimatePresence>
        {isScrolled && !sidebarOpen && (
          <motion.div
            initial={{ y: -40, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -40, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-6 right-6 lg:right-12 z-[60] flex items-center gap-3 backdrop-blur-2xl bg-white/80 p-2 rounded-full shadow-[0_20px_50px_rgba(45,27,20,0.12)] border border-white/50"
          >
            <button
              onClick={toggleCart}
              className="relative flex justify-center items-center w-11 h-11 rounded-full hover:bg-black/5 text-[#2D1B14] transition-all"
            >
              <CartIcon />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-[#BF5933] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setSidebarOpen(true)}
              className="group flex items-center gap-3 bg-[#2D1B14] text-white hover:bg-[#BF5933] transition-colors px-7 py-3 rounded-full shadow-md"
            >
              <span className="font-heading font-bold text-xs uppercase tracking-widest">
                Explore
              </span>
              <MenuBars />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 3. Luxury Sidebar Overlay ──────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-[100] bg-[#2D1B14]/60 backdrop-blur-md cursor-pointer"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 250 }}
              className="fixed top-0 right-0 bottom-0 w-full md:w-[500px] bg-[#2D1B14] z-[110] shadow-2xl flex flex-col pt-12 pr-10 pl-16 pb-12 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-16">
                <span className="font-body text-[11px] font-medium uppercase tracking-[0.4em] text-[#DAA28B]">
                  Navigation
                </span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-white/50 hover:text-[#DAA28B] hover:rotate-90 transition-all duration-500"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="flex flex-col gap-8 flex-1">
                {navLinks.map((l, i) => (
                  <motion.div
                    key={l.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="group"
                  >
                    <Link
                      href={l.href}
                      onClick={() => setSidebarOpen(false)}
                      className="block"
                    >
                      <h3 className="font-heading text-6xl md:text-7xl font-bold tracking-tight text-white group-hover:text-[#BF5933] transition-all duration-500 mb-2">
                        {l.name}
                      </h3>
                      <p className="font-body text-sm font-medium text-white/30 group-hover:text-[#DAA28B] transition-colors">
                        {l.subtitle}
                      </p>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="pt-12 border-t border-white/5 mt-12">
                <p className="font-heading text-lg font-bold uppercase text-white mb-2">
                  Dulce
                </p>
                <p className="font-body text-xs text-white/40 leading-relaxed max-w-[240px] font-medium mb-8">
                  Tucked behind Slashpoint Supermarket, Ikoyi. Baked fresh every
                  four hours.
                </p>

                <Link
                  href="/menu"
                  onClick={() => setSidebarOpen(false)}
                  className="inline-flex items-center gap-4 bg-[#BF5933] text-white px-10 py-5 rounded-full font-heading font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-[#2D1B14] transition-all"
                >
                  Reserve Table
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
