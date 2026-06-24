import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // 👈 একসাথে ক্লিন ইম্পোর্ট
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shamim Vai - সরকারি চাকরি প্রস্তুতি কোর্স",
  description: "Shamim Vai এর তত্ত্বাবধানে — বুক গাইডলাইন, জব সলিউশন, ভোকাবুলারি রুটিন ও বিগত প্রশ্নের সমাধান একই কোর্সে।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}