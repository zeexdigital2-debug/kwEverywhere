import { Sidebar } from '@/components/layout/Sidebar';
import SiteHeader from '@/components/SiteHeader';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased">
      {/* Main Site Navigation Bar at the top */}
      <SiteHeader />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content offset by sidebar width on desktop */}
        <div className="flex-1 md:pl-64 min-w-0">
          <main className="flex-1">
            <div className="py-8 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
