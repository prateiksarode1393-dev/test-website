import './globals.css';
import { MainLayout } from '@/components/layout/MainLayout';
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <MainLayout>{children}</MainLayout>
        <Script
          id="cloudflare-web-analytics"
          strategy="afterInteractive"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "10ed3703167244e785d52594d3520382"}'
        />
      </body>
    </html>
  );
}
