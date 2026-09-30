'use client';

import React from 'react';
export const dynamic = 'force-static';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  ArrowRight,
  Globe,
  Cpu,
  ShieldAlert,
  Video,
  Zap,
  Layers
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const STATS = [
  { label: 'Crawl Success Rate', value: '94.2%', status: 'success', color: 'text-green-400' },
  { label: 'Detection Latency', value: '12ms', status: 'success', color: 'text-blue-400' },
  { label: 'WAF Triggered', value: '1,204', status: 'warning', color: 'text-yellow-400' },
  { label: 'OOM Events', value: '42', status: 'danger', color: 'text-red-400' },
];

const TEST_CATEGORIES = [
  {
    id: 'media',
    title: 'Media Testing Hub',
    description: 'yt-dlp asset extraction & multi-provider stress tests',
    icon: Video,
    color: 'from-green-500/20 to-green-900/20',
    borderColor: 'border-green-500/30',
    textColor: 'text-green-400',
    link: '/test/media',
    status: 'ready'
  },
  {
    id: 'defenses',
    title: 'Scraping Defenses',
    description: 'WAF simulation, rate limiting & behavioral fingerprinting',
    icon: ShieldAlert,
    color: 'from-yellow-500/20 to-yellow-900/20',
    borderColor: 'border-yellow-500/30',
    textColor: 'text-yellow-400',
    link: '/test/defenses',
    status: 'warning'
  },
  {
    id: 'http',
    title: 'Network Failure Simulation',
    description: 'HTTP status matrix, redirect loops & timeout stressors',
    icon: Globe,
    color: 'from-purple-500/20 to-purple-900/20',
    borderColor: 'border-purple-500/30',
    textColor: 'text-purple-400',
    link: '/test/http',
    status: 'ready'
  },
  {
    id: 'dom',
    title: 'DOM Failure Engineering',
    description: 'Shadow DOM, virtualized lists & hydration traps',
    icon: Layers,
    color: 'from-pink-500/20 to-pink-900/20',
    borderColor: 'border-pink-500/30',
    textColor: 'text-pink-400',
    link: '/test/dom',
    status: 'ready'
  },
  {
    id: 'chaos',
    title: 'Chaos Engineering',
    description: 'Memory leaks, GPU stress & recursive resource spawning',
    icon: Cpu,
    color: 'from-red-500/20 to-red-900/20',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-400',
    link: '/test/chaos',
    status: 'danger'
  },
  {
    id: 'dynamic',
    title: 'Dynamic Cloaking',
    description: 'Delayed rendering & CSS-hidden link extraction',
    icon: Zap,
    color: 'from-orange-500/20 to-orange-900/20',
    borderColor: 'border-orange-500/30',
    textColor: 'text-orange-400',
    link: '/test/dynamic',
    status: 'ready'
  },
  {
    id: 'runtime',
    title: 'Runtime Environment',
    description: 'Async execution, WebWorkers & Service Worker traps',
    icon: Activity,
    color: 'from-blue-500/20 to-blue-900/20',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400',
    link: '/test/runtime',
    status: 'ready'
  },
];

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="relative p-8 rounded-3xl bg-gradient-to-br from-blue-600/10 via-transparent to-transparent border border-blue-500/20 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full -mr-32 -mt-32" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Terminal className="w-4 h-4" />
            <span className="text-xs font-mono uppercase tracking-widest font-semibold">System Initialized</span>
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tight">
            Crawler <span className="text-blue-500">Stress Test</span> Ground
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
            Welcome to the high-fidelity benchmarking environment. This platform is engineered
            with intentional architectural flaws and modern web traps to push headless browsers
            to their absolute operational limits.
          </p>
          <div className="flex gap-4 pt-4">
            <Link
              href="/test/media"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 group"
            >
              Launch Testing <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/sitemap.xml"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition-all border border-slate-700"
            >
              View Sitemap.xml
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-[#0f0f12] border border-slate-800 hover:border-slate-700 transition-colors group"
          >
            <p className="text-slate-500 text-sm font-medium mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <span className={cn("text-3xl font-bold", stat.color)}>{stat.value}</span>
              {stat.status === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500 mb-1" />}
              {stat.status === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500 mb-1" />}
              {stat.status === 'danger' && <Activity className="w-5 h-5 text-red-500 mb-1" />}
            </div>
          </motion.div>
        ))}
      </section>

      {/* Test Matrix Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Testing Matrix</h2>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <div className="w-2 h-2 rounded-full bg-green-500" /> Ready
            <div className="w-2 h-2 rounded-full bg-yellow-500 ml-4" /> Warning
            <div className="w-2 h-2 rounded-full bg-red-500 ml-4" /> Critical
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEST_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className={cn(
                "group relative p-8 rounded-3xl border transition-all duration-300 overflow-hidden",
                cat.borderColor,
                "bg-[#0f0f12] hover:bg-slate-900/50"
              )}
            >
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                cat.color
              )} />

              <div className="relative z-10 space-y-6">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-800 border border-slate-700",
                  cat.textColor
                )}>
                  <cat.icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{cat.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{cat.description}</p>
                </div>
                <Link
                  href={cat.link}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-300 group-hover:text-white transition-colors"
                >
                  Enter Module <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

