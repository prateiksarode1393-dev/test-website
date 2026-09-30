'use client';

import React, { useState, useEffect } from 'react';
export const dynamic = 'force-static';
import { motion } from 'framer-motion';
import { RefreshCcw, ArrowLeft, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function HighFailurePage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'fail'>('loading');

  useEffect(() => {
    const timer = setTimeout(() => {
      // 75% chance of failure to test aggressive retry policies
      setStatus(Math.random() > 0.75 ? 'success' : 'fail');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <RefreshCcw className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-slate-400 font-mono">Attempting connection to unstable node...</p>
      </div >
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-20">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">High <span className={cn("text-2xl", status === 'success' ? "text-green-500" : "text-red-500")}>Failure Rate</span></h1>
          <p className="text-slate-400">Testing Aggressive Retry Mechanisms (75% Failure Rate)</p>
        </div >
        <Link href="/test/chaos" className="p-3 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div >

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("p-12 rounded-3xl border text-center space-y-8", status === 'success' ? "bg-green-900/10 border-green-500/30" : "bg-red-900/10 border-red-500/30")}
      >
        <div className="flex justify-center">
          {status === 'success' ? (
            <div className="w-20 h-20 rounded-full bg-green-500 text-white flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div >
          ) : (
            <div className="w-20 h-20 rounded-full bg-red-500 text-white flex items-center justify-center">
              <AlertTriangle className="w-10 h-10" />
            </div >
          )}
        </div >
        <h2 className="text-3xl font-bold text-white">
          {status === 'success' ? "Request Succeeded" : "Critical Server Error (500)"}
        </h2>
        <p className="text-slate-400">
          {status === 'success'
            ? "You hit the 25% success window. The crawler has successfully extracted the data."
            : "This request failed. A high-performance crawler should implement exponential backoff and retry this URL."}
        </p>
      </motion.div>
    </div >
  );
}

