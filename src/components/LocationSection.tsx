"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const MapIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 2C7.69 2 5 4.69 5 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.31-2.69-6-6-6Z" />
    <circle cx="11" cy="8" r="2" />
  </svg>
);
const ClockIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="9" />
    <polyline points="11 6 11 11 14.5 14.5" />
  </svg>
);
const PhoneIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 2h4l2 5-2.5 1.5C8.5 11 11 13.5 14 14.5L15.5 12l5 2v4c0 1.1-.9 2-2 2C9.44 20 2 12.56 2 4c0-1.1.9-2 2-2Z" />
  </svg>
);
const IGIcon = () => (
  <svg
    width="20"
    height="20"
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
    width="20"
    height="20"
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

const details = [
  {
    icon: <MapIcon />,
    title: "Address",
    value: "42 Glover Road, Ikoyi",
    note: "Tucked behind Slashpoint Supermarket",
  },
  {
    icon: <ClockIcon />,
    title: "Hours",
    value: "08:00 AM — 08:00 PM",
    note: "Open every day of the week",
  },
  {
    icon: <PhoneIcon />,
    title: "Phone",
    value: "070 491 62291",
    note: "Call or message us on WhatsApp",
  },
];

export default function LocationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const mapY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section
      ref={sectionRef}
      id="locations"
      className="bg-[#FEF7F1] relative overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: info */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-body text-[11px] font-bold uppercase tracking-[0.4em] text-[#BF5933]/60 mb-6"
          >
            Find Us
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="font-heading text-6xl md:text-8xl font-bold uppercase text-[#2D1B14] leading-[1.0] -tracking-[0.02em] mb-14"
          >
            Hidden In
            <br />
            <span
              className="font-script text-[#BF5933] normal-case lowercase text-[80px] md:text-[100px]"
              style={{ display: "inline-block", transform: "rotate(2deg)" }}
            >
              ikoyi
            </span>
          </motion.h2>

          <div className="space-y-6">
            {details.map((d, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="flex items-start gap-5 group"
              >
                <div className="w-12 h-12 rounded-[16px] bg-[#BF5933]/8 text-[#BF5933] flex items-center justify-center flex-shrink-0 group-hover:bg-[#BF5933] group-hover:text-[#FEF7F1] transition-all duration-300 shadow-sm">
                  {d.icon}
                </div>
                <div>
                  <p className="font-body text-[10px] font-bold uppercase tracking-[0.35em] text-[#BF5933]/40 mb-1">
                    {d.title}
                  </p>
                  <p className="font-heading text-xl font-bold uppercase text-[#2D1B14] leading-tight mb-0.5">
                    {d.value}
                  </p>
                  <p className="font-body text-[13px] text-[#2D1B14]/40 font-medium">
                    {d.note}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4 mt-12"
          >
            {[IGIcon, FBIcon].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-12 h-12 rounded-[16px] bg-[#BF5933]/8 text-[#BF5933] flex items-center justify-center hover:bg-[#BF5933] hover:text-[#FEF7F1] transition-all hover:-translate-y-1 shadow-sm"
              >
                <Icon />
              </a>
            ))}
            <a
              href="https://wa.me/2347000000000"
              className="flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-full font-body text-sm font-bold hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.6 6.4A7.94 7.94 0 0 0 12 4a8 8 0 0 0-8 8c0 1.4.4 2.8 1 4L4 20l4.1-1.1A8 8 0 0 0 20 12c0-2.1-.8-4.1-2.4-5.6ZM12 18.5A6.5 6.5 0 1 1 18.5 12 6.5 6.5 0 0 1 12 18.5Zm3.6-4.8c-.2-.1-1.2-.6-1.4-.6s-.3-.1-.4.1-.5.6-.6.8-.2.1-.4 0a5.2 5.2 0 0 1-2.6-2.3c-.2-.3 0-.4.1-.6l.4-.4c.1-.2.1-.3.2-.5s0-.3-.1-.4L10 9.7c-.2-.4-.4-.3-.6-.3H9c-.2 0-.4.1-.6.3A3.6 3.6 0 0 0 7.3 12a6.3 6.3 0 0 0 1.3 3.3C10 17.2 11.8 18 13.2 18c.8 0 1.7-.2 2.2-.7a2 2 0 0 0 .7-1.3c0-.2-.6-1.2-.5-1.3Z" />
              </svg>
              WhatsApp
            </a>
          </motion.div>
        </div>

        {/* Right: map */}
        <motion.div
          style={{ y: mapY }}
          className="relative rounded-[48px] overflow-hidden shadow-2xl will-change-transform"
        >
          {/* Inner card image strip */}
          <div className="grid grid-cols-2 gap-2 mb-2 min-h-[250px] md:min-h-[300px]">
            {[
              "/assets/SaveGram.App_649178524_18095381855473296_1521200727115128491_n.jpg",
              "/assets/SaveGram.App_650726946_18096602135473296_180380354425029292_n.jpg",
            ].map((src, i) => (
              <div
                key={i}
                className={`relative w-full h-[250px] md:h-[300px] overflow-hidden ${i === 0 ? "rounded-tl-[48px] rounded-tr-[16px]" : "rounded-tl-[16px] rounded-tr-[48px]"} img-zoom`}
              >
                <Image 
                  src={src} 
                  alt="" 
                  fill 
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover" 
                />
              </div>
            ))}
          </div>

          {/* Map embed */}
          <div className="relative h-80 rounded-b-[48px] overflow-hidden bg-[#DAA28B]/20">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.717145241474!2d3.43003261!3d6.4431872!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8cc408ec739d%3A0xc3b5ed1d2d0c75a!2s42%20Glover%20Rd%2C%20Ikoyi%20106104%2C%20Lagos!5e0!3m2!1sen!2sng!4v1711234567890!5m2!1sen!2sng"
              className="absolute inset-0 w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {/* Warm tint */}
            <div className="absolute inset-0 bg-[#BF5933]/10 mix-blend-multiply pointer-events-none" />
          </div>

          {/* Bottom info chip */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#2D1B14]/90 backdrop-blur-sm text-[#FEF7F1] px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-[#BF5933] animate-pulse" />
            <span className="font-body text-xs font-semibold">
              42 Glover Road, Ikoyi
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
