'use client';

export const runtime = 'edge';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function HydrationMismatch() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-20">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">Hydration <span className="text-orange-500">Mismatch</span></h1>
          <p className="text-slate-400">Testing Server-Side vs Client-Side state consistency</p>
        </div >
        <Link href="/test/dom" className="p-3 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div >

      <div className="p-12 rounded-3xl bg-[#0f0f12] border border-slate-800 space-y-8">
        <div className="flex items-center gap-4">
          <AlertCircle className="w-8 h-8 text-orange-500" />
          <h2 className="text-2xl font-bold text-white">State Conflict</h2>
        </div >

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl bg-black/40 border border-slate-800 space-y-4">
            <span className="text-xs font-mono text-slate-500 uppercase">Server Version</span>
            <p className="text-xl font-bold text-slate-400">Value: 100</p>
            <p className="text-xs text-slate-600 italic">This is what the crawler sees in the initial HTML.</p>
          </div >
          <div className="p-6 rounded-2xl bg-orange-900/10 border border-orange-500/30 space-y-4">
            <span className="text-xs font-mono text-orange-400 uppercase">Client Version</span>
            <p className="text-xl font-bold text-white">{isClient ? 'Value: 999' : 'Loading...'}</p>
            <p className="text-xs text-slate-400 italic">This is what appears after JS hydration.</p>
          </div >
        </div >

        <div className="p-6 rounded-2xl bg-black/40 border border-slate-800 space-y-2">
          <p className="text-sm text-slate-400">
            <strong className="text-white">Challenge:</strong> Does your crawler capture the initial server state or wait for the hydration mismatch to resolve?
          </p>
        </div >
      </div >
    </div >
  );
}
