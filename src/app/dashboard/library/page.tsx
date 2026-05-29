"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { ARTICLES, ARTICLE_CATEGORIES } from "@/lib/constants";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function LibraryPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredArticles =
    activeCategory === "All"
      ? ARTICLES
      : ARTICLES.filter((a) => a.category === activeCategory);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="space-y-6"
    >
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary mb-2">
          Learning Library
        </h1>
        <p className="text-text-muted text-base">
          Warm, simple articles to help you understand and navigate your
          emotions.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
        {ARTICLE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "pill shrink-0 transition-all duration-300",
              activeCategory === cat
                ? "pill-teal"
                : "bg-card-soft/40 text-text-muted border border-glass-border hover:text-text-secondary"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Article Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredArticles.map((article, i) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: i * 0.05,
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="glass-card p-5 group cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <span className="pill pill-teal text-[0.625rem]">
                {article.category}
              </span>
              <span className="text-[0.6875rem] text-text-muted shrink-0">
                {article.readTime}
              </span>
            </div>
            <h3 className="font-display text-lg font-semibold text-text-primary mb-1.5 group-hover:text-teal transition-colors">
              {article.title}
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">
              {article.description}
            </p>
            <button className="mt-4 text-sm font-medium text-teal hover:text-teal-strong transition-colors">
              Read article →
            </button>
          </motion.div>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-[0.6875rem] text-text-muted/50 text-center pt-4">
        These articles are for educational purposes only and are not a
        substitute for professional advice.
      </p>
    </motion.div>
  );
}
