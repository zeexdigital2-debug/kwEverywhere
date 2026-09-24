'use client';
import Link from 'next/link';
import { Search, Target, Globe, BarChart3, ArrowRight, GitCompare } from 'lucide-react';

const tools = [
  { 
    name: 'Keyword Research', 
    desc: 'Analyze bulk keywords for volume, trends, and difficulty across 15+ countries.', 
    icon: Search, 
    href: '/dashboard/keyword-research',
    color: 'from-blue-400 to-blue-600'
  },
  { 
    name: 'Keywords Finder', 
    desc: 'Extract high-intent keywords from competitor URLs, domains, or seed keywords.', 
    icon: Target, 
    href: '/dashboard/keywords-finder',
    color: 'from-brand-400 to-brand-600'
  },
  { 
    name: 'Competitor Gap', 
    desc: "Find keywords competitors rank for that you don't — uncover hidden traffic.", 
    icon: GitCompare, 
    href: '/dashboard/competitor-gap',
    color: 'from-pink-400 to-rose-600',
    badge: 'New'
  },
  { 
    name: 'Local Keywords', 
    desc: 'Discover geo-targeted keyword opportunities across 22+ countries and languages.', 
    icon: Globe, 
    href: '/dashboard/local-keywords',
    color: 'from-purple-400 to-purple-600'
  },
  { 
    name: 'Domain Metrics', 
    desc: 'Check OpenPageRank authority scores in bulk for any domain list.', 
    icon: BarChart3, 
    href: '/dashboard/domain-metrics',
    color: 'from-orange-400 to-orange-600'
  }
];

export default function DashboardOverview() {
  return (
    <div className="space-y-7 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Welcome Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome to KWEveryWhere Workspace
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Access verified Google search volume, competitor domain authority, and keyword gap intelligence.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-semibold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>All Engines Operational</span>
          </span>
        </div>
      </div>

      {/* 4 Telemetry Quick Stats Cards (White Premium) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Access Tier</span>
          <div className="text-xl font-bold text-slate-900 mt-1">100% Free Forever</div>
          <span className="text-[11px] text-emerald-600 font-medium">No Subscription Paywalls</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Bulk Capacity</span>
          <div className="text-xl font-bold text-[#0a192f] mt-1">Unlimited</div>
          <span className="text-[11px] text-slate-500">Instant CSV Exports</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Supported Countries</span>
          <div className="text-xl font-bold text-slate-900 mt-1">22+ Regions</div>
          <span className="text-[11px] text-blue-600 font-medium">Multi-Language Telemetry</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">SERP Accuracy</span>
          <div className="text-xl font-bold text-emerald-600 mt-1">99.8% Live</div>
          <span className="text-[11px] text-slate-500">Direct Google In-SERP Sync</span>
        </div>
      </div>

      {/* 100% Free Banner (Clean White Gradient Accent) */}
      <div className="bg-gradient-to-r from-blue-50/90 via-white to-slate-50 border border-blue-200/70 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Enterprise SEO Telemetry at Zero Cost
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-700 rounded-full border border-blue-200">
              Free Tier
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            All keyword research, competitor gap analytics, and bulk domain metrics are unrestricted. Extract unlimited keyword opportunities anytime.
          </p>
        </div>
        <Link
          href="/dashboard/keyword-research"
          className="px-4 py-2 bg-[#0a192f] hover:bg-[#11244e] text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow-md transition-all whitespace-nowrap"
        >
          Start Keyword Research
        </Link>
      </div>

      {/* Tools Grid (Clean White Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tools.map((tool) => (
          <Link key={tool.name} href={tool.href} className="block group">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-xl hover:border-blue-400/60 hover:-translate-y-1 transition-all duration-200 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-md`}>
                    <tool.icon className="w-5 h-5 text-white" />
                  </div>
                  {tool.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                      {tool.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">
                  {tool.name}
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-4">
                  {tool.desc}
                </p>
              </div>

              <div className="flex items-center text-xs font-semibold text-blue-600 pt-3 border-t border-slate-100 group-hover:translate-x-1 transition-transform">
                <span>Launch Tool</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
