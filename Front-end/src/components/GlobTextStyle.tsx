"use client";

import { useEffect, useState } from "react";

export default function GlobTextStyle() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleVisibility = () => {
      setIsVisible(true);
    };

    window.addEventListener("scroll", handleScroll);

    // Trigger animation on mount
    const timer = setTimeout(handleVisibility, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="pb-100 overflow-hidden bg-transparent">
      {/* Main content */}
      <div className="relative z-10 ">
        <div>
          <h1
            className={`text-6xl  font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-white transition-all duration-2000 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-12 scale-95"
            }`}
            style={{
              transform: `translateY(${scrollY * 0.1}px) ${
                isVisible ? "translateY(0)" : "translateY(48px)"
              }`,
              textShadow:
                "0 0 20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 0, 0, 0.6), 0 0 60px rgba(0, 0, 0, 0.4)",
              filter: "drop-shadow(0 4px 20px rgba(0, 0, 0, 0.3))",
            }}
          >
            Through our Website
          </h1>

          {/* Animated underline */}
          <div
            className={`mt-8 mx-auto h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent transition-all duration-2000 ease-out ${
              isVisible ? "w-64 opacity-100" : "w-0 opacity-0"
            }`}
            style={{
              boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
