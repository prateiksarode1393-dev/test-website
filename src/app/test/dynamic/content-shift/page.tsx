'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, AlertTriangle, RefreshCw, ArrowLeft, Zap, Box, MousePointer2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ContentShiftPage() {
  const [shift, setShift] = useState(0);
  const [items, setItems] = useState([
    { id: 1, title: 'Stable Element A', content: 'I am a reliable piece of content that stays put.', color: 'bg-blue-500/20 border-blue-500/50 text-blue-400', isAd: false },
    { id: 2, title: 'Stable Element B', content: 'I am also stable, unless the chaos engine kicks in.', color: 'bg-purple-500/20 border-purple-500/50 text-purple-400', isAd: false },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly inject "Ads" or "Banners" that push content down (Layout Shift)
      setItems(prev => {
        if (Math.random() > 0.7) {
          const newAd = {
            id: Date.now(),
            title: '⚠️ SPONSORED CONTENT',
            content: 'This is a simulated layout shift that pushes everything down!',
            color: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
            isAd: true
          };
          return [newAd, ...prev];
        }
        // Remove ads over time
        return prev.filter(item => !item.isAd || Math.random() > 0.5);
      });

      setShift(Math.random() * 40 - 20);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/test/dynamic" className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-white">Content Shift Chaos</h1>
      </div >

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-3xl bg-[#0f0f12] border border-slate-800 space-y-4">
            <div className="flex items-center gap-3 text-orange-400">
              <Layout className="w-6 h-6" />
              <h2 className="text-xl font-bold">The Trap</h2>
            </div >
            <p className="text-slate-500 text-sm leading-relaxed">
              This page simulates <span className="text-orange-300 font-mono">Cumulative Layout Shift (CLS)</span>.
              Elements will suddenly appear or move, challenging the crawler's ability to
              track elements and handle dynamic DOM mutations.
            </p>
            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono">
              STATUS: Injecting instability...
            </div >
          </div >
        </div >

        <div className="lg:col-span-2 space-y-6">
          <div
            className="p-8 rounded-3xl bg-[#0f0f12] border border-slate-800 min-h-[500px] transition-transform duration-500 max-w-full box-border"
            style={{ transform: `translateX(${shift}px)`, width: '100%' }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white">Live Content Stream</h2>
              <RefreshCw className="w-5 h-5 text-slate-600 animate-spin-slow" />
            </div >

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, height: 0, scale: 0.9 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.9 }}
                    className={cn(
                      "p-6 rounded-2xl border transition-colors",
                      item.color || "bg-slate-900 border-slate-800 text-slate-300"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {item.isAd ? <AlertTriangle className="w-4 h-4" /> : <Box className="w-4 h-4" />}
                      <span className="font-bold uppercase tracking-wider text-xs">{item.title}</span>
                    </div >
                    <p className="text-sm opacity-90">{item.content}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div >
          </div >
        </div >
      </div >
    </div >
  );
}
