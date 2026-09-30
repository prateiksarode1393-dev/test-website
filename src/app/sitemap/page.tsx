import React from 'react';
import { motion } from 'framer-motion';

export const runtime = 'edge';
import { Map, ArrowRight, Globe, Zap, Shield, Layers, PlayCircle, Activity, Cpu } from 'lucide-react';
import Link from 'next/link';
import { SITE_ROUTES } from '@/lib/routes';

const CATEGORY_META = {
  chaos: { title: 'Chaos Engineering', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: Activity },
  defenses: { title: 'Scraping Defenses', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: Shield },
  dom: { title: 'DOM Failure', color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/30', icon: Layers },
  dynamic: { title: 'Dynamic Cloaking', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: Zap },
  http: { title: 'HTTP Matrix', color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: Globe },
  media: { title: 'Media Testing', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/30', icon: PlayCircle },
  runtime: { title: 'Runtime Environment', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: Cpu },
};

export default function HTMLSitemap() {
  const categories = Object.keys(CATEGORY_META) as Array<keyof typeof CATEGORY_META>;

  return (
    <div className="max-w-6xl mx-auto py-20 px-6 space-y-16">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center text-white border border-slate-700">
            <Map className="w-10 h-10" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-white tracking-tight">Site <span className="text-blue-500">Map</span></h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          The complete architectural directory of the ChaosNet testing suite.
          Designed for both human navigation and crawler discovery.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map(catKey => {
          const meta = CATEGORY_META[catKey];
          const routes = SITE_ROUTES.filter(r => r.category === catKey);

          return (
            <div key={catKey} className={`p-6 rounded-3xl border ${meta.border} ${meta.bg} space-y-6`}>
              <div className="flex items-center gap-3">
                <meta.icon className={`w-6 h-6 ${meta.color}`} />
                <h2 className={`text-xl font-bold ${meta.color}`}>{meta.title}</h2>
              </div>
              <ul className="space-y-3">
                {routes.map(route => (
                  <li key={route.path} className="flex items-center justify-between group">
                    <Link
                      href={route.path}
                      className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
                    >
                      {route.title}
                    </Link>
                    <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-white transition-colors" />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 text-center space-y-4">
        <h3 className="text-lg font-semibold text-white">Machine Readable Formats</h3>
        <div className="flex justify-center gap-4">
          <Link href="/sitemap.xml" className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 transition-all border border-slate-700">
            XML Sitemap
          </Link>
          <Link href="/robots.txt" className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 transition-all border border-slate-700">
            Robots.txt
          </Link>
          <Link href="/api/sitemap.json" className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 transition-all border border-slate-700">
            JSON Sitemap
          </Link>
        </div>
      </div>
    </div>
  );
}
