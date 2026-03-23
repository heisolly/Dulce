"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { usePathname } from "next/navigation";
import { ShoppingBag, X, Instagram, Mail, ArrowUpRight } from "lucide-react";

/* ── NAV LINKS WITH VERIFIED PREVIEW IMAGES ── */
const navLinks = [
  { 
    name: "The Menu", 
    href: "/menu", 
    subtitle: "Artisanal Bakes & Coffee",
    preview: "/assets/Heroimg/Platters.png" 
  },
  { 
    name: "Reservations", 
    href: "/reservations", 
    subtitle: "Secure Your Table",
    preview: "/assets/Heroimg/Dishes.png" 
  },
  { 
    name: "Journal", 
    href: "/blog", 
    subtitle: "Stories & Insights",
    preview: "/assets/Heroimg/Drinks.png" 
  },
  { 
    name: "Contact", 
    href: "/contact", 
    subtitle: "Say Hello",
    preview: "/assets/Heroimg/Snacks.png" 
  },
  { 
    name: "Our Story", 
    href: "/#our-story", 
    subtitle: "The Golden Process",
    preview: "/assets/Heroimg/Dessert.png" 
  },
];

/* ── CUSTOM MORPHING HAMBURGER ── */
const MorphingTrigger = ({ onClick, isDark = true }: { onClick: () => void; isDark?: boolean }) => (
  <button
    onClick={onClick}
    className="group relative flex items-center justify-center w-10 h-10 focus:outline-none"
  >
    <div className={`absolute inset-0 border rounded-full scale-0 group-hover:scale-100 transition-transform duration-700 ${isDark ? "border-[#B55B3A]/20" : "border-white/20"}`} />
    <div className="relative w-6 h-[12px] flex flex-col justify-between items-end overflow-hidden">
      <motion.div 
        className={`h-[1.5px] rounded-full ${isDark ? "bg-[#2D1B14]" : "bg-[#FEF7F1]"}`}
        animate={{ width: "100%" }}
        whileHover={{ x: -4 }}
        style={{ width: "24px" }}
      />
      <motion.div 
        className={`h-[1.5px] rounded-full ${isDark ? "bg-[#2D1B14]" : "bg-[#FEF7F1]/60"}`}
        animate={{ width: "60%" }}
        whileHover={{ x: -2, width: "100%" }}
        style={{ width: "14px" }}
      />
    </div>
  </button>
);

export default function Navbar() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const totalItems = useCartStore((s) => s.totalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (sidebarOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [sidebarOpen]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      {/* ── 1. The Integrated Hero Header (Transparent) ── */}
      <div 
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled ? "opacity-0 -translate-y-32" : "opacity-100 translate-y-0"
        }`}
      >
        <div className="max-w-[1700px] mx-auto px-6 md:px-12 h-24 md:h-32 flex items-center justify-between pointer-events-auto">
          
          {/* Left Nav (PC) */}
          <div className="flex-1 hidden md:flex items-center gap-8 lg:gap-14">
            {["The Menu", "Reservations"].map((name) => {
              const href = name === "The Menu" ? "/menu" : "/reservations";
              return (
                <Link
                  key={name}
                  href={href}
                  className={`font-heading text-[10px] md:text-[12px] uppercase tracking-[0.5em] font-black transition-all duration-500 hover:text-[#B55B3A] ${
                    pathname === href ? "text-[#B55B3A]" : "text-[#2D1B14]"
                  }`}
                >
                  {name}
                </Link>
              );
            })}
          </div>

          {/* Centered Logo (INCREASED SIZE) */}
          <Link href="/" className="px-4 md:px-16 group">
            <div className="relative w-[180px] md:w-[280px] h-[60px] md:h-[90px] transition-transform duration-700 group-hover:scale-105">
              <Image src="/assets/logo.png" alt="Dulce Logo" fill sizes="280px" className="object-contain" priority />
            </div>
          </Link>

          {/* Right Nav (PC) */}
          <div className="flex-1 flex items-center justify-end gap-6 md:gap-10">
            <div className="hidden xl:flex items-center gap-12 lg:gap-14 mr-10">
              {["Journal", "Contact"].map((name) => {
                const href = name === "Journal" ? "/blog" : "/contact";
                return (
                  <Link
                    key={name}
                    href={href}
                     className={`font-heading text-[11px] md:text-[12px] uppercase tracking-[0.5em] font-black transition-all duration-500 hover:text-[#B55B3A] ${
                      pathname === href ? "text-[#B55B3A]" : "text-[#2D1B14]"
                    }`}
                  >
                    {name}
                  </Link>
                )
              })}
            </div>

            {/* Action Group */}
            <div className="flex items-center gap-4 md:gap-8 pl-4 md:pl-8 border-l border-[#2D1B14]/10">
              <button onClick={toggleCart} className="relative group text-[#2D1B14] hover:text-[#B55B3A] transition-colors">
                <ShoppingBag size={22} strokeWidth={2.5} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#B55B3A] text-white text-[8px] font-black w-5 h-5 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>
              <MorphingTrigger onClick={() => setSidebarOpen(true)} isDark={true} />
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. The Floating Scrolled Trigger Overlay ── */}
      <AnimatePresence>
        {isScrolled && !sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 50 }}
            className="fixed top-6 right-6 z-[70]"
          >
            <div className="p-4 bg-[#2D1B14] rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10 group cursor-pointer" onClick={() => setSidebarOpen(true)}>
               <MorphingTrigger onClick={() => {}} isDark={false} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 3. The Fully Responsive Side Navbar ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[200] bg-[#150C09] overflow-hidden flex flex-col md:flex-row"
          >
            {/* Split Image Section (PC Only) */}
            <div className="hidden md:block relative w-[35%] lg:w-[40%] h-full border-r border-white/5 overflow-hidden">
               <AnimatePresence mode="wait">
                 <motion.div
                    key={hoveredIndex || "default"}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 1.2, ease: "circOut" }}
                    className="absolute inset-0"
                 >
                    <Image 
                      src={hoveredIndex !== null ? navLinks[hoveredIndex].preview : navLinks[0].preview} 
                      alt="Preview" 
                      fill 
                      className="object-cover opacity-60 transition-all duration-[2s]" 
                    />
                 </motion.div>
               </AnimatePresence>
               <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#150C09]" />
            </div>

            {/* Content Section (Mobile & PC) */}
            <div className="relative z-20 flex-1 flex flex-col h-full overflow-y-auto">
               
               {/* Mobile Image Layer */}
               <div className="absolute inset-0 md:hidden pointer-events-none opacity-20">
                  <Image src={hoveredIndex !== null ? navLinks[hoveredIndex].preview : navLinks[0].preview} alt="" fill className="object-cover" />
                  <div className="absolute inset-0 bg-[#150C09]/80" />
               </div>

               {/* Header Area */}
               <div className="flex items-center justify-between p-8 md:p-12">
                  <Link href="/" onClick={() => setSidebarOpen(false)} className="relative block h-[40px] w-[140px] md:h-[50px] md:w-[160px]">
                    <Image src="/assets/logo.png" alt="Dulce" fill className="object-contain filter brightness-[100]" />
                  </Link>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:bg-[#B55B3A] hover:text-white hover:border-[#B55B3A] transition-all duration-700 group hover:rotate-90"
                  >
                    <X size={24} />
                  </button>
               </div>

               {/* Navigation Links Area - COMPACT VERTICAL LAYOUT */}
               <div className="flex-1 px-8 md:px-20 py-4 flex flex-col justify-start gap-4 md:gap-6 lg:gap-8">
                 {navLinks.map((l, i) => (
                   <motion.div
                     key={l.name}
                     initial={{ opacity: 0, x: 50 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: 0.1 + i * 0.05 }}
                     onMouseEnter={() => setHoveredIndex(i)}
                     onMouseLeave={() => setHoveredIndex(null)}
                   >
                     <Link
                       href={l.href}
                       onClick={() => setSidebarOpen(false)}
                       className="group inline-flex flex-col items-start"
                     >
                        <div className="flex items-baseline gap-4 md:gap-6">
                           <span 
                             className="text-white/20 group-hover:text-[#B55B3A] transition-all duration-700 leading-tight block select-none"
                             style={{ 
                               fontFamily: "'Pacifico', cursive",
                               fontSize: "clamp(30px, 4.5vw, 68px)"
                             }}
                           >
                             {l.name}
                           </span>
                           <ArrowUpRight className="text-[#B55B3A] opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500" size={20} />
                        </div>
                        <p className="font-heading text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white/5 group-hover:text-white/40 transition-all duration-1000 group-hover:tracking-[0.6em]">
                          {l.subtitle}
                        </p>
                     </Link>
                   </motion.div>
                 ))}
               </div>

               {/* Footer Rituals Area */}
               <div className="p-8 md:p-12 border-t border-white/5 bg-[#150C09]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="flex flex-col gap-1">
                        <p className="font-heading text-[9px] font-black uppercase tracking-[0.5em] text-[#B55B3A]/60">Divine Inquiries</p>
                        <a href="tel:07049162291" className="font-heading text-2xl md:text-3xl font-black text-white hover:text-[#B55B3A] transition-colors leading-none">070 491 62291</a>
                     </div>
                     <div className="flex items-center gap-6">
                        <a href="https://instagram.com/dulcecafeng" target="_blank" className="text-white/20 hover:text-white transition-all transform hover:rotate-12">
                           <Instagram size={24} />
                        </a>
                        <a href="mailto:hello@dulcecafe.ng" className="text-white/20 hover:text-white transition-all transform hover:-rotate-12">
                           <Mail size={24} />
                        </a>
                        <span className="font-heading text-[8px] font-black uppercase tracking-[0.4em] text-white/10">Instagram Ritual</span>
                     </div>
                  </div>
               </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
