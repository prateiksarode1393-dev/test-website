'use client';

import React, { useState, useEffect } from 'react';
export const dynamic = 'force-static';
import { motion } from 'framer-motion';
import { ArrowLeft, Skull, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function OOMTrap() {
  const [memoryUsed, setMemoryUsed] = useState(0);
  const memoryRef = React.useRef<any[]>([]);

  useEffect(() => {
    // AUTO-TRIGGER: Crawler doesn't click buttons.
    // We start the leak immediately on mount.
    const leak = () => {
      for (let i = 0; i < 1000; i++) {
        memoryRef.current.push(new Array(100).fill({
          id: Math.random(),
          data: new Array(100).fill('CHAOS_MEM_LEAK_DATA_BLOCK_X_9999'),
          timestamp: Date.now(),
        }));
      }
      setMemoryUsed(prev => prev + 1);
      requestAnimationFrame(leak);
    };
    requestAnimationFrame(leak);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-20">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">Memory <span className="text-red-500">Leak Trap</span></h1>
          <p className="text-slate-400">Automatic Heap Exhaustion (No interaction required)</p>
        </div >
        <Link href="/test/chaos" className="p-3 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div >

      <motion.div
        className="p-12 rounded-3xl bg-red-900/20 border border-red-500 shadow-2xl shadow-red-500/20 text-center space-y-8"
      >
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-red-500 text-white flex items-center justify-center animate-pulse">
            <Skull className="w-10 h-10" />
          </div >
        </div >
        <h2 className="text-3xl font-bold text-white">Ticking Time Bomb</h2>
        <p className="text-slate-300 max-w-md mx-auto">
          This page is currently allocating memory exponentially.
          The browser tab will crash once the heap limit is reached.
        </p>
        <div className="flex flex-col items-center gap-4">
          <div className="w-64 h-3 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-red-500"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 15, ease: 'linear' }}
            />
          </div >
          <span className="text-xs font-mono text-red-400">Blocks Allocated: {memoryUsed * 1000}</span>
        </div >
      </motion.div>
    </div >
  );
}

