import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Shield Approved | Elite Asset Protection',
  description: 'Fortified protection for legacy assets. Military-grade vaulting, secure custody, and elite asset protection services.',
  icons: [{ rel: 'icon', url: '/logo.jpg' }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
