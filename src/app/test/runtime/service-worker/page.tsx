'use client';

import React, { useEffect, useState } from 'react';
export const dynamic = 'force-static';
import { motion } from 'framer-motion';
import { ShieldCheck, RefreshCw, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ServiceWorkerPage() {
  const [status, setStatus] = useState<'installing' | 'active' | 'unknown'>('unknown');
  const [secretData, setSecretData] = useState<string | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          console.log('SW registered:', reg);
          setStatus('installing');

          // Check if already active
          if (navigator.serviceWorker.controller) {
            setStatus('active');
          }
        })
        .catch((err) => console.error('SW registration failed:', err));
    }
  }, []);

  const fetchSecret = async () => {
    try {
      const res = await fetch('/test/runtime/service-worker/secret-data');
      const text = await res.text();
      setSecretData(text);
    } catch (err) {
      setSecretData('Error fetching secret');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/test/runtime" className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-white">Service Worker Trap</h1>
      </div >

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-3xl bg-[#0f0f12] border border-slate-800 space-y-6"
        >
          <div className="flex items-center gap-3 text-blue-400">
            <ShieldCheck className="w-6 h-6" />
            <h2 className="text-xl font-bold">Registration Status</h2>
          </div >

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className={cn(
              "w-3 h-3 rounded-full animate-pulse",
              status === 'active' ? "bg-green-500" : status === 'installing' ? "bg-yellow-500" : "bg-red-500"
            )} />
            <span className="text-slate-300 font-mono capitalize">{status}</span>
          </div >

          <p className="text-slate-500 text-sm">
            This page registers a Service Worker at <code className="text-blue-300">/sw.js</code>.
            The worker intercepts the "Secret Data" request below.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-8 rounded-3xl bg-[#0f0f12] border border-slate-800 space-y-6"
        >
          <div className="flex items-center gap-3 text-yellow-400">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-xl font-bold">Intercept Test</h2>
          </div >

          <button
            onClick={fetchSecret}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all"
          >
            Fetch Secret Data
          </button>

          <div className="p-4 rounded-xl bg-black border border-slate-800 min-h-[60px] flex items-center justify-center text-center">
            <span className={cn("font-mono text-sm", secretData ? "text-green-400" : "text-slate-600")}>
              {secretData || "No data fetched yet..."}
            </span>
          </div >
        </motion.div>
      </div >
    </div >
  );
}

