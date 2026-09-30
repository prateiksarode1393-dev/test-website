'use client';

export const runtime = 'edge';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCcw, FileText, Image, Video } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ShiftingPage() {
  const [index, setIndex] = useState(0);
  const contents = [
    {
      type: 'text',
      title: 'Textual Fragment',
      body: 'This is a static text block. Crawlers usually find this easily.',
      color: 'text-blue-400',
      icon: FileText
    },
    {
      type: 'image',
      title: 'Visual Fragment',
      body: 'https://picsum.photos/400/300',
      color: 'text-green-400',
      icon: Image
    },
    {
      type: 'video',
      title: 'Streaming Fragment',
      body: 'https://www.w3schools.com/html/mov_bbb.mp4',
      color: 'text-red-400',
      icon: Video
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % contents.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const current = contents[index];

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-20">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">Shifting <span className="text-orange-500">Content</span></h1>
          <p className="text-slate-400">Content rotates every 5 seconds. Tests snapshot consistency.</p>
        </div >
        <Link href="/test/dynamic" className="p-3 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div >

      <div className="p-12 rounded-3xl bg-[#0f0f12] border border-slate-800 space-y-8 text-center">
        <div className="flex justify-center gap-3 mb-6">
          {contents.map((_, i) => (
            <div key={i} className={cn("w-3 h-3 rounded-full transition-all", i === index ? "bg-orange-500 scale-125" : "bg-slate-700")} />
          ))}
        </div >

        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-center gap-3">
            <current.icon className={cn("w-8 h-8", current.color)} />
            <h2 className={cn("text-3xl font-bold", current.color)}>{current.title}</h2>
          </div >

          <div className="flex justify-center">
            {current.type === 'text' && <p className="text-xl text-slate-300 leading-relaxed">{current.body}</p>}
            {current.type === 'image' && <img src={current.body} alt="Dynamic" className="rounded-2xl border border-slate-700 max-h-64" />}
            {current.type === 'video' && <video src={current.body} controls className="rounded-2xl border border-slate-700 max-h-64" />}
          </div >
        </motion.div>

        <div className="p-6 rounded-2xl bg-black/40 border border-slate-800 text-sm text-slate-500 font-mono">
          Current Mode: {current.type.toUpperCase()} | Rotation Cycle: 5000ms
        </div >
      </div >
    </div >
  );
}
