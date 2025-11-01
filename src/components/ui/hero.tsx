"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { CanvasRevealEffect, MiniNavbar } from "@/components/ui/sign-in-flow-1";
import { TextShimmer } from "@/components/ui/text-shimmer";

export function HeroSection({ className }: { className?: string }) {
  return (
    <section className={cn("relative flex flex-col min-h-[50vh] md:min-h-[55vh] bg-black", className)}>
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0">
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName="bg-black"
            colors={[[255, 255, 255], [255, 255, 255]]}
            dotSize={6}
            reverse={false}
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.3)_0%,_rgba(0,0,0,0)_70%)]" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black/60 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 px-6 sm:px-10 pt-16 sm:pt-28">
        <MiniNavbar />
        <div className="flex flex-col items-center justify-center h-full py-16 sm:py-24">
          <div className="w-full">
            <div className="w-full mx-auto max-w-2xl py-8 sm:py-12 text-center">
              <div className="space-y-2">
                <h1 className="text-[2.5rem] sm:text-[3rem] font-bold leading-[1.1] tracking-tight text-white">We were raised by the web.</h1>
                <h2 className="text-[1.5rem] sm:text-[1.8rem] text-white/70 font-light">Now we log off together.</h2>
                <div className="pt-4">
                  <TextShimmer className="mt-8 text-sm sm:text-base" style={{ fontFamily: 'var(--font-space-mono), monospace' }}>Generating a new generation of builders</TextShimmer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


