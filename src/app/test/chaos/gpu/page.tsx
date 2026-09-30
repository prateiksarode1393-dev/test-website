'use client';

export const runtime = 'edge';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Cpu, Zap } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function GPUStress() {
  const [level, setLevel] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setLevel(prev => (prev < 3 ? prev + 1 : 1));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-20">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">GPU <span className="text-orange-500">Stress Test</span></h1>
          <p className="text-slate-400">Automatic Load Scaling: Level 1 $\to$ 2 $\to$ 3 every 10s</p>
        </div >
        <Link href="/test/chaos" className="p-3 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div >

      <div className="p-12 rounded-3xl bg-[#0f0f12] border border-slate-800 text-center space-y-12">
        <div className="flex justify-center gap-4">
          {[1, 2, 3].map(l => (
            <div key={l} className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-500",
              level === l ? "bg-orange-500 text-white scale-125 shadow-lg shadow-orange-500/50" : "bg-slate-800 text-slate-500"
            )}>
              {l}
            </div >
          ))}
        </div >

        <div className="relative h-96 w-full rounded-2xl bg-black overflow-hidden border border-slate-800">
          {Array.from({ length: level * 100 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                rotate: 360,
                scale: [1, 1.5, 1],
                x: [0, Math.random() * 200 - 100, 0],
                y: [0, Math.random() * 200 - 100, 0],
              }}
              transition={{
                duration: 2 / level,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute w-16 h-16 border-2 border-orange-500/30 rounded-full blur-sm"
              style={{ left: '50%', top: '50%', transformStyle: 'preserve-3d' }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h2 className="text-6xl font-black text-orange-500/20 uppercase tracking-tighter">Level {level}</h2>
          </div >
        </div >
        <p className="text-slate-500 font-mono">Current GPU load factor: {level * 100}%</p>
      </div >
    </div >
  );
}
