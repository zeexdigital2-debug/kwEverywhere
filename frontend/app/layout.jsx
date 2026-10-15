import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AnnouncementBanner } from '@/components/AnnouncementBanner';

export const metadata = {
  title: 'KWEveryWhere - Free Keyword Intelligence & SERP Analytics',
  description: 'Full-stack SEO platform for keyword research, live SERP volume, CPC benchmarks, and domain authority metrics.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Prevent dark/light mode flash */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            try {
              var t = localStorage.getItem('kws-theme');
              var html = document.documentElement;
              if (t === 'light') {
                html.classList.remove('dark');
                html.classList.add('light');
                html.style.colorScheme = 'light';
              } else {
                html.classList.add('dark');
                html.classList.remove('light');
                html.style.colorScheme = 'dark';
              }
            } catch(e) {}
          })();
        `}} />
      </head>
      <body className="min-h-screen font-sans antialiased selection:bg-teal-500/20">
        <ThemeProvider>
          <AnnouncementBanner />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
