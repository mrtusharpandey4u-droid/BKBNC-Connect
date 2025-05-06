import type {Metadata} from 'next';
 import {Geist, Geist_Mono} from 'next/font/google';
 import './globals.css';
 import { Toaster } from "@/components/ui/toaster"; // Import Toaster

 const geistSans = Geist({
   variable: '--font-geist-sans',
   subsets: ['latin'],
 });

 const geistMono = Geist_Mono({
   variable: '--font-geist-mono',
   subsets: ['latin'],
 });

 export const metadata: Metadata = {
   title: 'BKBNC Connect - Simplifying College Journey',
   description: 'AI Assistant for B. K. Birla Night College Kalyan',
 };

 export default function RootLayout({
   children,
 }: Readonly<{
   children: React.ReactNode;
 }>) {
   return (
     <html lang="en">
       <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
         {children}
         <Toaster /> {/* Add Toaster here */}
       </body>
     </html>
   );
 }
