'use client';

import React, { useState, useEffect } from 'react';
export const dynamic = 'force-static';
import { motion } from 'framer-motion';
import { ArrowLeft, Link as LinkIcon, Hash } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function TrackingLoop() {
  const [currentParams, setCurrentParams] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramsObj = Object.fromEntries(params.entries());
    setCurrentParams(paramsObj);
  }, []);

  const generateLink = (index: number) => {
    if (typeof window === 'undefined') return '#';
    const params = new URLSearchParams(window.location.search);
    params.append(`track_${index}`, Math.random().toString(36).substring(7));
    return `/test/chaos/tracking?${params.toString()}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-20">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">Tracking <span className="text-yellow-500">Loop</span></h1>
          <p className="text-slate-400">Testing URL normalization & canonical link detection</p>
        </div >
        <Link href="/test/chaos" className="p-3 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div >

      <div className="p-12 rounded-3xl bg-[#0f0f12] border border-slate-800 space-y-8">
        <div className="flex items-center gap-4">
          <LinkIcon className="w-8 h-8 text-yellow-500" />
          <h2 className="text-2xl font-bold text-white">Infinite Parameter Growth</h2>
        </div >

        <div className="p-6 rounded-2xl bg-black/40 border border-slate-800 space-y-4">
          <span className="text-xs font-mono text-slate-500 uppercase">Current URL State</span>
          <p className="text-sm font-mono text-blue-400 break-all bg-slate-900 p-3 rounded border border-slate-800">
            {typeof window !== 'undefined' ? window.location.href : 'Loading...'}
          </p>
          <div className="text-xs text-slate-500 italic">
            Parameter Count: {Object.keys(currentParams).length}
          </div >
        </div >

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Link
              key={i}
              href={generateLink(i)}
              className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-center font-semibold transition-all border border-slate-700"
            >
              Append Parameter {i} âž”
            </Link>
          ))}
        </div >

        <div className="p-6 rounded-2xl bg-black/40 border border-slate-800 space-y-2">
          <p className="text-sm text-slate-400">
            <strong className="text-white">Crawler Challenge:</strong> If the crawler doesn't recognize that these are the same page (via canonical tags or URL normalization), it will enter an infinite loop of unique URLs.
          </p>
        </div >
      </div >
    </div >
  );
}

