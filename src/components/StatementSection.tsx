"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

/** Full-width "statement" quote break section with massive typography and a real asset */
export default function StatementSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const imgY  = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <section ref={ref} className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#BF5933]">

      {/* Parallax bg image */}
      <motion.div
        style={{ y: imgY, position: "absolute", width: "100%", height: "100%" }}
        className="absolute inset-0 w-full h-full will-change-transform pointer-events-none"
      >
        <Image
          src="/assets/SaveGram.App_625052143_18091790006473296_3199304665552739135_n.jpg"
          alt="Dulce craft"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#BF5933]/85" />
      </motion.div>

      {/* Decorative doodle circles */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full border border-[#FEF7F1]/8 pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full border border-[#FEF7F1]/8 pointer-events-none" />


      {/* Content */}
      <motion.div
        style={{ y: textY }}
        className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 w-full py-32"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-body text-[11px] font-bold uppercase tracking-[0.4em] text-[#FEF7F1]/50 mb-10"
        >
          Our Philosophy
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 1.0, ease: [0.22,1,0.36,1] }}
          className="font-heading text-[clamp(52px,9vw,140px)] font-bold uppercase text-[#FEF7F1] leading-[0.92] -tracking-[0.02em] max-w-4xl"
        >
          Life Is{" "}
          <span
            className="font-script text-[#DAA28B] normal-case lowercase"
            style={{ display: "inline-block", transform: "rotate(2deg)" }}
          >
            shorter
          </span>
          <br />Without<br />Good Butter.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="font-body text-[16px] text-[#FEF7F1]/60 leading-relaxed max-w-xl mt-12 font-medium"
        >
          &ldquo;We believe in three-day fermentations, single-origin beans, and the absolute magic of a warm, flaky croissant. Because when food is made slowly, with intention — you can taste the difference.&rdquo;
        </motion.p>

        {/* Process strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap gap-4 mt-16"
        >
          {["Slow ferment", "Hand-laminate", "Bake to order", "Serve warm"].map((step, i) => (
            <div key={i} className="flex items-center gap-3 bg-[#FEF7F1]/10 border border-[#FEF7F1]/15 px-5 py-3 rounded-full">
              <span className="w-6 h-6 rounded-full bg-[#FEF7F1] text-[#BF5933] flex items-center justify-center text-[10px] font-heading font-bold flex-shrink-0">
                {i + 1}
              </span>
              <span className="font-body text-[13px] font-semibold text-[#FEF7F1]/80 uppercase tracking-wider">{step}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
