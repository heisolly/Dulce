"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

const testimonials = [
  {
    name: "Tega B.",
    role: "Regular Ritualist",
    text: "The churro cookies are quite literally the best thing I've put in my mouth in town. Pure bliss.",
    image: "/assets/SaveGram.App_639992183_18094591433473296_6428612442285326638_n.jpg",
    stars: 5,
  },
  {
    name: "Amina J.",
    role: "Local Artist",
    text: "Dulce is my sacred space. The vibe, the coffee, the croissants — it's high art.",
    image: "/assets/SaveGram.App_641279811_18094591385473296_2687015092613490888_n.jpg",
    stars: 5,
  },
  {
    name: "Emeka O.",
    role: "Designer",
    text: "Finally, a bakery that understands slow-living. The sourdough is worth every single kobo.",
    image: "/assets/SaveGram.App_641203665_18094591397473296_6077281244328795221_n.jpg",
    stars: 5,
  },
];

const StarRow = ({ n }: { n: number }) => (
  <div className="flex gap-1">
    {Array(n).fill(0).map((_, i) => (
      <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="#BF5933">
        <polygon points="7,0.5 8.8,5 13.5,5.4 10,8.6 11.1,13.3 7,10.8 2.9,13.3 4,8.6 0.5,5.4 5.2,5"/>
      </svg>
    ))}
  </div>
);

const QuoteIcon = () => (
  <svg width="48" height="36" viewBox="0 0 48 36" fill="none">
    <path d="M0 22.8C0 12.6 6.4 5.4 19.2 0L21.6 3.6C15.6 6 11.4 9.6 10.2 14.4C11.4 14.2 12.4 14 13.2 14C18 14 20.8 17 20.8 22C20.8 27.2 17.4 30.4 12 30.4C5 30.4 0 27 0 22.8ZM27.2 22.8C27.2 12.6 33.6 5.4 46.4 0L48 3.6C42 6 37.8 9.6 36.6 14.4C37.8 14.2 38.8 14 39.6 14C44.4 14 47.2 17 47.2 22C47.2 27.2 43.8 30.4 38.4 30.4C31.4 30.4 27.2 27 27.2 22.8Z" fill="currentColor"/>
  </svg>
);

export default function TestimonialSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#2D1B14] py-32">

      {/* Parallax warm grain bg */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none will-change-transform">
        <div className="absolute inset-0 bg-[url('/assets/SaveGram.App_625116915_18091789997473296_1570557760193326201_n.jpg')] bg-cover bg-center opacity-[0.06]" />
      </motion.div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-12 relative z-10">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-body text-[11px] font-bold uppercase tracking-[0.4em] text-[#DAA28B]/60 mb-6"
          >
            The Fan Club
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading text-6xl md:text-9xl font-bold uppercase text-[#FEF7F1] leading-[1.0] -tracking-[0.02em]"
          >
            They Came,<br />
            They{" "}
            <span className="font-script text-[#BF5933] normal-case lowercase" style={{ display: "inline-block", transform: "rotate(2deg)" }}>
              loved
            </span>{" "}
            it.
          </motion.h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22,1,0.36,1] }}
              whileHover={{ y: -10 }}
              className="relative bg-[#FEF7F1]/5 border border-[#FEF7F1]/8 rounded-[40px] p-10 flex flex-col gap-8 group hover:bg-[#FEF7F1]/8 transition-all duration-300"
            >
              {/* Quote icon */}
              <div className="text-[#BF5933]/30 group-hover:text-[#BF5933]/60 transition-colors">
                <QuoteIcon />
              </div>

              <p className="font-body text-[16px] text-[#FEF7F1]/70 leading-relaxed font-medium flex-1">
                "{t.text}"
              </p>

              <div className="border-t border-[#FEF7F1]/8 pt-8 flex items-center gap-4">
                {/* Avatar */}
                <div 
                  className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#BF5933]/20 shadow-lg shrink-0" style={{ position: "relative" }}
                >
                  <Image src={t.image} alt={t.name} fill className="object-cover grayscale" sizes="56px" />
                  <div className="absolute inset-0 bg-[#BF5933]/30 mix-blend-multiply" />
                </div>
                <div className="flex-1">
                  <h4 className="font-heading text-base font-bold uppercase text-[#FEF7F1] leading-none mb-1">{t.name}</h4>
                  <p className="font-body text-[11px] text-[#FEF7F1]/30 font-medium">{t.role}</p>
                </div>
                <StarRow n={t.stars} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom metric strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 grid grid-cols-3 divide-x divide-[#FEF7F1]/8 border border-[#FEF7F1]/8 rounded-[32px] overflow-hidden"
        >
          {[
            { value: "5,000+", label: "Daily Rituals" },
            { value: "4.9★", label: "Google Rating" },
            { value: "2019", label: "Founded" },
          ].map((m, i) => (
            <div key={i} className="py-10 text-center">
              <p className="font-heading text-4xl md:text-6xl font-bold text-[#FEF7F1] leading-none mb-2">{m.value}</p>
              <p className="font-body text-[11px] font-semibold uppercase tracking-[0.35em] text-[#FEF7F1]/30">{m.label}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
