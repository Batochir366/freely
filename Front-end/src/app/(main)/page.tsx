"use client";

import React from "react";
import { BackgroundBeamsWithCollision } from "@/components/background-beams-with-collision";
import { TextGenerateEffect } from "@/components/text-generate-effect";

import { EnhancedFooter } from "@/components/NextFooter";
import { InfiniteMovingCards } from "@/components/infinite-moving-cards";
import { GlobeDemo } from "@/components/Global";

import BentoGridDemo from "@/components/BentoGrid";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/sign-in");
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const words =
    "With Freely, businesses can showcase their activities and start getting bookings in minutes—so every adventure stays exciting and effortless, no matter how big your audience grows.";

  const testimonials = [
    {
      quote:
        "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.",
      name: "Charles Dickens",
      title: "A Tale of Two Cities",
    },
    {
      quote:
        "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
      name: "William Shakespeare",
      title: "Hamlet",
    },
    {
      quote: "All that we see or seem is but a dream within a dream.",
      name: "Edgar Allan Poe",
      title: "A Dream Within a Dream",
    },
    {
      quote:
        "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
      name: "Jane Austen",
      title: "Pride and Prejudice",
    },
    {
      quote:
        "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
      name: "Herman Melville",
      title: "Moby-Dick",
    },
  ];

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
          <TextGenerateEffect
            words={words}
            className=" text-center max-w-2xl  "
          />

          <div className="flex gap-6 pt-6">
            <button
              onClick={handleClick}
              className="min-w-[100px] relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                Join us
              </span>
            </button>
            <button
              onClick={() => scrollToSection("learn more")}
              className="min-w-[100px] relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                Learn More
              </span>
            </button>
          </div>
        </div>

        <div className="w-full h-[1200px] bg-black pt-2 md:pt-10 flex flex-col relative items-center justify-center">
          <GlobeDemo />
        </div>
        <div className="h-[30rem] md:h-[40rem] w-full flex flex-col antialiased bg-black justify-center relative overflow-hidden hidden-scroll -mt-4 md:mt-0">
          <p className="text-[20px] md:text-[30px] font-bold text-[rgba(227,232,255,0.9)] pl-4 md:pl-40">
            What they tell about us
          </p>
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
          />
        </div>

        <div id="learn more" className="bg-black pb-4 md:pb-10">
          <BentoGridDemo />
        </div>

        <EnhancedFooter />
      </div>
    </div>
  );
}
