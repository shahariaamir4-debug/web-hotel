/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useHotel } from '../context/HotelContext';
import { Lock, Unlock, ShieldCheck, Eye, EyeOff, X, AlertCircle, Sparkles, Building2 } from 'lucide-react';

export const AdminPasscodeModal: React.FC = () => {
  const {
    isPasscodeModalOpen,
    setIsPasscodeModalOpen,
    verifyAdminPasscode,
    adminPasscode
  } = useHotel();

  const [inputCode, setInputCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isPasscodeModalOpen) {
      setInputCode('');
      setErrorMsg('');
      setShowCode(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isPasscodeModalOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPasscodeModalOpen) {
        setIsPasscodeModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPasscodeModalOpen, setIsPasscodeModalOpen]);

  if (!isPasscodeModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) {
      setErrorMsg('Please enter the executive passcode.');
      return;
    }

    setIsSubmitting(true);
    const success = verifyAdminPasscode(inputCode);

    if (success) {
      setErrorMsg('');
      setIsSubmitting(false);
    } else {
      setIsSubmitting(false);
      setErrorMsg('Invalid passcode. Default passcode is antix2026.');
      inputRef.current?.select();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#03150f] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/90 relative overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          id="btn-close-passcode-modal"
          onClick={() => setIsPasscodeModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-emerald-900/40 transition-colors cursor-pointer"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xl shadow-amber-950/40 mb-4 border border-amber-400/30">
            <ShieldCheck className="w-7 h-7 text-amber-100" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-600/30 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Staff & Owner Portal</span>
          </div>

          <h2 className="font-display font-black text-2xl text-white tracking-tight">
            Security Gatekeeper
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Restricted hotel administration area. Enter your secret staff passcode to unlock the management dashboard.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Staff Passcode (PIN)
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                id="input-admin-passcode"
                type={showCode ? 'text' : 'password'}
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Enter passcode (e.g. antix2026)"
                className="w-full px-4 py-3.5 pr-11 bg-[#020e0a] border border-emerald-800/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-mono tracking-wider"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                title={showCode ? 'Hide passcode' : 'Show passcode'}
              >
                {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-1.5 text-rose-400 text-xs mt-2 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Discreet Help Note for client handover */}
          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40 text-[11px] text-amber-300/90 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <Lock className="w-3 h-3 text-amber-400 shrink-0" />
              Default Code:
            </span>
            <span className="font-mono font-bold bg-amber-900/50 px-2 py-0.5 rounded text-amber-200">
              antix2026
            </span>
          </div>

          {/* Submit Button */}
          <button
            id="btn-submit-passcode"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-600 via-emerald-600 to-teal-600 hover:from-amber-500 hover:to-teal-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Unlock className="w-4 h-4" />
            <span>Unlock Admin Panel</span>
          </button>

          {/* Return button */}
          <button
            id="btn-cancel-passcode"
            type="button"
            onClick={() => setIsPasscodeModalOpen(false)}
            className="w-full py-2 text-xs text-slate-400 hover:text-slate-200 transition-colors text-center cursor-pointer"
          >
            Cancel & Return to Guest View
          </button>
        </form>

        {/* Bottom micro security indicator */}
        <div className="mt-4 pt-3 border-t border-emerald-950/60 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
          <Building2 className="w-3 h-3 text-emerald-500" />
          <span>Antix Hotel Sanctuary Management Gateway</span>
        </div>
      </div>
    </div>
  );
};
