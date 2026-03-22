"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const IGIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="16" height="16" rx="5" />
    <circle cx="10" cy="10" r="4" />
    <circle cx="15" cy="5" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);
const FBIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2h-3a4 4 0 0 0-4 4v3H4v4h3v6h4v-6h3l1-4h-4V6c0-.6.4-1 1-1h3V2Z" />
  </svg>
);
const ArrowUpRight = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="2" y1="12" x2="12" y2="2" />
    <polyline points="4 2 12 2 12 10" />
  </svg>
);

const links = [
  { label: "Menu", href: "/menu" },
  { label: "Our Story", href: "#our-story" },
  { label: "Locations", href: "#locations" },
  { label: "Private Events", href: "#" },
];

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-[#2D1B14] relative overflow-hidden">
      {/* ── Image strip ── */}
      <div className="grid grid-cols-4 min-h-[250px] md:min-h-[300px] overflow-hidden border-b border-[#FEF7F1]/5">
        {[
          "/assets/SaveGram.App_652044208_18096602171473296_7123593077978161000_n.jpg",
          "/assets/SaveGram.App_652538168_18096602186473296_641326294712734725_n.jpg",
          "/assets/SaveGram.App_654474121_18096602195473296_2838072698752535229_n.jpg",
          "/assets/SaveGram.App_652937861_18096602120473296_2848885442795713619_n.jpg",
        ].map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative w-full h-[250px] md:h-[300px] overflow-hidden img-zoom"
            style={{ position: "relative", minHeight: "250px" }}
          >
            <Image 
              src={src} 
              alt="" 
              fill 
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover" 
            />
            <div className="absolute inset-0 bg-[#2D1B14]/40" />
          </motion.div>
        ))}
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-12 pt-24 pb-16">
        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div
                className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#FEF7F1]/20 shadow-md flex-shrink-0"
                style={{ 
                  position: "relative", 
                  minHeight: "48px", 
                  minWidth: "48px",
                  height: "48px",
                  width: "48px"
                }}
              >
                <Image
                  src="/assets/logo.png"
                  alt="Dulce"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <span className="font-heading text-2xl font-bold text-[#FEF7F1] tracking-tight uppercase">
                Dulce
              </span>
            </Link>
            <p className="font-body text-[15px] text-[#FEF7F1]/40 leading-relaxed max-w-sm font-medium">
              &ldquo;Every morning is a new chance to bake something magical for
              this neighbourhood. We haven&apos;t missed one yet.&rdquo;
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="#"
                className="group flex flex-row items-center gap-3 w-fit px-5 py-3 rounded-full bg-[#FEF7F1]/8 text-[#FEF7F1]/80 hover:bg-[#BF5933] hover:text-[#FEF7F1] transition-all hover:-translate-y-1"
              >
                <IGIcon />
                <span className="font-body text-xs font-bold uppercase tracking-wider">
                  @dulcecafeng
                </span>
              </a>
              <div className="font-body text-[#FEF7F1]/40 text-sm font-medium mt-2">
                Questions? Call{" "}
                <a
                  href="tel:07049162291"
                  className="hover:text-[#FEF7F1] underline decoration-[#BF5933] underline-offset-4"
                >
                  070 491 62291
                </a>
              </div>
            </div>
          </div>

          {/* Nav links */}
          <div className="space-y-8">
            <h4 className="font-body text-[10px] font-bold uppercase tracking-[0.4em] text-[#FEF7F1]/25">
              The Sanctuary
            </h4>
            <ul className="space-y-4">
              {links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="group flex items-center gap-2 font-heading text-xl font-bold uppercase text-[#FEF7F1]/60 hover:text-[#FEF7F1] transition-colors"
                  >
                    {l.label}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-8">
            <h4 className="font-body text-[10px] font-bold uppercase tracking-[0.4em] text-[#FEF7F1]/25">
              Visit Us
            </h4>
            <div className="space-y-5">
              <div>
                <p className="font-heading text-base font-bold uppercase text-[#FEF7F1]/80">
                  42 Glover Road
                </p>
                <p className="font-body text-sm text-[#FEF7F1]/35 font-medium">
                  Lagos, Nigeria
                </p>
              </div>
              <div>
                <p className="font-heading text-base font-bold uppercase text-[#FEF7F1]/80">
                  Every Day
                </p>
                <p className="font-body text-sm text-[#FEF7F1]/35 font-medium">
                  08:00 AM – 08:00 PM
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
                <p className="font-body text-[12px] font-semibold text-[#4ADE80]/70">
                  Open now · Baking fresh
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-[#FEF7F1]/8 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-body text-[11px] font-medium text-[#FEF7F1]/20 uppercase tracking-wider">
            &copy; 2026 Dulce Restaurant & Bakery. Your finest, always.
          </p>
          <div className="flex gap-8">
            {["Privacy", "Terms", "Delivery Policy"].map((t) => (
              <Link
                key={t}
                href="#"
                className="font-body text-[11px] font-medium text-[#FEF7F1]/20 hover:text-[#FEF7F1]/60 uppercase tracking-wider transition-colors"
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
