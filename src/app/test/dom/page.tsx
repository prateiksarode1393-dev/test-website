import React from 'react';
import { motion } from 'framer-motion';

export const runtime = 'edge';
import { Layers, Zap, AlertCircle, ArrowLeft, MousePointer2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function DomHub() {
  const TRAPS = [
    {
      id: 'infinite-scroll',
      title: 'Infinite Scroll',
      desc: 'Virtualized lists & Intersection Observer traps',
      icon: Zap,
      link: '/test/dom/infinite-scroll',
      color: 'text-pink-400',
      borderColor: 'border-pink-500/30'
    },
    {
      id: 'pagination',
      title: 'Deep Pagination',
      desc: 'Multi-page traversal & pagination logic traps',
      icon: Layers,
      link: '/test/dom/pagination',
      color: 'text-blue-400',
      borderColor: 'border-blue-500/30'
    },
    {
      id: 'no-load',
      title: 'The "No-Load" Trap',
      desc: 'Blocking DOMContentLoaded & window.load',
      icon: AlertCircle,
      link: '/test/dom/no-load',
      color: 'text-red-400',
      borderColor: 'border-red-500/30'
    },
    {
      id: 'live',
      title: 'Live-Stream Terminal',
      desc: 'WebSocket/SSE real-time data bursts',
      icon: MousePointer2,
      link: '/test/dom/live',
      color: 'text-blue-400',
      borderColor: 'border-blue-500/30'
    },
    {
      id: 'shadow',
      title: 'Shadow DOM Vault',
      desc: 'Open & Closed Shadow Root encapsulation',
      icon: Layers,
      link: '/test/dom/shadow',
      color: 'text-purple-400',
      borderColor: 'border-purple-500/30'
    },
    {
      id: 'mismatch',
      title: 'Hydration Mismatch',
      desc: 'Server vs Client state conflicts',
      icon: AlertCircle,
      link: '/test/dom/mismatch',
      color: 'text-orange-400',
      borderColor: 'border-orange-500/30'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white tracking-tight">DOM <span className="text-pink-500">Failure Engineering</span></h1>
        <p className="text-slate-400 max-w-2xl">
          Testing the "Piercing Power" of your crawler. These pages use advanced DOM techniques
          to hide content or block the standard event lifecycle.
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
              <h3 className="text-xl font-bold text-white group-hover:text-pink-400 transition-colors">{t.title}</h3>
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
