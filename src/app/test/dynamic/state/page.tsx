'use client';

export const runtime = 'edge';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lock, Key, CheckCircle, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function StateDependentPage() {
  // State machine: 'initial' -> 'input' -> 'confirm' -> 'final'
  const [step, setStep] = useState<'initial' | 'input' | 'confirm' | 'final'>('initial');
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const SECRET_CODE = '1234';

  const handleStart = () => {
    setStep('input');
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue === SECRET_CODE) {
      setError('');
      setStep('confirm');
    } else {
      setError('Invalid secret code. Please try again.');
    }
  };

  const handleConfirm = () => {
    setStep('final');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-20 px-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            State <span className="text-purple-500">Dependency</span>
          </h1>
          <p className="text-slate-400">Testing interaction sequences and state-based content discovery</p>
        </div>
        <Link
          href="/test/dynamic"
          className="p-3 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      <div className="p-12 rounded-3xl bg-[#0f0f12] border border-slate-800 min-h-[400px] flex flex-col items-center justify-center text-center space-y-8">
        <AnimatePresence mode="wait">
          {step === 'initial' && (
            <motion.div
              key="initial"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto text-purple-500">
                <Lock className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-white">Content Locked</h2>
              <p className="text-slate-400 max-w-sm mx-auto">
                The target content is hidden behind a state sequence. You must interact with the page to reveal it.
              </p>
              <button
                onClick={handleStart}
                className="px-8 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-500 transition-all shadow-lg shadow-purple-500/20"
              >
                Start Sequence
              </button>
            </motion.div>
          )}

          {step === 'input' && (
            <motion.form
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleCodeSubmit}
              className="space-y-6 w-full max-w-sm"
            >
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto text-blue-500">
                <Key className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-white">Step 1: Enter Secret Code</h2>
              <div className="space-y-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter code (1234)"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-center text-lg tracking-widest"
                />
                {error && <p className="text-red-400 text-sm">{error}</p>}
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all"
              >
                Unlock Next Step
              </button>
            </motion.form>
          )}

          {step === 'confirm' && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-white">Step 2: Confirm Identity</h2>
              <p className="text-slate-400 max-w-sm mx-auto">
                Code accepted. Please confirm your identity to access the secret content.
              </p>
              <button
                onClick={handleConfirm}
                className="px-8 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-500 transition-all shadow-lg shadow-green-500/20"
              >
                Confirm & Reveal
              </button>
            </motion.div>
          )}

          {step === 'final' && (
            <motion.div
              key="final"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto text-yellow-500">
                <Trophy className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-white">Success!</h2>
              <div className="p-6 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 text-xl font-medium">
                Success! You reached the state-dependent content.
              </div>
              <button
                onClick={() => { setStep('initial'); setInputValue(''); }}
                className="text-slate-500 hover:text-slate-300 text-sm underline transition-all"
              >
                Reset Sequence
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4">
        <h3 className="text-lg font-semibold text-white">Crawler Challenge</h3>
        <p className="text-slate-400 leading-relaxed">
          This page tests if a bot can navigate a multi-step interaction flow.
          Simple HTML scrapers will only see the "Content Locked" state.
          Advanced agents must:
          <ul className="list-disc list-inside mt-2 space-y-1 text-slate-500">
            <li>Find and click the "Start" button.</li>
            <li>Identify the input field and provide the correct secret code ('1234').</li>
            <li>Locate and click the final "Confirm" button.</li>
            <li>Extract the final success message.</li>
          </ul>
        </p>
      </div>
    </div>
  );
}
