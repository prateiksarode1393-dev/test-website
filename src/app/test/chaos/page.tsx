import React from 'react';
import { motion } from 'framer-motion';

export const runtime = 'edge';
import { Cpu, Zap, AlertTriangle, ArrowLeft, Activity } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ChaosHub() {
  const CHAOS_TRAPS = [
    {
      id: 'oom',
      title: 'OOM Memory Trap',
      desc: 'Exponential array growth & heap exhaustion',
      icon: Activity,
      link: '/test/chaos/oom',
      color: 'text-red-400',
      borderColor: 'border-red-500/30'
    },
    {
      id: 'gpu',
      title: 'GPU / CPU Stress',
      desc: 'Heavy WebGL & 3D CSS transform loops',
      icon: Cpu,
      link: '/test/chaos/gpu',
      color: 'text-orange-400',
      borderColor: 'border-orange-500/30'
    },
    {
      id: 'recursive',
      title: 'Recursive Spawning',
      desc: 'Infinite iFrame & WebWorker mounting',
      icon: Zap,
      link: '/test/chaos/recursive',
      color: 'text-yellow-400',
      borderColor: 'border-yellow-500/30'
    },
    {
      id: 'flaky',
      title: 'Flaky Response',
      desc: 'Random failure (50%) for retry testing',
      icon: AlertTriangle,
      link: '/test/chaos/flaky',
      color: 'text-orange-300',
      borderColor: 'border-orange-400/30'
    },
    {
      id: 'high-failure',
      title: 'High-Failure Node',
      desc: 'Aggressive failure (75%) for stress testing',
      icon: AlertTriangle,
      link: '/test/chaos/high-failure',
      color: 'text-red-600',
      borderColor: 'border-red-600/30'
    },
    {
      id: 'captcha',
      title: 'Bot Captcha',
      desc: 'Interactive challenge & bot-detection triggers',
      icon: AlertTriangle,
      link: '/test/chaos/captcha',
      color: 'text-orange-400',
      borderColor: 'border-orange-500/30'
    },
    {
      id: 'popup',
      title: 'Popup Storm',
      desc: 'Recursive window.open & overlay floods',
      icon: Zap,
      link: '/test/chaos/popup',
      color: 'text-yellow-400',
      borderColor: 'border-yellow-500/30'
    },
    {
      id: 'tracking',
      title: 'Tracking Pixel',
      desc: 'Invisible telemetry & beacon tracking tests',
      icon: Activity,
      link: '/test/chaos/tracking',
      color: 'text-blue-400',
      borderColor: 'border-blue-500/30'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white tracking-tight">Chaos <span className="text-red-500">Engineering</span></h1>
        <p className="text-slate-400 max-w-2xl">
          The ultimate stability test. These modules are designed to crash the browser tab,
          exhaust system memory, or freeze the operational thread.
          <span className="text-red-400 font-semibold block mt-2">⚠️ Warning: May cause browser instability.</span>
        </p>
      </div >

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {CHAOS_TRAPS.map((t) => (
          <Link key={t.id} href={t.link} className={cn(
            "group p-8 rounded-3xl border transition-all duration-300 bg-[#0f0f12] hover:bg-slate-900/50",
            t.borderColor
          )}>
            <div className="space-y-6">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-800 border border-slate-700", t.color)}>
                <t.icon className="w-6 h-6" />
              </div >
              <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">{t.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{t.desc}</p>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 group-hover:text-white transition-colors">
                Execute Trap <ArrowLeft className="w-4 h-4 rotate-180" />
              </div >
            </div >
          </Link>
        ))}
      </div >

      {/* Sitemap for Crawlers */}
      <div className="hidden">
        <ul className="sitemap-links">
          {CHAOS_TRAPS.map(t => (
            <li key={t.id}><a href={t.link}>{t.title}</a></li>
          ))}
        </ul>
      </div>
    </div >
  );
}
