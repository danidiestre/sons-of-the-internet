"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { CanvasRevealEffect, MiniNavbar } from "@/components/ui/sign-in-flow-1";

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
              <div className="space-y-10">
                <h1 className="text-[2.5rem] sm:text-[3rem] font-bold leading-[1.1] tracking-tight text-white">We host 1-week houses for people who build things</h1>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <h2 className="text-[1.2rem] sm:text-[1.4rem] text-white/70 font-light">Next house in Barcelona, 15th December 2025</h2>
                  <span className="px-3 py-1 text-xs sm:text-sm font-semibold uppercase tracking-wide text-white bg-red-500/20 border border-red-500/50 rounded-full" style={{ fontFamily: "var(--font-space-mono)" }}>
                    Sold out
                  </span>
                </div>
                <div className="relative group inline-block w-full sm:w-auto">
                  <div className="absolute inset-0 -m-2 rounded-full hidden sm:block bg-gray-100 opacity-40 filter blur-lg pointer-events-none transition-all duration-300 ease-out group-hover:opacity-60 group-hover:blur-xl group-hover:-m-3"></div>
                  <a href="https://tally.so/r/n025Aj" target="_blank" rel="noopener noreferrer" className="relative z-10 px-4 py-2 sm:px-3 text-xs sm:text-sm font-semibold text-black bg-gradient-to-br from-gray-100 to-gray-300 rounded-full hover:from-gray-200 hover:to-gray-400 transition-all duration-200 w-full sm:w-auto cursor-pointer">
                    Apply to SOTI family
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


