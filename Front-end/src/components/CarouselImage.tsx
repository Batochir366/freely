"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Images = {
  images: string[] | null;
};

export const CarouselImage = ({ images }: Images) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {}, [currentSlide]);

  const nextSlide = () => {
    if (!images) {
      return;
    }
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    if (!images) {
      return;
    }
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full mx-auto">
      {/* Main Carousel */}
      {images && (
        <div className="relative bg-white rounded-3xl overflow-hidden shadow-soft-lg border border-gray-100/50">
          <div className="relative aspect-video">
            <img
              src={images[currentSlide]}
              className="w-full h-full object-cover"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          </div>

          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 w-12 h-12 rounded-full"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 w-12 h-12 rounded-full"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      )}

      {/* Thumbnail Navigation */}
      <div className="flex justify-center space-x-3 mt-4">
        {images &&
          images.map((image: string, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`relative w-20 h-12 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                index === currentSlide
                  ? "border-coral shadow-glow scale-105"
                  : "border-gray-200 hover:border-mint"
              }`}
            >
              <img src={image} className="w-full h-full object-cover" />
            </button>
          ))}
      </div>

      {/* Slide Counter */}
      <div className="text-center mt-3">
        <p className="text-sm text-charcoal/60">
          {currentSlide + 1} of {images?.length}
        </p>
      </div>
    </div>
  );
};
