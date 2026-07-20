import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Live Stream Hub - HLS (.m3u8) Streaming Platform',
  description: 'High-performance HLS video streaming platform with live stream validation, CORS proxying, real-time health monitoring, telemetry, and multi-view grid.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased bg-[#0B0B0C] text-white selection:bg-red-600 selection:text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
