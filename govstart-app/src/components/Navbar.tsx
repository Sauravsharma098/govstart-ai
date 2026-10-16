'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/context/app-context';
import { 
  Bell, 
  ChevronDown, 
  LogOut, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  FileText, 
  LayoutDashboard, 
  Compass,
  Briefcase,
  Bookmark
} from 'lucide-react';

export default function Navbar() {
  const { 
    currentUser, 
    allUsers, 
    switchUserPersona, 
    activeView, 
    setActiveView, 
    unreadNotificationCount, 
    notifications,
    markNotificationAsRead,
    shortlistRecords,
    openAuth, 
    logout,
    setOnboardingModalOpen
  } = useApp();

  const [personaMenuOpen, setPersonaMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('landing')}>
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-md shadow-slate-900/10">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">GovStart</span>
                <span className="px-1.5 py-0.5 text-[11px] font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">AI</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase -mt-0.5">GovTech Startup Platform</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveView('landing')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeView === 'landing' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveView('tenders')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                activeView === 'tenders' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4 text-slate-500" />
              Explore Tenders
            </button>

            <button
              onClick={() => setActiveView('learning-hub')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                activeView === 'learning-hub' ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              Academy & Guides
            </button>

            {currentUser && (
              <>
                <button
                  onClick={() => setActiveView('dashboard')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                    activeView === 'dashboard' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-500" />
                  Dashboard
                </button>

                <button
                  onClick={() => setActiveView('ai-studio')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                    activeView === 'ai-studio' ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  AI Intelligence
                </button>

                <button
                  onClick={() => setActiveView('applications')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                    activeView === 'applications' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="w-4 h-4 text-slate-500" />
                  My Bids
                </button>

                {currentUser.role === 'STARTUP' && (
                  <button
                    onClick={() => setActiveView('shortlist')}
                    className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                      activeView === 'shortlist' ? 'bg-indigo-50 text-indigo-800 font-semibold border border-indigo-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Bookmark className="w-4 h-4 text-indigo-500" />
                    AI Shortlist
                    {shortlistRecords.length > 0 && (
                      <span className="ml-0.5 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded-full bg-indigo-600 text-white">
                        {shortlistRecords.length}
                      </span>
                    )}
                  </button>
                )}

                {currentUser.role === 'OFFICER' && (
                  <button
                    onClick={() => setActiveView('officer')}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                      activeView === 'officer' ? 'bg-blue-50 text-blue-800 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    Officer Desk
                  </button>
                )}

                {currentUser.role === 'ADMIN' && (
                  <button
                    onClick={() => setActiveView('admin')}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                      activeView === 'admin' ? 'bg-purple-50 text-purple-800 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Layers className="w-4 h-4 text-purple-600" />
                    Admin Console
                  </button>
                )}

                {currentUser.role === 'CONSULTANT' && (
                  <button
                    onClick={() => setActiveView('dashboard')}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                      activeView === 'dashboard' ? 'bg-amber-50 text-amber-800 font-semibold border border-amber-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Briefcase className="w-4 h-4 text-amber-600" />
                    Clients Hub
                  </button>
                )}
              </>
            )}
          </nav>

          {/* Right Action Tools: Persona Switcher, Notifications, User Menu */}
          <div className="flex items-center gap-2.5">
            
            {/* Quick Profile Tailor Button */}
            <button
              onClick={() => setOnboardingModalOpen(true)}
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all hover:scale-[1.02]"
              title="Tailor your capabilities and statutory exemptions"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>Tailor Matches</span>
            </button>

            {/* Live Demo Persona Switcher */}
            <div className="relative">
              <button
                onClick={() => { setPersonaMenuOpen(!personaMenuOpen); setNotifMenuOpen(false); setUserMenuOpen(false); }}
                className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors shadow-2xs"
                title="Switch test personas instantly"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-slate-500 font-normal">Persona:</span>
                <span className="max-w-[130px] truncate text-slate-900">{currentUser ? currentUser.name : 'Guest'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {personaMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-100 text-xs font-semibold text-slate-500">
                    Switch Active Persona (Demo Mode)
                  </div>
                  <div className="py-1 space-y-1">
                    {allUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUserPersona(u.id);
                          setPersonaMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          currentUser?.id === u.id ? 'bg-slate-100 text-slate-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-medium text-slate-900">{u.name}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[200px]">{u.organization}</div>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          u.role === 'OFFICER' ? 'bg-blue-100 text-blue-700' :
                          u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                          u.role === 'CONSULTANT' ? 'bg-amber-100 text-amber-800' :
                          u.role === 'MSME' ? 'bg-teal-100 text-teal-800' :
                          u.role === 'SUPPLIER' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {u.role}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => { setNotifMenuOpen(!notifMenuOpen); setPersonaMenuOpen(false); setUserMenuOpen(false); }}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {notifMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-sm font-semibold text-slate-900">Notifications</span>
                    <span className="text-xs text-slate-500">{notifications.length} alerts</span>
                  </div>
                  <div className="py-2 max-h-72 overflow-y-auto space-y-2">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
                          n.read ? 'bg-slate-50/50 text-slate-600' : 'bg-emerald-50/60 border border-emerald-100 text-slate-900'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{n.timestamp}</span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-600 line-clamp-2">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile or Login CTA */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => { setUserMenuOpen(!userMenuOpen); setPersonaMenuOpen(false); setNotifMenuOpen(false); }}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                    {currentUser.avatar || 'U'}
                  </div>
                  <div className="hidden sm:block text-left text-xs">
                    <div className="font-semibold text-slate-900 leading-tight truncate max-w-[100px]">{currentUser.name}</div>
                    <div className="text-[10px] text-emerald-600 font-medium capitalize">{currentUser.role.toLowerCase()}</div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => { setActiveView('dashboard'); setUserMenuOpen(false); }}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />
                        My Dashboard
                      </button>
                      <button
                        onClick={() => { setActiveView('applications'); setUserMenuOpen(false); }}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        Submitted Proposals
                      </button>
                      <button
                        onClick={() => { setOnboardingModalOpen(true); setUserMenuOpen(false); }}
                        className="w-full text-left px-3 py-1.5 text-xs text-emerald-700 hover:bg-emerald-50 rounded-lg flex items-center gap-2 font-semibold"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        Tailor Onboarding Profile
                      </button>
                      <button
                        onClick={() => { setActiveView('pricing'); setUserMenuOpen(false); }}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                      >
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        Subscription Plans & Pricing
                      </button>
                    </div>
                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-500" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuth('login')}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuth('signup')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
                >
                  Get Started
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
