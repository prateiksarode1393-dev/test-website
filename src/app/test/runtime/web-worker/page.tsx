'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Activity, ArrowLeft, Timer } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function WebWorkerPage() {
  const [result, setResult] = useState<string | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    // AUTO-TRIGGER: Start computation on page load
    const startCompute = () => {
      setIsComputing(true);
      setResult(null);
      const now = Date.now();
      setStartTime(now);

      // Create worker from public asset
      const worker = new Worker('/workers/compute.js');

      worker.onmessage = (e) => {
        setResult(e.data.value.toFixed(2));
        setDuration((Date.now() - now) / 1000);
        setIsComputing(false);
        worker.terminate();
      };

      worker.postMessage('start_computation');
    };

    startCompute();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/test/runtime" className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-white">Web Worker Async Compute</h1>
      </div >

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-3xl bg-[#0f0f12] border border-slate-800 space-y-6"
        >
          <div className="flex items-center gap-3 text-purple-400">
            <Cpu className="w-6 h-6" />
            <h2 className="text-xl font-bold">Off-Main-Thread</h2>
          </div >

          <p className="text-slate-500 text-sm">
            This page spawns a background worker to calculate a large sum automatically on load.
            The main thread remains responsive while the computation happens.
          </p>

          <div className={cn(
            "w-full py-3 rounded-xl font-semibold text-center transition-all",
            isComputing ? "bg-slate-800 text-slate-500" : "bg-green-900/30 text-green-400 border border-green-500/30"
          )}>
            {isComputing ? 'Computation Running...' : 'Computation Completed'}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-8 rounded-3xl bg-[#0f0f12] border border-slate-800 space-y-6"
        >
          <div className="flex items-center gap-3 text-blue-400">
            <Activity className="w-6 h-6" />
            <h2 className="text-xl font-bold">Result</h2>
          </div >

          <div className="p-6 rounded-2xl bg-black border border-slate-800 min-h-[120px] flex flex-col items-center justify-center text-center space-y-2">
            {result ? (
              <>
                <span className="text-4xl font-black text-white">{result}</span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Timer className="w-3 h-3" /> computed in {duration?.toFixed(2)}s
                </span>
              </>
            ) : (
              <span className="text-slate-600 italic">
                {isComputing ? 'Worker is processing...' : 'No result yet'}
              </span>
            )}
          </div >
        </motion.div>
      </div >
    </div >
  );
}
