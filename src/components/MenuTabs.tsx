"use client";

import { motion } from "framer-motion";

interface MenuCategoryItem {
  id: string;
  label: string;
  emoji: string;
}

interface MenuTabsProps {
  categories: MenuCategoryItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

/**
 * MenuTabs for Golden Crust.
 * Redesigned with the new Rust/Cream palette (#BF5933, #FEF7F1).
 * Features playful pill tabs with high-end animations and Fredoka typography.
 */
export default function MenuTabs({ categories, activeTab, onTabChange }: MenuTabsProps) {
  return (
    <div className="flex flex-wrap justify-center items-center gap-4 mb-24 p-4 bg-white/40 backdrop-blur-md rounded-[48px] border-4 border-[#BF5933]/5 shadow-2xl relative z-10 w-fit mx-auto">
      {categories.map((category) => {
        const isActive = activeTab === category.id;
        
        return (
          <button
            key={category.id}
            onClick={() => onTabChange(category.id)}
            className={[
              "relative px-12 py-6 rounded-full text-xs font-heading font-black uppercase tracking-[0.3em] transition-all duration-500 flex items-center gap-4 overflow-hidden group",
              isActive 
                ? "text-[#FEF7F1] shadow-2xl translate-y-[-4px]" 
                : "text-[#BF5933]/40 hover:text-[#BF5933] hover:bg-[#BF5933]/5"
            ].join(" ")}
          >
            {/* Animated Background for Active Tab Detail highlight */}
            {isActive && (
              <motion.div
                layoutId="activeTabMenuRust"
                className="absolute inset-0 bg-[#BF5933]"
                transition={{ type: "spring", bounce: 0.1, duration: 0.6 }}
              />
            )}
            
            <span className="relative z-10 flex items-center gap-4">
              <span className={`text-3xl transition-transform duration-700 ${isActive ? "scale-110 rotate-12" : "group-hover:scale-110 group-hover:-rotate-6"}`}>
                {category.emoji || "🍽️"}
              </span>
              <span className={`transition-all duration-300 ${isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}>
                {category.label}
              </span>
            </span>

            {/* Subtle glow dot highlight detail highlight decor detail section */}
            {isActive && (
              <motion.div 
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#FEF7F1] rounded-full"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
