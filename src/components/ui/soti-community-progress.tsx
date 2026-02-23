"use client";

import * as React from "react";
import { Progress } from "@base-ui-components/react/progress";

const TOTAL_SEATS = 64;
const API_URL = "/api/count";

export function SotiCommunityProgress() {
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setTotal(Math.min(data.total ?? 0, TOTAL_SEATS));
      })
      .catch(() => {
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = Math.round((total / TOTAL_SEATS) * 100);

  return (
    <div className="w-full space-y-4">
      <h3
        className="text-center text-white text-2xl sm:text-3xl font-semibold tracking-tight"
        style={{ fontFamily: "var(--font-space-mono)" }}
      >
        SOTI Community
      </h3>
      <Progress.Root className="w-full" value={loading ? 0 : value}>
        <div className="flex justify-between items-center mb-2">
          <Progress.Label
            className="text-sm font-medium text-white flex-1"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            {loading ? "…" : total} of {TOTAL_SEATS} seats filled for 2026
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
      <div className="flex justify-center pt-5">
        <div className="relative group inline-block">
          <div className="absolute inset-0 -m-2 rounded-full hidden sm:block bg-gray-100 opacity-40 filter blur-lg pointer-events-none transition-all duration-300 ease-out group-hover:opacity-60 group-hover:blur-xl group-hover:-m-3"></div>
          <a
            href="https://tally.so/r/n025Aj"
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 px-6 py-3 text-sm font-semibold text-black bg-gradient-to-br from-gray-100 to-gray-300 rounded-full hover:from-gray-200 hover:to-gray-400 transition-all duration-200 cursor-pointer"
          >
            Apply to join the family
          </a>
        </div>
      </div>
    </div>
  );
}
