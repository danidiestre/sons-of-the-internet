"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";

interface RevealTextProps {
  text: string;
  className?: string;
}

export function RevealText({ text, className = "" }: RevealTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const chars = useMemo(() => text.split(""), [text]);
  const [opacities, setOpacities] = useState<number[]>(() => new Array(text.length).fill(0.2));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentContainer = containerRef.current;
      if (!currentContainer) return;

      const rect = currentContainer.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementTop = rect.top;
      const elementHeight = rect.height;
      const elementCenter = elementTop + elementHeight / 2;

      // Calculate progress based on scroll position
      // Start revealing when element enters viewport, complete when it's centered
      const viewportCenter = windowHeight / 2;
      const revealStart = windowHeight * 0.8; // Start revealing when element is 80% down viewport
      const revealEnd = viewportCenter; // Complete when element reaches center

      // Calculate progress: 0 when element hasn't started revealing, 1 when fully revealed
      const progress = Math.max(
        0,
        Math.min(1, (revealStart - elementCenter) / (revealStart - revealEnd))
      );

      // Calculate how many characters should be fully visible
      const totalProgress = progress;
      const visibleChars = Math.floor(totalProgress * chars.length);
      
      // Create opacity array: first chars are 1 (white), later ones fade from 1 to 0.2 (grey)
      const newOpacities = chars.map((_, index) => {
        if (index < visibleChars) {
          return 1; // Fully white
        } else if (index === visibleChars && visibleChars < chars.length) {
          // Smooth transition for the current character
          const charProgress = (totalProgress * chars.length) % 1;
          return 0.2 + charProgress * 0.8;
        } else {
          return 0.2; // Grey
        }
      });

      setOpacities(newOpacities);
    };

    handleScroll(); // Initial calculation
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [chars]);

  const words = text.split(" ");

  return (
    <p ref={containerRef} className={`text-white ${className}`}>
      {words.map((word, wordIndex) => {
        // Calculate the starting character index for this word
        let wordStartIndex = 0;
        for (let i = 0; i < wordIndex; i++) {
          wordStartIndex += words[i].length + 1; // +1 for the space after each word
        }

        const wordChars = word.split("").map((char, charIdx) => {
          const currentIndex = wordStartIndex + charIdx;
          const opacity = opacities[currentIndex] ?? 0.2;
          return (
            <span
              key={charIdx}
              aria-hidden="true"
              style={{
                position: "relative",
                display: "inline-block",
                opacity,
                visibility: "inherit",
                transition: "opacity 0.1s ease-out",
              }}
            >
              {char}
            </span>
          );
        });

        // Handle space after word (except for last word)
        const spaceIndex = wordStartIndex + word.length;
        const spaceOpacity = wordIndex < words.length - 1 ? (opacities[spaceIndex] ?? 0.2) : 1;

        return (
          <React.Fragment key={wordIndex}>
            <span aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>
              {wordChars}
            </span>
            {wordIndex < words.length - 1 && (
              <span
                aria-hidden="true"
                style={{
                  position: "relative",
                  display: "inline-block",
                  opacity: spaceOpacity,
                  visibility: "inherit",
                  transition: "opacity 0.1s ease-out",
                  width: "0.25em",
                }}
              >
                {" "}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </p>
  );
}

export function ManifestoSection() {
  const paragraphs = [
    "We grew up online, through forums, pixels and late-night calls.",
    "We build in public, meet offline, and chase that first feeling of discovering the internet.",
    "We're digital natives who enjoy disconnecting with other passionate builders.",
    "Our community is global, our connections are real, and our gatherings never forget.",
  ];

  const fullText = paragraphs.join(" ");

  return (
    <section id="1" className="relative z-10 flex flex-col gap-10 mb-16 w-full scroll-mt-32 md:scroll-mt-40">
      <div className="mx-auto w-full max-w-2xl px-6 sm:px-10 py-16 sm:py-24">
        <div className="mb-8 text-center">
          <h3 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-space-mono)' }}>Our Manifesto</h3>
        </div>
        <h3
          className="text-center text-balance text-2xl leading-normal max-w-2xl flex flex-col gap-4 mx-auto text-white"
          aria-label={fullText}
        >
          {paragraphs.map((paragraph, index) => (
            <RevealText key={index} text={paragraph} />
          ))}
        </h3>
      </div>
    </section>
  );
}
