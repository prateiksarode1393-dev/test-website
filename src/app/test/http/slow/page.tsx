'use client';

import React, { useState, useEffect } from 'react';
export const dynamic = 'force-static';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe, Zap } from 'lucide-react';
import Link from 'next/link';

export default function SlowLoris() {
  const [status, setStatus] = useState('waiting');

  useEffect(() => {
    // Simulation of a Slow-Loris response.
    // We don't actually slow the TCP socket (which requires a proxy),
    // but we simulate the "hanging" UI a crawler sees.
    const timer = setTimeout(() => {
      setStatus('loaded');
    }, 15000); // 15 second extreme delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-20">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">Slow <span className="text-purple-500">Loris</span></h1>
          <p className="text-slate-400">Testing crawler timeouts & hanging connection handling</p>
        </div >
        <Link href="/test/http" className="p-3 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div >

      <div className="p-12 rounded-3xl bg-[#0f0f12] border border-slate-800 text-center space-y-8">
        {status === 'waiting' ? (
          <div className="space-y-6">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-2xl font-bold text-slate-300">Simulating Slow Response...</h2>
            <p className="text-slate-500 font-mono">Sending 1 byte every 5 seconds (simulated)</p>
          </div >
        ) : (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-green-400">Payload Finally Received!</h2>
            <p className="text-slate-300">The connection stayed open long enough to eventually deliver the content.</p>
          </div >
        )}
      </div >
    </div >
  );
}

