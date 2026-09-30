'use client';

export const runtime = 'edge';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function PopupStormPage() {
  const [popups, setPopups] = useState<number[]>([]);

  const spawnPopup = () => {
    setPopups(prev => [...prev, Date.now()]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      spawnPopup();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-[#0f0f12] text-white relative overflow-hidden">
      <Link href="/test/chaos" className="absolute top-10 left-10 p-3 rounded-full bg-slate-800 hover:bg-slate-700 transition-all">
        <ArrowLeft className="w-5 h-5" />
      </Link>
      <h1 className="text-3xl font-bold mb-8">Chaos: Popup Storm</h1>
      <div className="bg-slate-900 p-10 rounded-3xl border border-slate-800 shadow-xl max-w-md w-full space-y-6">
        <p className="text-slate-400">This page periodically spawns "popups" (DOM overlays) to test if a crawler can ignore them or find the main content.</p>
        <button onClick={spawnPopup} className="w-full py-3 bg-red-600 hover:bg-red-500 rounded-xl font-bold transition-all">
          Spawn Popup Manually
        </button>
      </div>

      {popups.map((id, index) => (
        <motion.div
          key={id}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            position: 'absolute',
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * 80}%`,
            zIndex: 100
          }}
          className="p-6 bg-white text-black rounded-lg shadow-2xl border-4 border-red-500 w-64"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="font-bold">AD #{index + 1}</span>
            <button onClick={() => setPopups(prev => prev.filter(p => p !== id))} className="text-slate-500 hover:text-black">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm mb-4">CONGRATULATIONS! You've won a free cruise to the depths of the DOM!</p>
          <button className="w-full py-2 bg-blue-600 text-white rounded font-bold text-xs">CLAIM NOW</button>
        </motion.div>
      ))}
    </div>
  );
}
