import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import './index.css'
import {  jetBrainsMono } from "@/app/fonts/nextfonts"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={jetBrainsMono.className}>{children}</body>
    </html>
  );
}
