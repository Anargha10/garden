import type { Metadata } from 'next';
import { Cormorant_Garamond, Playfair_Display, Great_Vibes } from 'next/font/google';
import './globals.css';

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant-garamond',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-playfair-display',
  display: 'swap',
});

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-great-vibes',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'The Garden Inside My Heart',
  description: 'A romantic storytelling experience — step through the hidden gate into a world of cherished memories and eternal love.',
  keywords: ['romance', 'love story', 'digital letter', 'romantic', 'memories'],
  authors: [{ name: 'A Garden Production' }],
  openGraph: {
    title: 'The Garden Inside My Heart',
    description: 'A romantic storytelling experience',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${playfairDisplay.variable} ${greatVibes.variable}`}
    >
      <body className="antialiased bg-garden-dark text-garden-parchment min-h-screen">
        {children}
      </body>
    </html>
  );
}