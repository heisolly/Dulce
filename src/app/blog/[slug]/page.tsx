"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import Footer from "@/components/Footer";

const supabase = createClient();

const ArrowLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 9H3M3 9l5-5M3 9l5 5" />
  </svg>
);

const FALLBACK: Record<string, { title: string; content: string; excerpt: string; category: string; author_name: string; cover_image: string; published_at: string; read_time: number }> = {
  "perfect-croissant-process": {
    title: "The Art of the Perfect Croissant: Our 72-Hour Process",
    excerpt: "Every layer of our signature croissant is a testament to patience.",
    content: `Our croissants are not made in a hurry. The process starts 72 hours before the first customer walks through our door. We begin with the détrempe — the dough — made with high-protein flour from a trusted miller in Ogun State. The butter block is sourced from a French supplier who understands that quality is non-negotiable.

The folding. The lamination. The chill periods between each fold. Each step is deliberate, each skip is expensive. It's a discipline more than a recipe.

When you bite into our croissant and feel the shattering crust give way to a cloud-soft, honeycomb interior, that's 72 hours in your hands.

That's what we believe in at Dulce: slowness in an age of shortcuts.`,
    category: "Behind the Scenes",
    author_name: "Chef Adaeze",
    cover_image: "/assets/SaveGram.App_638289208_18093782288473296_5700725885681164176_n.jpg",
    published_at: "2026-03-15",
    read_time: 5,
  },
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .or(`slug.eq.${params.slug},id.eq.${params.slug}`)
        .single();

      if (data) {
        setPost(data);
      } else {
        setPost(FALLBACK[params.slug] || null);
      }
      setLoading(false);
    };
    load();
  }, [params.slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FEF7F1] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-10 h-10 rounded-full border-2 border-[#BF5933]/20 border-t-[#BF5933]"
          />
          <p className="font-heading text-[11px] font-black uppercase tracking-[0.4em] text-[#2D1B14]/40">Loading story…</p>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-[#FEF7F1] flex flex-col items-center justify-center gap-8">
        <span className="text-6xl">📖</span>
        <p className="font-heading font-black uppercase text-[#2D1B14]/30 text-3xl tracking-tighter">Story not found</p>
        <Link href="/blog" className="font-heading text-[11px] font-black uppercase tracking-widest text-[#BF5933] underline underline-offset-4">
          ← Back to Journal
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FEF7F1] overflow-x-hidden">
      <div className="grain-overlay" aria-hidden="true" />

      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={post.cover_image || "/assets/SaveGram.App_638289208_18093782288473296_5700725885681164176_n.jpg"}
            alt={post.title}
            fill priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2D1B14]/30 via-[#2D1B14]/50 to-[#FEF7F1]" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-8 left-8 z-20"
        >
          <Link href="/blog" className="inline-flex items-center gap-3 font-heading text-[10px] font-black uppercase tracking-[0.4em] text-[#FEF7F1]/60 hover:text-[#DAA28B] transition-all group">
            <span className="w-9 h-9 rounded-full border border-[#FEF7F1]/20 flex items-center justify-center group-hover:border-[#DAA28B]/60 group-hover:bg-[#DAA28B]/10 transition-all">
              <ArrowLeftIcon />
            </span>
            Journal
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-[900px] mx-auto px-6 md:px-12 pb-16 w-full"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#BF5933]/20 backdrop-blur-sm rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DAA28B]" />
            <span className="font-heading text-[10px] font-black uppercase tracking-[0.4em] text-[#DAA28B]">{post.category}</span>
          </div>
          <h1 className="font-heading font-black uppercase text-[#FEF7F1] text-[clamp(32px,6vw,72px)] leading-[0.88] tracking-tighter mb-6">
            {post.title}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#DAA28B]/40 flex items-center justify-center font-heading font-black text-white text-sm">
              {post.author_name?.[0]}
            </div>
            <div>
              <p className="font-heading font-black uppercase text-[#FEF7F1] text-xs tracking-wider">{post.author_name}</p>
              <p className="font-body text-[#FEF7F1]/40 text-xs">
                {new Date(post.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                {post.read_time && ` · ${post.read_time} min read`}
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Article Body */}
      <article className="max-w-[760px] mx-auto px-6 md:px-12 py-16">
        {post.excerpt && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-body text-[#2D1B14]/70 text-xl leading-relaxed mb-12 italic border-l-4 border-[#BF5933] pl-6"
          >
            {post.excerpt}
          </motion.p>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-lg font-body text-[#2D1B14]/75 leading-relaxed space-y-6"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {(post.content || "").split("\n\n").map((para: string, i: number) => (
            <p key={i} className="text-[17px] leading-[1.8] text-[#2D1B14]/70">
              {para}
            </p>
          ))}
        </motion.div>

        {/* Share / Back */}
        <div className="flex items-center justify-between mt-20 pt-10 border-t border-[#2D1B14]/8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-3 font-heading text-[11px] font-black uppercase tracking-widest text-[#2D1B14]/40 hover:text-[#BF5933] transition-colors"
          >
            <ArrowLeftIcon />
            Back to Journal
          </Link>
          <div className="flex items-center gap-4">
            <span className="font-heading text-[10px] font-black uppercase tracking-[0.35em] text-[#2D1B14]/30">Share</span>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://dulcecafe.ng/blog/${post.slug || post.id}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-[#2D1B14]/5 flex items-center justify-center text-[#2D1B14]/50 hover:bg-[#BF5933] hover:text-white transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}
