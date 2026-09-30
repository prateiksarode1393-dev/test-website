'use client';

import React, { useState, useEffect, useRef } from 'react';
export const dynamic = 'force-static';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function InfiniteScroll() {
  const [items, setItems] = useState(Array.from({ length: 20 }, (_, i) => i + 1));
  const loaderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [items]);

  const loadMore = () => {
    setItems((prev) => {
      const lastItem = prev[prev.length - 1];
      return [...prev, ...Array.from({ length: 20 }, (_, i) => lastItem + i + 1)];
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">Infinite <span className="text-pink-500">Scroll Trap</span></h1>
          <p className="text-slate-400">Testing IntersectionObserver & Dynamic Hydration</p>
        </div >
        <Link href="/test/dom" className="p-3 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div >

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="aspect-square rounded-2xl bg-[#0f0f12] border border-slate-800 flex flex-col items-center justify-center p-4 group hover:border-pink-500/50 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-pink-500 mb-3 group-hover:bg-pink-500 group-hover:text-white transition-all">
              <Zap className="w-6 h-6" />
            </div >
            <span className="text-white font-bold">Item {item}</span>
            <span className="text-slate-500 text-xs">Fragment {Math.random().toString(36).substr(2, 5)}</span>
          </motion.div>
        ))}
      </div >

      <div ref={loaderRef} className="w-full py-12 flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-mono text-sm">Loading next fragment...</p>
      </div >
    </div >
  );
}

