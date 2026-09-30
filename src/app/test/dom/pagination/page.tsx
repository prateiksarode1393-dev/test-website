'use client';

export const runtime = 'edge';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, List } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function PaginationTrap() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 100;

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-20">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">Pagination <span className="text-pink-500">Engine</span></h1>
          <p className="text-slate-400">Testing sequential discovery & indexing iteration</p>
        </div >
        <Link href="/test/dom" className="p-3 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div >

      <div className="p-12 rounded-3xl bg-[#0f0f12] border border-slate-800 space-y-8">
        <div className="flex items-center gap-4">
          <List className="w-8 h-8 text-pink-500" />
          <h2 className="text-2xl font-bold text-white">Data Fragment {currentPage}</h2>
        </div >

        <div className="p-6 rounded-2xl bg-black/40 border border-slate-800 space-y-4">
          <p className="text-slate-300 leading-relaxed">
            This is the content for page {currentPage}. A crawler must be able to identify the "Next"
            pattern and iterate through the entire set of {totalPages} pages without skipping or looping.
          </p>
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-4 w-24 bg-slate-800 rounded animate-pulse" />
            ))}
          </div >
        </div >

        <div className="flex items-center justify-center gap-4 pt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 disabled:opacity-30 hover:text-white transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <span className="font-mono text-white">Page {currentPage} of {totalPages}</span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div >
      </div >

      <div className="p-6 rounded-2xl bg-black/40 border border-slate-800 space-y-2">
        <p className="text-sm text-slate-400">
          <strong className="text-white">Crawler Challenge:</strong> Does the crawler follow the "Next" button, or does it try to guess the URL pattern (e.g., /page/2)?
        </p>
      </div >
    </div >
  );
}
