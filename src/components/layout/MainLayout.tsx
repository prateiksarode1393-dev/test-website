'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Video,
  ShieldAlert,
  Globe,
  Cpu,
  Zap,
  Layers,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  {
    title: 'Core Dashboard',
    href: '/',
    icon: LayoutDashboard,
    color: 'text-blue-400',
    section: 'main'
  },
  {
    title: 'Media Testing',
    href: '/test/media',
    icon: Video,
    color: 'text-green-400',
    section: 'test'
  },
  {
    title: 'Scraping Defenses',
    href: '/test/defenses',
    icon: ShieldAlert,
    color: 'text-yellow-400',
    section: 'test'
  },
  {
    title: 'HTTP Matrix',
    href: '/test/http',
    icon: Globe,
    color: 'text-purple-400',
    section: 'test'
  },
  {
    title: 'DOM Traps',
    href: '/test/dom',
    icon: Layers,
    color: 'text-pink-400',
    section: 'test'
  },
  {
    title: 'Chaos Engineering',
    href: '/test/chaos',
    icon: Cpu,
    color: 'text-red-400',
    section: 'test'
  },
  {
    title: 'Dynamic Cloaking',
    href: '/test/dynamic',
    icon: Zap,
    color: 'text-orange-400',
    section: 'test'
  },
];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0a0a0c] text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Mobile Sidebar Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:sticky top-0 z-40 h-screen w-64 border-r border-slate-800 bg-[#0f0f12] flex flex-col transition-transform duration-300 ease-in-out",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">Chaos<span className="text-blue-500">Net</span></span>
        </div>

        <nav className="flex-1 p-4 space-y-8 overflow-y-auto">
          <div onClick={() => setIsMobileMenuOpen(false)}>
            <p className="px-3 mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Main</p>
            <div className="space-y-1">
              {NAV_ITEMS.filter(item => item.section === 'main').map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors group"
                >
                  <item.icon className={cn("w-4 h-4", item.color)} />
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          <div onClick={() => setIsMobileMenuOpen(false)}>
            <p className="px-3 mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Testing Ground</p>
            <div className="space-y-1">
              {NAV_ITEMS.filter(item => item.section === 'test').map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors group"
                >
                  <item.icon className={cn("w-4 h-4", item.color)} />
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800 bg-[#0f0f12]">
          <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-slate-900/50 border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-400">System Operational</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative overflow-x-hidden">
        <header className="h-16 border-b border-slate-800 bg-[#0a0a0c]/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-md text-slate-400 hover:bg-slate-800 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-sm font-medium text-slate-400">System / <span className="text-slate-200">Console</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
              v1.0.4-stable
            </div>
          </div>
        </header>
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
