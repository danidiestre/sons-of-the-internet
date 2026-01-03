import * as React from "react";

import { Progress } from "@base-ui-components/react/progress";

export default function ExampleProgress({ value = 55 }: { value?: number }) {
  // Calculate correct percentage for 35 out of 64 seats
  const seatsFilled = 35;
  const totalSeats = 64;
  const correctValue = Math.round((seatsFilled / totalSeats) * 100);
  
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="mx-auto w-full max-w-sm space-y-4">
        <h3 className="text-center text-white text-2xl sm:text-3xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-space-mono)' }}>SOTI Community</h3>
        <Progress.Root className="w-full" value={correctValue}>
          <div className="flex justify-between items-center mb-2">
            <Progress.Label
              className="text-sm font-medium text-white flex-1"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              35 of 64 seats filled for 2026
            </Progress.Label>
            <Progress.Value
              className="text-sm text-white ml-4"
              style={{ fontFamily: "var(--font-space-mono)" }}
            />
          </div>
          <Progress.Track className="col-span-full h-1 overflow-hidden rounded bg-white/10 shadow-[inset_0_0_0_1px] shadow-white/10">
            <Progress.Indicator className="block bg-white transition-all duration-500" />
          </Progress.Track>
        </Progress.Root>
        <div className="flex justify-center">
          <div className="relative group inline-block">
          <div className="absolute inset-0 -m-2 rounded-full hidden sm:block bg-gray-100 opacity-40 filter blur-lg pointer-events-none transition-all duration-300 ease-out group-hover:opacity-60 group-hover:blur-xl group-hover:-m-3"></div>
          <a href="https://tally.so/r/n025Aj" target="_blank" rel="noopener noreferrer" className="relative z-10 px-6 py-3 text-sm font-semibold text-black bg-gradient-to-br from-gray-100 to-gray-300 rounded-full hover:from-gray-200 hover:to-gray-400 transition-all duration-200 cursor-pointer">
            Apply to join the family
          </a>
          </div>
        </div>
      </div>
      <div className="mt-8 w-full pt-8 border-t border-white/10">
        <div className="mx-auto w-full max-w-sm space-y-4">
          <Progress.Root className="w-full" value={100}>
            <div className="flex justify-between items-center mb-2">
              <Progress.Label
                className="text-sm font-medium text-white flex-1"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                20/20 builders on Barcelona 2025
              </Progress.Label>
              <Progress.Value
                className="text-sm text-white ml-4"
                style={{ fontFamily: "var(--font-space-mono)" }}
              />
            </div>
            <Progress.Track className="col-span-full h-1 overflow-hidden rounded bg-white/10 shadow-[inset_0_0_0_1px] shadow-white/10">
              <Progress.Indicator className="block bg-white transition-all duration-500" />
            </Progress.Track>
          </Progress.Root>
          <div className="flex justify-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/40">
              <span className="text-orange-400 text-xs font-medium uppercase tracking-wide" style={{ fontFamily: "var(--font-space-mono)" }}>
                Sold out
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

