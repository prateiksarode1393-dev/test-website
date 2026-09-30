'use client';

export const runtime = 'edge';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EyeOff, AlertTriangle, ArrowLeft, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function Fingerprinting() {
  const [fingerprint, setFingerprint] = useState('');
  const [isBot, setIsBot] = useState(false);

  const [ua, setUa] = useState('');

  useEffect(() => {
    // Behavioral and Canvas Fingerprinting Simulation
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125,1,62,20);
    ctx.fillStyle = "#069";
    ctx.fillText("Hello World", 2, 15);
    const data = canvas.toDataURL();
    setFingerprint(data.substring(0, 30) + '...');
    setUa(navigator.userAgent);

    // Bot detection: Check for common headless signatures
    const lowerUa = navigator.userAgent.toLowerCase();
    if (lowerUa.includes('headless') || lowerUa.includes('bot')) {
      setIsBot(true);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-20">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">Behavioral <span className="text-pink-500">Fingerprinting</span></h1>
          <p className="text-slate-400">Testing Canvas, WebGL, and UA telemetry detection</p>
        </div >
        <Link href="/test/defenses" className="p-3 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div >

      <div className={cn(
        "p-12 rounded-3xl border transition-all duration-500 space-y-8",
        isBot ? "bg-red-900/10 border-red-500" : "bg-[#0f0f12] border-slate-800"
      )}>
        <div className="flex items-center gap-4">
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", isBot ? "bg-red-500 text-white" : "bg-green-500 text-white")}>
            {isBot ? <AlertTriangle className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
          </div >
          <h2 className="text-2xl font-bold text-white">
            {isBot ? "Bot Signature Detected" : "Human Signature Verified"}
          </h2>
        </div >

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-black/40 border border-slate-800 space-y-2">
            <span className="text-xs font-mono text-slate-500 uppercase">Canvas Hash</span>
            <p className="text-sm font-mono text-blue-400 break-all">{fingerprint || 'Generating...'}</p>
          </div >
          <div className="p-6 rounded-2xl bg-black/40 border border-slate-800 space-y-2">
            <span className="text-xs font-mono text-slate-500 uppercase">User Agent</span>
            <p className="text-sm font-mono text-slate-300 break-all">{ua || 'Loading...'}</p>
          </div >
        </div >

        {isBot && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-mono">
            ACTION: The system has stealthily stripped data payloads from the DOM for this session.
          </div >
        )}
      </div >
    </div >
  );
}
