import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en">
      <body className="antialiased selection:bg-cyan-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
