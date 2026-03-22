"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

const pillars = [
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 3 Q14 8 8 11 Q3 14 3 20 Q3 25 14 25 Q25 25 25 20 Q25 14 20 11 Q14 8 14 3Z" />
        <path d="M10 18 Q14 16 18 18" />
      </svg>
    ),
    label: "Grass-Fed Butter",
    sub: "100% sourced. No exceptions.",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="14" cy="14" r="11" />
        <polyline points="14 7 14 14 18 18" />
      </svg>
    ),
    label: "48-Hour Proof",
    sub: "Slow fermentation for depth.",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 22 Q4 10 14 6 Q24 10 24 22" />
        <path d="M9 22 Q9 15 14 12 Q19 15 19 22" />
        <line x1="4" y1="22" x2="24" y2="22" />
      </svg>
    ),
    label: "Small-Batch Only",
    sub: "15 croissants per tray. Always.",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 13 L12 20 L23 7" />
      </svg>
    ),
    label: "Zero Additives",
    sub: "Pure ingredients. Real flavour.",
  },
];

export default function FounderSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const imageScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.05, 1, 1.05],
  );
  const textY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  return (
    <section
      ref={sectionRef}
      id="our-story"
      className="relative overflow-hidden bg-[#FEF7F1]"
      style={{ position: "relative" }}
    >
      {/* ── Full-bleed image with parallax ── */}
      <div 
        className="relative h-[60vh] md:h-[75vh] overflow-hidden"
        style={{ position: "relative" }}
      >
        <motion.div
          style={{ y: imageY, scale: imageScale, position: "absolute", width: "100%", height: "100%" }}
          className="absolute inset-0 w-full h-full will-change-transform"
        >
          <Image
            src="/assets/SaveGram.App_625884423_18091789979473296_810128262769528983_n.jpg"
            alt="Hand-made pastry craftsmanship"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2D1B14]/20 via-transparent to-[#FEF7F1]" />
        </motion.div>

        {/* Floating badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="absolute bottom-12 left-8 md:left-16 glass rounded-[28px] p-6 max-w-[240px] shadow-2xl ring-rust"
        >
          <div className="w-10 h-10 rounded-xl bg-[#BF5933] flex items-center justify-center mb-4">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="#FEF7F1"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M10 2 L12 8 L18 8 L13 12 L15 18 L10 14 L5 18 L7 12 L2 8 L8 8 Z" />
            </svg>
          </div>
          <p className="font-heading text-xs uppercase font-bold text-[#BF5933] leading-none mb-2">
            Founded In
          </p>
          <p className="font-heading text-4xl font-bold text-[#2D1B14] leading-none">
            Dulce<span className="text-[#BF5933]">.</span>
          </p>
        </motion.div>

        {/* Right corner tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="absolute top-8 right-8 md:right-16 bg-[#BF5933] text-[#FEF7F1] px-6 py-3 rounded-full"
        >
          <p className="font-body text-[11px] font-bold uppercase tracking-[0.35em]">
            100% Artisanal
          </p>
        </motion.div>
      </div>

      {/* ── Story copy ── */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <motion.div style={{ y: textY }}>
          <p className="font-body text-[11px] font-bold uppercase tracking-[0.4em] text-[#BF5933]/60 mb-6">
            Our Story
          </p>
          <h2 className="font-heading text-6xl md:text-8xl font-bold uppercase text-[#2D1B14] leading-[1.0] -tracking-[0.02em] mb-8">
            Made In
            <br />
            <span
              className="font-script lowercase text-[#BF5933] text-[80px] md:text-[100px]"
              style={{ display: "inline-block", transform: "rotate(2deg)" }}
            >
              ikoyi
            </span>
          </h2>
          <p className="font-body text-[16px] text-[#2D1B14]/55 leading-relaxed max-w-lg font-medium">
            Dulce began with one conviction: bread shouldn&apos;t merely be
            sustenance. Every batch we bake is a meditation on patience, craft,
            and the transformative power of real butter.
          </p>
          <p className="font-body text-[16px] text-[#2D1B14]/40 leading-relaxed max-w-lg font-medium mt-5">
            We don&apos;t chase trends. We honour techniques developed over
            centuries in French pâtisseries and adapted for the warm, vibrant
            soul of Lagos.
          </p>
        </motion.div>

        <div className="space-y-6">
          {pillars.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.08,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex items-center gap-6 group p-6 rounded-[24px] bg-white border border-[#BF5933]/8 hover:border-[#BF5933]/30 hover:shadow-[0_8px_32px_rgba(191,89,51,0.1)] transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-[18px] bg-[#BF5933]/8 group-hover:bg-[#BF5933] text-[#BF5933] group-hover:text-[#FEF7F1] flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-sm">
                {p.icon}
              </div>
              <div>
                <h4 className="font-heading text-lg font-bold uppercase text-[#2D1B14] leading-none mb-1">
                  {p.label}
                </h4>
                <p className="font-body text-sm text-[#2D1B14]/45 font-medium">
                  {p.sub}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Second parallax image strip ── */}
      <div className="grid grid-cols-3 h-[40vh] overflow-hidden gap-2 px-2 pb-2">
        {[
          "/assets/SaveGram.App_638289208_18093782288473296_5700725885681164176_n.jpg",
          "/assets/SaveGram.App_624775943_18091789988473296_1648485002755290713_n.jpg",
          "/assets/SaveGram.App_640384807_18094591409473296_167242608410445082_n.jpg",
        ].map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.8 }}
            className="relative rounded-[24px] overflow-hidden img-zoom w-full h-full min-h-[300px]"
            style={{ position: "relative" }}
          >
            <Image 
              src={src} 
              alt="" 
              fill 
              sizes="(max-width: 768px) 33vw, 30vw"
              className="object-cover" 
            />
            <div className="absolute inset-0 bg-[#2D1B14]/10 group-hover:bg-transparent transition" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
