import type {Metadata} from 'next';
// import { Inter } from 'next/font/google'; // Removed Inter font
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

// const inter = Inter({ // Removed Inter font
//   subsets: ['latin'],
//   variable: '--font-inter', // Removed Inter font
// });

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
       <body className={`font-bold antialiased`}> {/* Apply font-bold and remove Inter font variable */}
         {children}
         <Toaster /> {/* Add Toaster here */}
       </body>
     </html>
   );
 }
