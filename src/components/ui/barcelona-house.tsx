"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

export function BarcelonaHouseSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementTop = rect.top;
      const elementHeight = rect.height;
      const elementCenter = elementTop + elementHeight / 2;

      // Calculate scroll progress
      // Start scaling when element enters viewport, complete when it's centered
      const viewportCenter = windowHeight / 2;
      const startPoint = windowHeight * 0.9; // Start when element is 90% down viewport
      const endPoint = viewportCenter;

      // Calculate progress: 0 when element hasn't started, 1 when centered
      const progress = Math.max(
        0,
        Math.min(1, (startPoint - elementCenter) / (startPoint - endPoint))
      );

      // Scale from 0.4 (small) to 0.85 (not too big) with easing
      const easedProgress = progress * progress; // Ease out
      const newScale = 0.4 + easedProgress * 0.45;
      setScale(newScale);
    };

    handleScroll(); // Initial calculation
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <section className="w-full overflow-hidden">
      <div 
        ref={containerRef}
        className="relative w-full flex justify-center items-center"
        style={{
          transform: `scale3d(${scale}, ${scale}, 1)`,
          transition: "transform 0.1s ease-out",
          willChange: "transform",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transformStyle: "preserve-3d",
        }}
      >
        <div className="w-full px-4 sm:px-6 md:px-8">
          <div className="rounded-3xl bg-card shadow-2xl ring-1 ring-black/5 color-card-foreground">
            <div className="grid grid-cols-1 rounded-[2rem] p-2 shadow-md shadow-black/5">
              <div className="relative w-full aspect-[4/3] sm:aspect-[5/4] md:aspect-[3/2] overflow-hidden rounded-[1rem] shadow-[inset_0_0_2px_1px_#ffffff4d] ring-1 ring-black/5">
                <Image
                  src="/events/barcelona-1.png"
                  alt="Barcelona House"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 85vw, 80vw"
                  quality={100}
                  priority
                  unoptimized={true}
                  style={{
                    imageRendering: 'auto',
                  } as React.CSSProperties}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

