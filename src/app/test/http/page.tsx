import React from 'react';
import { motion } from 'framer-motion';

export const runtime = 'edge';
import { Globe, Zap, AlertTriangle, ArrowLeft, RefreshCcw, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function HttpMatrix() {
  const STATUS_CODES = [
    { code: '400', label: 'Bad Request', color: 'text-yellow-500' },
    { code: '401', label: 'Unauthorized', color: 'text-orange-500' },
    { code: '403', label: 'Forbidden', color: 'text-red-500' },
    { code: '404', label: 'Not Found', color: 'text-blue-500' },
    { code: '405', label: 'Method Not Allowed', color: 'text-yellow-500' },
    { code: '406', label: 'Not Acceptable', color: 'text-yellow-500' },
    { code: '408', label: 'Request Timeout', color: 'text-yellow-500' },
    { code: '409', label: 'Conflict', color: 'text-yellow-500' },
    { code: '410', label: 'Gone', color: 'text-yellow-500' },
    { code: '413', label: 'Payload Too Large', color: 'text-yellow-500' },
    { code: '415', label: 'Unsupported Media Type', color: 'text-yellow-500' },
    { code: '422', label: 'Unprocessable Entity', color: 'text-yellow-500' },
    { code: '429', label: 'Too Many Requests', color: 'text-orange-500' },
    { code: '500', label: 'Internal Error', color: 'text-red-600' },
    { code: '501', label: 'Not Implemented', color: 'text-red-500' },
    { code: '502', label: 'Bad Gateway', color: 'text-red-500' },
    { code: '503', label: 'Service Unavailable', color: 'text-orange-600' },
    { code: '504', label: 'Gateway Timeout', color: 'text-red-500' },
    { code: '505', label: 'HTTP Version Not Supported', color: 'text-red-500' },
    { code: '511', label: 'Network Auth Required', color: 'text-red-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white tracking-tight">HTTP <span className="text-purple-500">Matrix</span></h1>
        <p className="text-slate-400 max-w-2xl">
          This module generates precise HTTP response codes and network stressors.
          Essential for testing crawler error-handling, retry logic, and timeout thresholds.
        </p>
      </div >

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Status Codes Grid */}
        <section className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-3 text-white mb-6">
            <Globe className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl font-bold">Response Codes</h2>
          </div >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {STATUS_CODES.map((s) => (
              <Link
                key={s.code}
                href={`/test/http/${s.code}`}
                className="p-4 rounded-2xl bg-[#0f0f12] border border-slate-800 hover:border-purple-500/50 transition-all group"
              >
                <div className="flex justify-between items-center">
                  <span className={cn("text-2xl font-black", s.color)}>{s.code}</span>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 transition-colors" />
                </div >
                <p className="text-slate-500 text-xs mt-1">{s.label}</p>
              </Link>
            ))}
          </div >
        </section>

        {/* Network Stressors */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-white mb-6">
            <Zap className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl font-bold">Stressors</h2>
          </div >
          <div className="space-y-4">
            <StressorLink
              href="/test/http/redirect"
              title="Redirect Chain"
              desc="Deep nested 302 sequences"
              icon={RefreshCcw}
            />
            <StressorLink
              href="/test/http/loop"
              title="Infinite Loop"
              desc="Circular redirect trap"
              icon={AlertTriangle}
            />
            <StressorLink
              href="/test/http/slow"
              title="Slow-Loris"
              desc="Extreme response latency"
              icon={Globe}
            />
          </div >
        </section>
      </div >

      {/* Sitemap for Crawlers */}
      <div className="hidden">
        <ul className="sitemap-links">
          {STATUS_CODES.map(s => (
            <li key={s.code}><a href={`/test/http/${s.code}`}>{s.label}</a></li>
          ))}
          <li><a href="/test/http/redirect">Redirect Chain</a></li>
          <li><a href="/test/http/loop">Infinite Loop</a></li>
          <li><a href="/test/http/slow">Slow-Loris</a></li>
        </ul>
      </div >
    </div >
  );
}

function StressorLink({ href, title, desc, icon: Icon }: { href: string; title: string; desc: string; icon: any }) {
  return (
    <Link href={href} className="block p-4 rounded-2xl bg-[#0f0f12] border border-slate-800 hover:border-purple-500/50 transition-all group">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
          <Icon className="w-5 h-5" />
        </div >
        <div>
          <h3 className="text-white font-semibold group-hover:text-purple-400 transition-colors">{title}</h3>
          <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
        </div >
      </div >
    </Link>
  );
}
