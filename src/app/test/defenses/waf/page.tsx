'use client';

export const runtime = 'edge';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, AlertTriangle, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function WAFSimulation() {
  const [isBlocked, setIsBlocked] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Simulation of WAF Header Inspection
    const ua = navigator.userAgent.toLowerCase();
    const isHeadless = ua.includes('headless') || ua.includes('python') || ua.includes('bot') || ua.includes('crawl');

    const timer = setTimeout(() => {
      setIsBlocked(isHeadless);
      setIsChecking(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 font-mono animate-pulse">Inspecting Request Headers...</p>
      </div >
    );
  }

  if (isBlocked) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full p-12 rounded-3xl bg-red-900/10 border border-red-500/30 text-center space-y-8 shadow-2xl"
        >
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
              <Lock className="w-10 h-10" />
            </div >
          </div >
          <h1 className="text-4xl font-bold text-white">Access Denied</h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Your request has been blocked by the ChaosNet WAF. <br />
            <span className="text-red-400 font-mono text-sm">Reason: Headless Browser / Bot Signature Detected</span>
          </p>
          <div className="p-4 rounded-xl bg-black/40 border border-red-500/20 font-mono text-xs text-red-300 text-left">
            Error Code: 403_FORBIDDEN_BOT_DETECTION<br />
            Request-ID: {Math.random().toString(36).substr(2, 9)}
          </div >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition-all border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" /> Return Home
          </Link>
        </motion.div>
      </div >
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white tracking-tight">WAF <span className="text-yellow-500">Simulation</span></h1>
        <p className="text-slate-400 max-w-2xl">
          This page simulates a Cloudflare-style WAF. It inspects the User-Agent and behavioral signatures.
          Clean browsers pass; headless crawlers are blocked with a 403.
        </p>
      </div >
      <div className="p-12 rounded-3xl bg-green-900/10 border border-green-500/30 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
            <ShieldAlert className="w-8 h-8" />
          </div >
        </div >
        <h2 className="text-3xl font-bold text-white">Clearance Granted</h2>
        <p className="text-slate-400">Your browser identity is recognized as human. You have bypassed the WAF challenge.</p>
      </div >
    </div >
  );
}
