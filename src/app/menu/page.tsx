"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { CATEGORIES, MENU_ITEMS, MenuItem } from "@/data/menu";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import MenuItemCard from "@/components/MenuItemCard";
import Footer from "@/components/Footer";

const supabase = createClient();

/* ─── Icon helpers ────────────────────────────────────────── */
const ArrowLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 9H3M3 9l5-5M3 9l5 5" />
  </svg>
);

const CATEGORY_META: Record<string, { icon: string; desc: string; color: string }> = {
  bakery:  { icon: "🥐", desc: "Hand-laminated pastries baked fresh every morning",        color: "#D4923A" },
  brunch:  { icon: "🍳", desc: "Weekend-worthy plates built for long, lazy mornings",      color: "#BF5933" },
  coffee:  { icon: "☕", desc: "Single-origin espresso and ceremonial-grade matcha",       color: "#7A4B35" },
};

const STATS = [
  { value: "7AM",  label: "Fresh Daily" },
  { value: "100%", label: "Hand-crafted" },
  { value: "18+",  label: "Signature Items" },
  { value: "★4.9", label: "Guest Rating" },
];

export default function MenuPage() {
  const [activeTab, setActiveTab]   = useState<string>("bakery");
  const [items, setItems]           = useState<MenuItem[]>(MENU_ITEMS);
  const [categories, setCategories] = useState<{ id: string; label: string; emoji?: string }[]>(Array.from(CATEGORIES));
  const [loading, setLoading]       = useState(false);
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY  = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOp = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  /* Try Supabase, fall back to static data */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      
      const { data: catData, error: catErr } = await supabase.from("categories").select("*");
      let catMap: Record<string, string> = {};
      
      if (catData && catData.length > 0) {
        // Build category lookup
        catData.forEach((c: any) => { catMap[c.id] = c.name.toLowerCase(); });
        setCategories(catData.map((c: any) => ({ id: c.name.toLowerCase(), label: c.name })));
        setActiveTab(catData[0]?.name.toLowerCase());
      }

      const { data: menuData } = await supabase.from("menu_items").select("*, categories(name)");
      if (menuData && menuData.length > 0) {
        setItems(
          menuData.map((item: any) => {
            const catName = item.categories?.name?.toLowerCase() || catMap[item.category_id] || "bakery";
            return {
              id:          item.id,
              name:        item.name,
              price:       item.price,
              description: item.description || "",
              category:    catName as any,
              emoji:       "✨",
              image_url:   item.image_url
            };
          })
        );
      }
      setLoading(false);
    };
    load();
  }, []);

  const filteredItems = useMemo(
    () => items.filter((i) => i.category === activeTab),
    [items, activeTab]
  );

  const activeMeta = CATEGORY_META[activeTab] ?? CATEGORY_META.bakery;

  return (
    <main className="menu-page min-h-screen bg-[#FEF7F1] relative overflow-x-hidden">

      {/* ── Grain overlay ──────────────────────────── */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* ════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden">

        {/* Parallax background image */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <Image
            src="/assets/SaveGram.App_625116915_18091789997473296_1570557760193326201_n.jpg"
            alt="Dulce bakery atmosphere"
            fill
            priority
            className="object-cover scale-110"
          />
          {/* Rich layered gradient over image */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#2D1B14]/80 via-[#BF5933]/50 to-[#FEF7F1]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2D1B14]/40 via-transparent to-[#2D1B14]/20" />
        </motion.div>

        {/* Decorative orbs */}
        <div className="absolute top-24 left-12 w-72 h-72 bg-[#BF5933]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-40 right-16 w-96 h-96 bg-[#DAA28B]/15 rounded-full blur-[150px] pointer-events-none" />

        {/* Hero content */}
        <motion.div
          style={{ opacity: heroOp }}
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        >
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-3 mb-10"
          >
            <div className="h-px w-12 bg-[#DAA28B]/60" />
            <span className="font-heading text-[11px] font-black uppercase tracking-[0.45em] text-[#DAA28B]">
              Handcrafted in Lagos
            </span>
            <div className="h-px w-12 bg-[#DAA28B]/60" />
          </motion.div>

          {/* Main headline */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-heading font-black uppercase text-[#FEF7F1] leading-[0.82] tracking-tighter">
              <span className="block text-[clamp(64px,12vw,140px)]">OUR</span>
              <span className="block font-script lowercase normal-case italic text-[clamp(72px,14vw,160px)] text-[#DAA28B] leading-[0.75] tracking-normal">
                menu
              </span>
            </h1>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-body text-[clamp(16px,2.2vw,22px)] text-[#FEF7F1]/65 max-w-xl mx-auto mt-8 leading-relaxed font-medium italic"
          >
            "Everything we serve is a reflection of our love for slow-living and real ingredients."
          </motion.p>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-14 flex flex-col items-center gap-3"
          >
            <span className="font-heading text-[10px] font-black uppercase tracking-[0.5em] text-[#FEF7F1]/40">
              Scroll to Explore
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 rounded-full border-2 border-[#FEF7F1]/25 flex items-start justify-center pt-1.5"
            >
              <div className="w-1.5 h-2.5 rounded-full bg-[#DAA28B]" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Back link — top-left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute top-8 left-8 z-20"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-3 font-heading text-[10px] font-black uppercase tracking-[0.4em] text-[#FEF7F1]/50 hover:text-[#DAA28B] transition-all duration-300 group"
          >
            <span className="w-9 h-9 rounded-full border border-[#FEF7F1]/20 flex items-center justify-center group-hover:border-[#DAA28B]/60 group-hover:bg-[#DAA28B]/10 transition-all">
              <ArrowLeftIcon />
            </span>
            Home
          </Link>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════
          STATS STRIP
      ════════════════════════════════════════════ */}
      <section className="relative z-10 bg-[#BF5933] overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 divide-x divide-[#FEF7F1]/15">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onHoverStart={() => setHoveredStat(i)}
              onHoverEnd={() => setHoveredStat(null)}
              className="flex flex-col items-center justify-center py-6 px-4 cursor-default group"
            >
              <motion.span
                animate={{ scale: hoveredStat === i ? 1.08 : 1 }}
                className="font-heading font-black text-[clamp(26px,4vw,40px)] text-[#FEF7F1] leading-none tracking-tighter"
              >
                {stat.value}
              </motion.span>
              <span className="font-body text-[11px] uppercase tracking-[0.35em] text-[#FEF7F1]/55 mt-1 font-semibold">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════
          MAIN MENU CONTENT
      ════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 py-24">

        {/* ── Section heading ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div>
            <p className="font-heading text-[10px] font-black uppercase tracking-[0.5em] text-[#BF5933]/50 mb-4">
              What We Offer
            </p>
            <h2 className="font-heading font-black uppercase text-[#2D1B14] text-[clamp(36px,6vw,72px)] leading-[0.88] tracking-tighter">
              CHOOSE YOUR
              <br />
              <span className="font-script lowercase normal-case italic text-[#BF5933] text-[clamp(42px,7vw,84px)] tracking-normal leading-[0.8]">
                experience.
              </span>
            </h2>
          </div>
          <p className="font-body text-base text-[#2D1B14]/45 max-w-xs leading-relaxed">
            Curated daily with the finest local ingredients. Every item tells a story.
          </p>
        </div>

        {/* ── Category Tabs ── */}
        <div className="flex flex-wrap gap-3 md:gap-4 mb-16">
          {(categories.length > 0 ? categories : CATEGORIES).map((cat: any) => {
            const meta = CATEGORY_META[cat.id] ?? CATEGORY_META.bakery;
            const isActive = activeTab === cat.id;
            return (
              <motion.button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={[
                  "relative group flex items-center gap-3 px-7 py-4 rounded-2xl font-heading text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-400 overflow-hidden border-2",
                  isActive
                    ? "bg-[#BF5933] border-[#BF5933] text-[#FEF7F1] shadow-[0_12px_40px_rgba(191,89,51,0.35)]"
                    : "bg-white border-[#BF5933]/10 text-[#2D1B14]/50 hover:border-[#BF5933]/30 hover:text-[#BF5933] hover:bg-[#BF5933]/5 shadow-sm",
                ].join(" ")}
              >
                <span className={`text-2xl transition-transform duration-500 ${isActive ? "scale-110 rotate-12" : "group-hover:scale-105 group-hover:-rotate-6"}`}>
                  {meta.icon}
                </span>
                <span>{cat.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-[#FEF7F1]/50 rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* ── Active-category context bar ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="mb-14 flex items-center gap-4"
          >
            <div className="h-px flex-1 bg-gradient-to-r from-[#BF5933]/20 to-transparent" />
            <span className="font-body text-sm text-[#2D1B14]/40 italic">
              {activeMeta.desc}
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-[#BF5933]/20 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* ── Items Grid ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white/60 rounded-[28px] h-72 animate-pulse" />
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <span className="text-6xl mb-4">🌿</span>
                <p className="font-heading font-black uppercase text-[#2D1B14]/20 text-2xl tracking-tighter">
                  Coming Soon
                </p>
                <p className="font-body text-sm text-[#2D1B14]/30 mt-2 italic">
                  This section is being lovingly prepared.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.07, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <MenuItemCard item={item} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ════════════════════════════════════════════
          FEATURED SHOWCASE BANNER
      ════════════════════════════════════════════ */}
      <section className="relative z-10 mx-6 md:mx-12 max-w-[1280px] xl:mx-auto mb-24">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[48px] overflow-hidden shadow-2xl group"
        >
          {/* Background image */}
          <div className="relative w-full aspect-[16/7] min-h-[340px]">
            <Image
              src="/assets/SaveGram.App_638289208_18093782288473296_5700725885681164176_n.jpg"
              alt="Dulce craft process"
              fill
              className="object-cover transition-transform duration-[2500ms] group-hover:scale-105"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a0f0a]/90 via-[#BF5933]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f0a]/50 via-transparent to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-20 py-12">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#FEF7F1]/10 backdrop-blur-sm border border-[#FEF7F1]/15 rounded-full px-5 py-2 w-fit mb-8">
                <span className="w-2 h-2 rounded-full bg-[#DAA28B] animate-pulse" />
                <span className="font-heading text-[10px] font-black uppercase tracking-[0.45em] text-[#DAA28B]">
                  Chef's Special
                </span>
              </div>

              <h3 className="font-heading font-black uppercase text-[#FEF7F1] leading-[0.85] tracking-tighter text-[clamp(32px,5vw,72px)] max-w-xl mb-8">
                THE MAGIC IS
                <br />
                IN EVERY
                <br />
                <span className="font-script lowercase normal-case italic text-[#DAA28B] text-[clamp(38px,6vw,86px)] leading-[0.75] tracking-normal">
                  single layer.
                </span>
              </h3>

              <div className="flex flex-wrap gap-4 items-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-3 bg-[#FEF7F1] text-[#BF5933] font-heading text-[11px] font-black uppercase tracking-[0.35em] px-8 py-4 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 active:scale-95"
                >
                  Our Story
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 7h10M7 2l5 5-5 5" />
                  </svg>
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-3 border-2 border-[#FEF7F1]/30 text-[#FEF7F1] font-heading text-[11px] font-black uppercase tracking-[0.35em] px-8 py-4 rounded-2xl hover:bg-[#FEF7F1]/10 hover:border-[#FEF7F1]/50 transition-all duration-300"
                >
                  Reserve a Table
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════
          PHILOSOPHY / BOTTOM CTA
      ════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-[#2D1B14] rounded-[48px] p-12 md:p-20 overflow-hidden text-center"
        >
          {/* Decorative circles */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#BF5933]/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-[#DAA28B]/10 rounded-full blur-[60px] pointer-events-none" />

          {/* Large decorative text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <span className="font-heading font-black uppercase text-[#FEF7F1]/[0.02] text-[200px] tracking-tighter leading-none whitespace-nowrap">
              DULCE
            </span>
          </div>

          <div className="relative z-10">
            <p className="font-heading text-[10px] font-black uppercase tracking-[0.55em] text-[#DAA28B]/70 mb-8">
              Hand-Crafted Daily
            </p>
            <h4 className="font-heading font-black uppercase text-[#FEF7F1] text-[clamp(30px,5.5vw,68px)] leading-[0.88] tracking-tighter max-w-3xl mx-auto mb-6">
              CURATED FOR THE TRUE
              <br />
              <span className="font-script lowercase normal-case italic text-[#DAA28B] text-[clamp(38px,6.5vw,80px)] tracking-normal leading-[0.78]">
                aficionado.
              </span>
            </h4>
            <p className="font-body text-[#FEF7F1]/40 text-base italic max-w-md mx-auto mb-14 leading-relaxed">
              We believe the best meals are made slowly, with intention, and shared joyfully.
            </p>

            {/* Icon trio */}
            <div className="flex items-center justify-center gap-6">
              {["☕", "🥐", "🍳"].map((icon, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
                  className="w-16 h-16 bg-[#FEF7F1]/5 border border-[#FEF7F1]/8 rounded-2xl flex items-center justify-center text-2xl hover:bg-[#BF5933]/30 hover:border-[#BF5933]/40 transition-all duration-300 cursor-default"
                >
                  {icon}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
