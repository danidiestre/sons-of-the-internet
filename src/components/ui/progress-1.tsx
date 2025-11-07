import * as React from "react";

import { Progress } from "@base-ui-components/react/progress";

const BARCELONA_DETAILS_URL =
  "https://www.notion.so/valeramarcos/Castellter-ol-Winter-House-28dbff6a5cda80109b9fcbbc2873c83f?source=copy_link";

export default function ExampleProgress({ value = 65 }: { value?: number }) {
  return (
    <div className="flex flex-col items-center gap-6">
      <Progress.Root className="grid w-full grid-cols-2 gap-y-2" value={value}>
        <Progress.Label
          className="text-sm font-medium text-white"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          13/20 builders are in
        </Progress.Label>
        <Progress.Value
          className="col-start-2 text-right text-sm text-white"
          style={{ fontFamily: "var(--font-space-mono)" }}
        />
        <Progress.Track className="col-span-full h-1 overflow-hidden rounded bg-white/10 shadow-[inset_0_0_0_1px] shadow-white/10">
          <Progress.Indicator className="block bg-white transition-all duration-500" />
        </Progress.Track>
      </Progress.Root>
      <div className="flex justify-center w-full">
        <div className="relative group inline-flex">
          <div className="absolute inset-0 -m-2 hidden sm:block rounded-full bg-gray-100/40 blur-md pointer-events-none transition-all duration-300 ease-out group-hover:bg-gray-100/60 group-hover:blur-lg group-hover:-m-2.5" />
          <a
            href={BARCELONA_DETAILS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center justify-center px-5 py-2 text-sm font-semibold uppercase tracking-wide text-black bg-gradient-to-br from-gray-100 to-gray-300 rounded-full transition-all duration-200 hover:from-gray-200 hover:to-gray-400"
          >
            VIEW DETAILS →
          </a>
        </div>
      </div>
    </div>
  );
}

