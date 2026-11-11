import './globals.css';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';

import Header from './components/Header';

const chaletFont = localFont({
   src: '../public//fonts/chalet.otf',
   variable: '--font-chalet'
});

const geistSans = Geist({
   subsets: ['latin'],
   variable: '--font-geist-sans'
});

const geistMono = Geist_Mono({
   subsets: ['latin'],
   variable: '--font-geist-mono'
});

export const metadata: Metadata = {
   description: 'Stories and ideas from OpenFlight.',
   title: 'OpenFlight Labs'
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
   return (
      <html
         lang="en"
         className={`${chaletFont.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
         <body className="min-h-full flex flex-col">
            <Header></Header>
            {children}
         </body>
      </html>
   );
}
