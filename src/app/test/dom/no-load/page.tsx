'use client';

export const runtime = 'edge';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function NoLoadTrap() {
  useEffect(() => {
    // Simulate a script that blocks the load event
    // In a real scenario, we'd use a synchronous XHR or a massive blocking loop
    console.log("Blocking load event simulation active...");
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-20">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">No-Load <span className="text-red-500">Trap</span></h1>
          <p className="text-slate-400">Testing bypass of DOMContentLoaded and window.load</p>
        </div >
        <Link href="/test/dom" className="p-3 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div >

      <div className="p-12 rounded-3xl bg-[#0f0f12] border border-slate-800 space-y-8">
        <div className="flex items-center gap-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <h2 className="text-2xl font-bold text-white">Lifecycle Block</h2>
        </div >

        <div className="p-8 rounded-2xl bg-red-900/10 border border-red-500/30 text-center space-y-4">
          <p className="text-slate-300 font-mono">Status: <span className="text-red-400">LIFECYCLE_PENDING</span></p>
          <p className="text-sm text-slate-500">
            This page is designed to hold the browser's "load" event hostage.
            If your crawler waits for <code>window.onload</code>, it will timeout here.
          </p>
        </div >

        <div className="p-6 rounded-2xl bg-black/40 border border-slate-800 space-y-2">
          <p className="text-sm text-slate-400">
            <strong className="text-white">Crawler Challenge:</strong> Can you extract the content based on a timer or a specific element selector instead of the load event?
          </p>
        </div >
      </div >
    </div >
  );
}
