"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CategoryProvider } from "./context/CategoryContext";
import { LoadingProvider } from "./context/LoadingContext";
import { ScanProvider } from "./context/ScanContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        <AuthProvider>
          <ScanProvider>
            <LoadingProvider>
              <CategoryProvider>
                {children}
                <Toaster position="top-right" theme="dark" />
              </CategoryProvider>
            </LoadingProvider>
          </ScanProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

export default RootLayout;
