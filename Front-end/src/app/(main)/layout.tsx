"use client";
import { Inter } from "next/font/google";
import { clsx } from "clsx";
import NavBar from "@/components/navbar";

const interFont = Inter({ subsets: ["latin"] });

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={clsx(
        "flex flex-col min-h-screen bg-black text-foreground",
        interFont.className
      )}
    >
      <NavBar />
      <main className="flex-1 space-y-2 md:space-y-0">{children}</main>
    </div>
  );
}
