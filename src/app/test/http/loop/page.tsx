'use client';

import React from 'react';
export const dynamic = 'force-static';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function RedirectLoop() {
  // In a real Next.js app, we would use a server-side redirect in a middleware or layout.
  // For the UI mockup, we provide a "Trigger" button to simulate the loop.

  return (
    <div className="max-w-4xl mx-auto text-center space-y-12 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-12 rounded-3xl bg-[#0f0f12] border border-red-900/30 text-center space-y-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-red-500/5 pointer-events-none" />

        <div className="flex justify-center">
          <AlertTriangle className="w-16 h-16 text-red-500 animate-bounce" />
        </div >
        <h1 className="text-4xl font-bold text-white">Infinite Loop Trap</h1>
        <p className="text-slate-400 text-lg">
          This route is designed to trigger a <code className="text-red-400">ERR_TOO_MANY_REDIRECTS</code> error.
          The server will redirect the browser back to this same URL indefinitely.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 rounded-full bg-red-600 text-white font-bold hover:bg-red-500 transition-all shadow-lg shadow-red-600/20"
          >
            Trigger Loop â†»
          </button>
          <Link
            href="/test/http"
            className="px-8 py-3 rounded-full bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-all border border-slate-700"
          >
            Return
          </Link>
        </div >
      </motion.div>
    </div >
  );
}

