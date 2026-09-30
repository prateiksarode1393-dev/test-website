'use client';

export const runtime = 'edge';

import React, { useState, CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { EyeOff, Eye, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function HiddenPage() {
  const [reveal, setReveal] = useState(false);

  const traps = [
    { id: 'display-none', label: 'Display None', style: (reveal ? {} : { display: 'none' }) as CSSProperties, desc: 'Element is removed from the layout entirely.' },
    { id: 'visibility-hidden', label: 'Visibility Hidden', style: (reveal ? {} : { visibility: 'hidden' }) as CSSProperties, desc: 'Element is invisible but still takes up space.' },
    { id: 'opacity-zero', label: 'Opacity Zero', style: (reveal ? {} : { opacity: 0 }) as CSSProperties, desc: 'Element is fully transparent.' },
    { id: 'off-screen', label: 'Off-screen', style: (reveal ? {} : { position: 'absolute', left: '-9999px' }) as CSSProperties, desc: 'Element is positioned far outside the viewport.' },
    { id: 'z-index-minus', label: 'Z-Index Minus', style: (reveal ? {} : { position: 'relative', zIndex: -1 }) as CSSProperties, desc: 'Element is layered behind the background.' },
    { id: 'clip-path', label: 'Clip Path', style: (reveal ? {} : { clipPath: 'inset(50% 50% 50% 50%)' }) as CSSProperties, desc: 'Element is clipped to 0% size.' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-20 px-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Hidden <span className="text-blue-500">Assets</span>
          </h1>
          <p className="text-slate-400">Testing the "Sight" of your crawler against CSS cloaking techniques</p>
        </div >
        <Link
          href="/test/dynamic"
          className="p-3 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div >

      <div className="p-12 rounded-3xl bg-[#0f0f12] border border-slate-800 min-h-[400px] flex flex-col items-center justify-center text-center space-y-8 relative">
        <div className="space-y-6 max-w-md">
          <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto text-blue-500">
            {reveal ? <Eye className="w-10 h-10" /> : <EyeOff className="w-10 h-10" />}
          </div >
          <h2 className="text-2xl font-bold text-white">{reveal ? 'Assets Revealed' : 'Content Cloaked'}</h2>
          <p className="text-slate-400">
            {reveal
              ? 'All hidden traps are now visible. A sophisticated crawler should have found these without the toggle.'
              : 'Target assets are present in the DOM but visually hidden using various CSS techniques.'}
          </p>
          <button
            onClick={() => setReveal(!reveal)}
            className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${
              reveal
                ? 'bg-slate-700 text-white hover:bg-slate-600'
                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/20'
            }`}
          >
            {reveal ? 'Hide Assets' : 'Reveal All'}
          </button>
        </div >

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 w-full max-w-2xl">
          {traps.map((trap) => (
            <div
              key={trap.id}
              className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-left flex items-center gap-4"
            >
              <div className="flex-1">
                <span className="text-xs font-mono text-slate-500 block mb-1">{trap.id}</span>
                <div style={trap.style} className="text-white font-medium">
                  {trap.label}: SECRET_DATA_{trap.id.toUpperCase()}
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-600 max-w-[150px] leading-tight">{trap.desc}</p>
              </div>
            </div>
          ))}
        </div >
      </div >

      <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3 text-white mb-2">
          <AlertCircle className="w-6 h-6 text-blue-500" />
          <h3 className="text-lg font-semibold">Crawler Challenge</h3>
        </div >
        <p className="text-slate-400 leading-relaxed">
          This page tests if a bot can identify "invisible" content. Many cloaking techniques
          rely on the fact that simple scrapers only look at the raw HTML or don't calculate
          computed styles.
          <br /><br />
          A high-quality crawler should check for <code className="text-blue-400">computedStyles</code>
          to detect if an element is actually visible to the user.
        </p>
      </div >
    </div >
  );
}
