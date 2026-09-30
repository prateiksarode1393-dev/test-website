import React from 'react';
export const dynamic = 'force-static';
import { motion } from 'framer-motion';

import { Globe, Zap, AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function DefensesHub() {
  const DEFENSES = [
    {
      id: 'waf',
      title: 'WAF Simulation',
      desc: 'UA Inspection & Bot Challenges',
      icon: ShieldAlert,
      link: '/test/defenses/waf',
      color: 'text-yellow-400',
      borderColor: 'border-yellow-500/30'
    },
    {
      id: 'rate-limit',
      title: 'Rate Limiter',
      desc: 'HTTP 429 & Retry-After headers',
      icon: Zap,
      link: '/test/defenses/rate-limit',
      color: 'text-orange-400',
      borderColor: 'border-orange-500/30'
    },
    {
      id: 'fingerprint',
      title: 'Fingerprinting',
      desc: 'Canvas & WebGL telemetry traps',
      icon: Globe,
      link: '/test/defenses/fingerprint',
      color: 'text-pink-400',
      borderColor: 'border-pink-500/30'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white tracking-tight">Scraping <span className="text-yellow-500">Defenses</span></h1>
        <p className="text-slate-400 max-w-2xl">
          Simulating production-grade CDN and WAF environments. These pages test if crawlers
          can mimic human behavior or switch User-Agents to bypass detection.
        </p>
      </div >

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {DEFENSES.map((d) => (
          <Link key={d.id} href={d.link} className={cn(
            "group p-8 rounded-3xl border transition-all duration-300 bg-[#0f0f12] hover:bg-slate-900/50",
            d.borderColor
          )}>
            <div className="space-y-6">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-800 border border-slate-700", d.color)}>
                <d.icon className="w-6 h-6" />
              </div >
              <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">{d.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{d.desc}</p>
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
          {DEFENSES.map(d => (
            <li key={d.id}><a href={d.link}>{d.title}</a></li>
          ))}
        </ul>
      </div >
    </div >
  );
}

import { ShieldAlert } from 'lucide-react';

