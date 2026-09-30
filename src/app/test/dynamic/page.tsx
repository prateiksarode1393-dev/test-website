import React from 'react';
export const dynamic = 'force-static';
import { motion } from 'framer-motion';

import { Zap, EyeOff, Lock, ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function DynamicHub() {
  const TRAPS = [
    {
      id: 'delayed',
      title: 'Delayed Rendering',
      desc: 'Blank HTML with 8-12s async injection',
      icon: Clock,
      link: '/test/dynamic/delayed',
      color: 'text-orange-400',
      borderColor: 'border-orange-500/30'
    },
    {
      id: 'hidden',
      title: 'CSS-Hidden Links',
      desc: 'Extraction traps using clip-paths & ::after',
      icon: EyeOff,
      link: '/test/dynamic/hidden',
      color: 'text-blue-400',
      borderColor: 'border-blue-500/30'
    },
    {
      id: 'state',
      title: 'State-Locked Content',
      desc: 'Cookie & localStorage gated layouts',
      icon: Lock,
      link: '/test/dynamic/state',
      color: 'text-purple-400',
      borderColor: 'border-purple-500/30'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white tracking-tight">Dynamic <span className="text-orange-500">Cloaking</span></h1>
        <p className="text-slate-400 max-w-2xl">
          Testing the "Patience" and "Sight" of your crawler. These pages use timing delays,
          CSS masking, and session state to hide high-value assets.
        </p>
      </div >

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {TRAPS.map((t) => (
          <Link key={t.id} href={t.link} className={cn(
            "group p-8 rounded-3xl border transition-all duration-300 bg-[#0f0f12] hover:bg-slate-900/50",
            t.borderColor
          )}>
            <div className="space-y-6">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-800 border border-slate-700", t.color)}>
                <t.icon className="w-6 h-6" />
              </div >
              <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">{t.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{t.desc}</p>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 group-hover:text-white transition-colors">
                Enter Trap <ArrowLeft className="w-4 h-4 rotate-180" />
              </div >
            </div >
          </Link>
        ))}
      </div >

      {/* Sitemap for Crawlers */}
      <div className="hidden">
        <ul className="sitemap-links">
          {TRAPS.map(t => (
            <li key={t.id}><a href={t.link}>{t.title}</a></li>
          ))}
        </ul>
      </div >
    </div >
  );
}

