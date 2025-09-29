"use client";

import React from "react";
import { BackgroundBeamsWithCollision } from "@/components/background-beams-with-collision";
import { EnhancedFooter } from "@/components/NextFooter";

import BentoGridDemo from "@/components/BentoGrid";

export default function Home() {
  const words =
    "With Freely, businesses can showcase their activities and start getting bookings in minutes—so every adventure stays exciting and effortless, no matter how big your audience grows.";

  return (
    <div className="relative">
      <BackgroundBeamsWithCollision>
        <div></div>
      </BackgroundBeamsWithCollision>
      <div className="relative z-10 w-full bg-black">
        {/* Hero Section */}
        <div className="flex flex-col items-center min-h-screen justify-center py-4 md:py-0">
          <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-[rgba(227,232,255,0.9)] dark:text-white font-sans tracking-tight">
            Are you looking for best activity site?{" "}
            <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
              <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                <span className="">Freely is for you</span>
              </div>
              <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
                <span className="">Freely is for you</span>
              </div>
            </div>
          </h2>
          <p className="text-center max-w-2xl text-white text-lg">{words}</p>
        </div>

        <div id="learn more" className="bg-black pb-4 md:pb-10">
          <BentoGridDemo />
        </div>

        <EnhancedFooter />
      </div>
    </div>
  );
}
