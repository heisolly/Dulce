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
  const rotateImage = useTransform(scrollYProgress, [0, 1], ["0deg", "12deg"]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-screen min-h-[700px] md:min-h-[800px] bg-[#FEF7F1] overflow-hidden flex items-center justify-center p-0"
    >
      {/* ── Background Art & Atmospheric Glows ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
         {/* Elegant hand-written watermark texture */}
         <div className="absolute top-[15%] left-[-5%] w-[110%] flex flex-wrap gap-x-20 gap-y-12 opacity-[0.02] select-none text-[#BF5933] font-script text-[clamp(80px,10vw,140px)] leading-none -rotate-2">
           {Array.from({ length: 30 }).map((_, i) => <span key={i}>dulce cafe</span>)}
         </div>

         {/* Cinematic Ambient Glows */}
         <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] bg-[#E2A654]/10 rounded-full blur-[180px]" />
         <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-[#BF5933]/5 rounded-full blur-[150px]" />
      </div>

      <div className="w-full max-w-[1550px] mx-auto px-6 md:px-12 xl:px-20 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] items-center relative z-10 h-full mt-10 md:mt-20 lg:mt-0">
        
        {/* ════ LEFT SIDE: THE PROMISE ════ */}
        <motion.div 
          style={{ y: yText }} 
          className="flex flex-col items-start justify-center text-left pt-12 lg:pt-0"
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 1, delay: 0.2, ease: "circOut" }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="w-12 h-[1px] bg-[#BF5933]" />
            <span className="font-heading text-[#BF5933] text-[10px] md:text-[13px] uppercase tracking-[0.5em] font-black">
              Artisanal Bakery & Cafe
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <h1 className="font-heading text-[#2D1B14] text-[clamp(54px,8vw,120px)] leading-[0.9] tracking-[-0.03em] font-black mb-6">
               <span className="block">Discover</span>
               <div className="flex items-center gap-4 md:gap-8 mt-2 md:mt-4">
                 <span 
                   className="text-[#BF5933] text-[clamp(65px,10vw,150px)] lowercase normal-case italic translate-y-[-10%] inline-block h-[0.9em]"
                   style={{ fontFamily: "'Pacifico', cursive" }}
                 >
                   Taste
                 </span>
                 <span className="block">Perfection</span>
               </div>
            </h1>
            
            {/* Soft decorative accent under perfection */}
            <div className="absolute -bottom-4 left-0 w-32 h-[2px] bg-[#BF5933]/20" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1, delay: 0.5 }}
            className="font-body text-[#2D1B14]/70 text-lg md:text-xl lg:text-2xl max-w-lg mt-8 mb-12 leading-relaxed"
          >
            Freshly made. Beautifully served. <br className="hidden md:block"/> 
            Designed for those who seek the <span className="text-[#2D1B14] font-bold">extraordinary</span>.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-wrap items-center gap-8"
          >
            <Link 
              href="/reservations" 
              className="px-12 py-6 bg-[#2D1B14] text-white rounded-full font-heading font-black text-[11px] uppercase tracking-[0.4em] hover:bg-[#BF5933] transition-all duration-500 shadow-[0_20px_40px_rgba(45,27,20,0.2)] hover:shadow-[0_25px_50px_rgba(191,89,51,0.3)] hover:-translate-y-1 active:scale-95 group flex items-center gap-4"
            >
              Reserve a Table
              <ArrowUpRightIcon />
            </Link>
          </motion.div>
        </motion.div>

        {/* ════ RIGHT SIDE: THE CINEMATIC DISH ════ */}
        <div className="relative h-full flex items-center justify-center lg:justify-end py-10 lg:py-0">
           
           {/* Interactive Floating Leaves */}
           <FloatingElement delay={0.2} x="10%" y="-20%" rotate={-45} scale={1.2}>
              <div className="w-16 h-16 md:w-24 md:h-24 opacity-[0.4] filter blur-[1px] brightness-[0.8]">
                 <Image src="/assets/Heroimg/Leaf.png" alt="" fill className="object-contain" />
              </div>
           </FloatingElement>

           <FloatingElement delay={0.8} x="-20%" y="30%" rotate={15} scale={0.8}>
              <div className="w-20 h-20 md:w-32 md:h-32 opacity-[0.3] filter blur-[2px]">
                 <Image src="/assets/Heroimg/Leaf.png" alt="" fill className="object-contain" />
              </div>
           </FloatingElement>

           {/* Main Dish Showcase */}
           <motion.div 
             style={{ y: yImage, rotate: rotateImage }}
             initial={{ opacity: 0, scale: 0.8, rotate: -20, x: 100 }}
             animate={{ opacity: 1, scale: 1, rotate: 0, x: 0 }}
             transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
             className="relative w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] lg:w-[600px] lg:h-[600px] xl:w-[750px] xl:h-[750px] z-10"
           >
              <Image 
                src="/assets/Heroimg/Dishes.png" 
                alt="Signature Dish" 
                fill 
                className="object-contain drop-shadow-[0_60px_100px_rgba(0,0,0,0.25)] hover:scale-105 transition-transform duration-1000" 
                priority 
              />
           </motion.div>
           
           {/* Radiance Glow */}
           <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 0.6 }} 
             transition={{ duration: 3 }}
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-radial from-[#BF5933]/20 via-transparent to-transparent rounded-full blur-[120px] pointer-events-none"
           />
        </div>

      </div>
      
      {/* ── Scroll Ritual ── */}
      <motion.div 
         initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
         className="absolute bottom-10 left-12 hidden lg:flex flex-col items-center gap-4 z-30"
      >
         <span className="font-heading text-[9px] uppercase tracking-[0.6em] text-[#2D1B14]/40 rotate-90 translate-y-[-20px]">Scroll</span>
         <div className="w-[1px] h-20 bg-[#2D1B14]/10 relative overflow-hidden">
            <motion.div 
              animate={{ y: ["-100%", "100%"] }} 
              transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
              className="absolute top-0 left-0 w-full h-1/2 bg-[#BF5933]"
            />
         </div>
      </motion.div>

    </section>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
      <path d="M7 17L17 7M17 7H7M17 7V17" />
    </svg>
  );
}

function FloatingElement({ children, x, y, rotate, scale, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, x, y, rotate, scale }}
      transition={{ duration: 2, delay }}
      className="absolute top-1/2 left-1/2 z-20 pointer-events-none"
    >
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [rotate, rotate + 10, rotate]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
