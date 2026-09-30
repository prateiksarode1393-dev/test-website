'use client';

import React, { useState, useEffect } from 'react';
export const dynamic = 'force-static';
import { motion } from 'framer-motion';
import { ArrowLeft, Layers, Lock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ShadowVault() {
  useEffect(() => {
    // Create a CLOSED shadow root.
    // Closed shadow roots are invisible to standard JS like querySelectorAll.
    const host = document.getElementById('shadow-host');
    if (host && !host.shadowRoot) {
      const shadow = host.attachShadow({ mode: 'closed' });
      const container = document.createElement('div');
      container.className = "p-6 bg-purple-900/20 border border-purple-500 rounded-2xl text-white space-y-4";
      container.innerHTML = `
        <h3 class="text-xl font-bold">Encapsulated Secret</h3>
        <p class="text-sm text-purple-300">This content is inside a CLOSED shadow root. Standard crawlers cannot pierce this boundary.</p>
        <a href="/test/media/vault" class="text-blue-400 underline font-mono">/test/media/vault</a>
      `;
      shadow.appendChild(container);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-20">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">Shadow <span className="text-purple-500">Vault</span></h1>
          <p className="text-slate-400">Testing DOM piercing and Shadow Root encapsulation</p>
        </div >
        <Link href="/test/dom" className="p-3 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div >

      <div className="p-12 rounded-3xl bg-[#0f0f12] border border-slate-800 space-y-8">
        <div className="flex items-center gap-4">
          <Layers className="w-8 h-8 text-purple-500" />
          <h2 className="text-2xl font-bold text-white">Encapsulated Content</h2>
        </div >

        <div id="shadow-host" className="min-h-[200px] rounded-2xl border border-dashed border-slate-700 flex items-center justify-center text-slate-500 italic">
          Shadow root content will be injected here...
        </div >

        <div className="p-6 rounded-2xl bg-black/40 border border-slate-800 space-y-2">
          <p className="text-sm text-slate-400">
            <strong>Crawler Challenge:</strong> If you only use `document.body.innerHTML`, you will miss the secret link inside the shadow root.
          </p>
        </div >
      </div >
    </div >
  );
}

