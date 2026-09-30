'use client';

export const runtime = 'edge';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Terminal, Activity } from 'lucide-react';
import Link from 'next/link';

export default function LiveStream() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setIsConnected(true);
    const interval = setInterval(() => {
      const events = [
        `[${new Date().toLocaleTimeString()}] INFO: Packet received from 192.168.1.${Math.floor(Math.random() * 255)}`,
        `[${new Date().toLocaleTimeString()}] WARN: Latency spike detected: ${Math.floor(Math.random() * 500)}ms`,
        `[${new Date().toLocaleTimeString()}] ERROR: Handshake failed on port ${Math.floor(Math.random() * 65535)}`,
        `[${new Date().toLocaleTimeString()}] DEBUG: Hydrating DOM fragment ${Math.random().toString(36).substr(2, 5)}`,
        `[${new Date().toLocaleTimeString()}] INFO: Crawler signature detected: ${Math.random() > 0.5 ? 'Chrome' : 'Headless'}`,
      ];
      setLogs(prev => [...prev.slice(-49), events[Math.floor(Math.random() * events.length)]]);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">Live <span className="text-blue-500">Stream Terminal</span></h1>
          <p className="text-slate-400">Testing real-time data capture & SSE/WebSocket persistence</p>
        </div >
        <Link href="/test/dom" className="p-3 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div >

      <div className="relative p-1 rounded-3xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 shadow-2xl shadow-blue-500/10">
        <div className="bg-[#0a0a0c] rounded-[22px] overflow-hidden">
          {/* Terminal Header */}
          <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div >
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest"> chaosnet_stream_v1.0 </span>
            </div >
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
              <div className={cn("w-2 h-2 rounded-full", isConnected ? "bg-green-500 animate-pulse" : "bg-red-500")} />
              {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
            </div >
          </div >

          {/* Terminal Content */}
          <div className="p-6 h-[500px] overflow-y-auto font-mono text-sm space-y-1 scrollbar-hide">
            {logs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "py-0.5 transition-colors",
                  log.includes('ERROR') ? "text-red-400" : log.includes('WARN') ? "text-yellow-400" : "text-blue-300"
                )}
              >
                <span className="text-slate-600 mr-2">[{i}]</span> {log}
              </motion.div>
            ))}
            {logs.length === 0 && (
              <div className="flex items-center justify-center h-full text-slate-600 animate-pulse">
                Waiting for incoming data stream...
              </div >
            )}
          </div >
        </div >
      </div >
    </div >
  );
}

import { cn } from '@/lib/utils';
