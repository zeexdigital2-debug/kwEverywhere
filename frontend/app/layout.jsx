import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { clsx } from 'clsx';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AnnouncementBanner } from '@/components/AnnouncementBanner';

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans' 
});
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata = {
  title: 'KWEveryWhere - Free Keyword Intelligence & SERP Analytics',
  description: 'Full-stack SEO platform for keyword research, live SERP volume, CPC benchmarks, and domain authority metrics.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <head>
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
      <body className={clsx(jakarta.variable, jetbrains.variable, "min-h-screen font-sans antialiased selection:bg-teal-500/20")}>
        <ThemeProvider>
          <AnnouncementBanner />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
