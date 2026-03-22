"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import Footer from "@/components/Footer";

const supabase = createClient();

const CONTACT_INFO = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    label: "Address",
    value: "42 Glover Road, Ikoyi",
    sub: "Lagos, Nigeria",
    href: "https://maps.google.com/?q=42+Glover+Road+Ikoyi+Lagos",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.5 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    label: "Phone",
    value: "070 491 62291",
    sub: "Mon–Sun · 8AM – 8PM",
    href: "tel:07049162291",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    label: "Email",
    value: "hello@dulcecafe.ng",
    sub: "We reply within 24hrs",
    href: "mailto:hello@dulcecafe.ng",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    label: "Hours",
    value: "8:00 AM – 8:00 PM",
    sub: "Every day of the week",
    href: null,
  },
];

const INQUIRY_TYPES = [
  "General Inquiry",
  "Reservation Help",
  "Private Events",
  "Catering",
  "Press & Media",
  "Feedback",
];

const ArrowLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 9H3M3 9l5-5M3 9l5 5" />
  </svg>
);

export default function ContactPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [selectedType, setSelectedType] = useState<string>("General Inquiry");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData(e.currentTarget);

    const { error } = await supabase.from("notifications").insert([{
      title: `Contact: ${fd.get("subject") || selectedType}`,
      message: `From: ${fd.get("name")} (${fd.get("email")}) — ${fd.get("message")}`,
      is_read: false,
    }]);

    if (error) {
      console.error(error);
      setStatus("error");
    } else {
      setStatus("success");
      (e.target as HTMLFormElement).reset();
      setSelectedType("General Inquiry");
    }
  };

  return (
    <main className="min-h-screen bg-[#FEF7F1] overflow-x-hidden">
      <div className="grain-overlay" aria-hidden="true" />

      {/* ── Hero — Full Viewport Split ── */}
      <section ref={heroRef} className="relative w-full min-h-screen flex flex-col lg:flex-row overflow-hidden">

        {/* LEFT — Dark text panel */}
        <div className="relative z-10 flex flex-col justify-end lg:justify-center w-full lg:w-[52%] min-h-[55vh] lg:min-h-screen bg-[#2D1B14] px-8 md:px-14 xl:px-20 pt-32 lg:pt-0 pb-12 lg:pb-0">
          <div className="absolute top-1/3 right-0 w-72 h-72 bg-[#BF5933]/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-[#DAA28B]/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 max-w-[520px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex items-center gap-3 mb-10"
            >
              <div className="h-px w-10 bg-[#DAA28B]/50" />
              <span className="font-heading text-[10px] font-black uppercase tracking-[0.5em] text-[#DAA28B]">
                Say Hello
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="font-heading font-black uppercase text-[#FEF7F1] leading-[0.85] tracking-tighter">
                <span className="block text-[clamp(52px,8vw,96px)]">GET</span>
                <span className="block text-[clamp(52px,8vw,96px)]">IN</span>
                <span className="block font-script lowercase normal-case italic text-[#DAA28B] text-[clamp(60px,9.5vw,114px)] leading-[0.72] tracking-normal">
                  touch.
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="font-body text-white/45 text-[17px] mt-8 leading-relaxed max-w-[400px]"
            >
              Whether you have a question, want to plan a private event, or just want to share how your last visit made you feel — we'd love to hear.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="flex flex-col gap-4 mt-10"
            >
              <a href="tel:07049162291" className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-2xl bg-[#BF5933]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#BF5933]/35 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DAA28B" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-heading text-[9px] font-black uppercase tracking-[0.4em] text-white/25">Phone</p>
                  <p className="font-body text-white/75 font-semibold text-sm group-hover:text-white transition-colors">070 491 62291</p>
                </div>
              </a>
              <a href="mailto:hello@dulcecafe.ng" className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-2xl bg-[#BF5933]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#BF5933]/35 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DAA28B" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div>
                  <p className="font-heading text-[9px] font-black uppercase tracking-[0.4em] text-white/25">Email</p>
                  <p className="font-body text-white/75 font-semibold text-sm group-hover:text-white transition-colors">hello@dulcecafe.ng</p>
                </div>
              </a>
            </motion.div>
          </div>
        </div>

        {/* RIGHT — Image */}
        <div className="relative w-full lg:w-[48%] min-h-[45vh] lg:min-h-screen overflow-hidden">
          <Image
            src="/assets/SaveGram.App_640004270_18093782342473296_3490771191939909153_n.jpg"
            alt="Dulce cafe interior"
            fill priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2D1B14]/30 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#2D1B14] lg:via-[#2D1B14]/5 lg:to-transparent" />

          {/* Hours badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
            className="absolute bottom-8 right-8 lg:bottom-12 lg:right-12 bg-[#2D1B14]/90 backdrop-blur-xl text-white rounded-3xl px-6 py-5 border border-white/10 shadow-2xl"
          >
            <p className="font-heading font-black text-[10px] uppercase tracking-[0.4em] text-[#DAA28B]/70 mb-2">Open Daily</p>
            <p className="font-heading font-black text-2xl tracking-tight text-white leading-none">8 AM – 8 PM</p>
            <p className="font-body text-xs text-white/40 mt-1">42 Glover Road, Ikoyi</p>
          </motion.div>
        </div>
      </section>

      {/* ── Contact Grid ── */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* LEFT: Form */}
          <div>
            <p className="font-body text-[#2D1B14]/50 text-lg leading-relaxed mb-12 max-w-md">
              Whether you have a question, want to plan a private event, or just want to share how your last visit made you feel — we'd love to hear from you.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              {/* Inquiry Type */}
              <div>
                <label className="font-heading text-[10px] font-black uppercase tracking-[0.5em] text-[#2D1B14]/40 block mb-4">
                  Inquiry Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {INQUIRY_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedType(type)}
                      className={`px-5 py-2.5 rounded-2xl font-heading text-[10px] font-black uppercase tracking-[0.2em] border-2 transition-all ${
                        selectedType === type
                          ? "bg-[#BF5933] border-[#BF5933] text-white shadow-[0_8px_20px_rgba(191,89,51,0.25)]"
                          : "bg-white border-[#2D1B14]/10 text-[#2D1B14]/50 hover:border-[#BF5933]/30 hover:text-[#BF5933]"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Your Name", name: "name", type: "text", placeholder: "Chidinma Eze", colSpan: false },
                  { label: "Email Address", name: "email", type: "email", placeholder: "you@example.com", colSpan: false },
                  { label: "Subject", name: "subject", type: "text", placeholder: "What's on your mind?", colSpan: true },
                ].map((field) => (
                  <div key={field.name} className={`flex flex-col gap-2 ${field.colSpan ? "md:col-span-2" : ""}`}>
                    <label className="font-heading text-[10px] font-black uppercase tracking-[0.35em] text-[#2D1B14]/40">
                      {field.label}
                    </label>
                    <input
                      name={field.name}
                      type={field.type}
                      required
                      placeholder={field.placeholder}
                      className="w-full bg-white border border-[#2D1B14]/10 rounded-2xl px-6 py-4 font-body text-[#2D1B14] text-base outline-none focus:border-[#BF5933]/40 focus:shadow-[0_0_0_3px_rgba(191,89,51,0.08)] transition-all placeholder:text-[#2D1B14]/25 shadow-sm"
                    />
                  </div>
                ))}
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="font-heading text-[10px] font-black uppercase tracking-[0.35em] text-[#2D1B14]/40">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us more…"
                    className="w-full bg-white border border-[#2D1B14]/10 rounded-2xl px-6 py-4 font-body text-[#2D1B14] text-base outline-none focus:border-[#BF5933]/40 focus:shadow-[0_0_0_3px_rgba(191,89,51,0.08)] transition-all placeholder:text-[#2D1B14]/25 shadow-sm resize-none"
                  />
                </div>
              </div>

              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 p-6 bg-[#2D1B14] rounded-2xl"
                >
                  <span className="text-2xl">✉️</span>
                  <div>
                    <p className="font-heading font-black uppercase text-[#DAA28B] text-sm tracking-wider">Message received!</p>
                    <p className="font-body text-white/40 text-xs mt-1">We'll get back to you within 24 hours.</p>
                  </div>
                </motion.div>
              ) : (
                <div className="flex items-center gap-6 flex-wrap">
                  <motion.button
                    type="submit"
                    disabled={status === "loading"}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-4 bg-[#BF5933] text-[#FEF7F1] font-heading text-[11px] font-black uppercase tracking-widest px-10 py-5 rounded-2xl hover:bg-[#2D1B14] transition-all shadow-[0_12px_40px_rgba(191,89,51,0.3)] disabled:opacity-40"
                  >
                    {status === "loading" ? "Sending…" : "Send Message"}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M3 8h10M8 3l5 5-5 5" />
                    </svg>
                  </motion.button>
                  {status === "error" && (
                    <p className="text-red-500 font-body text-sm font-semibold">Something went wrong. Please try again.</p>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* RIGHT: Info Panel */}
          <div className="flex flex-col gap-8">
            {/* Info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {CONTACT_INFO.map((info, i) => (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group hover-lift"
                >
                  {info.href ? (
                    <a
                      href={info.href}
                      target={info.href.startsWith("https") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="block bg-white border border-[#2D1B14]/8 rounded-[28px] p-8 shadow-sm hover:shadow-lg hover:border-[#BF5933]/20 transition-all"
                    >
                      <InfoCardContent info={info} />
                    </a>
                  ) : (
                    <div className="bg-white border border-[#2D1B14]/8 rounded-[28px] p-8 shadow-sm">
                      <InfoCardContent info={info} />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Image + social */}
            <div className="relative h-72 rounded-[36px] overflow-hidden">
              <Image
                src="/assets/SaveGram.App_638319547_18093782306473296_5221783078591784523_n.jpg"
                alt="Dulce cafe"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B14]/75 via-transparent to-transparent flex flex-col justify-end p-8">
                <p className="font-heading font-black uppercase text-[#FEF7F1] text-xl tracking-tight leading-tight mb-3">
                  Follow our journey
                </p>
                <a
                  href="https://instagram.com/dulcecafeng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-heading text-[11px] font-black uppercase tracking-[0.35em] text-[#DAA28B] hover:text-white transition-colors"
                >
                  @dulcecafeng
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M1 11 11 1M4 1h7v7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Map embed placeholder */}
            <div className="bg-[#2D1B14] rounded-[28px] p-8 text-center">
              <p className="font-heading text-[10px] font-black uppercase tracking-[0.5em] text-[#DAA28B]/70 mb-4">Find Us</p>
              <p className="font-heading font-black uppercase text-[#FEF7F1] text-2xl tracking-tight mb-2">42 Glover Road</p>
              <p className="font-body text-white/40 text-sm mb-6">Tucked behind Slashpoint Supermarket, Ikoyi, Lagos</p>
              <a
                href="https://maps.google.com/?q=42+Glover+Road+Ikoyi+Lagos"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#BF5933]/15 border border-[#BF5933]/30 text-[#DAA28B] font-heading text-[10px] font-black uppercase tracking-[0.35em] px-6 py-3 rounded-2xl hover:bg-[#BF5933]/25 transition-all"
              >
                Open in Maps
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M1 11 11 1M4 1h7v7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function InfoCardContent({ info }: { info: typeof CONTACT_INFO[0] }) {
  return (
    <>
      <div className="w-12 h-12 rounded-2xl bg-[#BF5933]/8 flex items-center justify-center text-[#BF5933] mb-5">
        {info.icon}
      </div>
      <p className="font-heading text-[10px] font-black uppercase tracking-[0.4em] text-[#2D1B14]/35 mb-2">{info.label}</p>
      <p className="font-heading font-black uppercase text-[#2D1B14] text-base tracking-tight leading-tight">{info.value}</p>
      <p className="font-body text-[#2D1B14]/45 text-sm mt-0.5">{info.sub}</p>
    </>
  );
}
