import * as React from "react";

import { Progress } from "@base-ui-components/react/progress";

export default function ExampleProgress({ value = 55 }: { value?: number }) {
  return (
    <div className="flex w-full flex-col items-center gap-6">
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

