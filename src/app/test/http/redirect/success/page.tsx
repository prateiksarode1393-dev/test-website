'use client';

import React from 'react';
export const dynamic = 'force-static';
import { motion } from 'framer-motion';
import { Trophy, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function RedirectSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f12] text-white text-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500">
          <Trophy className="w-10 h-10" />
        </div >
        <h1 className="text-5xl font-bold text-green-500">Redirect Success!</h1>
        <p className="text-slate-400 text-xl">You have successfully navigated through the redirect chain.</p>
        <Link
          href="/test/http"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 rounded-full hover:bg-slate-700 transition-all border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" /> Return to HTTP Matrix
        </Link>
      </motion.div>
    </div >
  );
}

