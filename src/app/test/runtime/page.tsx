import React from 'react';
export const dynamic = 'force-static';
import { motion } from 'framer-motion';

import { Cpu, Zap, Globe, ArrowLeft, Activity } from 'lucide-react';
import Link from 'next/link';

export default function RuntimeHub() {
  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white tracking-tight">Runtime <span className="text-blue-500">Environment</span></h1>
        <p className="text-slate-400 max-w-2xl">
          These tests verify if a crawler can handle advanced browser APIs, asynchronous execution, and non-standard data streams.
        </p>
      </div >

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <RuntimeCard
          title="Service Worker"
          desc="Tests caching, offline support, and request interception."
          icon={Globe}
          href="/test/runtime/service-worker"
          color="text-blue-400"
        />
        <RuntimeCard
          title="WebSockets"
          desc="Tests real-time data streams and asynchronous DOM updates."
          icon={Zap}
          href="/test/runtime/websocket"
          color="text-yellow-400"
        />
        <RuntimeCard
          title="Web Workers"
          desc="Tests off-main-thread computation and result rendering."
          icon={Cpu}
          href="/test/runtime/web-worker"
          color="text-purple-400"
        />
      </div >

      <div className="pt-8">
        <Link
          href="/test"
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition-all border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Test Hub
        </Link>
      </div >
    </div >
  );
}

function RuntimeCard({ title, desc, icon: Icon, href, color }: any) {
  return (
    <Link href={href} className="block p-8 rounded-3xl bg-[#0f0f12] border border-slate-800 hover:border-blue-500/50 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className="w-24 h-24" />
      </div >
      <div className="relative z-10 space-y-4">
        <div className={cn("w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center", color)}>
          <Icon className="w-6 h-6" />
        </div >
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{desc}</p>
        <div className="pt-4 flex items-center gap-2 text-sm font-semibold text-blue-400">
          Launch Trap <ArrowRight className="w-4 h-4" />
        </div >
      </div >
    </Link>
  );
}

import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

