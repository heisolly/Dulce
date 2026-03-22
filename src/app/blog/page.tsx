"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import Footer from "@/components/Footer";

const supabase = createClient();

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  category: string | null
  author_name: string | null
  author_image?: string | null
  cover_image?: string | null
  published_at: string
  read_time?: number | null
  featured?: boolean | null
}

const CATEGORIES = ["All", "Behind the Scenes", "Recipes", "Events", "Culture", "Lifestyle"];

const FALLBACK_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "The Art of the Perfect Croissant: Our 72-Hour Process",
    slug: "perfect-croissant-process",
    excerpt: "Every layer of our signature croissant is a testament to patience. Here's how we achieve the perfect honeycomb interior.",
    content: "",
    category: "Behind the Scenes",
    author_name: "Chef Adaeze",
    cover_image: "/assets/SaveGram.App_638289208_18093782288473296_5700725885681164176_n.jpg",
    published_at: "2026-03-15",
    read_time: 5,
    featured: true,
  },
  {
    id: "2",
    title: "Lagos's Best Brunch Spots and Why We're Among Them",
    slug: "lagos-best-brunch",
    excerpt: "We sat down with food writers from across the city to talk about what makes a brunch experience truly memorable.",
    content: "",
    category: "Culture",
    author_name: "The Dulce Team",
    cover_image: "/assets/SaveGram.App_652044208_18096602171473296_7123593077978161000_n.jpg",
    published_at: "2026-03-08",
    read_time: 4,
  },
  {
    id: "3",
    title: "How We Source Our Ingredients from Lagos Island Farmers",
    slug: "local-ingredient-sourcing",
    excerpt: "Our relationships with local growers aren't just ethical — they're what make the difference in every bite.",
    content: "",
    category: "Behind the Scenes",
    author_name: "Chef Emeka",
    cover_image: "/assets/SaveGram.App_625116915_18091789997473296_1570557760193326201_n.jpg",
    published_at: "2026-02-28",
    read_time: 6,
  },
  {
    id: "4",
    title: "Our Valentine's Day Pop-Up Was Pure Magic",
    slug: "valentines-popup",
    excerpt: "Over 80 couples dined with us on Valentine's Day. Here's how we turned the space into something truly unforgettable.",
    content: "",
    category: "Events",
    author_name: "The Dulce Team",
    cover_image: "/assets/SaveGram.App_640384807_18094591409473296_167242608410445082_n.jpg",
    published_at: "2026-02-15",
    read_time: 3,
  },
  {
    id: "5",
    title: "Our Morning Mochi Recipe (Adapted for Home Kitchens)",
    slug: "morning-mochi-recipe",
    excerpt: "One of our most-requested recipes — our signature mochi, simplified so you can try it at home this weekend.",
    content: "",
    category: "Recipes",
    author_name: "Chef Adaeze",
    cover_image: "/assets/SaveGram.App_641221621_18093782297473296_1139418546164141333_n.jpg",
    published_at: "2026-02-10",
    read_time: 7,
  },
];

const ArrowLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 9H3M3 9l5-5M3 9l5 5" />
  </svg>
);

export default function BlogPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);

  const [posts, setPosts] = useState<BlogPost[]>(FALLBACK_POSTS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (data && data.length > 0) {
        setPosts(data);
      }
      setLoading(false);
    };
    load();
  }, []);

  const filteredPosts = activeCategory === "All"
    ? posts
    : posts.filter(p => p.category === activeCategory);

  const featuredPost = filteredPosts.find(p => p.featured) || filteredPosts[0];
  const restPosts = filteredPosts.filter(p => p.id !== featuredPost?.id);

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
                Stories & Insights
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="font-heading font-black uppercase text-[#FEF7F1] leading-[0.85] tracking-tighter">
                <span className="block text-[clamp(52px,8vw,96px)]">THE</span>
                <span className="block text-[clamp(52px,8vw,96px)]">DULCE</span>
                <span className="block font-script lowercase normal-case italic text-[#DAA28B] text-[clamp(60px,9.5vw,114px)] leading-[0.72] tracking-normal">
                  journal.
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="font-body text-white/45 text-[17px] mt-8 leading-relaxed max-w-[400px]"
            >
              Stories from behind the counter. Recipes, culture, events — everything that makes Dulce, Dulce.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="flex items-center gap-8 mt-12"
            >
              {[
                { value: "50+", label: "Stories" },
                { value: "Weekly", label: "Updates" },
                { value: "Free", label: "Recipes" },
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
          <motion.div style={{ y: heroY }} className="absolute inset-0">
            <Image
              src="/assets/SaveGram.App_649178524_18095381855473296_1521200727115128491_n.jpg"
              alt="Dulce stories"
              fill priority
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#2D1B14]/30 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#2D1B14] lg:via-[#2D1B14]/5 lg:to-transparent" />
        </div>
      </section>

      {/* ── Category Filters ── */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 pt-16 pb-8">
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`px-6 py-3 rounded-2xl font-heading text-[11px] font-black uppercase tracking-[0.3em] border-2 transition-all ${
                activeCategory === cat
                  ? "bg-[#BF5933] border-[#BF5933] text-white shadow-[0_8px_24px_rgba(191,89,51,0.25)]"
                  : "bg-white border-[#2D1B14]/10 text-[#2D1B14]/50 hover:border-[#BF5933]/30 hover:text-[#BF5933]"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </section>

      {/* ── Posts ── */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {loading ? (
              /* Skeleton */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <div className="aspect-[4/3] bg-[#2D1B14]/8 rounded-[36px] animate-pulse" />
                <div className="flex flex-col gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-32 bg-[#2D1B14]/8 rounded-[28px] animate-pulse" />
                  ))}
                </div>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <span className="text-6xl mb-6">✍️</span>
                <p className="font-heading font-black uppercase text-[#2D1B14]/20 text-3xl tracking-tighter">No posts yet</p>
                <p className="font-body text-[#2D1B14]/30 text-sm mt-2 italic">Stories are being crafted.</p>
              </div>
            ) : (
              <>
                {/* Featured Post */}
                {featuredPost && (
                  <div className="mb-12">
                    <Link href={`/blog/${featuredPost.slug || featuredPost.id}`} className="group block">
                      <motion.div
                        className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-[48px] overflow-hidden shadow-[0_32px_80px_rgba(45,27,20,0.12)] hover:shadow-[0_40px_100px_rgba(45,27,20,0.18)] transition-all duration-700"
                        whileHover={{ scale: 1.005 }}
                      >
                        {/* Image */}
                        <div className="relative aspect-[4/3] lg:aspect-auto min-h-[400px] overflow-hidden">
                          <Image
                            src={featuredPost.cover_image || "/assets/SaveGram.App_638289208_18093782288473296_5700725885681164176_n.jpg"}
                            alt={featuredPost.title}
                            fill
                            className="object-cover transition-transform duration-[2s] group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent lg:to-[#FEF7F1] via-transparent" />
                        </div>
                        {/* Content */}
                        <div className="bg-[#FEF7F1] p-10 md:p-14 flex flex-col justify-center">
                          <div className="flex items-center gap-3 mb-6">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#BF5933]/10 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#BF5933]" />
                              <span className="font-heading text-[10px] font-black uppercase tracking-[0.4em] text-[#BF5933]">{featuredPost.category}</span>
                            </span>
                            {featuredPost.featured && (
                              <span className="px-4 py-2 bg-[#DAA28B]/15 rounded-full font-heading text-[10px] font-black uppercase tracking-[0.4em] text-[#2D1B14]/50">Featured</span>
                            )}
                          </div>
                          <h2 className="font-heading font-black uppercase text-[#2D1B14] text-3xl md:text-4xl tracking-tighter leading-[0.92] mb-5">
                            {featuredPost.title}
                          </h2>
                          <p className="font-body text-[#2D1B14]/55 text-base leading-relaxed mb-8">
                            {featuredPost.excerpt}
                          </p>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#DAA28B]/30 flex items-center justify-center font-heading font-black text-[#BF5933] text-sm">
                              {(featuredPost.author_name ?? "D")[0]}
                            </div>
                            <div>
                              <p className="font-heading font-black uppercase text-[#2D1B14] text-xs tracking-wider">{featuredPost.author_name}</p>
                              <p className="font-body text-[#2D1B14]/40 text-xs">
                                {new Date(featuredPost.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                                {featuredPost.read_time && ` · ${featuredPost.read_time} min read`}
                              </p>
                            </div>
                            <div className="ml-auto flex items-center gap-2 font-heading text-[11px] font-black uppercase tracking-wider text-[#BF5933]">
                              Read More
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M2 7h10M8 2l5 5-5 5" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </div>
                )}

                {/* Grid of remaining posts */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {restPosts.map((post, i) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <Link href={`/blog/${post.slug || post.id}`} className="group block h-full">
                        <div className="bg-white rounded-[36px] overflow-hidden shadow-sm hover:shadow-[0_20px_60px_rgba(45,27,20,0.1)] transition-all duration-500 flex flex-col h-full border border-[#2D1B14]/5">
                          {/* Image */}
                          <div className="relative h-56 overflow-hidden">
                            <Image
                              src={post.cover_image || "/assets/SaveGram.App_638289208_18093782288473296_5700725885681164176_n.jpg"}
                              alt={post.title}
                              fill
                              className="object-cover transition-transform duration-[1.5s] group-hover:scale-108"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B14]/40 via-transparent to-transparent" />
                            <div className="absolute top-4 left-4">
                              <span className="px-3 py-1.5 bg-[#FEF7F1]/90 backdrop-blur-sm rounded-full font-heading text-[9px] font-black uppercase tracking-[0.4em] text-[#BF5933]">
                                {post.category}
                              </span>
                            </div>
                          </div>
                          {/* Content */}
                          <div className="p-7 flex flex-col flex-1">
                            <h3 className="font-heading font-black uppercase text-[#2D1B14] text-xl tracking-tight leading-[0.92] mb-3 group-hover:text-[#BF5933] transition-colors">
                              {post.title}
                            </h3>
                            <p className="font-body text-[#2D1B14]/50 text-sm leading-relaxed mb-6 flex-1">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center gap-3 pt-5 border-t border-[#2D1B14]/5">
                              <div className="w-8 h-8 rounded-full bg-[#DAA28B]/25 flex items-center justify-center font-heading font-black text-[#BF5933] text-xs">
                                {(post.author_name ?? "D")[0]}
                              </div>
                              <div className="flex-1">
                                <p className="font-heading font-black uppercase text-[#2D1B14] text-[10px] tracking-wider">{post.author_name}</p>
                                <p className="font-body text-[#2D1B14]/35 text-[11px]">
                                  {new Date(post.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                                  {post.read_time && ` · ${post.read_time}m`}
                                </p>
                              </div>
                              <span className="text-[#BF5933]/50 group-hover:text-[#BF5933] transition-colors">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                  <path d="M3 8h10M8 3l5 5-5 5" />
                                </svg>
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-24 bg-[#2D1B14] rounded-[48px] p-12 md:p-20 text-center overflow-hidden relative"
        >
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#BF5933]/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-[#DAA28B]/10 rounded-full blur-[60px] pointer-events-none" />
          <div className="relative z-10">
            <p className="font-heading text-[10px] font-black uppercase tracking-[0.55em] text-[#DAA28B]/70 mb-6">Stay in the Loop</p>
            <h3 className="font-heading font-black uppercase text-[#FEF7F1] text-[clamp(28px,5vw,60px)] leading-[0.88] tracking-tighter mb-4">
              Fresh Stories,
              <br />
              <span className="font-script lowercase normal-case italic text-[#DAA28B] text-[clamp(36px,6vw,72px)] leading-[0.75]">every week.</span>
            </h3>
            <p className="font-body text-[#FEF7F1]/35 text-base max-w-sm mx-auto mb-10 leading-relaxed">
              Get our latest recipes, event announcements, and behind-the-scenes stories delivered to you.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-body text-base outline-none focus:border-[#DAA28B]/40 transition-all placeholder:text-white/30"
              />
              <button className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#BF5933] text-white font-heading text-[11px] font-black uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-white hover:text-[#BF5933] transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>
      </section>
      <Footer />
    </main>
  );
}
