"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

const CATEGORIES = [
  {
    id: "coffee",
    label: "Coffee",
    tagline: "Single-origin, locally roasted",
    desc: "Sourced directly, roasted locally, and extracted perfectly. Our beans rotate seasonally to bring you the best espresso in town.",
    image:
      "/assets/SaveGram.App_625052143_18091790006473296_3199304665552739135_n.jpg",
    accent: "#BF5933",
  },
  {
    id: "bakery",
    label: "Bakery",
    tagline: "48-hour hand-laminated croissants",
    desc: "Layers of imported butter and patience. We fold, rest, and bake our pastries over three days for maximum flakiness.",
    image:
      "/assets/SaveGram.App_640004270_18093782342473296_3490771191939909153_n.jpg",
    accent: "#DAA28B",
  },
  {
    id: "brunch",
    label: "Brunch",
    tagline: "French pâtisserie meets West Africa",
    desc: "From savory tarts to hearty bowls, our brunch menu is designed to slow you down. Served fresh from open till sold out.",
    image:
      "/assets/SaveGram.App_641221621_18093782297473296_1139418546164141333_n.jpg",
    accent: "#B15E3E",
  },
  {
    id: "bread",
    label: "Bread",
    tagline: "Wild-yeast sourdough, real bakes",
    desc: "No commercial yeast. Just flour, water, salt, and time. Our sourdough boules have the thickest crust and airiest crumb.",
    image:
      "/assets/SaveGram.App_548895059_18076383830473296_2742508074210821941_n.jpg",
    accent: "#2D1B14",
  },
];

/* ── Individual Stacked Card ── */
function StackedCard({
  item,
  i,
  progress,
  range,
  targetScale,
}: {
  item: (typeof CATEGORIES)[0];
  i: number;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // When progressing through the range, scale down the card slightly
  const scale = useTransform(progress, range, [1, targetScale]);
  // And move it up slightly to stack behind the next card securely
  const topOffset = useTransform(progress, range, [0, -40]);

  return (
    <div
      ref={containerRef}
      className="h-screen w-full flex items-center justify-center sticky top-0"
    >
      <motion.div
        style={{
          scale,
          y: topOffset,
          top: `calc(10vh + ${i * 20}px)`,
          borderColor: item.accent,
        }}
        className="flex flex-col md:flex-row w-full max-w-[1000px] h-[70vh] max-h-[600px] bg-[#FEF7F1] rounded-[40px] overflow-hidden shadow-[0_40px_100px_rgba(45,27,20,0.4)] origin-top border-[8px] flex-shrink-0 relative z-0 mx-6"
      >
        {/* Left: Content */}
        <div className="flex-1 p-10 md:p-16 flex flex-col justify-center relative bg-[#FEF7F1]">
          <span className="font-heading text-[180px] font-bold text-[#BF5933]/5 uppercase leading-none absolute -bottom-10 -left-10 select-none">
            0{i + 1}
          </span>
          <div className="relative z-10 w-full">
            <p
              className="font-body text-[11px] font-bold uppercase tracking-[0.4em] mb-4"
              style={{ color: item.accent }}
            >
              {item.tagline}
            </p>
            <h3 className="font-heading text-5xl md:text-7xl font-bold uppercase text-[#2D1B14] leading-[0.95] mb-6">
              {item.label}
            </h3>
            <p className="font-body text-base text-[#2D1B14]/60 font-normal leading-relaxed max-w-sm mb-10">
              {item.desc}
            </p>
            <Link
              href={`/menu#${item.id}`}
              className="inline-flex items-center gap-3 font-body text-sm font-bold uppercase py-3 px-8 rounded-full border-2 transition-all hover:bg-[#2D1B14] hover:text-[#FEF7F1] hover:border-[#2D1B14]"
              style={{ borderColor: item.accent, color: item.accent }}
            >
              Explore Menu
            </Link>
          </div>
        </div>

        {/* Right: Image */}
        <div
          className="relative w-full h-[300px] md:h-[500px] overflow-hidden"
          style={{ position: "relative", minHeight: "300px", height: "100%", width: "100%" }}
        >
          <Image
            src={item.image}
            alt={item.label}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority={i === 0}
            loading={i === 0 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#FEF7F1]/20 hidden md:block" />
        </div>

        {/* Dim overlay that activates when cards stack beneath others */}
        <motion.div
          style={{ opacity: useTransform(progress, range, [0, 1]) }}
          className="absolute inset-0 bg-[#2D1B14]/40 pointer-events-none"
        />
      </motion.div>
    </div>
  );
}

export default function DailyLineupSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate scroll over the entire multi-screen height container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section className="bg-[#2D1B14] relative text-[#FEF7F1]">
      {/* ── Stacked Scroll Container ── */}
      <div 
        ref={containerRef}
        className="relative pb-32"
        style={{ height: `${CATEGORIES.length * 100 + 50}vh`, position: "relative" }}
      >
        {/* Intro text embedded in the flow at the very top */}
        <div className="absolute top-0 left-0 w-full h-screen flex flex-col items-center justify-center pointer-events-none z-0 px-6">
          <p className="font-body text-[11px] font-bold uppercase tracking-[0.4em] text-[#BF5933]/60 mb-5">
            The Daily Lineup
          </p>
          <h2 className="font-heading text-5xl md:text-8xl font-bold uppercase text-center leading-[1.0] -tracking-[0.02em] max-w-4xl text-[#FEF7F1]">
            Our Bakes.
            <br />
            <span
              className="font-script text-[#BF5933] normal-case lowercase text-[70px] md:text-[100px]"
              style={{ display: "inline-block", transform: "rotate(-2deg)" }}
            >
              your ritual.
            </span>
          </h2>
        </div>

        {/* Card Stack */}
        <div className="relative pt-[70vh]">
          {CATEGORIES.map((item, i) => {
            // Target scale gets progressively smaller for cards at the bottom of the stack
            const targetScale = 1 - (CATEGORIES.length - i) * 0.04;

            // Compute the scroll range dedicated to compressing THIS card.
            // When the scroll passes the card's active point, it starts squishing.
            const range: [number, number] = [i * (0.8 / CATEGORIES.length), 1];

            return (
              <StackedCard
                key={item.id}
                i={i}
                item={item}
                progress={scrollYProgress}
                range={range}
                targetScale={targetScale}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
