"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useAnimationFrame,
} from "framer-motion";

/**
 * GallerySection — "Dome Gallery" inspired by a curved glass display.
 * Contains:
 *   1. 3D arc carousel (drag to rotate)
 *   2. Circular ingredient carousel (auto-rotates, hover to pause)
 *   3. Layered parallax reveal window for the "Hidden Gem" story
 */

/* ── Assets ─────────────────────────────── */
const DOME_IMAGES = [
  {
    src: "/assets/SaveGram.App_638319547_18093782306473296_5221783078591784523_n.jpg",
    label: "Courtyard",
  },
  {
    src: "/assets/SaveGram.App_616371694_18090083603473296_5371289776757257378_n.jpg",
    label: "Morning Light",
  },
  {
    src: "/assets/SaveGram.App_616456289_18090083612473296_1599402748258183382_n.jpg",
    label: "The Counter",
  },
  {
    src: "/assets/SaveGram.App_616502443_18090083576473296_6940413690354383994_n.jpg",
    label: "Craft Station",
  },
  {
    src: "/assets/SaveGram.App_617586919_18090083585473296_4720555195066062852_n.jpg",
    label: "The Ritual",
  },
  {
    src: "/assets/SaveGram.App_618470577_18090083594473296_6766641053246629226_n.jpg",
    label: "The Vibe",
  },
  {
    src: "/assets/SaveGram.App_515076141_18068786171473296_4827874835941814655_n.jpg",
    label: "Details",
  },
];

const INGREDIENTS = [
  {
    src: "/assets/SaveGram.App_548895059_18076383830473296_2742508074210821941_n.jpg",
    label: "Sourdough",
  },
  {
    src: "/assets/SaveGram.App_548930954_18076383908473296_530891266974199650_n.jpg",
    label: "Croissant",
  },
  {
    src: "/assets/SaveGram.App_549220985_18076383935473296_438797776633112488_n.jpg",
    label: "Coffee",
  },
  {
    src: "/assets/SaveGram.App_549408979_18076383926473296_7279655098346077939_n.jpg",
    label: "Salad",
  },
  {
    src: "/assets/SaveGram.App_548893247_18076383881473296_7059615792816616625_n.jpg",
    label: "Brunch",
  },
  {
    src: "/assets/SaveGram.App_548911578_18076383899473296_4880182499186018392_n.jpg",
    label: "Pastry",
  },
];

/* ── 3D Dome Carousel ────────────────────── */
function DomeCarousel() {
  const total = DOME_IMAGES.length;
  const [active, setActive] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const startDrag = useRef(0);

  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    // No-op for now, just tracking the swipe on up
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const delta = e.clientX - startX.current;
    if (Math.abs(delta) > 40) {
      const dir = delta < 0 ? 1 : -1;
      setActive((p) => (p + dir + total) % total);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center h-[480px] cursor-grab active:cursor-grabbing select-none overflow-visible"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {DOME_IMAGES.map((img, i) => {
        const offset = (i - active + total) % total;
        const normalized = offset > total / 2 ? offset - total : offset;
        // Arc: each position maps to an angle on the dome
        const angleStep = 38;
        const angle = normalized * angleStep;
        const rad = (angle * Math.PI) / 180;
        // Project onto a curved arc: x = radius * sin(angle), z = radius * cos(angle) - radius
        const radius = 600;
        const x = Math.sin(rad) * radius;
        const z = Math.cos(rad) * radius - radius;
        const scale = Math.max(0.55, 1 - Math.abs(normalized) * 0.14);
        const opacity = Math.max(0.2, 1 - Math.abs(normalized) * 0.28);
        const zIndex = 10 - Math.abs(normalized);
        const rotateY = -angle * 0.5;
        const isCenter = normalized === 0;

        return (
          <motion.div
            key={img.src}
            onClick={() => setActive(i)}
            animate={{
              x,
              scale,
              opacity,
              rotateY,
              filter: isCenter
                ? "blur(0px) brightness(1)"
                : `blur(${Math.abs(normalized) * 1.5}px) brightness(0.85)`,
            }}
            transition={{ type: "spring", stiffness: 180, damping: 26 }}
            style={{ zIndex, position: "absolute", perspective: 1000, width: 280, height: 380 }}
            className="cursor-pointer"
          >
            <div
              className={`relative w-[280px] h-[380px] overflow-hidden rounded-[36px] shadow-2xl transition-shadow duration-500 ${isCenter ? "shadow-[0_32px_80px_rgba(45,27,20,0.3)]" : ""}`}
              style={{ position: "relative" }}
            >
              <Image
                src={img.src}
                alt={img.label}
                fill
                sizes="280px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B14]/50 via-transparent to-transparent" />
              <motion.div
                initial={false}
                animate={{ opacity: isCenter ? 1 : 0, y: isCenter ? 0 : 12 }}
                className="absolute bottom-5 left-5 right-5"
              >
                <span className="font-heading text-lg font-bold uppercase text-[#FEF7F1] leading-none block">
                  {img.label}
                </span>
                <span className="font-body text-[10px] text-[#FEF7F1]/50 font-medium uppercase tracking-wider mt-1 block">
                  Dulce
                </span>
              </motion.div>
            </div>
          </motion.div>
        );
      })}

      {/* Edge hint arrows */}
      <button
        onClick={() => setActive((p) => (p - 1 + total) % total)}
        className="absolute left-2 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="#2D1B14"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="10 2 4 8 10 14" />
        </svg>
      </button>
      <button
        onClick={() => setActive((p) => (p + 1) % total)}
        className="absolute right-2 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="#2D1B14"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 2 12 8 6 14" />
        </svg>
      </button>
    </div>
  );
}

/* ── Circular carousel (ingredient spotlight) ─────────── */
function CircularCarousel() {
  const [angle, setAngle] = useState(0);
  const [paused, setPaused] = useState(false);
  const lastTime = useRef<number>(0);
  const total = INGREDIENTS.length;
  const radius = 220;
  const speed = 12; // degrees/sec

  useAnimationFrame((t) => {
    if (paused) {
      lastTime.current = t;
      return;
    }
    const dt = lastTime.current ? (t - lastTime.current) / 1000 : 0;
    lastTime.current = t;
    setAngle((a) => (a + speed * dt) % 360);
  });

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: radius * 2 + 160, height: radius * 2 + 160 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Track ring */}
      <div
        className="absolute rounded-full border-2 border-dashed border-[#BF5933]/15"
        style={{ width: radius * 2, height: radius * 2 }}
      />

      {INGREDIENTS.map((item, i) => {
        const itemAngle = ((i / total) * 360 + angle) % 360;
        const rad = ((itemAngle - 90) * Math.PI) / 180;
        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;
        // Items near the top/bottom get bigger
        const normAngle = (itemAngle + 90) % 360;
        const isCenter = normAngle < 40 || normAngle > 320;
        const scale = isCenter
          ? 1.2
          : 0.8 + 0.2 * Math.cos(((normAngle - 0) * Math.PI) / 180);

        return (
          <motion.div
            key={item.src}
            animate={{ x, y, scale }}
            transition={{ type: "tween", duration: 0 }}
            className="absolute flex flex-col items-center gap-2 cursor-pointer group"
            style={{ translateX: "-50%", translateY: "-50%" }}
          >
            <div
              className={`relative overflow-hidden rounded-full border-4 border-[#FEF7F1] shadow-xl transition-all duration-300 group-hover:border-[#BF5933] ${isCenter ? "w-[100px] h-[100px]" : "w-[72px] h-[72px]"}`}
              style={{ 
                position: "relative", 
                width: isCenter ? "100px" : "72px", 
                height: isCenter ? "100px" : "72px",
                display: "block"
              }}
            >
              <Image
                src={item.src}
                alt={item.label}
                fill
                sizes="(max-width: 768px) 72px, 100px"
                className="object-cover"
              />
              {isCenter && (
                <div className="absolute inset-0 ring-4 ring-[#BF5933]/30 rounded-full" />
              )}
            </div>
            {isCenter && (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-heading text-sm font-bold uppercase text-[#2D1B14] whitespace-nowrap"
              >
                {item.label}
              </motion.span>
            )}
          </motion.div>
        );
      })}

      {/* Center logo */}
      <div className="absolute w-24 h-24 rounded-full bg-[#BF5933] flex items-center justify-center shadow-2xl border-4 border-[#FEF7F1] z-10">
        <div className="text-center">
          <p className="font-heading text-base font-bold uppercase text-[#FEF7F1] leading-tight tracking-widest">
            Dulce
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Layered parallax reveal ("Hidden Gem") ─────────── */
function HiddenGemReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Image moves at 75% the speed of text (25% slower)
  const imgY  = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  return (
    <div
      ref={ref}
      className="relative h-[80vh] flex items-center overflow-hidden"
    >
      {/* Background image moves slower (parallax) */}
      <motion.div
        style={{ y: imgY, position: "absolute", width: "100%", height: "100%" }}
        className="absolute inset-0 w-full h-full min-h-[500px] lg:min-h-[700px] will-change-transform"
      >
        <Image
          src="/assets/SaveGram.App_625116915_18091789997473296_1570557760193326201_n.jpg"
          alt="The hidden gem"
          fill
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#2D1B14]/60" />
      </motion.div>

      {/* Cutout window — the text sits on top and moves at normal scroll speed */}
      <motion.div
        style={{ y: textY }}
        className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 w-full"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-body text-[11px] font-bold uppercase tracking-[0.4em] text-[#DAA28B]/80 mb-6"
        >
          A Hidden Gem
        </motion.p>
        <motion.h3
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading text-[clamp(52px,8vw,120px)] font-bold uppercase text-[#FEF7F1] leading-[0.9] -tracking-[0.02em] max-w-4xl"
        >
          Tucked In
          <br />
          <span
            className="font-script text-[#DAA28B] normal-case lowercase"
            style={{ display: "inline-block", transform: "rotate(2deg)" }}
          >
            ikoyi,
          </span>
          <br />
          Since 2019.
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-body text-[16px] text-[#FEF7F1]/65 leading-relaxed max-w-lg mt-8 font-normal"
        >
          Tucked entirely out of sight behind the hustle of Slashpoint
          Supermarket, there is no glowing neon sign guiding the way. Just an
          unmarked wooden door, the rich aroma of artisanal baking, and the
          quiet hum of a sun-drenched botanical sanctuary.
        </motion.p>
      </motion.div>
    </div>
  );
}

/* ── Main export ────────────────────────── */
export default function GallerySection() {
  return (
    <section id="gallery" className="bg-[#FEF7F1] overflow-hidden">
      {/* 1. Section header */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center mb-4"
        >
          <p className="font-body text-[11px] font-bold uppercase tracking-[0.4em] text-[#BF5933]/60 mb-5">
            The Vibe
          </p>
          <h2 className="font-heading text-6xl md:text-8xl font-bold uppercase text-[#2D1B14] leading-[1.0] -tracking-[0.02em] mb-5">
            Step Inside
            <br />
            <span
              className="font-script text-[#BF5933] normal-case lowercase text-[80px] md:text-[100px]"
              style={{ display: "inline-block", transform: "rotate(2deg)" }}
            >
              our world.
            </span>
          </h2>
          <p className="font-body text-[16px] text-[#2D1B14]/40 max-w-md font-medium">
            Drag to explore the courtyard, the counter, and every crafted corner
            of Dulce.
          </p>
        </motion.div>
      </div>

      {/* 2. Dome carousel */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex justify-center pb-16"
      >
        <DomeCarousel />
      </motion.div>

      {/* 3. Layered parallax "Hidden Gem" reveal */}
      <HiddenGemReveal />

      {/* 4. Circular carousel — ingredient spotlight */}
      <div className="bg-[#FEF7F1] py-24">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="font-body text-[11px] font-bold uppercase tracking-[0.4em] text-[#BF5933]/60 mb-4">
              What We Use
            </p>
            <h3 className="font-heading text-5xl md:text-7xl font-bold uppercase text-[#2D1B14] leading-[1.0] -tracking-[0.02em]">
              Ingredient
              <br />
              Spotlight
            </h3>
            <p className="font-body text-sm text-[#2D1B14]/35 font-medium mt-4">
              Hover to pause • Drag to explore
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <CircularCarousel />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
