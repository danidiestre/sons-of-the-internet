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

  // Zone 2 transition refs
  const zone2TriggerRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const sunCanvasRef = useRef<HTMLCanvasElement>(null);
  const zone2ContentRef = useRef<HTMLDivElement>(null);
  const zone2Fired = useRef(false);
  const sunAnimId = useRef<number>(0);

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

  // Zone 2 flash + sun lens flare — fires once when trigger enters viewport
  useEffect(() => {
    const trigger = zone2TriggerRef.current;
    const flash = flashRef.current;
    const sunCanvas = sunCanvasRef.current;
    const content = zone2ContentRef.current;
    if (!trigger || !flash || !sunCanvas || !content) return;

    // Sun + lens flare animation on canvas
    function startSunAnimation(canvas: HTMLCanvasElement) {
      const ctx = canvas.getContext('2d')!;
      const dpr = window.devicePixelRatio || 1;
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);

      // Sun position — pinned near top of screen
      const sunX = W * 0.5;
      const sunY = H * 0.06;

      // Lens flare artifacts along a nearly horizontal line (~15° tilt)
      const flares = [
        { dist: 0.12, size: 40, color: 'rgba(255,209,102,0.55)' },
        { dist: 0.22, size: 20, color: 'rgba(255,107,43,0.4)' },
        { dist: 0.34, size: 55, color: 'rgba(255,209,102,0.25)' },
        { dist: 0.46, size: 15, color: 'rgba(255,180,80,0.5)' },
        { dist: 0.56, size: 70, color: 'rgba(255,209,102,0.18)' },
        { dist: 0.68, size: 25, color: 'rgba(255,107,43,0.35)' },
        { dist: 0.78, size: 45, color: 'rgba(255,255,255,0.15)' },
        { dist: 0.90, size: 30, color: 'rgba(255,180,80,0.2)' },
      ];
      // Flare axis — nearly horizontal, ~15° tilt to the right
      const axisAngle = Math.PI * (15 / 180);
      const axisDist = W * 0.9;

      let startTime = 0;
      let globalAlpha = 1;

      function draw(time: number) {
        if (!startTime) startTime = time;
        const elapsed = time - startTime;
        ctx.clearRect(0, 0, W, H);
        ctx.globalAlpha = globalAlpha;

        const rotation = elapsed * 0.0003;

        // Sun core glow — massive warm aura
        const coreR = 280;
        const coreGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, coreR);
        coreGrad.addColorStop(0, 'rgba(255,255,255,1)');
        coreGrad.addColorStop(0.08, 'rgba(255,255,240,0.95)');
        coreGrad.addColorStop(0.2, 'rgba(255,248,220,0.7)');
        coreGrad.addColorStop(0.4, 'rgba(255,209,102,0.35)');
        coreGrad.addColorStop(0.65, 'rgba(255,140,50,0.12)');
        coreGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = coreGrad;
        ctx.fillRect(sunX - coreR, sunY - coreR, coreR * 2, coreR * 2);

        // Sun rays — prominent starburst with slow rotation
        const rayCount = 16;
        for (let i = 0; i < rayCount; i++) {
          const angle = rotation + (i / rayCount) * Math.PI * 2;
          const length = 220 + Math.sin(elapsed * 0.002 + i) * 60;
          const width = 2.5;
          ctx.save();
          ctx.translate(sunX, sunY);
          ctx.rotate(angle);
          const rayGrad = ctx.createLinearGradient(0, 0, length, 0);
          rayGrad.addColorStop(0, 'rgba(255,255,255,0.85)');
          rayGrad.addColorStop(0.2, 'rgba(255,248,220,0.5)');
          rayGrad.addColorStop(0.5, 'rgba(255,209,102,0.2)');
          rayGrad.addColorStop(1, 'transparent');
          ctx.strokeStyle = rayGrad;
          ctx.lineWidth = width;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(length, 0);
          ctx.stroke();
          ctx.restore();
        }

        // Secondary thinner rays — counter-rotating
        for (let i = 0; i < rayCount * 2; i++) {
          const angle = -rotation * 0.5 + (i / (rayCount * 2)) * Math.PI * 2;
          const length = 140 + Math.cos(elapsed * 0.0015 + i * 0.5) * 35;
          ctx.save();
          ctx.translate(sunX, sunY);
          ctx.rotate(angle);
          const rayGrad = ctx.createLinearGradient(0, 0, length, 0);
          rayGrad.addColorStop(0, 'rgba(255,209,102,0.5)');
          rayGrad.addColorStop(0.4, 'rgba(255,180,80,0.2)');
          rayGrad.addColorStop(1, 'transparent');
          ctx.strokeStyle = rayGrad;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(12, 0);
          ctx.lineTo(length, 0);
          ctx.stroke();
          ctx.restore();
        }

        // Bright inner core — hot white center
        const innerR = 50;
        const innerGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, innerR);
        innerGrad.addColorStop(0, 'rgba(255,255,255,1)');
        innerGrad.addColorStop(0.3, 'rgba(255,255,240,0.9)');
        innerGrad.addColorStop(0.6, 'rgba(255,255,255,0.4)');
        innerGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = innerGrad;
        ctx.fillRect(sunX - innerR, sunY - innerR, innerR * 2, innerR * 2);

        // Lens flare artifacts — bokeh circles along axis
        for (const f of flares) {
          const fx = sunX + Math.cos(axisAngle) * axisDist * f.dist;
          const fy = sunY + Math.sin(axisAngle) * axisDist * f.dist;
          // Subtle pulse
          const pulse = 1 + Math.sin(elapsed * 0.003 + f.dist * 10) * 0.15;
          const r = f.size * pulse;

          // Outer ring
          ctx.beginPath();
          ctx.arc(fx, fy, r, 0, Math.PI * 2);
          ctx.fillStyle = f.color;
          ctx.fill();

          // Inner bright spot
          const spotGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, r * 0.4);
          spotGrad.addColorStop(0, 'rgba(255,255,255,0.3)');
          spotGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = spotGrad;
          ctx.beginPath();
          ctx.arc(fx, fy, r * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Hexagonal flare (camera aperture artifact) midway
        const hexX = sunX + Math.cos(axisAngle) * axisDist * 0.35;
        const hexY = sunY + Math.sin(axisAngle) * axisDist * 0.35;
        const hexR = 40;
        ctx.save();
        ctx.translate(hexX, hexY);
        ctx.rotate(rotation * 0.3);
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          const hx = Math.cos(a) * hexR;
          const hy = Math.sin(a) * hexR;
          if (i === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(255,209,102,0.15)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,209,102,0.25)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

        sunAnimId.current = requestAnimationFrame(draw);
      }

      sunAnimId.current = requestAnimationFrame(draw);
    }

    // Reset content to hidden state
    function resetContent() {
      const children = content!.children;
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        child.style.transition = 'none';
        child.style.opacity = '0';
        child.style.transform = 'translateY(30px)';
      }
    }

    // Guard: prevent exit observer from resetting during animation
    let animGuard = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (zone2Fired.current) return;
        zone2Fired.current = true;
        animGuard = true;

        // Lock scroll — snap to Valencia section and freeze
        const section = content.closest('section');
        if (section) {
          const sectionTop = section.getBoundingClientRect().top + window.scrollY - 40;
          window.scrollTo({ top: sectionTop, behavior: 'smooth' });
        }
        document.body.style.overflow = 'hidden';

        // t=0: bright flash ON + start sun canvas
        flash.style.transition = 'opacity 0.12s ease-in';
        flash.style.opacity = '1';
        sunCanvas.style.opacity = '1';
        startSunAnimation(sunCanvas);

        // t=150ms: flash fades, sun stays permanently
        setTimeout(() => {
          flash.style.transition = 'opacity 0.5s ease-out';
          flash.style.opacity = '0';
        }, 150);

        // t=350ms: reveal content with staggered animation
        setTimeout(() => {
          const children = content.children;
          for (let i = 0; i < children.length; i++) {
            const child = children[i] as HTMLElement;
            child.style.transition = `opacity 0.6s ease-out ${i * 0.15}s, transform 0.6s ease-out ${i * 0.15}s`;
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
          }
        }, 350);

        // Unlock scroll after animation completes
        setTimeout(() => {
          document.body.style.overflow = '';
        }, 1400);

        // Allow exit observer to work after animation settles
        setTimeout(() => {
          animGuard = false;
        }, 2500);
      },
      { threshold: 0.15 }
    );

    // When trigger exits viewport (user scrolls back up), reset everything
    const exitObserver = new IntersectionObserver(
      ([entry]) => {
        // Don't reset during the animation sequence
        if (animGuard) return;
        if (entry.isIntersecting || !zone2Fired.current) return;
        // Trigger left viewport — reset so it can fire again
        zone2Fired.current = false;
        cancelAnimationFrame(sunAnimId.current);
        sunCanvas.style.opacity = '0';
        flash.style.opacity = '0';
        resetContent();
      },
      { threshold: 0 }
    );

    observer.observe(trigger);
    exitObserver.observe(trigger);
    return () => {
      observer.disconnect();
      exitObserver.disconnect();
      cancelAnimationFrame(sunAnimId.current);
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

          {/* Rain Controls — disabled for now
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
          */}
        </div>
      </section>
      </div>

      {/* ============================================= */}
      {/* ZONE 2: Valencia — Warm Mediterranean          */}
      {/* ============================================= */}
      <div style={{ background: '#FFF8F0' }}>

        {/* Flash overlay — fills the entire viewport on trigger */}
        <div
          ref={flashRef}
          className="fixed inset-0 pointer-events-none z-50"
          style={{
            background: 'radial-gradient(ellipse at center 30%, #ffffff 0%, #FFF8F0 20%, #FFD166 45%, #FF6B2B60 70%, transparent 100%)',
            opacity: 0,
          }}
        />

        {/* Sun lens flare canvas — fixed overlay */}
        <canvas
          ref={sunCanvasRef}
          className="fixed inset-0 pointer-events-none z-40"
          style={{ width: '100vw', height: '100vh', opacity: 0, transition: 'opacity 0.3s ease-in' }}
        />

        {/* Transition: sharp dark → cream cutoff */}
        <div ref={zone2TriggerRef} className="relative" style={{ height: '80px', background: 'linear-gradient(to bottom, #0a0a0c 0%, #0a0a0c 20%, #1a1410 45%, #FFF8F0 100%)' }}>
          {/* Static warm glow underneath */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[800px] h-[400px] pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, #FFD16640 0%, #FF6B2B15 35%, transparent 65%)' }} />
        </div>

        {/* ============================================= */}
        {/* SECTION: Valencia Hero Intro                   */}
        {/* ============================================= */}
        <section className="relative w-full min-h-screen flex flex-col justify-center pt-10 sm:pt-16 pb-10 sm:pb-14">
          <div ref={zone2ContentRef} className="mx-auto w-full max-w-3xl px-6 sm:px-10 text-center">
            <p className="text-sm uppercase tracking-[0.3em] mb-4" style={{ fontFamily: 'var(--font-dm-mono)', color: '#FF6B2B', opacity: 0, transform: 'translateY(30px)' }}>
              Welcome to
            </p>
            <div className="flex justify-center mb-5" style={{ opacity: 0, transform: 'translateY(30px)' }}>
              <div className="relative w-36 h-16 sm:w-48 sm:h-20">
                <Image src="/logo.png" alt="SOTI" fill className="object-contain" />
              </div>
            </div>
            <p className="text-xs uppercase tracking-[0.2em] mb-1" style={{ fontFamily: 'var(--font-dm-mono)', color: '#6b5e52', opacity: 0, transform: 'translateY(30px)' }}>
              connect beyond the web
            </p>
            <h2 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05]" style={{ fontFamily: 'var(--font-syne)', color: '#1a1a1a', opacity: 0, transform: 'translateY(30px)' }}>
              Valencia.
            </h2>
            <p className="mt-4 text-lg sm:text-xl leading-relaxed max-w-xl mx-auto" style={{ color: '#6b5e52', opacity: 0, transform: 'translateY(30px)' }}>
              20 builders. One villa. Seven days of sun.
            </p>

            {/* Progress + Apply — inside hero so it fills the viewport */}
            <div className="mt-6 mx-auto w-full max-w-md" style={{ opacity: 0, transform: 'translateY(30px)' }}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-dm-mono)', color: '#1a1a1a' }}>
                    0/20 builders
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: '#1a1a1a10' }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: '0%', background: '#FF6B2B' }} />
                </div>
                <div className="flex flex-col items-center gap-4 pt-2">
                  <div className="relative group inline-block">
                    <div className="absolute inset-0 -m-2 rounded-full hidden sm:block opacity-40 filter blur-lg pointer-events-none transition-all duration-300 ease-out group-hover:opacity-60 group-hover:blur-xl group-hover:-m-3" style={{ background: '#FF6B2B' }} />
                    <a
                      href="https://tally.so/r/BzXWgN"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative z-10 px-7 py-3 text-sm font-bold rounded-full transition-all duration-200 cursor-pointer"
                      style={{ background: '#FF6B2B', color: '#FFF8F0' }}
                    >
                      Apply to join
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* SECTION: Manifesto                             */}
        {/* ============================================= */}
        <section id="1" className="relative z-10 w-full scroll-mt-32 md:scroll-mt-40">
          <div className="mx-auto w-full max-w-2xl px-6 sm:px-10 py-16 sm:py-24">
            <div className="mb-8 text-center">
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-syne)', color: '#1a1a1a' }}>Our Manifesto</h3>
            </div>
            <div className="text-center text-balance text-xl sm:text-2xl leading-relaxed max-w-2xl flex flex-col gap-5 mx-auto" style={{ color: '#6b5e52' }}>
              <p>We grew up online, through forums, pixels and late-night calls.</p>
              <p>We build in public, meet offline, and chase that first feeling of discovering the internet.</p>
              <p>We&apos;re digital natives who enjoy disconnecting with other passionate builders.</p>
              <p>Our community is global, our connections are real, and our gatherings never forget.</p>
            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* SECTION: SOTI Community Progress               */}
        {/* ============================================= */}
        <section className="w-full pb-10 sm:pb-14 pt-6 sm:pt-8">
          <div className="mx-auto w-full max-w-md px-6 sm:px-10">
            <div className="w-full space-y-4">
              <h3 className="text-center text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-syne)', color: '#1a1a1a' }}>
                SOTI Community
              </h3>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-dm-mono)', color: '#1a1a1a' }}>
                  0/128 seats filled for 2026
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: '#1a1a1a10' }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ width: '0%', background: '#FF8C42' }} />
              </div>
              <div className="flex justify-center pt-3">
                <div className="relative group inline-block">
                  <div className="absolute inset-0 -m-2 rounded-full hidden sm:block opacity-40 filter blur-lg pointer-events-none transition-all duration-300 ease-out group-hover:opacity-60 group-hover:blur-xl group-hover:-m-3" style={{ background: '#FF6B2B' }} />
                  <a
                    href="https://tally.so/r/BzXWgN"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 px-7 py-3 text-sm font-bold rounded-full transition-all duration-200 cursor-pointer"
                    style={{ background: '#FF6B2B', color: '#FFF8F0' }}
                  >
                    Apply to join the family
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="mx-auto max-w-xs h-px" style={{ background: 'linear-gradient(to right, transparent, #FF6B2B30, transparent)' }} />

        {/* ============================================= */}
        {/* SECTION: Barcelona 2025 (past event)           */}
        {/* ============================================= */}
        <section className="w-full py-10 sm:py-14">
          <div className="mx-auto w-full max-w-md px-6 sm:px-10">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-dm-mono)', color: '#1a1a1a' }}>
                  20/20 builders on Barcelona 2025
                </span>
                <span className="text-sm" style={{ fontFamily: 'var(--font-dm-mono)', color: '#6b5e52' }}>100%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: '#1a1a1a10' }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ width: '100%', background: '#FF8C42' }} />
              </div>
              <div className="flex flex-col items-center gap-4 pt-2">
                <div className="inline-flex items-center px-3 py-1 rounded-full" style={{ background: '#FF6B2B15', border: '1px solid #FF6B2B40' }}>
                  <span className="text-xs font-medium uppercase tracking-wide" style={{ fontFamily: 'var(--font-dm-mono)', color: '#FF6B2B' }}>
                    Sold out
                  </span>
                </div>
                <a
                  href="https://www.notion.so/valeramarcos/Castellter-ol-Winter-House-28dbff6a5cda80109b9fcbbc2873c83f?source=copy_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer border"
                  style={{ color: '#FF6B2B', borderColor: '#FF6B2B', background: 'transparent' }}
                >
                  View house recap
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* SECTION: Houses / Events                       */}
        {/* ============================================= */}
        <section id="2" className="w-full scroll-mt-32 md:scroll-mt-40">
          <div className="mx-auto w-full max-w-5xl px-6 sm:px-10 py-16 sm:py-24">
            <div className="mb-10 text-center">
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-syne)', color: '#1a1a1a' }}>Houses</h3>
              <p className="mt-3 text-base" style={{ color: '#6b5e52' }}>Mark your digital calendar. These moments only happen IRL.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">

              {/* Event Card: Next House */}
              <div className="w-full aspect-square rounded-2xl overflow-hidden relative group" style={{ background: 'linear-gradient(135deg, #FF6B2B15 0%, #FFD16620 100%)', border: '1px solid #FF6B2B20' }}>
                <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide" style={{ background: '#FF6B2B20', color: '#FF6B2B', border: '1px solid #FF6B2B30' }}>UPCOMING</span>
                      <span className="text-xs" style={{ color: '#6b5e52' }}>April 2026</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-bold" style={{ fontFamily: 'var(--font-syne)', color: '#1a1a1a' }}>Next Soti House</h4>
                    <p className="text-sm" style={{ color: '#6b5e52' }}>Ireland, Spain or France</p>
                    <div className="mt-3">
                      <a href="https://tally.so/r/BzXWgN" target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-xs sm:text-sm font-bold rounded-full transition-all duration-200 inline-block" style={{ background: '#FF6B2B', color: '#FFF8F0' }}>
                        JOIN THE WAITLIST
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Card: Barcelona */}
              <div className="w-full aspect-square rounded-2xl overflow-hidden relative group" style={{ border: '1px solid #1a1a1a10' }}>
                <Image src="/events/barcelona.jpeg" alt="Barcelona, Spain" fill className="object-cover transition-transform duration-300 group-hover:scale-110" sizes="(min-width: 640px) 50vw, 100vw" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 via-50% to-black/70 flex flex-col justify-end p-5 sm:p-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-300 bg-emerald-500/20 border border-emerald-500/30">FINISHED</span>
                      <span className="text-xs text-white/60">Dec 15, 2025</span>
                    </div>
                    <h4 className="text-white text-lg sm:text-xl font-bold" style={{ fontFamily: 'var(--font-syne)' }}>Barcelona Winter Edition</h4>
                    <p className="text-white/70 text-sm">Barcelona, Spain</p>
                    <a href="https://www.notion.so/valeramarcos/Castellter-ol-Winter-House-28dbff6a5cda80109b9fcbbc2873c83f?source=copy_link" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-semibold" style={{ color: '#FFD166' }}>
                      VIEW EVENT &rarr;
                    </a>
                  </div>
                </div>
              </div>

              {/* Event Card: Italy */}
              <div className="w-full aspect-square rounded-2xl overflow-hidden relative group" style={{ border: '1px solid #1a1a1a10' }}>
                <Image src="/events/italia.jpg" alt="Taranto, Italy" fill className="object-cover transition-transform duration-300 group-hover:scale-110" sizes="(min-width: 640px) 50vw, 100vw" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 via-50% to-black/70 flex flex-col justify-end p-5 sm:p-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-300 bg-emerald-500/20 border border-emerald-500/30">FINISHED</span>
                      <span className="text-xs text-white/60">Sept 21, 2025</span>
                    </div>
                    <h4 className="text-white text-lg sm:text-xl font-bold" style={{ fontFamily: 'var(--font-syne)' }}>La Settimana: Great Minds</h4>
                    <p className="text-white/70 text-sm">Taranto, Italy</p>
                    <a href="https://www.notion.so/valeramarcos/Taranto-La-Settimana-1f6bff6a5cda8083a794dd49975cf9ce?source=copy_link" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-semibold" style={{ color: '#FFD166' }}>
                      VIEW EVENT &rarr;
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* SECTION: Schedule                              */}
        {/* ============================================= */}
        <section className="w-full py-8 sm:py-12">
          <div className="mx-auto w-full max-w-4xl px-6 sm:px-10">
            <div className="mb-8 text-center">
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2" style={{ fontFamily: 'var(--font-syne)', color: '#1a1a1a' }}>
                Last Schedule
              </h3>
              <p style={{ color: '#6b5e52' }}>Weekly program structure</p>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <div className="min-w-full rounded-xl overflow-hidden" style={{ border: '1px solid #1a1a1a10' }}>
                <table className="w-full table-fixed">
                  <thead>
                    <tr style={{ background: '#FF6B2B08', borderBottom: '1px solid #1a1a1a10' }}>
                      <th className="w-32 px-4 py-4 text-left text-sm font-semibold" style={{ color: '#1a1a1a' }}>Time</th>
                      <th className="px-4 py-4 text-center text-sm font-semibold" style={{ color: '#1a1a1a' }}>Mon</th>
                      <th className="px-4 py-4 text-center text-sm font-semibold" style={{ color: '#1a1a1a' }}>Tue</th>
                      <th className="px-4 py-4 text-center text-sm font-semibold" style={{ color: '#1a1a1a' }}>Wed</th>
                      <th className="px-4 py-4 text-center text-sm font-semibold" style={{ color: '#1a1a1a' }}>Thu</th>
                      <th className="px-4 py-4 text-center text-sm font-semibold" style={{ color: '#1a1a1a' }}>Fri</th>
                      <th className="px-4 py-4 text-center text-sm font-semibold" style={{ color: '#1a1a1a' }}>Sat</th>
                      <th className="px-4 py-4 text-center text-sm font-semibold" style={{ color: '#1a1a1a' }}>Sun</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ background: '#FF6B2B06', borderBottom: '1px solid #1a1a1a08' }}>
                      <td className="px-4 py-4 text-sm font-medium" style={{ color: '#1a1a1a', background: '#FF6B2B08' }}>09:00–13:00</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: '#6b5e52' }}>Check In</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: '#6b5e52' }}>Work Time</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: '#6b5e52' }}>Work Time</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: '#6b5e52' }}>Work Time</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: '#6b5e52' }}>Work Time</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: '#6b5e52' }}>Demo Day</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: '#6b5e52' }}>Morning activity</td>
                    </tr>
                    <tr style={{ background: '#FF8C4206', borderBottom: '1px solid #1a1a1a08' }}>
                      <td className="px-4 py-4 text-sm font-medium" style={{ color: '#1a1a1a', background: '#FF6B2B08' }}>13:00–15:00</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: '#6b5e52' }}>Lunch</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: '#6b5e52' }}>Lunch</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: '#6b5e52' }}>Lunch</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: '#6b5e52' }}>Lunch</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: '#6b5e52' }}>Lunch</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: '#6b5e52' }}>Public Event – Paella (60 Attendees)</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: '#6b5e52' }}>Lunch</td>
                    </tr>
                    <tr style={{ background: '#FFD16606', borderBottom: '1px solid #1a1a1a08' }}>
                      <td className="px-4 py-4 text-sm font-medium" style={{ color: '#1a1a1a', background: '#FF6B2B08' }}>15:00–18:00</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: '#6b5e52' }}>Work Time</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: '#6b5e52' }}>Work Time</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: '#6b5e52' }}>Work Time</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: '#6b5e52' }}>Work Time</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: '#6b5e52' }}>Work Time</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: '#6b5e52' }}>DJ + Drinks</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: '#6b5e52' }}>Reflect & Harvest</td>
                    </tr>
                    <tr style={{ background: '#FF6B2B04' }}>
                      <td className="px-4 py-4 text-sm font-medium" style={{ color: '#1a1a1a', background: '#FF6B2B08' }}>18:00+</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: '#6b5e52' }}>Intros & Goals</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: '#6b5e52' }}>Inspiration talk</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: '#6b5e52' }}>Network Afternoon</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: '#6b5e52' }}>Chef Dinner</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: '#6b5e52' }}>Demo Day</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: '#6b5e52' }}>DJ + Drinks</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: '#6b5e52' }}>Check out</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {[
                { day: 'Monday', slots: ['09:00–13:00 → Check In', '13:00–15:00 → Lunch', '15:00–18:00 → Work Time', '18:00+ → Intros & Goals'] },
                { day: 'Tuesday', slots: ['09:00–13:00 → Work Time', '13:00–15:00 → Lunch', '15:00–18:00 → Work Time', '18:00+ → Inspiration talk'] },
                { day: 'Wednesday', slots: ['09:00–13:00 → Work Time', '13:00–15:00 → Lunch', '15:00–18:00 → Work Time', '18:00+ → Network Afternoon'] },
                { day: 'Thursday', slots: ['09:00–13:00 → Work Time', '13:00–15:00 → Lunch', '15:00–18:00 → Work Time', '18:00+ → Chef Dinner'] },
                { day: 'Friday', slots: ['09:00–13:00 → Work Time', '13:00–15:00 → Lunch', '15:00–18:00 → Work Time', '18:00+ → Demo Day'] },
                { day: 'Saturday', slots: ['09:00–13:00 → Demo Day', '13:00–15:00 → Public Event – Paella', '15:00–18:00 → DJ + Drinks', '18:00+ → DJ + Drinks'] },
                { day: 'Sunday', slots: ['09:00–13:00 → Morning activity + Check out', '13:00–15:00 → Lunch', '15:00–18:00 → Reflect & Harvest', '18:00+ → Check out'] },
              ].map((d) => (
                <div key={d.day} className="rounded-xl p-4" style={{ background: '#FF6B2B06', border: '1px solid #FF6B2B15' }}>
                  <h4 className="font-bold text-base mb-3" style={{ fontFamily: 'var(--font-syne)', color: '#1a1a1a' }}>{d.day}</h4>
                  <div className="space-y-2 text-sm" style={{ color: '#6b5e52' }}>
                    {d.slots.map((slot, j) => {
                      const colors = ['#FF6B2B10', '#FF8C4210', '#FFD16610', '#FF6B2B08'];
                      return (
                        <div key={j} className="px-3 py-3 rounded-lg h-14 flex items-center" style={{ background: colors[j] }}>
                          {slot}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* SECTION: Led By (Team)                         */}
        {/* ============================================= */}
        <section className="w-full">
          <div className="mx-auto w-full max-w-2xl px-6 sm:px-10 py-16 sm:py-24">
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-center" style={{ fontFamily: 'var(--font-syne)', color: '#1a1a1a' }}>Led by</h3>
            <p className="mb-12 text-center text-base" style={{ color: '#6b5e52' }}>Meet the builders behind SOTI</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              {/* Marcos */}
              <div className="rounded-2xl p-6 transition-all hover:shadow-lg" style={{ background: '#ffffff', border: '1px solid #FF6B2B15' }}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden" style={{ boxShadow: '0 0 0 3px #FF6B2B30' }}>
                    <Image src="/marcos.jpeg" alt="Marcos Valera" fill className="object-cover" sizes="96px" />
                  </div>
                  <h4 className="text-lg font-bold" style={{ fontFamily: 'var(--font-syne)', color: '#1a1a1a' }}>Marcos Valera</h4>
                  <div className="flex gap-4 items-center">
                    <a href="https://www.youtube.com/@MarcosValera" target="_blank" rel="noopener noreferrer" className="text-sm transition-colors" style={{ color: '#6b5e52' }}>YT</a>
                    <a href="https://x.com/_MarcosValera" target="_blank" rel="noopener noreferrer" className="text-sm transition-colors" style={{ color: '#6b5e52' }}>X</a>
                    <a href="https://www.linkedin.com/in/valeramarcos/" target="_blank" rel="noopener noreferrer" className="text-sm transition-colors" style={{ color: '#6b5e52' }}>LI</a>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-dm-mono)', color: '#6b5e52' }}>GTM, community. 10k youtube + 25k linkedin. Startups and builders audience.</p>
                </div>
              </div>

              {/* Juan Pablo */}
              <div className="rounded-2xl p-6 transition-all hover:shadow-lg" style={{ background: '#ffffff', border: '1px solid #FF6B2B15' }}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden" style={{ boxShadow: '0 0 0 3px #FF6B2B30' }}>
                    <Image src="/juan-pablo.jpeg" alt="Juan Pablo" fill className="object-cover" sizes="96px" />
                  </div>
                  <h4 className="text-lg font-bold" style={{ fontFamily: 'var(--font-syne)', color: '#1a1a1a' }}>Juan Pablo</h4>
                  <div className="flex gap-4 items-center">
                    <a href="https://x.com/jpgallegoar" target="_blank" rel="noopener noreferrer" className="text-sm transition-colors" style={{ color: '#6b5e52' }}>X</a>
                    <a href="https://github.com/jpgallegoar" target="_blank" rel="noopener noreferrer" className="text-sm transition-colors" style={{ color: '#6b5e52' }}>GH</a>
                    <a href="https://www.linkedin.com/in/jpgallegoar/" target="_blank" rel="noopener noreferrer" className="text-sm transition-colors" style={{ color: '#6b5e52' }}>LI</a>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-dm-mono)', color: '#6b5e52' }}>Researcher and CTO. how research AI works</p>
                </div>
              </div>

              {/* Dani */}
              <div className="rounded-2xl p-6 transition-all hover:shadow-lg" style={{ background: '#ffffff', border: '1px solid #FF6B2B15' }}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden" style={{ boxShadow: '0 0 0 3px #FF6B2B30' }}>
                    <Image src="/dani.png" alt="Dani Diestre" fill className="object-cover" sizes="96px" />
                  </div>
                  <h4 className="text-lg font-bold" style={{ fontFamily: 'var(--font-syne)', color: '#1a1a1a' }}>Dani Diestre</h4>
                  <div className="flex gap-4 items-center">
                    <a href="https://www.youtube.com/@danidiestre" target="_blank" rel="noopener noreferrer" className="text-sm transition-colors" style={{ color: '#6b5e52' }}>YT</a>
                    <a href="https://github.com/danidiestre" target="_blank" rel="noopener noreferrer" className="text-sm transition-colors" style={{ color: '#6b5e52' }}>GH</a>
                    <a href="https://www.linkedin.com/in/danidiestre/" target="_blank" rel="noopener noreferrer" className="text-sm transition-colors" style={{ color: '#6b5e52' }}>LI</a>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-dm-mono)', color: '#6b5e52' }}>Co-Founder Autentic, Youtube Creator</p>
                </div>
              </div>

              {/* Aniol */}
              <div className="rounded-2xl p-6 transition-all hover:shadow-lg" style={{ background: '#ffffff', border: '1px solid #FF6B2B15' }}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden" style={{ boxShadow: '0 0 0 3px #FF6B2B30' }}>
                    <Image src="/aniol.jpeg" alt="Aniol Carreras" fill className="object-cover" sizes="96px" />
                  </div>
                  <h4 className="text-lg font-bold" style={{ fontFamily: 'var(--font-syne)', color: '#1a1a1a' }}>Aniol Carreras</h4>
                  <div className="flex gap-4 items-center">
                    <a href="https://x.com/carrerasaniol" target="_blank" rel="noopener noreferrer" className="text-sm transition-colors" style={{ color: '#6b5e52' }}>X</a>
                    <a href="https://www.linkedin.com/in/aniolcarreras" target="_blank" rel="noopener noreferrer" className="text-sm transition-colors" style={{ color: '#6b5e52' }}>LI</a>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-dm-mono)', color: '#6b5e52' }}>COO at The Hero Camp (Product School Leader in Spain) , Events Creator - Leading Product Fest (Madrid, 3 editions)</p>
                </div>
              </div>

              {/* Saura */}
              <div className="rounded-2xl p-6 transition-all hover:shadow-lg" style={{ background: '#ffffff', border: '1px solid #FF6B2B15' }}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden" style={{ boxShadow: '0 0 0 3px #FF6B2B30' }}>
                    <Image src="/saura.jpeg" alt="Jose Saura" fill className="object-cover" sizes="96px" />
                  </div>
                  <h4 className="text-lg font-bold" style={{ fontFamily: 'var(--font-syne)', color: '#1a1a1a' }}>Jose Saura</h4>
                  <div className="flex gap-4 items-center">
                    <a href="https://x.com/iamsaura_" target="_blank" rel="noopener noreferrer" className="text-sm transition-colors" style={{ color: '#6b5e52' }}>X</a>
                    <a href="https://github.com/eddsaura" target="_blank" rel="noopener noreferrer" className="text-sm transition-colors" style={{ color: '#6b5e52' }}>GH</a>
                    <a href="https://www.linkedin.com/in/jesauraoller/" target="_blank" rel="noopener noreferrer" className="text-sm transition-colors" style={{ color: '#6b5e52' }}>LI</a>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-dm-mono)', color: '#6b5e52' }}>Indiehacker - Paellas CEO - Starting on / IG / Tiktok - Skool community $1000MRR - DJ</p>
                </div>
              </div>

              {/* Adrian */}
              <div className="rounded-2xl p-6 transition-all hover:shadow-lg" style={{ background: '#ffffff', border: '1px solid #FF6B2B15' }}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden" style={{ boxShadow: '0 0 0 3px #FF6B2B30' }}>
                    <Image src="/adrian.png" alt="Adrian Valera" fill className="object-cover" sizes="96px" />
                  </div>
                  <h4 className="text-lg font-bold" style={{ fontFamily: 'var(--font-syne)', color: '#1a1a1a' }}>Adrian Valera</h4>
                  <div className="flex gap-4 items-center">
                    <a href="https://github.com/adrixo" target="_blank" rel="noopener noreferrer" className="text-sm transition-colors" style={{ color: '#6b5e52' }}>GH</a>
                    <a href="http://linkedin.com/in/adrian-valera" target="_blank" rel="noopener noreferrer" className="text-sm transition-colors" style={{ color: '#6b5e52' }}>LI</a>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-dm-mono)', color: '#6b5e52' }}>Engineer & Researcher. Building communities with love.</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* SECTION: Final CTA                             */}
        {/* ============================================= */}
        <section className="w-full">
          <div className="mx-auto w-full max-w-2xl px-6 sm:px-10 py-20 sm:py-28 text-center">
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-syne)', color: '#1a1a1a' }}>Build something that matters</h3>
            <p className="mt-4 text-lg" style={{ color: '#6b5e52' }}>Not another community.</p>
            <p style={{ color: '#6b5e52' }}>Join the new generation of builders now</p>
            <div className="mt-8">
              <div className="relative group inline-block">
                <div className="absolute inset-0 -m-2 rounded-full hidden sm:block opacity-40 filter blur-lg pointer-events-none transition-all duration-300 ease-out group-hover:opacity-60 group-hover:blur-xl group-hover:-m-3" style={{ background: '#FF6B2B' }} />
                <a href="https://tally.so/r/BzXWgN" target="_blank" rel="noopener noreferrer" className="relative z-10 px-7 py-3 text-sm font-bold rounded-full transition-all duration-200" style={{ background: '#FF6B2B', color: '#FFF8F0' }}>Apply to join the family</a>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* SECTION: Footer                                */}
        {/* ============================================= */}
        <footer className="w-full" style={{ borderTop: '1px solid #1a1a1a10' }}>
          <div className="mx-auto w-full max-w-2xl px-6 sm:px-10 py-12 sm:py-16">
            <div className="space-y-8">
              <div>
                <h4 className="text-lg sm:text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-syne)', color: '#1a1a1a' }}>SOTI Family</h4>
                <p className="mr-12 mt-2 text-sm" style={{ fontFamily: 'var(--font-dm-mono)', color: '#6b5e52' }}>A global community of digital natives who build, create, and connect beyond the web.</p>
                <div className="flex mt-4">
                  <div className="relative w-40 h-14">
                    <Image src="/logo.png" alt="SOTI Isotope" fill className="object-contain" priority={false} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <h5 className="text-xs tracking-wider mb-3" style={{ color: '#FF6B2B' }}>QUICK_LINKS</h5>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="/#1" className="transition-colors hover:underline" style={{ color: '#6b5e52' }}>&gt; Manifesto</Link></li>
                    <li><Link href="/#2" className="transition-colors hover:underline" style={{ color: '#6b5e52' }}>&gt; Houses</Link></li>
                    <li><a href="https://tally.so/r/BzXWgN" target="_blank" rel="noopener noreferrer" className="transition-colors hover:underline" style={{ color: '#6b5e52' }}>&gt; Apply to become a member</a></li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-xs tracking-wider mb-3" style={{ color: '#FF6B2B' }}>FIND_US</h5>
                  <p className="text-sm mt-2" style={{ color: '#6b5e52' }}>Only in real life.<br />We don&apos;t do social media.<br />We do moments that matter.</p>
                </div>
              </div>
              <div className="pt-6 text-xs" style={{ color: '#6b5e5240' }}>&copy; {new Date().getFullYear()} SOTI</div>
            </div>
          </div>
        </footer>

      </div>

    </main>
  );
}
