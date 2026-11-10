import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import localFont from 'next/font/local'
import Header from "./components/Header";

const chaletFont = localFont({
  src: '../public//fonts/chalet.otf',
  variable: '--font-chalet',
})


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpenFlight Journal",
  description: "Stories and ideas from OpenFlight.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${chaletFont.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
   
      <body className="min-h-full flex flex-col">
           <Header></Header>
        {children}</body>
    </html>
  );
}
