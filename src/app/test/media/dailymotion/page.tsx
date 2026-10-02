import React from 'react';
export const dynamic = 'force-static';
import { PlayCircle } from 'lucide-react';

const VIDEOS = [
  { name: 'Dailymotion Sample 1', url: 'https://geo.dailymotion.com/player.html?video=x84sh87' },   { name: 'Dailymotion Sample 2', url: 'https://geo.dailymotion.com/player.html?video=x7l7z8u' }
];

export default function DailymotionPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-12 px-4 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white tracking-tight">{name} <span className="text-green-500">Provider Test</span></h1>
        <p className="text-slate-400 max-w-2xl">
          Testing source extraction from {name} embeds. These are public, free videos used for crawler validation.
        </p>
      </div >

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {VIDEOS.map((v, i) => (
          <div key={i} className="bg-[#0f0f12] border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-3 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-300">{v.name}</span>
              <PlayCircle className="w-3 h-3 text-slate-500" />
            </div >
            <div className="aspect-video bg-black">
              <iframe src={v.url} className="w-full h-full" allowFullScreen />
            </div >
          </div >
        ))}
      </div >
    </div >
  );
}
