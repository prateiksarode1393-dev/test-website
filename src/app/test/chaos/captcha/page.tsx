'use client';

import React, { useState } from 'react';
export const dynamic = 'force-static';
import { motion } from 'framer-motion';
import { Lock, Key, CheckCircle, Trophy, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CaptchaTestPage() {
  const [status, setStatus] = useState<'idle' | 'solving' | 'success'>('idle');
  const [progress, setProgress] = useState(0);

  const startCaptcha = () => {
    setStatus('solving');
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setStatus('success');
      }
    }, 200);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-[#0f0f12] text-white">
      <Link href="/test/chaos" className="absolute top-10 left-10 p-3 rounded-full bg-slate-800 hover:bg-slate-700 transition-all">
        <ArrowLeft className="w-5 h-5" />
      </Link>
      <h1 className="text-3xl font-bold mb-8">Bot Challenge: Captcha</h1>
      <div className="bg-slate-900 p-10 rounded-3xl border border-slate-800 shadow-xl max-w-md w-full space-y-6">
        {status === 'idle' && (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto text-orange-500">
              <Lock className="w-10 h-10" />
            </div>
            <p className="text-slate-400">Please verify you are human to access the secret content.</p>
            <button onClick={startCaptcha} className="w-full py-3 bg-orange-600 hover:bg-orange-500 rounded-xl font-bold transition-all">
              I am not a robot
            </button>
          </div>
        )}
        {status === 'solving' && (
          <div className="space-y-6">
            <p className="text-slate-400">Analyzing behavior patterns...</p>
            <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-orange-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 font-mono">{progress}% complete</p>
          </div>
        )}
        {status === 'success' && (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold">Verification Complete</h2>
            <p className="text-green-400 font-mono">SECRET_TOKEN: BOT_BYPASS_SUCCESS_99</p>
          </div>
        )}
      </div>
    </div>
  );
}

