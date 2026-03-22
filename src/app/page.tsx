import React from "react";

import HeroSection from "@/components/HeroSection";
import DailyLineupSection from "@/components/DailyLineupSection";
import StatementSection from "@/components/StatementSection";
import FounderSection from "@/components/FounderSection";
import TestimonialSection from "@/components/TestimonialSection";
import LocationSection from "@/components/LocationSection";
import GallerySection from "@/components/GallerySection";
import ReservationForm from "@/components/ReservationForm";
import Footer from "@/components/Footer";

/**
 * Main Homepage for Golden Crust.
 * Production-ready artisanal bakery landing page.
 */
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <HeroSection />
      {/* Dark lineup section with stacked cards + dual marquee */}
      <DailyLineupSection />

      {/* 3D Dome Gallery, Hidden Gem Parallax & Circular Ingredient Carousel */}
      <GallerySection />

      {/* Brand philosophy with parallax image + process steps */}
      <StatementSection />

      {/* Story section with full-bleed parallax + pillars */}
      <FounderSection />

      {/* Social proof with dark testimonials + metrics */}
      <TestimonialSection />

      {/* Location with parallax map + asset strip */}
      <LocationSection />

      {/* Reservation Section */}
      <ReservationForm />

      <Footer />
    </div>
  );
}
