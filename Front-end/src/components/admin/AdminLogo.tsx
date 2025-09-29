"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import LogoIconMain from "@/components/LogoIcon";

export const Logo = () => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push("/")}
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <LogoIconMain />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-[20px] text-black dark:text-white"
      >
        Freely
      </motion.span>
    </div>
  );
};

export const LogoIcon = () => {
  return (
    <div className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </div>
  );
};
