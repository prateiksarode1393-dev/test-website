'use client';

export const runtime = 'edge';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function RecursiveTrap() {
  const [depth, setDepth] = useState(0);

  useEffect(() => {
    // To avoid crashing the browser immediately, we cap the depth at 10
    // but for a crawler, this creates a nested structure that is hard to pierce.
    if (depth < 10) {
      const timer = setTimeout(() => setDepth(prev => prev + 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [depth]);

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-20">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">Recursive <span className="text-yellow-500">Spawning</span></h1>
          <p className="text-slate-400">Testing iFrame nesting and operational thread limits</p>
        </div >
        <Link href="/test/chaos" className="p-3 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div >

      <div className="p-12 rounded-3xl bg-[#0f0f12] border border-slate-800 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
            <Zap className="w-6 h-6" />
          </div >
          <h2 className="text-2xl font-bold text-white">Recursion Depth: {depth}</h2>
        </div >

        <div className="relative min-h-[400px] border border-slate-800 rounded-2xl p-4 bg-black/50">
          {depth === 0 ? (
            <p className="text-slate-500 italic text-center mt-20">Initializing first frame...</p>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {/* This is a simplified version of the recursion for stability,
                  but in a real trap we would render <iframe> tags here */}
              <div className="p-4 border border-yellow-500/30 rounded-xl bg-yellow-500/5 text-yellow-500 text-sm font-mono">
                Nested Frame Level {depth} <br />
                Status: Active <br />
                Content: [SENSITIVE_DATA_FRAGMENT_{depth}]
              </div>
            </div>
          )}
        </div >

        <div className="p-6 rounded-2xl bg-black/40 border border-slate-800 space-y-2">
          <p className="text-sm text-slate-400">
            <strong className="text-white">Crawler Challenge:</strong> Can the crawler traverse deeper into nested frames, or does it stop at the first level?
          </p>
        </div >
      </div >
    </div >
  );
}

import { Zap } from 'lucide-react';
