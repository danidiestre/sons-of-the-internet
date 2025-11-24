import * as React from "react";

import { Progress } from "@base-ui-components/react/progress";

export default function ExampleProgress({ value = 80 }: { value?: number }) {
  return (
    <div className="flex flex-col items-center gap-6">
      <Progress.Root className="grid w-full grid-cols-2 gap-y-2" value={value}>
        <Progress.Label
          className="text-sm font-medium text-white"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          19/20 builders are in
        </Progress.Label>
        <Progress.Value
          className="col-start-2 text-right text-sm text-white"
          style={{ fontFamily: "var(--font-space-mono)" }}
        />
        <Progress.Track className="col-span-full h-1 overflow-hidden rounded bg-white/10 shadow-[inset_0_0_0_1px] shadow-white/10">
          <Progress.Indicator className="block bg-white transition-all duration-500" />
        </Progress.Track>
      </Progress.Root>
      {value === 100 && (
        <div className="text-white/80 text-sm font-medium uppercase tracking-wide" style={{ fontFamily: "var(--font-space-mono)" }}>
          Sold out
        </div>
      )}
    </div>
  );
}

