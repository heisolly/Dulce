"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  { id: "Dishes", label: "Dishes", iconSrc: "/assets/Heroimg/Dishes.png", delay: 0.5, top: "10%", right: "5%" },
  { id: "Dessert", label: "Dessert", iconSrc: "/assets/Heroimg/Dessert.png", delay: 0.6, top: "30%", right: "-2%" },
  { id: "Drinks", label: "Drinks", iconSrc: "/assets/Heroimg/Drinks.png", delay: 0.7, top: "50%", right: "-5%" },
  { id: "Platter", label: "Platter", iconSrc: "/assets/Heroimg/Platters.png", delay: 0.8, top: "70%", right: "-2%" },
  { id: "Snacks", label: "Snacks", iconSrc: "/assets/Heroimg/Snacks.png", delay: 0.9, top: "90%", right: "5%" },
];

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState("Dishes");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yText = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "15%"]), { stiffness: 60, damping: 20 });
  const yImage = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "8%"]), { stiffness: 50, damping: 20 });
  const rotateImage = useTransform(scrollYProgress, [0, 1], ["0deg", "12deg"]);

  // Define the dynamic map directly from our list
  const activeHeroImage = CATEGORIES.find(c => c.id === activeCategory)?.iconSrc || "/assets/Heroimg/Dishes.png";

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[88vh] xl:min-h-[96vh] bg-[#FFFBF8] pt-[100px] md:pt-[120px] pb-8 overflow-hidden"
    >
      {/* ── Decorative pattern (Top Left) ── */}
      <div className="absolute top-20 left-8 opacity-20 pointer-events-none">
         <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className="rotate-12">
             <path d="M10 10c2 4 6 2 8 0 M20 30c-2 4-6 2-8 0 M40 10c2 4 6 2 8 0 M50 30c-2 4-6 2-8 0 M10 50c2 4 6 2 8 0 M30 50c2 4 6 2 8 0 M30 20c-2 4-6 2-8 0" stroke="#BF5933" strokeWidth="2.5" strokeLinecap="round"/>
         </svg>
      </div>

      {/* ── Decorative pattern (Bottom Right) ── */}
      <div className="absolute bottom-10 right-10 opacity-20 pointer-events-none rotate-[200deg]">
         <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
             <path d="M10 10c2 4 6 2 8 0 M20 30c-2 4-6 2-8 0 M40 10c2 4 6 2 8 0 M50 30c-2 4-6 2-8 0 M10 50c2 4 6 2 8 0 M30 50c2 4 6 2 8 0 M30 20c-2 4-6 2-8 0 M45 45c-2 4-6 2-8 0" stroke="#BF5933" strokeWidth="2.5" strokeLinecap="round"/>
         </svg>
      </div>

      <div className="w-full max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-4 items-center relative z-10 px-6 md:px-12">
        {/* ════ LEFT SIDE: TEXT & BUTTONS ════ */}
        <motion.div style={{ y: yText }} className="flex flex-col items-start lg:pr-5 z-30 pt-4 pb-8">
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-heading font-black text-[50px] sm:text-[65px] md:text-[75px] lg:text-[85px] leading-[1.05] tracking-[-0.03em] text-[#2D1B14] mb-4"
          >
            <div className="flex flex-col">
              <span className="capitalize">We Serve The</span>
              <span className="capitalize flex items-end">
                <span className="font-script lowercase text-[70px] sm:text-[90px] md:text-[100px] lg:text-[110px] text-[#BF5933] italic normal-case leading-[0.7] -mb-2">Taste</span>
                {" "}<span className="ml-[10px]">You</span>
              </span>
              <span className="capitalize">Love</span>
            </div>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body text-[#2D1B14]/70 text-[14px] md:text-[16px] font-medium max-w-[480px] leading-[1.7] mb-8"
          >
            This is an artisanal hideaway which typically serves handcrafted plates, rich delicacies, in addition to light refreshments such as fresh baked goods or snacks. Elevating the standard of culinary perfection.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4"
          >
            {/* Primary Solid Button */}
            <Link
              href="/menu"
              className="bg-[#DFA651] text-[#2D1B14] px-9 py-4 rounded-full font-body font-bold text-[14px] shadow-[0_12px_30px_rgba(223,166,81,0.35)] hover:bg-[#c99242] hover:shadow-[0_15px_35px_rgba(223,166,81,0.45)] hover:-translate-y-1 transition-all duration-300 active:scale-95"
            >
              Explore Food
            </Link>

            {/* Secondary Outline Search Button */}
            <button
              className="group flex items-center gap-3 bg-white border border-[#DFA651]/40 text-[#2D1B14] px-8 py-3.5 rounded-full font-body font-bold text-[14px] hover:border-[#DFA651] hover:shadow-lg transition-all duration-300 active:scale-95"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-[#2D1B14]">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              Search
            </button>
          </motion.div>
        </motion.div>

        {/* ════ RIGHT SIDE: CONCENTRIC CIRCLES & PLATE ════ */}
        <motion.div
           style={{ y: yImage }}
           className="relative w-full h-[350px] sm:h-[400px] lg:h-[60vh] xl:h-[65vh] flex items-center justify-center z-10"
        >
          {/* Concentric rings matching exactly the screenshot style */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.5 }}
              className="absolute w-[360px] h-[360px] md:w-[500px] md:h-[500px] lg:w-[650px] lg:h-[650px] rounded-full border-[1.5px] border-[#2D1B14]/[0.04]"
            />
            <motion.div
               initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.5, delay: 0.2 }}
               className="absolute w-[260px] h-[260px] md:w-[350px] md:h-[350px] lg:w-[480px] lg:h-[480px] rounded-full border-[1.5px] border-[#2D1B14]/[0.06]"
            />
          </div>

          {/* Semicircle Orbiting category tags (Desktop Only) */}
          <div className="absolute inset-0 pointer-events-none hidden lg:block z-30">
            {CATEGORIES.map((cat) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: cat.delay }}
                onMouseEnter={() => setActiveCategory(cat.id)}
                className={`absolute flex items-center gap-3 pl-1.5 py-1.5 pr-5 rounded-full shadow-[0_12px_24px_rgba(45,27,20,0.08)] cursor-pointer pointer-events-auto transition-all duration-300 ${activeCategory === cat.id ? "bg-[#BF5933] scale-110 shadow-[0_15px_30px_rgba(191,89,51,0.3)] z-40" : "bg-white hover:scale-105"}`}
                style={{ right: cat.right, top: cat.top }}
              >
                 <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-sm shrink-0">
                    <Image src={cat.iconSrc} alt={cat.label} width={32} height={32} className="object-cover w-full h-full" />
                 </div>
                 <span className={`font-heading font-black text-[11px] uppercase tracking-wider transition-colors ${activeCategory === cat.id ? "text-white" : "text-[#2D1B14]"}`}>
                   {cat.label}
                 </span>
              </motion.div>
            ))}
          </div>

          <motion.div
            style={{ rotate: rotateImage }}
            className="relative w-[100%] h-[100%] lg:w-[105%] lg:h-[105%] lg:translate-x-[-8%] z-20"
          >
             <AnimatePresence mode="wait">
               <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, scale: 0.8, rotate: -25 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 25 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 80, damping: 15 }}
                  className="absolute inset-0 filter drop-shadow-[0_45px_75px_rgba(0,0,0,0.12)]"
               >
                 <Image
                    src={activeHeroImage}
                    alt={`${activeCategory} Signature Dish`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 75vw"
                    className="object-contain drop-shadow-2xl"
                    priority
                 />
               </motion.div>
             </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
