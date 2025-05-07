import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // Import Inter font
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

const inter = Inter({ // Initialize Inter font
  subsets: ['latin'],
  variable: '--font-inter', // Define CSS variable for Inter font
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
       <body className={`${inter.variable} font-sans antialiased`}> {/* Apply Inter font */}
         {children}
         <Toaster /> {/* Add Toaster here */}
       </body>
     </html>
   );
 }
