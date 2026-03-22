"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import Footer from "@/components/Footer";

const supabase = createClient();

const TIME_SLOTS = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM",
];

const PARTY_SIZES = [1, 2, 3, 4, 5, 6, 7, 8];

const EXPERIENCE_TAGS = [
  { label: "Romantic Dinner", emoji: "🕯️" },
  { label: "Birthday", emoji: "🎂" },
  { label: "Business Lunch", emoji: "💼" },
  { label: "Family Brunch", emoji: "👨‍👩‍👧" },
  { label: "Anniversary", emoji: "💍" },
  { label: "Friends", emoji: "🥂" },
];

const CheckIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 7 11 19 5 13" />
  </svg>
);

export default function ReservationPage() {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", date: "", notes: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime || !selectedSize) return;
    setStatus("loading");

    const convertTime = (t: string) => {
      const [time, period] = t.split(" ");
      let [h, m] = time.split(":").map(Number);
      if (period === "PM" && h !== 12) h += 12;
      if (period === "AM" && h === 12) h = 0;
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    };

    const { error } = await supabase.from("reservations").insert([{
      customer_name: formData.name,
      date: formData.date,
      time: convertTime(selectedTime),
      seats: selectedSize,
      status: "pending",
      notes: formData.notes || null,
    }]);

    if (error) {
      console.error(error);
      setStatus("error");
    } else {
      setStatus("success");
    }
  };

  return (
    <main className="min-h-screen bg-[#FEF7F1] overflow-x-hidden">
      <div className="grain-overlay" aria-hidden="true" />

      {/* ══════════════════════════════════════════════════
          HERO — Full Viewport Split Layout
      ══════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-screen flex flex-col lg:flex-row overflow-hidden">

        {/* LEFT — Dark text panel */}
        <div className="relative z-10 flex flex-col justify-end lg:justify-center w-full lg:w-[52%] min-h-[55vh] lg:min-h-screen bg-[#2D1B14] px-8 md:px-14 xl:px-20 pt-32 lg:pt-0 pb-12 lg:pb-0">
          {/* Decorative orb */}
          <div className="absolute top-1/4 right-0 w-80 h-80 bg-[#BF5933]/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-[#DAA28B]/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 max-w-[520px]">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex items-center gap-3 mb-10"
            >
              <div className="h-px w-10 bg-[#DAA28B]/50" />
              <span className="font-heading text-[10px] font-black uppercase tracking-[0.5em] text-[#DAA28B]">
                Secure Your Table
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="font-heading font-black uppercase text-[#FEF7F1] leading-[0.85] tracking-tighter">
                <span className="block text-[clamp(52px,8vw,96px)]">BOOK</span>
                <span className="block text-[clamp(52px,8vw,96px)]">YOUR</span>
                <span className="block font-script lowercase normal-case italic text-[#DAA28B] text-[clamp(60px,9.5vw,114px)] leading-[0.72] tracking-normal">
                  experience.
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="font-body text-white/45 text-[17px] mt-8 leading-relaxed max-w-[400px]"
            >
              Reserve a table and step into Lagos's most beloved culinary sanctuary. Every meal is an occasion worth celebrating.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="flex items-center gap-8 mt-12"
            >
              {[
                { value: "4.9★", label: "Rating" },
                { value: "2min", label: "To Confirm" },
                { value: "Free", label: "Cancellation" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-heading font-black text-2xl text-[#FEF7F1] tracking-tight">{s.value}</p>
                  <p className="font-body text-[11px] text-white/35 uppercase tracking-widest font-semibold">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* RIGHT — Image */}
        <div className="relative w-full lg:w-[48%] min-h-[45vh] lg:min-h-screen overflow-hidden">
          <Image
            src="/assets/SaveGram.App_639497783_18093782330473296_5334377840370386583_n.jpg"
            alt="Dulce dining atmosphere"
            fill
            priority
            className="object-cover"
          />
          {/* Overlay gradient — blends into the left panel on desktop */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#2D1B14]/30 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#2D1B14] lg:via-[#2D1B14]/5 lg:to-transparent" />

          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
            className="absolute bottom-8 right-8 lg:bottom-12 lg:right-12 bg-[#BF5933] text-white rounded-3xl px-6 py-4 shadow-2xl"
          >
            <p className="font-heading font-black text-4xl leading-none">250+</p>
            <p className="font-body text-xs text-white/70 mt-1 font-semibold uppercase tracking-widest">Happy Guests</p>
            <p className="font-body text-xs text-white/50 mt-0.5">This month alone</p>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden lg:flex flex-col items-center gap-2"
        >
          <span className="font-heading text-[9px] font-black uppercase tracking-[0.5em] text-white/25">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-[#DAA28B]/60" />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════
          BOOKING FORM SECTION
      ══════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 py-24">
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#2D1B14] rounded-[48px] p-16 text-center flex flex-col items-center gap-8 max-w-2xl mx-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-[#BF5933] flex items-center justify-center text-white"
              >
                <CheckIcon />
              </motion.div>
              <div>
                <h2 className="font-heading font-black uppercase text-[#FEF7F1] text-4xl md:text-5xl tracking-tighter leading-[0.88]">
                  You're All Set,
                  <br />
                  <span className="font-script lowercase normal-case italic text-[#DAA28B] text-5xl md:text-6xl leading-[0.75]">
                    {formData.name.split(" ")[0] || "friend"}.
                  </span>
                </h2>
                <p className="font-body text-white/40 mt-5 text-base leading-relaxed max-w-md mx-auto">
                  Reservation confirmed for {selectedSize} guest{selectedSize !== 1 ? "s" : ""} on {formData.date} at {selectedTime}. We look forward to seeing you.
                </p>
              </div>
              <Link href="/" className="inline-flex items-center gap-3 bg-[#BF5933] text-white font-heading text-xs font-black uppercase tracking-widest px-10 py-4 rounded-2xl hover:bg-white hover:text-[#BF5933] transition-all">
                Back to Home
              </Link>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

              {/* Section heading */}
              <div className="text-center mb-16">
                <p className="font-heading text-[10px] font-black uppercase tracking-[0.5em] text-[#BF5933]/50 mb-4">The Details</p>
                <h2 className="font-heading font-black uppercase text-[#2D1B14] text-[clamp(32px,5.5vw,64px)] leading-[0.88] tracking-tighter">
                  Tell us about
                  <br />
                  <span className="font-script lowercase normal-case italic text-[#BF5933] text-[clamp(38px,6.5vw,78px)] leading-[0.78]">your visit.</span>
                </h2>
              </div>

              {/* Step tabs */}
              <div className="flex items-center justify-center gap-0 mb-14">
                {[{ n: 1, label: "Your Details" }, { n: 2, label: "Date & Time" }].map((s, i) => (
                  <React.Fragment key={s.n}>
                    <button
                      type="button"
                      onClick={() => setStep(s.n as 1 | 2)}
                      className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all ${step === s.n ? "bg-[#2D1B14] text-white" : "text-[#2D1B14]/40 hover:text-[#2D1B14]/70"}`}
                    >
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center font-heading font-black text-sm transition-all ${step === s.n ? "bg-[#BF5933] text-white" : "border-2 border-[#2D1B14]/20 text-[#2D1B14]/40"}`}>
                        {s.n}
                      </span>
                      <span className="font-heading text-[11px] font-black uppercase tracking-[0.3em]">{s.label}</span>
                    </button>
                    {i === 0 && <div className="w-12 h-px bg-[#2D1B14]/10" />}
                  </React.Fragment>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 xl:gap-20">
                {/* FORM */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-12">
                  <AnimatePresence mode="wait">
                    {step === 1 ? (
                      <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="flex flex-col gap-10">
                        {/* Personal */}
                        <div>
                          <p className="font-heading text-[10px] font-black uppercase tracking-[0.5em] text-[#BF5933]/50 mb-6">Personal Information</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {[
                              { label: "Full Name", name: "name", type: "text", placeholder: "Amaka Osei", required: true, col2: true },
                              { label: "Email Address", name: "email", type: "email", placeholder: "hello@example.com", required: false, col2: false },
                              { label: "Phone Number", name: "phone", type: "tel", placeholder: "+234 800 000 0000", required: false, col2: false },
                            ].map((f) => (
                              <div key={f.name} className={`flex flex-col gap-2 ${f.col2 ? "md:col-span-2" : ""}`}>
                                <label className="font-heading text-[10px] font-black uppercase tracking-[0.35em] text-[#2D1B14]/40">{f.label}</label>
                                <input
                                  name={f.name} type={f.type} placeholder={f.placeholder} required={f.required}
                                  value={(formData as any)[f.name]} onChange={handleChange}
                                  className="w-full bg-white border-2 border-[#2D1B14]/8 rounded-2xl px-5 py-4 font-body text-[#2D1B14] text-base outline-none focus:border-[#BF5933]/50 focus:shadow-[0_0_0_4px_rgba(191,89,51,0.07)] transition-all placeholder:text-[#2D1B14]/25 shadow-sm hover:border-[#2D1B14]/14"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Occasion */}
                        <div>
                          <p className="font-heading text-[10px] font-black uppercase tracking-[0.5em] text-[#BF5933]/50 mb-5">What's the Occasion?</p>
                          <div className="flex flex-wrap gap-2.5">
                            {EXPERIENCE_TAGS.map((tag) => (
                              <button
                                key={tag.label} type="button"
                                onClick={() => setSelectedTag(selectedTag === tag.label ? null : tag.label)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading text-[11px] font-black uppercase tracking-[0.18em] border-2 transition-all ${
                                  selectedTag === tag.label
                                    ? "bg-[#BF5933] border-[#BF5933] text-white shadow-[0_6px_20px_rgba(191,89,51,0.25)]"
                                    : "bg-white border-[#2D1B14]/10 text-[#2D1B14]/50 hover:border-[#BF5933]/35 hover:text-[#BF5933]"
                                }`}
                              >
                                <span>{tag.emoji}</span> <span>{tag.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Notes */}
                        <div>
                          <label className="font-heading text-[10px] font-black uppercase tracking-[0.35em] text-[#2D1B14]/40 block mb-2">Special Requests</label>
                          <textarea
                            name="notes" rows={3} value={formData.notes} onChange={handleChange}
                            placeholder="Allergies, high chairs, surprise setups…"
                            className="w-full bg-white border-2 border-[#2D1B14]/8 rounded-2xl px-5 py-4 font-body text-[#2D1B14] text-base outline-none focus:border-[#BF5933]/50 transition-all placeholder:text-[#2D1B14]/25 shadow-sm resize-none"
                          />
                        </div>

                        <button
                          type="button" onClick={() => setStep(2)}
                          className="self-start flex items-center gap-3 bg-[#2D1B14] text-white font-heading text-[11px] font-black uppercase tracking-widest px-9 py-4 rounded-2xl hover:bg-[#BF5933] transition-all shadow-xl"
                        >
                          Choose Date & Time
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M2 7h10M6 2l5 5-5 5" /></svg>
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="flex flex-col gap-10">
                        {/* Date */}
                        <div>
                          <p className="font-heading text-[10px] font-black uppercase tracking-[0.5em] text-[#BF5933]/50 mb-5">Select Date</p>
                          <input
                            type="date" name="date" required
                            min={new Date().toISOString().split("T")[0]}
                            value={formData.date} onChange={handleChange}
                            className="bg-white border-2 border-[#2D1B14]/8 rounded-2xl px-5 py-4 font-body text-[#2D1B14] text-base outline-none focus:border-[#BF5933]/50 transition-all shadow-sm w-full md:w-72"
                          />
                        </div>

                        {/* Party Size */}
                        <div>
                          <p className="font-heading text-[10px] font-black uppercase tracking-[0.5em] text-[#BF5933]/50 mb-5">Number of Guests</p>
                          <div className="flex flex-wrap gap-3 items-center">
                            {PARTY_SIZES.map((n) => (
                              <button
                                key={n} type="button" onClick={() => setSelectedSize(n)}
                                className={`w-13 h-13 w-[52px] h-[52px] rounded-2xl font-heading font-black text-lg border-2 transition-all ${
                                  selectedSize === n
                                    ? "bg-[#BF5933] border-[#BF5933] text-white shadow-[0_6px_20px_rgba(191,89,51,0.3)]"
                                    : "bg-white border-[#2D1B14]/10 text-[#2D1B14]/60 hover:border-[#BF5933]/40 hover:text-[#BF5933]"
                                }`}
                              >{n}</button>
                            ))}
                            <div className="text-[#2D1B14]/35 font-body text-sm ml-2">
                              8+? <Link href="/contact" className="text-[#BF5933] underline underline-offset-2 font-semibold">Call us</Link>
                            </div>
                          </div>
                        </div>

                        {/* Time slots */}
                        <div>
                          <p className="font-heading text-[10px] font-black uppercase tracking-[0.5em] text-[#BF5933]/50 mb-5">Preferred Time</p>
                          <div className="flex flex-wrap gap-2.5">
                            {TIME_SLOTS.map((slot) => (
                              <button
                                key={slot} type="button" onClick={() => setSelectedTime(slot)}
                                className={`px-4 py-2.5 rounded-xl font-heading text-[11px] font-black uppercase tracking-[0.15em] border-2 transition-all ${
                                  selectedTime === slot
                                    ? "bg-[#BF5933] border-[#BF5933] text-white shadow-[0_6px_20px_rgba(191,89,51,0.25)]"
                                    : "bg-white border-[#2D1B14]/10 text-[#2D1B14]/50 hover:border-[#BF5933]/35 hover:text-[#BF5933]"
                                }`}
                              >{slot}</button>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-6 flex-wrap">
                          <button type="button" onClick={() => setStep(1)} className="font-heading text-[11px] font-black uppercase tracking-widest text-[#2D1B14]/35 hover:text-[#2D1B14] transition-colors underline underline-offset-4">← Back</button>
                          <button
                            type="submit"
                            disabled={!selectedTime || !selectedSize || !formData.date || !formData.name || status === "loading"}
                            className="flex items-center gap-3 bg-[#BF5933] text-white font-heading text-[11px] font-black uppercase tracking-widest px-10 py-4 rounded-2xl hover:bg-[#2D1B14] transition-all shadow-[0_12px_40px_rgba(191,89,51,0.3)] disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {status === "loading" ? "Confirming…" : "Confirm Reservation"}
                          </button>
                        </div>
                        {status === "error" && <p className="text-red-500 font-body text-sm font-semibold">Something went wrong. Please try again.</p>}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>

                {/* Sidebar summary card */}
                <div className="flex flex-col gap-6">
                  <div className="bg-[#2D1B14] rounded-[36px] p-8 sticky top-28">
                    <p className="font-heading text-[10px] font-black uppercase tracking-[0.5em] text-[#DAA28B]/60 mb-7">Your Reservation</p>
                    <div className="flex flex-col gap-4">
                      {[
                        { label: "Name", value: formData.name || "—" },
                        { label: "Date", value: formData.date || "—" },
                        { label: "Time", value: selectedTime || "—" },
                        { label: "Guests", value: selectedSize ? `${selectedSize} person${selectedSize !== 1 ? "s" : ""}` : "—" },
                        { label: "Occasion", value: selectedTag || "—" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between border-b border-white/5 pb-4">
                          <span className="font-heading text-[10px] font-black uppercase tracking-[0.3em] text-white/20">{item.label}</span>
                          <span className="font-body text-sm font-semibold text-white/70 text-right max-w-[160px]">{item.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-7 p-4 bg-[#BF5933]/10 border border-[#BF5933]/20 rounded-2xl">
                      <p className="font-body text-xs text-[#DAA28B]/80 leading-relaxed">
                        <strong className="font-heading uppercase tracking-wide text-[#DAA28B]">Free Cancellation</strong> up to 24 hours before your visit. Call{" "}
                        <a href="tel:07049162291" className="underline">070 491 62291</a> for changes.
                      </p>
                    </div>
                  </div>

                  <div className="relative h-56 rounded-[28px] overflow-hidden">
                    <Image src="/assets/SaveGram.App_652044208_18096602171473296_7123593077978161000_n.jpg" alt="Dulce dining" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B14]/80 via-transparent to-transparent flex flex-col justify-end p-6">
                      <p className="font-heading font-black uppercase text-white text-base tracking-tight leading-tight">
                        Where every meal is<br />
                        <span className="font-script lowercase normal-case italic text-[#DAA28B] text-xl">a memory.</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <Footer />
    </main>
  );
}
