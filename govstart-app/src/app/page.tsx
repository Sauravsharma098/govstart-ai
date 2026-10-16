'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/app-context';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LandingPage from '@/components/LandingPage';
import StartupDashboard from '@/components/StartupDashboard';
import TenderDiscovery from '@/components/TenderDiscovery';
import AiStudioView from '@/components/AiStudioView';
import ApplicationsTracker from '@/components/ApplicationsTracker';
import OfficerPortal from '@/components/OfficerPortal';
import AdminConsole from '@/components/AdminConsole';
import AuthModal from '@/components/AuthModal';
import SmartShortlist from '@/components/SmartShortlist';
import LearningHub from '@/components/LearningHub';
import ConsultantWorkspace from '@/components/ConsultantWorkspace';
import OnboardingModal from '@/components/OnboardingModal';
import PricingPlansModal from '@/components/PricingPlansModal';

function MainContent() {
  const { activeView, setActiveView } = useApp();
  const [pricingModalOpen, setPricingModalOpen] = useState(false);

  return (
    <main className="flex-1">
      {activeView === 'landing' && <LandingPage />}
      {activeView === 'dashboard' && <StartupDashboard />}
      {activeView === 'tenders' && <TenderDiscovery />}
      {activeView === 'ai-studio' && <AiStudioView />}
      {activeView === 'applications' && <ApplicationsTracker />}
      {activeView === 'shortlist' && <SmartShortlist />}
      {activeView === 'learning-hub' && <LearningHub />}
      {activeView === 'officer' && <OfficerPortal />}
      {activeView === 'admin' && <AdminConsole />}
      
      {/* Modals and Overlays */}
      <AuthModal />
      <OnboardingModal />
      <PricingPlansModal 
        isOpen={activeView === 'pricing' || pricingModalOpen} 
        onClose={() => {
          setPricingModalOpen(false);
          if (activeView === 'pricing') setActiveView('landing');
        }} 
      />
    </main>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />
      <MainContent />
      <Footer />
    </div>
  );
}
