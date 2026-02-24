"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const HOUSE_COLOR = "#1a1a1a";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const heroWrapperRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const arrowRef = useRef<HTMLDivElement>(null);

  // Rain config — sliders update this ref, animation reads it
  const rainCfg = useRef({ speed: 18, density: 60, length: 40, width: 3, splash: 100 });
  const [rainUI, setRainUI] = useState({ speed: 18, density: 60, length: 40, width: 3, splash: 100 });
  const updateRain = (key: string, val: number) => {
    (rainCfg.current as Record<string, number>)[key] = val;
    setRainUI(prev => ({ ...prev, [key]: val }));
  };

  const heroMessages = [
    {
      title: (
        <>
          We host 1-week houses for<br />
          <span style={{ color: '#9a9aaa' }}>people who build things</span>
        </>
      ),
      subtitle: "The rain hits the window. Your screen is the only light in the room. Another night.",
    },
    {
      title: (
        <>
          You shipped at midnight.<br />
          <span style={{ color: '#9a9aaa' }}>Again.</span>
        </>
      ),
      subtitle: "Nobody saw it. Nobody clapped. But you know it works. That's enough. For now.",
    },
    {
      title: (
        <>
          Your friends don&apos;t get it.<br />
          <span style={{ color: '#9a9aaa' }}>They never did.</span>
        </>
      ),
      subtitle: `"Get a normal job?" Because normal jobs don't keep you up at 3AM with a pulse.`,
    },
    {
      title: (
        <>
          The screen is warm.<br />
          <span style={{ color: '#9a9aaa' }}>The room is cold.</span>
        </>
      ),
      subtitle: "You build alone. You celebrate alone. It doesn't have to be this way.",
    },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const box = boxRef.current;
    if (!canvas || !box) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ROOF_H = 80;
    let w = 0,
      h = 0,
      boxTop = 0,
      boxLeft = 0,
      boxRight = 0,
      centerX = 0,
      roofBaseY = 0;
    let animationId: number;

    // Thunder state
    let thunderAlpha = 0;
    let thunderFlashes = 0;
    let nextThunder = performance.now() + (5000 + Math.random() * 3000);

    const rain: { x: number; y: number; vy: number; l: number }[] = [];
    const splashes: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      size: number;
    }[] = [];

    function updateLayout() {
      const section = canvas!.parentElement!;
      const sr = section.getBoundingClientRect();
      canvas!.width = sr.width;
      canvas!.height = sr.height;
      w = sr.width;
      h = sr.height;
      const br = box!.getBoundingClientRect();
      boxTop = br.top - sr.top;
      boxLeft = br.left - sr.left;
      boxRight = br.right - sr.left;
      centerX = (boxLeft + boxRight) / 2;
      roofBaseY = boxTop + ROOF_H;
    }

    // Get the roof surface Y at a given X position
    function getRoofY(x: number): number {
      if (x < boxLeft || x > boxRight) return Infinity;
      if (x <= centerX) {
        const t = (x - boxLeft) / (centerX - boxLeft);
        return roofBaseY - t * ROOF_H;
      } else {
        const t = (x - centerX) / (boxRight - centerX);
        return boxTop + t * ROOF_H;
      }
    }

    const observer = new ResizeObserver(updateLayout);
    observer.observe(canvas!.parentElement!);

    function animate() {
      ctx!.clearRect(0, 0, w, h);
      ctx!.lineCap = "round";

      // Thunder logic
      const now = performance.now();
      if (thunderFlashes === 0 && now >= nextThunder) {
        thunderFlashes = Math.random() < 0.5 ? 1 : 2;
        thunderAlpha = 0.9;
      }
      if (thunderAlpha > 0) {
        ctx!.fillStyle = `rgba(255,255,255,${thunderAlpha})`;
        ctx!.fillRect(0, 0, w, h);
        thunderAlpha -= 0.06;
        if (thunderAlpha <= 0) {
          thunderAlpha = 0;
          thunderFlashes--;
          if (thunderFlashes > 0) {
            thunderAlpha = 0.6;
          } else {
            nextThunder = now + 5000 + Math.random() * 3000;
          }
        }
      }

      // Generate rain — reads from config ref
      const cfg = rainCfg.current;
      const spawnCount = Math.max(1, Math.ceil(cfg.density / 20));
      const spawnProb = cfg.density / 100;
      for (let k = 0; k < spawnCount; k++) {
        if (Math.random() < spawnProb) {
          rain.push({
            x: Math.random() * w,
            y: -50,
            vy: cfg.speed + Math.random() * (cfg.speed * 0.4),
            l: cfg.length + Math.random() * (cfg.length * 2),
          });
        }
      }

      // Rain rendering & collision with roof slopes
      ctx!.strokeStyle = "#aec2e0";
      ctx!.lineWidth = cfg.width;
      for (let i = rain.length - 1; i >= 0; i--) {
        const r = rain[i];
        r.y += r.vy;
        ctx!.beginPath();
        ctx!.moveTo(r.x, r.y);
        ctx!.lineTo(r.x, r.y - r.l);
        ctx!.stroke();

        const surfaceY = getRoofY(r.x);
        if (surfaceY < Infinity && r.y >= surfaceY && r.y - r.vy <= surfaceY) {
          // Splash outward based on which slope was hit
          const isLeft = r.x <= centerX;
          const sf = cfg.splash / 100;
          for (let k = 0; k < 6; k++) {
            splashes.push({
              x: r.x,
              y: surfaceY,
              vx: isLeft
                ? -(Math.random() * 4 * sf + 1)
                : Math.random() * 4 * sf + 1,
              vy: -(Math.random() * 3 * sf + 0.5),
              life: 1,
              size: 3 + Math.random() * 5,
            });
          }
          rain.splice(i, 1);
        } else if (r.y > h) {
          rain.splice(i, 1);
        }
      }

      // Splash physics — slide along roof surface
      ctx!.fillStyle = "#aec2e0";
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.25; // Gravity

        // Pool on roof surface and slide down the slope
        const roofY = getRoofY(s.x);
        if (roofY < Infinity && s.y > roofY) {
          s.y = roofY;
          s.vy = 0;
          // Slide along the slope direction
          if (s.x <= centerX) {
            s.vx -= 0.3;
          } else {
            s.vx += 0.3;
          }
          s.vx *= 0.9;
        }

        s.life -= 0.02;
        if (s.life <= 0) {
          splashes.splice(i, 1);
          continue;
        }

        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
        ctx!.fill();
      }

      animationId = requestAnimationFrame(animate);
    }

    updateLayout();
    window.addEventListener("resize", updateLayout);
    animate();

    return () => {
      window.removeEventListener("resize", updateLayout);
      observer.disconnect();
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Scroll-driven hero message transitions (no React re-renders — direct DOM)
  useEffect(() => {
    let isSnapping = false;
    let snapTimeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      const wrapper = heroWrapperRef.current;
      if (!wrapper) return;

      const rect = wrapper.getBoundingClientRect();
      const scrolled = -rect.top;
      const scrollableHeight = wrapper.offsetHeight - window.innerHeight;

      if (scrolled <= 0 || scrollableHeight <= 0) {
        textRefs.current.forEach((el, i) => {
          if (el) el.style.opacity = i === 0 ? '1' : '0';
        });
        if (arrowRef.current) arrowRef.current.style.opacity = '1';
        return;
      }

      const progress = Math.min(Math.max(scrolled / scrollableHeight, 0), 1);
      const totalPhases = 4;
      const phaseFloat = progress * totalPhases;
      const phase = Math.min(Math.floor(phaseFloat), totalPhases - 1);
      const within = phaseFloat - phase;

      textRefs.current.forEach((el, i) => {
        if (!el) return;
        if (i === phase) {
          let opacity = 1;
          if (phase < totalPhases - 1 && within > 0.75) {
            opacity = (1 - within) / 0.25;
          }
          if (phase > 0 && within < 0.2) {
            opacity = within / 0.2;
          }
          if (phase === 0 && within < 0.2) opacity = 1;
          el.style.opacity = String(opacity);
        } else {
          el.style.opacity = '0';
        }
      });

      if (arrowRef.current) {
        if (phase === 0) {
          const arrowOp = within < 0.4 ? 1 : Math.max(0, 1 - (within - 0.4) / 0.2);
          arrowRef.current.style.opacity = String(arrowOp);
        } else {
          arrowRef.current.style.opacity = '0';
        }
      }

      // Snap to nearest phase when user stops scrolling
      if (!isSnapping) {
        clearTimeout(snapTimeout);
        snapTimeout = setTimeout(() => {
          const w = heroWrapperRef.current;
          if (!w) return;
          const r = w.getBoundingClientRect();
          const s = -r.top;
          const sh = w.offsetHeight - window.innerHeight;
          if (s <= 0 || s >= sh) return;

          const phaseSize = sh / totalPhases;
          // Round to nearest phase CENTER (where text is fully visible), not boundary
          const nearestPhase = Math.max(0, Math.min(Math.round(s / phaseSize - 0.5), totalPhases - 1));
          // Don't snap if user is scrolling past the hero
          if (nearestPhase === totalPhases - 1 && s > (nearestPhase + 0.75) * phaseSize) return;
          // Phase 0 snaps to top; others snap to center of phase
          const targetScrolled = nearestPhase === 0 ? 0 : (nearestPhase + 0.5) * phaseSize;
          const target = targetScrolled + w.offsetTop;

          if (Math.abs(window.scrollY - target) < 5) return;

          isSnapping = true;
          window.scrollTo({ top: target, behavior: 'smooth' });
          setTimeout(() => { isSnapping = false; }, 600);
        }, 120);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(snapTimeout);
    };
  }, []);

  return (
    <main style={{ background: '#0a0a0c' }}>

      {/* SVG Goo Filter */}
      <svg className="hidden absolute w-0 h-0">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* ============================================= */}
      {/* SECTION: Hero                                 */}
      {/* ============================================= */}
      <div ref={heroWrapperRef} style={{ height: '400vh' }}>
      <section className="sticky top-0 relative flex flex-col h-screen overflow-hidden" style={{ background: '#0a0a0c' }}>
        {/* Rain canvas with goo filter */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          style={{ filter: "url(#goo)" }}
        />

        {/* Hero house */}
        <div className="relative z-10 flex flex-col flex-1 justify-center px-6 sm:px-10 py-10 sm:py-16">
          <div ref={boxRef} className="relative mx-auto w-full max-w-2xl">

            {/* Triangular Roof */}
            <div className="relative w-full" style={{ height: '80px' }}>
              {/* Roof fill */}
              <div
                className="absolute inset-0"
                style={{
                  clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                  background: HOUSE_COLOR,
                  backdropFilter: 'blur(4px)',
                }}
              />
              {/* Roof border lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1="50" y1="0" x2="0" y2="100" stroke="#3a3a48" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <line x1="50" y1="0" x2="100" y2="100" stroke="#3a3a48" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              </svg>
              {/* SOTI logo at the peak */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-10">
                <div className="relative w-24 h-10">
                  <Image src="/logo-white.png" alt="SOTI" fill className="object-contain" />
                </div>
              </div>
            </div>

            {/* House Body */}
            <div className="border-x border-b backdrop-blur-sm" style={{ background: HOUSE_COLOR, borderColor: '#3a3a48' }}>
              <div className="px-6 pt-6 pb-4 sm:pb-6">
                {/* Hero text + CTA */}
                <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                  <div className="relative w-full text-center">
                    {heroMessages.map((msg, i) => (
                      <div
                        key={i}
                        ref={(el) => { textRefs.current[i] = el; }}
                        className={i === 0 ? '' : 'absolute inset-0'}
                        style={{ opacity: i === 0 ? 1 : 0 }}
                      >
                        <div className="space-y-10">
                          <h1 className="text-[2.5rem] sm:text-[3rem] font-bold leading-[1.1] tracking-tight" style={{ fontFamily: 'var(--font-instrument-serif)', color: '#d0d0dd' }}>
                            {msg.title}
                          </h1>
                          <div className="flex items-center justify-center gap-3 flex-wrap">
                            <h2 className="text-[1.2rem] sm:text-[1.4rem] font-light" style={{ color: '#8a8a9a' }}>{msg.subtitle}</h2>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Bouncing arrow at bottom of house */}
              <div ref={arrowRef} className="flex justify-center pb-8">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#5a5a6a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-bounce"
                >
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </div>
            </div>

          </div>

          {/* Fueled by — outside house but sheltered from rain */}
          <div className="mx-auto w-full max-w-2xl pt-8 pb-4">
            <p className="text-sm sm:text-base text-center mb-4" style={{ fontFamily: 'var(--font-dm-mono)', color: '#5a5a6a' }}>Fueled by:</p>
            <div className="flex items-center justify-center gap-6 sm:gap-8 flex-wrap">
              <a href="https://www.blackbox.ai/" target="_blank" rel="noopener noreferrer" className="inline-block">
                <img src="/sponsors/blackbox.svg" alt="Blackbox" className="h-8 sm:h-12 w-auto opacity-80 hover:opacity-100 transition-opacity" />
              </a>
              <a href="https://baobabventures.vc/" target="_blank" rel="noopener noreferrer" className="inline-block">
                <img src="/sponsors/baobab.svg" alt="Baobab" className="h-8 sm:h-12 w-auto opacity-80 hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>

          {/* Rain Controls */}
          <div className="mx-auto w-full max-w-2xl pt-6 pb-2">
            <div className="border border-[#3a3a48] rounded-lg p-4 space-y-3" style={{ background: '#111114' }}>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ fontFamily: 'var(--font-dm-mono)', color: '#5a5a6a' }}>Rain config</p>
              {[
                { key: 'speed', label: 'Speed', min: 1, max: 30, step: 1 },
                { key: 'density', label: 'Density', min: 5, max: 100, step: 5 },
                { key: 'length', label: 'Drop length', min: 5, max: 120, step: 5 },
                { key: 'width', label: 'Stroke', min: 1, max: 6, step: 0.5 },
                { key: 'splash', label: 'Splash', min: 0, max: 300, step: 10 },
              ].map(s => (
                <div key={s.key} className="flex items-center gap-3">
                  <span className="text-xs w-24 shrink-0" style={{ fontFamily: 'var(--font-dm-mono)', color: '#8a8a9a' }}>{s.label}</span>
                  <input
                    type="range"
                    min={s.min}
                    max={s.max}
                    step={s.step}
                    value={rainUI[s.key as keyof typeof rainUI]}
                    onChange={e => updateRain(s.key, Number(e.target.value))}
                    className="flex-1 h-1 appearance-none bg-[#3a3a48] rounded cursor-pointer accent-[#aec2e0]"
                  />
                  <span className="text-xs w-8 text-right tabular-nums" style={{ fontFamily: 'var(--font-dm-mono)', color: '#5a5a6a' }}>
                    {rainUI[s.key as keyof typeof rainUI]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* ============================================= */}
      {/* SECTION: Event Showcase Image                 */}
      {/* ============================================= */}
      <section className="w-full overflow-hidden">
        <div className="relative w-full flex justify-center items-center px-6 sm:px-10">
          <div className="w-full max-w-4xl">
            <div className="rounded-3xl bg-card shadow-2xl ring-1 ring-black/5">
              <div className="grid grid-cols-1 rounded-[2rem] p-2 shadow-md shadow-black/5">
                <div className="relative w-full aspect-[4/3] sm:aspect-[5/4] md:aspect-[3/2] overflow-hidden rounded-[1rem] shadow-[inset_0_0_2px_1px_#ffffff4d] ring-1 ring-black/5">
                  <Image
                    src="/events/barcelona-social.png"
                    alt="SOTI House"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, 80vw"
                    quality={100}
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* SECTION: Progress Tracker                     */}
      {/* ============================================= */}
      <section className="w-full pb-8 sm:pb-12 pt-6 sm:pt-8">
        <div className="mx-auto w-full max-w-2xl px-6 sm:px-10">
          <div className="flex w-full flex-col items-center">
            <div className="w-full pt-8 border-t border-white/10">
              <div className="mx-auto w-full max-w-sm space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-white flex-1" style={{ fontFamily: "var(--font-dm-mono)" }}>
                    0/20 builders on Valencia 2026
                  </span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded bg-white/10">
                  <div className="h-full bg-white transition-all duration-500" style={{ width: "0%" }}></div>
                </div>
                <div className="flex flex-col items-center gap-6">
                  <div className="relative group inline-block">
                    <div className="absolute inset-0 -m-2 rounded-full hidden sm:block bg-gray-100 opacity-40 filter blur-lg pointer-events-none transition-all duration-300 ease-out group-hover:opacity-60 group-hover:blur-xl group-hover:-m-3"></div>
                    <a
                      href="https://tally.so/r/BzXWgN"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative z-10 px-6 py-3 text-sm font-semibold text-black bg-gradient-to-br from-gray-100 to-gray-300 rounded-full hover:from-gray-200 hover:to-gray-400 transition-all duration-200 cursor-pointer"
                    >
                      Apply to join the family
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* SECTION: Builders Progress (Barcelona 2025)   */}
      {/* ============================================= */}
      <section className="w-full pb-8 sm:pb-12 pt-6 sm:pt-8">
        <div className="mx-auto w-full max-w-2xl px-6 sm:px-10">
          <div className="flex w-full flex-col items-center">
            <div className="w-full pt-8 border-t border-white/10">
              <div className="mx-auto w-full max-w-sm space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-white flex-1" style={{ fontFamily: "var(--font-dm-mono)" }}>
                    20/20 builders on Barcelona 2025
                  </span>
                  <span className="text-sm text-white ml-4" style={{ fontFamily: "var(--font-dm-mono)" }}>100%</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded bg-white/10">
                  <div className="h-full bg-white transition-all duration-500" style={{ width: "100%" }}></div>
                </div>
                <div className="flex flex-col items-center gap-6">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/40">
                    <span className="text-orange-400 text-xs font-medium uppercase tracking-wide" style={{ fontFamily: "var(--font-dm-mono)" }}>
                      Sold out
                    </span>
                  </div>
                  <div className="relative group inline-block">
                    <div className="absolute inset-0 -m-2 rounded-full hidden sm:block bg-gray-100 opacity-40 filter blur-lg pointer-events-none transition-all duration-300 ease-out group-hover:opacity-60 group-hover:blur-xl group-hover:-m-3"></div>
                    <a
                      href="https://www.notion.so/valeramarcos/Castellter-ol-Winter-House-28dbff6a5cda80109b9fcbbc2873c83f?source=copy_link"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative z-10 px-6 py-3 text-sm font-semibold text-black bg-gradient-to-br from-gray-100 to-gray-300 rounded-full hover:from-gray-200 hover:to-gray-400 transition-all duration-200 cursor-pointer"
                    >
                      View house recap
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* SECTION: Manifesto                            */}
      {/* ============================================= */}
      <section id="1" className="relative z-10 flex flex-col gap-10 mb-16 w-full scroll-mt-32 md:scroll-mt-40">
        <div className="mx-auto w-full max-w-2xl px-6 sm:px-10 py-16 sm:py-24">
          <div className="mb-8 text-center">
            <h3 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-dm-mono)' }}>Our Manifesto</h3>
          </div>
          <div className="text-center text-balance text-2xl leading-normal max-w-2xl flex flex-col gap-4 mx-auto text-white/80">
            <p>We grew up online, through forums, pixels and late-night calls.</p>
            <p>We build in public, meet offline, and chase that first feeling of discovering the internet.</p>
            <p>We&apos;re digital natives who enjoy disconnecting with other passionate builders.</p>
            <p>Our community is global, our connections are real, and our gatherings never forget.</p>
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* SECTION: SOTI Community Progress              */}
      {/* ============================================= */}
      <section className="w-full pb-8 sm:pb-12 pt-6 sm:pt-8">
        <div className="mx-auto w-full max-w-2xl px-6 sm:px-10">
          <div className="w-full space-y-4">
            <h3 className="text-center text-white text-2xl sm:text-3xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-dm-mono)" }}>
              SOTI Community
            </h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-white flex-1" style={{ fontFamily: "var(--font-dm-mono)" }}>
                0/128 seats filled for 2026
              </span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded bg-white/10">
              <div className="h-full bg-white transition-all duration-500" style={{ width: "0%" }}></div>
            </div>
            <div className="flex justify-center pt-5">
              <div className="relative group inline-block">
                <div className="absolute inset-0 -m-2 rounded-full hidden sm:block bg-gray-100 opacity-40 filter blur-lg pointer-events-none transition-all duration-300 ease-out group-hover:opacity-60 group-hover:blur-xl group-hover:-m-3"></div>
                <a
                  href="https://tally.so/r/BzXWgN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-10 px-6 py-3 text-sm font-semibold text-black bg-gradient-to-br from-gray-100 to-gray-300 rounded-full hover:from-gray-200 hover:to-gray-400 transition-all duration-200 cursor-pointer"
                >
                  Apply to join the family
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* SECTION: Houses / Events                      */}
      {/* ============================================= */}
      <section id="2" className="w-full scroll-mt-32 md:scroll-mt-40">
        <div className="mx-auto w-full max-w-5xl px-6 sm:px-10 py-16 sm:py-24">
          <div className="mb-8 text-center">
            <h3 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-dm-mono)' }}>Houses</h3>
            <p className="text-white/60 mt-2">Mark your digital calendar. These moments only happen IRL.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">

            {/* Event Card: Next House */}
            <div className="w-full aspect-square rounded-2xl border border-white/10 overflow-hidden relative group bg-white/5">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 via-50% to-black/80 flex flex-col justify-end p-4 sm:p-5">
                <div className="space-y-[6px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] tracking-wide text-amber-300/80 border-amber-300/20">UPCOMING</span>
                    <span className="text-xs text-white/50">April 2026</span>
                  </div>
                  <h4 className="text-white text-base sm:text-lg font-medium">Next Soti House</h4>
                  <p className="text-white/60 text-sm">Ireland, Spain or France</p>
                  <div className="mt-3">
                    <a href="https://tally.so/r/BzXWgN" target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-xs sm:text-sm font-semibold text-black bg-gradient-to-br from-gray-100 to-gray-300 rounded-full hover:from-gray-200 hover:to-gray-400 transition-all duration-200 inline-block">
                      JOIN THE WAITLIST
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Card: Barcelona */}
            <div className="w-full aspect-square rounded-2xl border border-white/10 overflow-hidden relative group">
              <Image src="/events/barcelona.jpeg" alt="Barcelona, Spain" fill className="object-cover transition-transform duration-300 group-hover:scale-110" sizes="(min-width: 640px) 50vw, 100vw" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 via-50% to-black/80 flex flex-col justify-end p-4 sm:p-5">
                <div className="space-y-[6px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] tracking-wide text-emerald-300/80 border-emerald-300/20">FINISHED</span>
                    <span className="text-xs text-white/50">Dec 15, 2025</span>
                  </div>
                  <h4 className="text-white text-base sm:text-lg font-medium">Barcelona Winter Edition</h4>
                  <p className="text-white/60 text-sm">Barcelona, Spain</p>
                  <a href="https://www.notion.so/valeramarcos/Castellter-ol-Winter-House-28dbff6a5cda80109b9fcbbc2873c83f?source=copy_link" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-white/80 hover:text-white transition-colors">
                    VIEW EVENT →
                  </a>
                </div>
              </div>
            </div>

            {/* Event Card: Italy */}
            <div className="w-full aspect-square rounded-2xl border border-white/10 overflow-hidden relative group">
              <Image src="/events/italia.jpg" alt="Taranto, Italy" fill className="object-cover transition-transform duration-300 group-hover:scale-110" sizes="(min-width: 640px) 50vw, 100vw" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 via-50% to-black/80 flex flex-col justify-end p-4 sm:p-5">
                <div className="space-y-[6px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] tracking-wide text-emerald-300/80 border-emerald-300/20">FINISHED</span>
                    <span className="text-xs text-white/50">Sept 21, 2025</span>
                  </div>
                  <h4 className="text-white text-base sm:text-lg font-medium">La Settimana: Great Minds</h4>
                  <p className="text-white/60 text-sm">Taranto, Italy</p>
                  <a href="https://www.notion.so/valeramarcos/Taranto-La-Settimana-1f6bff6a5cda8083a794dd49975cf9ce?source=copy_link" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-white/80 hover:text-white transition-colors">
                    VIEW EVENT →
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* SECTION: Schedule                             */}
      {/* ============================================= */}
      <section className="w-full py-8 sm:py-12">
        <div className="mx-auto w-full max-w-4xl px-6 sm:px-10">
          <div className="mb-8 text-center">
            <h3 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight mb-2" style={{ fontFamily: 'var(--font-dm-mono)' }}>
              Last Schedule
            </h3>
            <p className="text-white/60">Weekly program structure</p>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <div className="min-w-full border border-white/10 rounded-lg overflow-hidden">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="w-32 px-4 py-4 text-left text-sm font-semibold text-white">Time</th>
                    <th className="px-4 py-4 text-center text-sm font-semibold text-white">Mon</th>
                    <th className="px-4 py-4 text-center text-sm font-semibold text-white">Tue</th>
                    <th className="px-4 py-4 text-center text-sm font-semibold text-white">Wed</th>
                    <th className="px-4 py-4 text-center text-sm font-semibold text-white">Thu</th>
                    <th className="px-4 py-4 text-center text-sm font-semibold text-white">Fri</th>
                    <th className="px-4 py-4 text-center text-sm font-semibold text-white">Sat</th>
                    <th className="px-4 py-4 text-center text-sm font-semibold text-white">Sun</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr className="bg-blue-500/10 hover:bg-blue-500/15 transition-colors">
                    <td className="px-4 py-4 text-sm font-medium text-white bg-white/5">09:00–13:00</td>
                    <td className="px-4 py-4 text-sm text-white text-center h-20">Check In</td>
                    <td className="px-4 py-4 text-sm text-white text-center h-20">Work Time</td>
                    <td className="px-4 py-4 text-sm text-white text-center h-20">Work Time</td>
                    <td className="px-4 py-4 text-sm text-white text-center h-20">Work Time</td>
                    <td className="px-4 py-4 text-sm text-white text-center h-20">Work Time</td>
                    <td className="px-4 py-4 text-sm text-white text-center h-20">Demo Day</td>
                    <td className="px-4 py-4 text-sm text-white text-center h-20">Morning activity</td>
                  </tr>
                  <tr className="bg-orange-500/10 hover:bg-orange-500/15 transition-colors">
                    <td className="px-4 py-4 text-sm font-medium text-white bg-white/5">13:00–15:00</td>
                    <td className="px-4 py-4 text-sm text-white text-center h-20">Lunch</td>
                    <td className="px-4 py-4 text-sm text-white text-center h-20">Lunch</td>
                    <td className="px-4 py-4 text-sm text-white text-center h-20">Lunch</td>
                    <td className="px-4 py-4 text-sm text-white text-center h-20">Lunch</td>
                    <td className="px-4 py-4 text-sm text-white text-center h-20">Lunch</td>
                    <td className="px-4 py-4 text-sm text-white text-center h-20">Public Event – Paella (60 Attendees)</td>
                    <td className="px-4 py-4 text-sm text-white text-center h-20">Lunch</td>
                  </tr>
                  <tr className="bg-purple-500/10 hover:bg-purple-500/15 transition-colors">
                    <td className="px-4 py-4 text-sm font-medium text-white bg-white/5">15:00–18:00</td>
                    <td className="px-4 py-4 text-sm text-white text-center h-20">Work Time</td>
                    <td className="px-4 py-4 text-sm text-white text-center h-20">Work Time</td>
                    <td className="px-4 py-4 text-sm text-white text-center h-20">Work Time</td>
                    <td className="px-4 py-4 text-sm text-white text-center h-20">Work Time</td>
                    <td className="px-4 py-4 text-sm text-white text-center h-20">Work Time</td>
                    <td className="px-4 py-4 text-sm text-white text-center h-20">DJ + Drinks</td>
                    <td className="px-4 py-4 text-sm text-white text-center h-20">Reflect & Harvest</td>
                  </tr>
                  <tr className="bg-pink-500/10 hover:bg-pink-500/15 transition-colors">
                    <td className="px-4 py-4 text-sm font-medium text-white bg-white/5">18:00+</td>
                    <td className="px-4 py-4 text-sm text-white text-center h-20">Intros & Goals</td>
                    <td className="px-4 py-4 text-sm text-white text-center h-20">Inspiration talk</td>
                    <td className="px-4 py-4 text-sm text-white text-center h-20">Network Afternoon</td>
                    <td className="px-4 py-4 text-sm text-white text-center h-20">Chef Dinner</td>
                    <td className="px-4 py-4 text-sm text-white text-center h-20">Demo Day</td>
                    <td className="px-4 py-4 text-sm text-white text-center h-20">DJ + Drinks</td>
                    <td className="px-4 py-4 text-sm text-white text-center h-20">Check out</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h4 className="text-white font-semibold text-base mb-3">Monday</h4>
              <div className="space-y-2 text-sm text-white">
                <div className="bg-blue-500/10 px-3 py-3 rounded h-14 flex items-center">09:00–13:00 → Check In</div>
                <div className="bg-orange-500/10 px-3 py-3 rounded h-14 flex items-center">13:00–15:00 → Lunch</div>
                <div className="bg-purple-500/10 px-3 py-3 rounded h-14 flex items-center">15:00–18:00 → Work Time</div>
                <div className="bg-pink-500/10 px-3 py-3 rounded h-14 flex items-center">18:00+ → Intros & Goals</div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h4 className="text-white font-semibold text-base mb-3">Tuesday</h4>
              <div className="space-y-2 text-sm text-white">
                <div className="bg-blue-500/10 px-3 py-3 rounded h-14 flex items-center">09:00–13:00 → Work Time</div>
                <div className="bg-orange-500/10 px-3 py-3 rounded h-14 flex items-center">13:00–15:00 → Lunch</div>
                <div className="bg-purple-500/10 px-3 py-3 rounded h-14 flex items-center">15:00–18:00 → Work Time</div>
                <div className="bg-pink-500/10 px-3 py-3 rounded h-14 flex items-center">18:00+ → Inspiration talk</div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h4 className="text-white font-semibold text-base mb-3">Wednesday</h4>
              <div className="space-y-2 text-sm text-white">
                <div className="bg-blue-500/10 px-3 py-3 rounded h-14 flex items-center">09:00–13:00 → Work Time</div>
                <div className="bg-orange-500/10 px-3 py-3 rounded h-14 flex items-center">13:00–15:00 → Lunch</div>
                <div className="bg-purple-500/10 px-3 py-3 rounded h-14 flex items-center">15:00–18:00 → Work Time</div>
                <div className="bg-pink-500/10 px-3 py-3 rounded h-14 flex items-center">18:00+ → Network Afternoon</div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h4 className="text-white font-semibold text-base mb-3">Thursday</h4>
              <div className="space-y-2 text-sm text-white">
                <div className="bg-blue-500/10 px-3 py-3 rounded h-14 flex items-center">09:00–13:00 → Work Time</div>
                <div className="bg-orange-500/10 px-3 py-3 rounded h-14 flex items-center">13:00–15:00 → Lunch</div>
                <div className="bg-purple-500/10 px-3 py-3 rounded h-14 flex items-center">15:00–18:00 → Work Time</div>
                <div className="bg-pink-500/10 px-3 py-3 rounded h-14 flex items-center">18:00+ → Chef Dinner</div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h4 className="text-white font-semibold text-base mb-3">Friday</h4>
              <div className="space-y-2 text-sm text-white">
                <div className="bg-blue-500/10 px-3 py-3 rounded h-14 flex items-center">09:00–13:00 → Work Time</div>
                <div className="bg-orange-500/10 px-3 py-3 rounded h-14 flex items-center">13:00–15:00 → Lunch</div>
                <div className="bg-purple-500/10 px-3 py-3 rounded h-14 flex items-center">15:00–18:00 → Work Time</div>
                <div className="bg-pink-500/10 px-3 py-3 rounded h-14 flex items-center">18:00+ → Demo Day</div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h4 className="text-white font-semibold text-base mb-3">Saturday</h4>
              <div className="space-y-2 text-sm text-white">
                <div className="bg-blue-500/10 px-3 py-3 rounded h-14 flex items-center">09:00–13:00 → Demo Day</div>
                <div className="bg-orange-500/10 px-3 py-3 rounded h-14 flex items-center">13:00–15:00 → Public Event – Paella</div>
                <div className="bg-purple-500/10 px-3 py-3 rounded h-14 flex items-center">15:00–18:00 → DJ + Drinks</div>
                <div className="bg-pink-500/10 px-3 py-3 rounded h-14 flex items-center">18:00+ → DJ + Drinks</div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h4 className="text-white font-semibold text-base mb-3">Sunday</h4>
              <div className="space-y-2 text-sm text-white">
                <div className="bg-blue-500/10 px-3 py-3 rounded h-14 flex items-center">09:00–13:00 → Morning activity + Check out</div>
                <div className="bg-orange-500/10 px-3 py-3 rounded h-14 flex items-center">13:00–15:00 → Lunch</div>
                <div className="bg-purple-500/10 px-3 py-3 rounded h-14 flex items-center">15:00–18:00 → Reflect & Harvest</div>
                <div className="bg-pink-500/10 px-3 py-3 rounded h-14 flex items-center">18:00+ → Check out</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* SECTION: Led By (Team)                        */}
      {/* ============================================= */}
      <section className="w-full">
        <div className="mx-auto w-full max-w-2xl px-6 sm:px-10 py-16 sm:py-24">
          <h3 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight mb-4 text-center" style={{ fontFamily: 'var(--font-dm-mono)' }}>Led by:</h3>
          <p className="text-white/60 mb-12 text-center">Meet the builders behind SOTI</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Marcos */}
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-white/10">
                  <Image src="/marcos.jpeg" alt="Marcos Valera" fill className="object-cover" sizes="96px" />
                </div>
                <h4 className="text-white text-lg font-semibold" style={{ fontFamily: 'var(--font-dm-mono)' }}>Marcos Valera</h4>
                <div className="flex gap-4 items-center">
                  <a href="https://www.youtube.com/@MarcosValera" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">YT</a>
                  <a href="https://x.com/_MarcosValera" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">X</a>
                  <a href="https://www.linkedin.com/in/valeramarcos/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">LI</a>
                </div>
                <p className="text-white/70 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-dm-mono)' }}>GTM, community. 10k youtube + 25k linkedin. Startups and builders audience.</p>
              </div>
            </div>

            {/* Juan Pablo */}
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-white/10">
                  <Image src="/juan-pablo.jpeg" alt="Juan Pablo" fill className="object-cover" sizes="96px" />
                </div>
                <h4 className="text-white text-lg font-semibold" style={{ fontFamily: 'var(--font-dm-mono)' }}>Juan Pablo</h4>
                <div className="flex gap-4 items-center">
                  <a href="https://x.com/jpgallegoar" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">X</a>
                  <a href="https://github.com/jpgallegoar" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">GH</a>
                  <a href="https://www.linkedin.com/in/jpgallegoar/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">LI</a>
                </div>
                <p className="text-white/70 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-dm-mono)' }}>Researcher and CTO. how research AI works</p>
              </div>
            </div>

            {/* Dani */}
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-white/10">
                  <Image src="/dani.png" alt="Dani Diestre" fill className="object-cover" sizes="96px" />
                </div>
                <h4 className="text-white text-lg font-semibold" style={{ fontFamily: 'var(--font-dm-mono)' }}>Dani Diestre</h4>
                <div className="flex gap-4 items-center">
                  <a href="https://www.youtube.com/@danidiestre" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">YT</a>
                  <a href="https://github.com/danidiestre" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">GH</a>
                  <a href="https://www.linkedin.com/in/danidiestre/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">LI</a>
                </div>
                <p className="text-white/70 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-dm-mono)' }}>Co-Founder Autentic, Youtube Creator</p>
              </div>
            </div>

            {/* Aniol */}
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-white/10">
                  <Image src="/aniol.jpeg" alt="Aniol Carreras" fill className="object-cover" sizes="96px" />
                </div>
                <h4 className="text-white text-lg font-semibold" style={{ fontFamily: 'var(--font-dm-mono)' }}>Aniol Carreras</h4>
                <div className="flex gap-4 items-center">
                  <a href="https://x.com/carrerasaniol" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">X</a>
                  <a href="https://www.linkedin.com/in/aniolcarreras" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">LI</a>
                </div>
                <p className="text-white/70 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-dm-mono)' }}>COO at The Hero Camp (Product School Leader in Spain) , Events Creator - Leading Product Fest (Madrid, 3 editions)</p>
              </div>
            </div>

            {/* Saura */}
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-white/10">
                  <Image src="/saura.jpeg" alt="Jose Saura" fill className="object-cover" sizes="96px" />
                </div>
                <h4 className="text-white text-lg font-semibold" style={{ fontFamily: 'var(--font-dm-mono)' }}>Jose Saura</h4>
                <div className="flex gap-4 items-center">
                  <a href="https://x.com/iamsaura_" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">X</a>
                  <a href="https://github.com/eddsaura" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">GH</a>
                  <a href="https://www.linkedin.com/in/jesauraoller/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">LI</a>
                </div>
                <p className="text-white/70 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-dm-mono)' }}>Indiehacker - Paellas CEO - Starting on / IG / Tiktok - Skool community $1000MRR - DJ</p>
              </div>
            </div>

            {/* Adrian */}
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-white/10">
                  <Image src="/adrian.png" alt="Adrian Valera" fill className="object-cover" sizes="96px" />
                </div>
                <h4 className="text-white text-lg font-semibold" style={{ fontFamily: 'var(--font-dm-mono)' }}>Adrian Valera</h4>
                <div className="flex gap-4 items-center">
                  <a href="https://github.com/adrixo" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">GH</a>
                  <a href="http://linkedin.com/in/adrian-valera" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">LI</a>
                </div>
                <p className="text-white/70 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-dm-mono)' }}>Engineer & Researcher. Building communities with love.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* SECTION: Final CTA                            */}
      {/* ============================================= */}
      <section className="w-full">
        <div className="mx-auto w-full max-w-2xl px-6 sm:px-10 py-20 sm:py-28 text-center">
          <h3 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-dm-mono)' }}>Build something that matters</h3>
          <p className="text-white/70 mt-3">Not another community.</p>
          <p className="text-white/70">Join the new generation of builders now</p>
          <div className="mt-8">
            <div className="relative group inline-block">
              <div className="absolute inset-0 -m-2 rounded-full hidden sm:block bg-gray-100 opacity-40 filter blur-lg pointer-events-none transition-all duration-300 ease-out group-hover:opacity-60 group-hover:blur-xl group-hover:-m-3"></div>
              <a href="https://tally.so/r/BzXWgN" target="_blank" rel="noopener noreferrer" className="relative z-10 px-6 py-3 text-sm font-semibold text-black bg-gradient-to-br from-gray-100 to-gray-300 rounded-full hover:from-gray-200 hover:to-gray-400 transition-all duration-200">Apply to join the family</a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* SECTION: Footer                               */}
      {/* ============================================= */}
      <footer className="w-full border-t border-white/10">
        <div className="mx-auto w-full max-w-2xl px-6 sm:px-10 py-12 sm:py-16">
          <div className="space-y-8">
            <div>
              <h4 className="text-white text-lg sm:text-xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-dm-mono)' }}>SOTI Family</h4>
              <p className="text-white/60 mr-12 mt-2" style={{ fontFamily: 'var(--font-dm-mono)' }}>A global community of digital natives who build, create, and connect beyond the web.</p>
              <div className="flex mt-4">
                <div className="relative w-40 h-14">
                  <Image src="/logo-white.png" alt="SOTI Isotope" fill className="object-contain" priority={false} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h5 className="text-white/80 text-xs tracking-wider mb-3">QUICK_LINKS</h5>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/#1" className="text-white/70 hover:text-white transition-colors">&gt; Manifesto</Link></li>
                  <li><Link href="/#2" className="text-white/70 hover:text-white transition-colors">&gt; Houses</Link></li>
                  <li><a href="https://tally.so/r/BzXWgN" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">&gt; Apply to become a member</a></li>
                </ul>
              </div>
              <div>
                <h5 className="text-white/80 text-xs tracking-wider mb-3">FIND_US</h5>
                <p className="text-white/50 text-sm mt-2">Only in real life.<br />We don&apos;t do social media.<br />We do moments that matter.</p>
              </div>
            </div>
            <div className="pt-6 text-white/30 text-xs">&copy; {new Date().getFullYear()} SOTI</div>
          </div>
        </div>
      </footer>

    </main>
  );
}
