'use client';

import React, { useState, useEffect } from 'react';
export const dynamic = 'force-static';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function RateLimit() {
  const [requestCount, setRequestCount] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    // Simulate rate limiting: block if > 5 requests in a session
    // In a real app, this would be a 429 response from the server
    setRequestCount(prev => prev + 1);
    if (requestCount >= 5) {
      setIsBlocked(true);
    }
  }, []);

  if (isBlocked) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="max-w-2xl w-full p-12 rounded-3xl bg-orange-900/10 border border-orange-500/30 text-center space-y-8">
          <h1 className="text-5xl font-bold text-orange-500">429</h1>
          <h2 className="text-2xl font-bold text-white">Too Many Requests</h2>
          <p className="text-slate-400">You have exceeded the rate limit. Please wait before trying again.</p>
          <div className="p-4 rounded-xl bg-black/40 border border-orange-500/20 font-mono text-xs text-orange-300">
            Retry-After: 60 seconds
          </div>
          <Link href="/test/defenses" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition-all">
            <ArrowLeft className="w-4 h-4" /> Return
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-20">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-white">Rate <span className="text-orange-500">Limiter</span></h1>
        <Link href="/test/defenses" className="p-3 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>
      <div className="p-12 rounded-3xl bg-[#0f0f12] border border-slate-800 text-center space-y-6">
        <Zap className="w-16 h-16 text-orange-500 mx-auto animate-pulse" />
        <p className="text-slate-300">Request count: <span className="text-white font-bold">{requestCount}</span> / 5</p>
        <p className="text-slate-500 text-sm">Refresh this page repeatedly to trigger the 429 block.</p>
      </div>
    </div>
  );
}

