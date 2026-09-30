'use client';

import React, { useState, useEffect } from 'react';
export const dynamic = 'force-static';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function DelayedRendering() {
  const [isRendered, setIsRendered] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    const renderTimer = setTimeout(() => {
      setIsRendered(true);
    }, 10000); // Fixed 10s delay

    return () => {
      clearInterval(timer);
      clearTimeout(renderTimer);
    };
  }, []);

  if (!isRendered) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-slate-800 border-t-orange-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">
            {countdown}
          </div >
        </div >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Loading Content...</h1>
          <p className="text-slate-500 font-mono">Executing async hydration script...</p>
        </div >
      </div >
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-20">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">Delayed <span className="text-orange-500">Payload</span></h1>
          <p className="text-slate-400">Content successfully injected after 10s delay</p>
        </div >
        <Link href="/test/dynamic" className="p-3 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div >

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-12 rounded-3xl bg-orange-900/10 border border-orange-500/30 space-y-6"
      >
        <div className="flex items-center gap-3 text-orange-400">
          <CheckCircle2 className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Payload Delivered</h2>
        </div >
        <p className="text-slate-300 leading-relaxed">
          If a crawler captured this page before the 10s mark, it would have seen only the loading screen.
          This tests the <code className="text-orange-400">wait_until</code> logic of the automation script.
        </p>
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="p-4 rounded-xl bg-black/40 border border-orange-500/20">
            <span className="block text-xs text-slate-500 uppercase mb-1">Secret Key</span>
            <span className="font-mono text-white">CHAOS_DELAYED_VAL_99</span>
          </div >
          <div className="p-4 rounded-xl bg-black/40 border border-orange-500/20">
            <span className="block text-xs text-slate-500 uppercase mb-1">Target URL</span>
            <span className="font-mono text-white">https://chaosnet.local/vault/hidden</span>
          </div >
        </div >
      </motion.div>
    </div >
  );
}

