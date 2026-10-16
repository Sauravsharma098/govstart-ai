'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/context/app-context';
import { UserRole } from '../lib/types';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Building, 
  ArrowRight, 
  CheckCircle2, 
  User as UserIcon,
  AlertCircle
} from 'lucide-react';

export default function AuthModal() {
  const { authModalOpen, authMode, closeAuth, login, openAuth } = useApp();
  
  const [email, setEmail] = useState('vikram@aerotechdefence.in');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState<UserRole>('STARTUP');
  const [organization, setOrganization] = useState('AeroTech Defence Labs');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please provide a valid official email address.');
      return;
    }
    setErrorMsg('');

    if (authMode === 'forgot') {
      setSuccessMsg(`Password reset instructions have been dispatched to ${email}. (Demo mode: You can now sign in)`);
      setTimeout(() => {
        setSuccessMsg('');
        openAuth('login');
      }, 2000);
      return;
    }

    login(email, role);
  };

  const handleQuickFill = (targetRole: UserRole) => {
    setRole(targetRole);
    if (targetRole === 'STARTUP') {
      setEmail('vikram@aerotechdefence.in');
      setOrganization('AeroTech Defence Labs');
    } else if (targetRole === 'OFFICER') {
      setEmail('rajesh.sharma@drdo.gov.in');
      setOrganization('DRDO Directorate of Electronics');
    } else {
      setEmail('pooja.verma@meity.gov.in');
      setOrganization('Ministry of Electronics & IT');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white relative">
          <button
            onClick={closeAuth}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">GovStart AI</span>
          </div>

          <h3 className="text-xl font-bold">
            {authMode === 'login' && 'Sign in to your account'}
            {authMode === 'signup' && 'Create your platform account'}
            {authMode === 'forgot' && 'Reset your password'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {authMode === 'login' && 'Access government tenders and AI proposal tools'}
            {authMode === 'signup' && 'Register as a Startup or Procurement Authority'}
            {authMode === 'forgot' && 'We will send a secure verification code to your email'}
          </p>
        </div>

        {/* Quick Demo Role Autofill Pills */}
        <div className="px-6 pt-4 pb-2 bg-slate-50 border-b border-slate-100">
          <div className="text-[11px] font-semibold text-slate-500 mb-1.5">Quick Demo Persona Fill:</div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('STARTUP')}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center border transition-all ${
                role === 'STARTUP' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Startup
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('OFFICER')}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center border transition-all ${
                role === 'OFFICER' ? 'bg-blue-50 border-blue-300 text-blue-800' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Officer
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('ADMIN')}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center border transition-all ${
                role === 'ADMIN' ? 'bg-purple-50 border-purple-300 text-purple-800' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {authMode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Entity / Organization Name</label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  required
                  placeholder="e.g. AeroTech Defence Labs"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@organization.gov.in"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {authMode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                {authMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => openAuth('forgot')}
                    className="text-[11px] text-emerald-700 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            {authMode === 'login' && 'Sign In to Platform'}
            {authMode === 'signup' && 'Register New Account'}
            {authMode === 'forgot' && 'Send Reset Link'}
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Mode Switcher footer */}
          <div className="pt-2 text-center text-xs text-slate-500">
            {authMode === 'login' && (
              <span>
                Don&apos;t have an account?{' '}
                <button type="button" onClick={() => openAuth('signup')} className="font-semibold text-slate-900 hover:underline">
                  Sign up
                </button>
              </span>
            )}
            {authMode === 'signup' && (
              <span>
                Already registered?{' '}
                <button type="button" onClick={() => openAuth('login')} className="font-semibold text-slate-900 hover:underline">
                  Sign in
                </button>
              </span>
            )}
            {authMode === 'forgot' && (
              <span>
                Remembered your password?{' '}
                <button type="button" onClick={() => openAuth('login')} className="font-semibold text-slate-900 hover:underline">
                  Back to Sign in
                </button>
              </span>
            )}
          </div>

        </form>

      </div>
    </div>
  );
}
