"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const box = boxRef.current;
    if (!canvas || !box) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0,
      h = 0,
      boxTop = 0,
      boxLeft = 0,
      boxRight = 0;
    let animationId: number;

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
    }

    const observer = new ResizeObserver(updateLayout);
    observer.observe(canvas!.parentElement!);

    function animate() {
      ctx!.clearRect(0, 0, w, h);
      ctx!.lineCap = "round";

      // Generate rain
      for (let k = 0; k < 4; k++) {
        if (Math.random() < 0.6) {
          rain.push({
            x: Math.random() * w,
            y: -50,
            vy: 18 + Math.random() * 8,
            l: 40 + Math.random() * 80,
          });
        }
      }

      // Rain rendering & collision
      ctx!.strokeStyle = "#ffffff";
      ctx!.lineWidth = 3;
      for (let i = rain.length - 1; i >= 0; i--) {
        const r = rain[i];
        r.y += r.vy;
        ctx!.beginPath();
        ctx!.moveTo(r.x, r.y);
        ctx!.lineTo(r.x, r.y - r.l);
        ctx!.stroke();

        // Collision with box top edge
        if (
          r.y >= boxTop &&
          r.y - r.vy <= boxTop &&
          r.x > boxLeft &&
          r.x < boxRight
        ) {
          for (let k = 0; k < 6; k++) {
            splashes.push({
              x: r.x,
              y: boxTop,
              vx: (Math.random() - 0.5) * 5,
              vy: -Math.random() * 3 - 1,
              life: 1,
              size: 3 + Math.random() * 5,
            });
          }
          rain.splice(i, 1);
        } else if (r.y > h) {
          rain.splice(i, 1);
        }
      }

      // Splash physics
      ctx!.fillStyle = "#ffffff";
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.25; // Gravity

        // Pool at the top edge of the box
        if (s.y > boxTop) {
          s.y = boxTop;
          s.vy = 0;
          s.vx *= 0.85; // Friction
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

  return (
    <main className="bg-black">

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
      <section className="relative flex flex-col min-h-[50vh] md:min-h-[55vh] bg-black overflow-hidden">
        {/* Rain canvas with goo filter */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          style={{ filter: "url(#goo)" }}
        />

        {/* Hero box */}
        <div className="relative z-10 flex flex-col flex-1 px-6 sm:px-10 pt-16 sm:pt-28">
          <div
            ref={boxRef}
            className="relative border border-white/10 rounded-2xl bg-black/80 backdrop-blur-sm mx-auto w-full max-w-2xl"
          >
            <div className="px-6 pt-6 pb-16 sm:pb-24">
              {/* Navbar */}
              <nav className="flex items-center justify-between w-full mb-8">
                <div className="relative w-28 h-10">
                  <Image src="/logo-white.png" alt="SOTI" fill className="object-contain" />
                </div>
                <a
                  href="https://tally.so/r/BzXWgN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs font-semibold text-black bg-gradient-to-br from-gray-100 to-gray-300 rounded-full hover:from-gray-200 hover:to-gray-400 transition-all duration-200"
                >
                  Apply
                </a>
              </nav>

              {/* Hero text + CTA */}
              <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                <div className="w-full text-center">
                  <div className="space-y-10">
                    <h1 className="text-[2.5rem] sm:text-[3rem] font-bold leading-[1.1] tracking-tight text-white">
                      We host 1-week houses for people who build things
                    </h1>
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      <h2 className="text-[1.2rem] sm:text-[1.4rem] text-white/70 font-light">Next House — April 2026</h2>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-6">
                      <div className="relative group inline-block">
                        <div className="absolute inset-0 -m-2 rounded-full hidden sm:block bg-gray-100 opacity-40 filter blur-lg pointer-events-none transition-all duration-300 ease-out group-hover:opacity-60 group-hover:blur-xl group-hover:-m-3"></div>
                        <a
                          href="https://tally.so/r/BzXWgN"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative z-10 px-4 py-2 sm:px-3 text-xs sm:text-sm font-semibold text-black bg-gradient-to-br from-gray-100 to-gray-300 rounded-full hover:from-gray-200 hover:to-gray-400 transition-all duration-200 cursor-pointer"
                        >
                          Apply to join the family
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* SECTION: Fueled By                            */}
      {/* ============================================= */}
      <section className="w-full py-8 sm:py-12">
        <div className="mx-auto w-full max-w-2xl px-6 sm:px-10">
          <p className="text-white/60 text-sm sm:text-base text-center mb-4" style={{ fontFamily: 'var(--font-space-mono)' }}>Fueled by:</p>
          <div className="flex items-center justify-center gap-6 sm:gap-8 flex-wrap">
            <a href="https://www.blackbox.ai/" target="_blank" rel="noopener noreferrer" className="inline-block">
              <img src="/sponsors/blackbox.svg" alt="Blackbox" className="h-8 sm:h-12 w-auto opacity-80 hover:opacity-100 transition-opacity" />
            </a>
            <a href="https://baobabventures.vc/" target="_blank" rel="noopener noreferrer" className="inline-block">
              <img src="/sponsors/baobab.svg" alt="Baobab" className="h-8 sm:h-12 w-auto opacity-80 hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>
      </section>

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
                  <span className="text-sm font-medium text-white flex-1" style={{ fontFamily: "var(--font-space-mono)" }}>
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
                  <span className="text-sm font-medium text-white flex-1" style={{ fontFamily: "var(--font-space-mono)" }}>
                    20/20 builders on Barcelona 2025
                  </span>
                  <span className="text-sm text-white ml-4" style={{ fontFamily: "var(--font-space-mono)" }}>100%</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded bg-white/10">
                  <div className="h-full bg-white transition-all duration-500" style={{ width: "100%" }}></div>
                </div>
                <div className="flex flex-col items-center gap-6">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/40">
                    <span className="text-orange-400 text-xs font-medium uppercase tracking-wide" style={{ fontFamily: "var(--font-space-mono)" }}>
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
            <h3 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-space-mono)' }}>Our Manifesto</h3>
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
            <h3 className="text-center text-white text-2xl sm:text-3xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-space-mono)" }}>
              SOTI Community
            </h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-white flex-1" style={{ fontFamily: "var(--font-space-mono)" }}>
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
            <h3 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-space-mono)' }}>Houses</h3>
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
            <h3 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight mb-2" style={{ fontFamily: 'var(--font-space-mono)' }}>
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
          <h3 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight mb-4 text-center" style={{ fontFamily: 'var(--font-space-mono)' }}>Led by:</h3>
          <p className="text-white/60 mb-12 text-center">Meet the builders behind SOTI</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Marcos */}
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-white/10">
                  <Image src="/marcos.jpeg" alt="Marcos Valera" fill className="object-cover" sizes="96px" />
                </div>
                <h4 className="text-white text-lg font-semibold" style={{ fontFamily: 'var(--font-space-mono)' }}>Marcos Valera</h4>
                <div className="flex gap-4 items-center">
                  <a href="https://www.youtube.com/@MarcosValera" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">YT</a>
                  <a href="https://x.com/_MarcosValera" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">X</a>
                  <a href="https://www.linkedin.com/in/valeramarcos/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">LI</a>
                </div>
                <p className="text-white/70 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-space-mono)' }}>GTM, community. 10k youtube + 25k linkedin. Startups and builders audience.</p>
              </div>
            </div>

            {/* Juan Pablo */}
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-white/10">
                  <Image src="/juan-pablo.jpeg" alt="Juan Pablo" fill className="object-cover" sizes="96px" />
                </div>
                <h4 className="text-white text-lg font-semibold" style={{ fontFamily: 'var(--font-space-mono)' }}>Juan Pablo</h4>
                <div className="flex gap-4 items-center">
                  <a href="https://x.com/jpgallegoar" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">X</a>
                  <a href="https://github.com/jpgallegoar" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">GH</a>
                  <a href="https://www.linkedin.com/in/jpgallegoar/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">LI</a>
                </div>
                <p className="text-white/70 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-space-mono)' }}>Researcher and CTO. how research AI works</p>
              </div>
            </div>

            {/* Dani */}
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-white/10">
                  <Image src="/dani.png" alt="Dani Diestre" fill className="object-cover" sizes="96px" />
                </div>
                <h4 className="text-white text-lg font-semibold" style={{ fontFamily: 'var(--font-space-mono)' }}>Dani Diestre</h4>
                <div className="flex gap-4 items-center">
                  <a href="https://www.youtube.com/@danidiestre" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">YT</a>
                  <a href="https://github.com/danidiestre" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">GH</a>
                  <a href="https://www.linkedin.com/in/danidiestre/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">LI</a>
                </div>
                <p className="text-white/70 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-space-mono)' }}>Co-Founder Autentic, Youtube Creator</p>
              </div>
            </div>

            {/* Aniol */}
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-white/10">
                  <Image src="/aniol.jpeg" alt="Aniol Carreras" fill className="object-cover" sizes="96px" />
                </div>
                <h4 className="text-white text-lg font-semibold" style={{ fontFamily: 'var(--font-space-mono)' }}>Aniol Carreras</h4>
                <div className="flex gap-4 items-center">
                  <a href="https://x.com/carrerasaniol" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">X</a>
                  <a href="https://www.linkedin.com/in/aniolcarreras" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">LI</a>
                </div>
                <p className="text-white/70 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-space-mono)' }}>COO at The Hero Camp (Product School Leader in Spain) , Events Creator - Leading Product Fest (Madrid, 3 editions)</p>
              </div>
            </div>

            {/* Saura */}
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-white/10">
                  <Image src="/saura.jpeg" alt="Jose Saura" fill className="object-cover" sizes="96px" />
                </div>
                <h4 className="text-white text-lg font-semibold" style={{ fontFamily: 'var(--font-space-mono)' }}>Jose Saura</h4>
                <div className="flex gap-4 items-center">
                  <a href="https://x.com/iamsaura_" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">X</a>
                  <a href="https://github.com/eddsaura" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">GH</a>
                  <a href="https://www.linkedin.com/in/jesauraoller/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">LI</a>
                </div>
                <p className="text-white/70 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-space-mono)' }}>Indiehacker - Paellas CEO - Starting on / IG / Tiktok - Skool community $1000MRR - DJ</p>
              </div>
            </div>

            {/* Adrian */}
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-white/10">
                  <Image src="/adrian.png" alt="Adrian Valera" fill className="object-cover" sizes="96px" />
                </div>
                <h4 className="text-white text-lg font-semibold" style={{ fontFamily: 'var(--font-space-mono)' }}>Adrian Valera</h4>
                <div className="flex gap-4 items-center">
                  <a href="https://github.com/adrixo" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">GH</a>
                  <a href="http://linkedin.com/in/adrian-valera" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">LI</a>
                </div>
                <p className="text-white/70 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-space-mono)' }}>Engineer & Researcher. Building communities with love.</p>
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
          <h3 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-space-mono)' }}>Build something that matters</h3>
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
              <h4 className="text-white text-lg sm:text-xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-space-mono)' }}>SOTI Family</h4>
              <p className="text-white/60 mr-12 mt-2" style={{ fontFamily: 'var(--font-space-mono)' }}>A global community of digital natives who build, create, and connect beyond the web.</p>
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
