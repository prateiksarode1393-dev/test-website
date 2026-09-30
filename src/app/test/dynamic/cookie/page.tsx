'use client';

export const runtime = 'edge';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, Bell, Zap } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function CookiePopup() {
  const [showCookie, setShowCookie] = useState(false);
  const [showPromo, setShowPromo] = useState(false);

  useEffect(() => {
    // Trigger cookie banner immediately
    setShowCookie(true);
    // Trigger promo popup after 3 seconds
    const timer = setTimeout(() => setShowPromo(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-20">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">UX <span className="text-orange-500">Blockers</span></h1>
          <p className="text-slate-400">Testing overlay interference and interaction barriers</p>
        </div >
        <Link href="/test/dynamic" className="p-3 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div >

      <div className="p-12 rounded-3xl bg-[#0f0f12] border border-slate-800 space-y-8">
        <h2 className="text-2xl font-bold text-white">Main Content Area</h2>
        <p className="text-slate-400 leading-relaxed">
          This content is technically present in the DOM, but for a human, it is blocked by overlays.
          A crawler must decide if it can "see through" these elements or if it needs to interact with them to clear the view.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-500">Data Point A</div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-500">Data Point B</div>
        </div >
      </div >

      {/* Cookie Banner */}
      <AnimatePresence>
        {showCookie && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-0 left-0 right-0 p-6 bg-slate-900 border-t border-blue-500/50 z-50 flex items-center justify-between shadow-2xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Bell className="w-5 h-5" />
              </div >
              <p className="text-slate-300 text-sm max-w-2xl">
                We use cookies to track your crawling behavior. By continuing, you agree to our Chaos Privacy Policy.
              </p>
            </div >
            <button
              onClick={() => setShowCookie(false)}
              className="px-6 py-2 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all"
            >
              Accept All
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Promo Popup */}
      <AnimatePresence>
        {showPromo && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-md w-full p-8 rounded-3xl bg-[#0f0f12] border border-orange-500/50 relative shadow-2xl"
            >
              <button
                onClick={() => setShowPromo(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto text-orange-500">
                  <Zap className="w-10 h-10" />
                </div >
                <h3 className="text-3xl font-bold text-white">Special Offer!</h3>
                <p className="text-slate-400">Get 100% more chaos in your crawler today. Sign up for our newsletter.</p>
                <button
                  onClick={() => setShowPromo(false)}
                  className="w-full py-3 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-500 transition-all"
                >
                  Claim Reward
                </button>
              </div >
            </motion.div>
          </div >
        )}
      </AnimatePresence>
    </div >
  );
}
