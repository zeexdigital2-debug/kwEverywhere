import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { KeywordProvider } from './context/KeywordContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import CreditBadge from './components/Dashboard/CreditBadge';
import KeywordInput from './components/Dashboard/KeywordInput';
import ResultsTable from './components/Dashboard/ResultsTable';
import TrendChart from './components/Dashboard/TrendChart';
import DomainAuthorityChecker from './components/Dashboard/DomainAuthorityChecker';
import ExtensionModal from './components/Dashboard/ExtensionModal';

function MainAppContent() {
  const [activeTab, setActiveTab] = useState('landing'); // 'landing' | 'dashboard' | 'domain'
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isExtensionOpen, setIsExtensionOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-900 text-gray-100 flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      
      <div>
        {/* Sticky Glass Navbar */}
        <Navbar
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenExtensionModal={() => setIsExtensionOpen(true)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Tab Content */}
        {activeTab === 'landing' && (
          <main>
            <Hero
              onExploreDashboard={() => setActiveTab('dashboard')}
              onOpenExtensionModal={() => setIsExtensionOpen(true)}
            />
            <Features onOpenExtensionModal={() => setIsExtensionOpen(true)} />
          </main>
        )}

        {activeTab === 'dashboard' && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">Keyword Intelligence Dashboard</h1>
                <p className="text-sm text-gray-400">Search volume estimates, 12-month trends & competition ratings</p>
              </div>
              <div className="w-full md:w-80">
                <CreditBadge />
              </div>
            </div>

            <KeywordInput />
            <ResultsTable />
          </main>
        )}

        {activeTab === 'domain' && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Domain Authority & PageRank Engine</h1>
              <p className="text-sm text-gray-400 mt-2">Evaluate competitor domains and web metrics powered by OpenPageRank</p>
            </div>
            <div className="max-w-3xl mx-auto">
              <DomainAuthorityChecker />
            </div>
          </main>
        )}
      </div>

      {/* Footer */}
      <Footer />

      {/* Modals & Overlay Visualizers */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <ExtensionModal isOpen={isExtensionOpen} onClose={() => setIsExtensionOpen(false)} />
      <TrendChart />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <KeywordProvider>
        <MainAppContent />
      </KeywordProvider>
    </AuthProvider>
  );
}
