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
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!clerkPublishableKey) {
    return (
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
        >
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-4">
                Environment Setup Required
              </h1>
              <p className="text-gray-400">
                Please set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY in your environment
                variables.
              </p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey}
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
