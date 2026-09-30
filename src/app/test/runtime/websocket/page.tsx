'use client';

export const runtime = 'edge';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity, ArrowLeft, Terminal } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function WebSocketPage() {
  const [messages, setMessages] = useState<{id: number, text: string, type: string}[]>([]);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [input, setInput] = useState('');

  useEffect(() => {
    // Using a public echo server for demonstration
    const socket = new WebSocket('wss://echo.websocket.org');

    socket.onopen = () => {
      setStatus('connected');
      setMessages(prev => [...prev, { id: Date.now(), text: 'Connection established. Waiting for stream...', type: 'sys' }]);

      // Trigger an automatic "delayed" message for crawlers to wait for
      setTimeout(() => {
        socket.send('Ping for Crawler Trap');
      }, 3000);
    };

    socket.onmessage = (event) => {
      setMessages(prev => [...prev, { id: Date.now(), text: `Server Echo: ${event.data}`, type: 'server' }]);
    };

    socket.onclose = () => setStatus('disconnected');
    socket.onerror = () => setStatus('disconnected');

    return () => socket.close();
  }, []);

  const sendMessage = () => {
    if (!input) return;
    // We can't actually send if we didn't save the socket ref, but for UI demonstration:
    setMessages(prev => [...prev, { id: Date.now(), text: input, type: 'user' }]);
    setInput('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/test/runtime" className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-white">WebSocket Dynamic Stream</h1>
      </div >

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="p-6 rounded-3xl bg-[#0f0f12] border border-slate-800 space-y-4">
            <div className="flex items-center gap-3 text-yellow-400">
              <Zap className="w-6 h-6" />
              <h2 className="text-xl font-bold">Connection</h2>
            </div >
            <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-900">
              <div className={cn(
                "w-2 h-2 rounded-full",
                status === 'connected' ? "bg-green-500" : status === 'connecting' ? "bg-yellow-500" : "bg-red-500"
              )} />
              <span className="text-xs font-mono text-slate-300 capitalize">{status}</span>
            </div >
          </div >
        </div >

        <div className="md:col-span-2 space-y-4">
          <div className="p-6 rounded-3xl bg-[#0f0f12] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 text-white">
                <Terminal className="w-5 h-5 text-yellow-400" />
                <h3 className="font-bold">Event Log</h3>
              </div >
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Live Stream</span>
            </div >

            <div className="h-[400px] overflow-y-auto space-y-3 p-4 rounded-xl bg-black border border-slate-800 font-mono text-sm">
              {messages.map(m => (
                <div key={m.id} className={cn(
                  "p-2 rounded-lg",
                  m.type === 'sys' ? "bg-slate-900 text-slate-400 italic" :
                  m.type === 'server' ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                  "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                )}>
                  {m.text}
                </div >
              ))}
              {messages.length === 0 && (
                <div className="text-slate-700 text-center py-20 italic">Connecting to stream...</div>
              )}
            </div >

            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Send message to echo server..."
                className="flex-1 px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-yellow-500"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-white font-semibold transition-all"
              >
                Send
              </button>
            </div >
          </div >
        </div >
      </div >
    </div >
  );
}
