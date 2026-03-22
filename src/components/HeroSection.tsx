"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const rotateImage = useTransform(scrollYProgress, [0, 1], ["0deg", "15deg"]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-[100dvh] bg-[#FFF8F3] overflow-hidden flex pt-[140px] md:pt-[160px] pb-10 xl:pt-[180px] lg:pb-0"
    >
      {/* ── Subtle Background Watermark & Glows ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
         {/* Faint repeating watermark text mimicking the reference design */}
         <div className="absolute top-10 left-[-10%] w-[120%] flex flex-wrap gap-8 opacity-[0.03] select-none text-[#BF5933] font-script text-8xl leading-none -rotate-3">
           {Array.from({ length: 40 }).map((_, i) => <span key={i}>dulce cafe</span>)}
         </div>
         <div className="absolute top-1/2 left-[-10%] w-[120%] flex flex-wrap gap-8 opacity-[0.03] select-none text-[#BF5933] font-script text-8xl leading-none -rotate-3">
           {Array.from({ length: 40 }).map((_, i) => <span key={i}>dulce cafe</span>)}
         </div>
         {/* Soft glow behind the text to enhance the cream tone */}
         <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-white rounded-full blur-[150px]" />
      </div>

      <div className="w-full max-w-[1450px] mx-auto px-6 md:px-12 xl:px-16 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] h-full relative z-10 gap-10 lg:gap-0">
        
        {/* ════ LEFT SIDE: TYPOGRAPHY & BUTTONS ════ */}
        <motion.div 
          style={{ y: yText }} 
          className="flex flex-col items-start justify-start xl:pr-10 w-full"
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4 mb-6 lg:mb-8"
          >
            <div className="w-8 h-[1px] bg-[#BF5933]" />
            <span className="font-heading text-[#BF5933] text-[10px] md:text-[12px] uppercase tracking-[0.4em] font-bold">
              Artisanal Bakery
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="font-luxury text-[#2D1B14] text-[48px] sm:text-[60px] md:text-[80px] lg:text-[90px] xl:text-[110px] leading-[0.95] tracking-[-0.02em] mb-6 flex flex-col items-start w-full"
          >
             <span>Discover</span>
             <span className="flex items-center gap-4 lg:gap-6 mt-2">
               <span className="font-script text-[#BF5933] italic font-light text-[60px] sm:text-[85px] md:text-[100px] lg:text-[120px] xl:text-[140px] leading-[0.7] pt-2 lg:pt-4">Taste</span>
             </span>
             <span className="mt-2">Perfection</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-body text-[#2D1B14]/70 text-[15px] md:text-[17px] lg:text-[18px] max-w-[500px] leading-[1.8] mb-10 lg:mb-14 font-medium"
          >
            Experience an artisanal hideaway serving elegant, handcrafted plates and rich delicacies. A stunning symphony of flavors thoughtfully composed in every bite.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8"
          >
            <Link 
              href="/menu" 
              className="relative overflow-hidden bg-[#BF5933] text-white px-10 py-4 rounded-full font-heading text-[11px] uppercase tracking-[0.25em] font-bold transition-all duration-300 shadow-[0_10px_30px_rgba(191,89,51,0.25)] hover:bg-[#DAA28B] hover:text-[#2D1B14] hover:shadow-[0_15px_35px_rgba(191,89,51,0.4)] hover:-translate-y-1"
            >
               Explore Menu
            </Link>
            
            <Link 
              href="/reservations" 
              className="flex items-center gap-3 font-heading text-[11px] uppercase tracking-[0.2em] font-bold text-[#2D1B14]/70 hover:text-[#BF5933] transition-colors duration-300 group"
            >
               Reserve A Table
               <svg 
                 width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" 
                 className="transform transition-transform duration-300 group-hover:translate-x-1"
               >
                 <path d="M5 12h14M12 5l7 7-7 7"/>
               </svg>
            </Link>
          </motion.div>
        </motion.div>

        {/* ════ RIGHT SIDE: LUXURY IMAGE SHOWCASE ════ */}
        <motion.div 
           className="relative w-full h-[40vh] sm:h-[50vh] lg:h-full min-h-[400px] flex items-center justify-center lg:justify-end xl:mt-[-50px]"
        >
           <motion.div 
             style={{ y: yImage, rotate: rotateImage }}
             initial={{ opacity: 0, scale: 0.9, rotate: -15, x: 50 }}
             animate={{ opacity: 1, scale: 1, rotate: 0, x: 0 }}
             transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
             className="relative w-[130%] h-[130%] sm:w-[120%] sm:h-[120%] lg:w-[150%] lg:h-[110%] xl:w-[160%] xl:translate-x-16"
           >
              <Image 
                src="/assets/Heroimg/Dishes.png" 
                alt="Signature Dish" 
                fill 
                className="object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.15)] scale-110 lg:scale-125 xl:scale-[1.35]" 
                priority 
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
           </motion.div>
           
           {/* Floating warm ambient glow right behind the plate to pop it */}
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ duration: 2, delay: 1 }}
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] lg:w-[600px] lg:h-[600px] bg-[#E2A654]/20 rounded-full blur-[100px] pointer-events-none z-[-1]"
           />
        </motion.div>

      </div>
      
      {/* ── Scroll Line Indicator ── */}
      <motion.div 
         initial={{ opacity: 0 }} 
         animate={{ opacity: 1 }} 
         transition={{ delay: 1.5, duration: 1 }}
         className="absolute bottom-6 left-1/2 -translate-x-1/2 lg:left-12 lg:translate-x-0 flex flex-col items-center lg:items-start gap-3 z-30"
      >
         <div className="w-[1px] h-16 bg-[#2D1B14]/10 relative overflow-hidden hidden lg:block">
            <motion.div 
               animate={{ y: [0, 64, 64] }} 
               transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
               className="absolute top-0 left-0 w-full h-[50%] bg-[#BF5933]"
            />
         </div>
      </motion.div>
    </section>
  );
}
