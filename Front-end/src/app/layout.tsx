"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { dark } from "@clerk/themes";
import { CategoryProvider } from "./context/CategoryContext";
import { LoadingProvider } from "./context/LoadingContext";
import { ScanProvider } from "./context/ScanContext";

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
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: "#111827" },
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
        >
          <ScanProvider>
            <LoadingProvider>
              <CategoryProvider>{children}</CategoryProvider>
            </LoadingProvider>
          </ScanProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

export default RootLayout;
