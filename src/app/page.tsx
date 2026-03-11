"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { RevealText } from "@/components/ui/manifesto";
import { MiniNavbar } from "@/components/ui/sign-in-flow-1";
import { TALLY_URL } from "@/lib/constants";

const HOUSE_COLOR = "#1a1a1a";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const heroWrapperRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  // Zone 2 transition refs
  const zone2TriggerRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const sunCanvasRef = useRef<HTMLCanvasElement>(null);
  const zone2ContentRef = useRef<HTMLDivElement>(null);
  const zone2Fired = useRef(false);
  const sunAnimId = useRef<number>(0);
  const sunCleanup = useRef<(() => void) | null>(null);

  // Rain config — sliders update this ref, animation reads it
  const rainCfg = useRef({ speed: 18, density: 60, length: 40, width: 1.5, splash: 100 });
  const [rainUI, setRainUI] = useState({ speed: 18, density: 60, length: 40, width: 1.5, splash: 100 });
  const updateRain = (key: string, val: number) => {
    (rainCfg.current as Record<string, number>)[key] = val;
    setRainUI(prev => ({ ...prev, [key]: val }));
  };



  // Mobile/Safari detection for disabling expensive effects
  const [isMobile, setIsMobile] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    const ua = navigator.userAgent;
    setIsSafari(/^((?!chrome|android).)*safari/i.test(ua));
  }, []);

  // API data for builder/seat counts
  const valenciaCount = 7;
  const [carouselIdx, setCarouselIdx] = useState(0);
  const carouselImages = ['/landing-house.jpg', '/landing-people.png', '/working.png'];
  const [totalSeats, setTotalSeats] = useState(0);
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    fetch('/api/count')
      .then(res => res.json())
      .then(data => {
        // valenciaCount hardcoded to 7
        setTotalSeats(data.total ?? 0);
      })
      .catch(() => {});
  }, []);

  const heroTitle = (
    <>
      They called it a phase.<br />
      <span style={{ color: '#9a9aaa' }}>It&apos;s been two years.</span>
    </>
  );
  const heroSubtitle = "Still here. Still building. Still proving no one wrong but yourself.";

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

    rainCfg.current.density = 60;

    // Thunder state
    let thunderAlpha = 0;
    let thunderFlashes = 0;
    let nextThunder = performance.now() + (5000 + Math.random() * 3000);

    // Pre-allocated particle pools
    const MAX_RAIN = 600;
    const MAX_SPLASH = 160;
    const SPLASH_PER_HIT = 3;
    const SPLASH_DECAY = 0.04;

    const rainX = new Float32Array(MAX_RAIN);
    const rainY = new Float32Array(MAX_RAIN);
    const rainVY = new Float32Array(MAX_RAIN);
    const rainL = new Float32Array(MAX_RAIN);
    let rainCount = 0;

    const splX = new Float32Array(MAX_SPLASH);
    const splY = new Float32Array(MAX_SPLASH);
    const splVX = new Float32Array(MAX_SPLASH);
    const splVY = new Float32Array(MAX_SPLASH);
    const splLife = new Float32Array(MAX_SPLASH);
    const splSize = new Float32Array(MAX_SPLASH);
    let splCount = 0;
    let lastTime = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function updateLayout() {
      const section = canvas!.parentElement!;
      const sr = section.getBoundingClientRect();
      w = sr.width;
      h = sr.height;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = w + 'px';
      canvas!.style.height = h + 'px';
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const br = box!.getBoundingClientRect();
      boxTop = br.top - sr.top;
      boxLeft = br.left - sr.left;
      boxRight = br.right - sr.left;
      centerX = (boxLeft + boxRight) / 2;
      roofBaseY = boxTop + ROOF_H;
    }

    // Inline roof Y — avoid function call overhead
    function getRoofY(x: number): number {
      if (x < boxLeft || x > boxRight) return Infinity;
      if (x <= centerX) {
        return roofBaseY - ((x - boxLeft) / (centerX - boxLeft)) * ROOF_H;
      }
      return boxTop + ((x - centerX) / (boxRight - centerX)) * ROOF_H;
    }

    const observer = new ResizeObserver(updateLayout);
    observer.observe(canvas!.parentElement!);

    function animate(timestamp: number) {
      const c = ctx!;
      c.clearRect(0, 0, w, h);

      // Delta time normalized to 60fps (1.0 at 60fps, 2.0 at 30fps, etc.)
      const dt60 = lastTime > 0 ? Math.min((timestamp - lastTime) / 16.667, 3) : 1;
      lastTime = timestamp;

      // Skip rendering if layout isn't ready
      if (w === 0 || h === 0) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      // Thunder logic
      const now = performance.now();
      if (thunderFlashes === 0 && now >= nextThunder) {
        thunderFlashes = Math.random() < 0.5 ? 1 : 2;
        thunderAlpha = 0.9;
      }
      if (thunderAlpha > 0) {
        c.fillStyle = `rgba(255,255,255,${thunderAlpha})`;
        c.fillRect(0, 0, w, h);
        thunderAlpha -= 0.06 * dt60;
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

      // Spawn rain
      const cfg = rainCfg.current;
      const spawnCount = Math.max(1, Math.ceil(cfg.density / 20));
      const spawnProb = Math.min((cfg.density / 100) * dt60, 1);
      for (let k = 0; k < spawnCount; k++) {
        if (rainCount < MAX_RAIN && Math.random() < spawnProb) {
          const i = rainCount++;
          rainX[i] = Math.random() * w;
          rainY[i] = -50;
          rainVY[i] = cfg.speed + Math.random() * (cfg.speed * 0.4);
          rainL[i] = cfg.length + Math.random() * (cfg.length * 2);
        }
      }

      // Update + draw all rain in ONE batched path
      c.strokeStyle = "#aec2e0";
      c.lineWidth = cfg.width;
      c.lineCap = "round";
      c.beginPath();
      const sf = cfg.splash / 100;
      let i = 0;
      while (i < rainCount) {
        const move = rainVY[i] * dt60;
        rainY[i] += move;
        const rx = rainX[i], ry = rainY[i];

        // Add line to batch
        c.moveTo(rx, ry);
        c.lineTo(rx, ry - rainL[i]);

        // Check roof collision
        const surfaceY = getRoofY(rx);
        let remove = false;
        if (surfaceY < Infinity && ry >= surfaceY && ry - move <= surfaceY) {
          // Spawn splashes
          const isLeft = rx <= centerX;
          for (let k = 0; k < SPLASH_PER_HIT && splCount < MAX_SPLASH; k++) {
            const j = splCount++;
            splX[j] = rx;
            splY[j] = surfaceY;
            splVX[j] = isLeft ? -(Math.random() * 4 * sf + 1) : Math.random() * 4 * sf + 1;
            splVY[j] = -(Math.random() * 3 * sf + 0.5);
            splLife[j] = 1;
            splSize[j] = 3 + Math.random() * 4;
          }
          remove = true;
        } else if (ry > h) {
          remove = true;
        }

        if (remove) {
          // Swap with last element (O(1) removal)
          const last = --rainCount;
          rainX[i] = rainX[last];
          rainY[i] = rainY[last];
          rainVY[i] = rainVY[last];
          rainL[i] = rainL[last];
        } else {
          i++;
        }
      }
      c.stroke();

      // Update + draw all splashes as simple rects in ONE batch
      c.fillStyle = "#aec2e0";
      c.beginPath();
      let si = 0;
      while (si < splCount) {
        splX[si] += splVX[si] * dt60;
        splY[si] += splVY[si] * dt60;
        splVY[si] += 0.25 * dt60;

        splLife[si] -= SPLASH_DECAY * dt60;
        if (splLife[si] <= 0) {
          const last = --splCount;
          splX[si] = splX[last];
          splY[si] = splY[last];
          splVX[si] = splVX[last];
          splVY[si] = splVY[last];
          splLife[si] = splLife[last];
          splSize[si] = splSize[last];
        } else {
          // Draw as rect (much cheaper than arc)
          const sz = splSize[si] * splLife[si];
          c.rect(splX[si] - sz * 0.5, splY[si] - sz * 0.5, sz, sz);
          si++;
        }
      }
      c.fill();

      animationId = requestAnimationFrame(animate);
    }

    updateLayout();
    window.addEventListener("resize", updateLayout);
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", updateLayout);
      observer.disconnect();
      cancelAnimationFrame(animationId);
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

      // Sun position — pinned at the top center of canvas
      const sunX = W * 0.5;
      const sunY = 0;

      // Flare axis: ~20° from horizontal, going lower-right
      const axisAngle = 20 * Math.PI / 180;
      const axisDist = W * 0.9;

      // Pre-compute random ray data (once, not per frame)
      const primaryRays = Array.from({ length: 12 }, (_, i) => ({
        baseAngle: (i / 12) * Math.PI * 2 + (Math.random() - 0.5) * 0.15,
        baseLength: 180 + Math.random() * 120,
        baseWidth: 1.5 + Math.random() * 3.5,
        phase1: Math.random() * Math.PI * 2,
        phase2: Math.random() * Math.PI * 2,
        brightness: 0.5 + Math.random() * 0.5,
      }));

      const secondaryRays = Array.from({ length: 20 }, (_, i) => ({
        baseAngle: (i / 20) * Math.PI * 2 + (Math.random() - 0.5) * 0.2,
        baseLength: 90 + Math.random() * 80,
        phase: Math.random() * Math.PI * 2,
      }));

      // 6 diffraction spikes (6-blade aperture simulation)
      const spikeAngles = Array.from({ length: 6 }, (_, i) => (i / 6) * Math.PI + 0.26);

      // Chromatic lens flare elements along the axis
      const flareElements: { dist: number; size: number; type: 'filled' | 'ring' | 'chromatic'; alpha: number; color: number[] }[] = [
        { dist: 0.25, size: 22, type: 'chromatic', alpha: 0.12, color: [255, 200, 120] },
        { dist: 0.4,  size: 40, type: 'ring',      alpha: 0.06, color: [200, 220, 255] },
        { dist: 0.55, size: 14, type: 'filled',     alpha: 0.10, color: [180, 220, 255] },
        { dist: 0.7,  size: 55, type: 'chromatic', alpha: 0.08, color: [255, 220, 160] },
        { dist: 0.9,  size: 28, type: 'ring',      alpha: 0.05, color: [220, 200, 255] },
        { dist: 1.1,  size: 70, type: 'filled',     alpha: 0.04, color: [200, 180, 255] },
        { dist: 1.3,  size: 18, type: 'chromatic', alpha: 0.10, color: [120, 220, 180] },
        { dist: 1.5,  size: 45, type: 'ring',      alpha: 0.04, color: [180, 200, 255] },
        { dist: 1.8,  size: 30, type: 'filled',     alpha: 0.06, color: [120, 255, 180] },
        { dist: 2.1,  size: 80, type: 'chromatic', alpha: 0.04, color: [200, 180, 255] },
      ];

      // Hexagonal aperture ghosts
      const hexGhosts = [
        { dist: 0.5,  size: 32, filled: true,  rotMul: 0.2 },
        { dist: 1.05, size: 50, filled: false, rotMul: -0.15 },
        { dist: 1.6,  size: 22, filled: true,  rotMul: 0.3 },
      ];

      // Iris rainbow ring spectral colors
      const irisColors = [
        [180, 100, 255], // violet
        [100, 100, 255], // blue
        [80, 200, 120],  // green
        [255, 255, 100], // yellow
        [255, 180, 80],  // orange
        [255, 100, 80],  // red
      ];

      let startTime = 0;
      const globalAlpha = 1;

      // Sun stays fixed at center (no mouse drift)

      // Hex path helper
      function drawHexPath(r: number) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          const hx = Math.cos(a) * r;
          const hy = Math.sin(a) * r;
          if (i === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
      }

      function draw(time: number) {
        if (!startTime) startTime = time;
        const elapsed = time - startTime;
        ctx.clearRect(0, 0, W, H);
        ctx.globalAlpha = globalAlpha;
        ctx.lineCap = 'round';

        // Fixed sun position (no mouse drift)
        const sx = sunX;
        const sy = sunY;

        const rotation = elapsed * 0.00015;

        // ── LAYER 1: Screen-space haze ──
        ctx.globalCompositeOperation = 'source-over';
        const hazeR = Math.max(W, H) * 0.8;
        const hazeAlpha = 0.06 * (0.9 + 0.1 * Math.sin(elapsed * 0.0004));
        const hazeGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, hazeR);
        hazeGrad.addColorStop(0, `rgba(255,240,200,${hazeAlpha})`);
        hazeGrad.addColorStop(0.3, `rgba(255,220,160,${hazeAlpha * 0.5})`);
        hazeGrad.addColorStop(0.7, `rgba(255,200,120,${hazeAlpha * 0.17})`);
        hazeGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = hazeGrad;
        ctx.fillRect(sx - hazeR, sy - hazeR, hazeR * 2, hazeR * 2);

        // Switch to additive blending for all light
        ctx.globalCompositeOperation = 'lighter';

        // ── LAYER 2: Multi-layer glow (3 shells) ──
        // Outer halo
        const outerR = 450 + 15 * Math.sin(elapsed * 0.0003);
        const outerGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, outerR);
        outerGrad.addColorStop(0, 'rgba(255,200,120,0.15)');
        outerGrad.addColorStop(0.15, 'rgba(255,180,80,0.08)');
        outerGrad.addColorStop(0.4, 'rgba(255,140,50,0.03)');
        outerGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = outerGrad;
        ctx.fillRect(sx - outerR, sy - outerR, outerR * 2, outerR * 2);

        // Mid glow
        const midR = 200 + 8 * Math.sin(elapsed * 0.0005 + 1.0);
        const midGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, midR);
        midGrad.addColorStop(0, 'rgba(255,250,230,0.6)');
        midGrad.addColorStop(0.1, 'rgba(255,240,200,0.4)');
        midGrad.addColorStop(0.3, 'rgba(255,220,150,0.15)');
        midGrad.addColorStop(0.6, 'rgba(255,180,80,0.04)');
        midGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = midGrad;
        ctx.fillRect(sx - midR, sy - midR, midR * 2, midR * 2);

        // Inner hot glow
        const hotR = 80 + 3 * Math.sin(elapsed * 0.0007 + 2.0);
        const hotGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, hotR);
        hotGrad.addColorStop(0, 'rgba(255,255,255,1)');
        hotGrad.addColorStop(0.15, 'rgba(255,255,245,0.9)');
        hotGrad.addColorStop(0.4, 'rgba(255,250,220,0.5)');
        hotGrad.addColorStop(0.7, 'rgba(255,240,180,0.15)');
        hotGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = hotGrad;
        ctx.fillRect(sx - hotR, sy - hotR, hotR * 2, hotR * 2);

        // ── LAYER 3: Non-uniform primary rays ──
        for (const ray of primaryRays) {
          const angle = ray.baseAngle + rotation * 0.8
            + Math.sin(elapsed * 0.001 + ray.phase1) * 0.02;
          const length = ray.baseLength
            + Math.sin(elapsed * 0.002 + ray.phase1) * 40
            + Math.sin(elapsed * 0.005 + ray.phase2) * 15;
          const w = ray.baseWidth * (0.85 + 0.15 * Math.sin(elapsed * 0.003 + ray.phase2));
          const b = ray.brightness;

          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(angle);
          const rg = ctx.createLinearGradient(0, 0, length, 0);
          rg.addColorStop(0, `rgba(255,255,255,${0.7 * b})`);
          rg.addColorStop(0.15, `rgba(255,248,220,${0.4 * b})`);
          rg.addColorStop(0.4, `rgba(255,220,150,${0.12 * b})`);
          rg.addColorStop(1, 'transparent');
          ctx.strokeStyle = rg;
          ctx.lineWidth = w;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(length, 0);
          ctx.stroke();
          ctx.restore();
        }

        // ── LAYER 4: Secondary shimmer rays ──
        for (const ray of secondaryRays) {
          const angle = ray.baseAngle - rotation * 0.4;
          const length = ray.baseLength + Math.sin(elapsed * 0.0025 + ray.phase) * 25;
          const w = 0.5 + Math.sin(elapsed * 0.004 + ray.phase) * 0.4;

          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(angle);
          const rg = ctx.createLinearGradient(0, 0, length, 0);
          rg.addColorStop(0, 'rgba(255,230,180,0.3)');
          rg.addColorStop(0.3, 'rgba(255,200,120,0.1)');
          rg.addColorStop(1, 'transparent');
          ctx.strokeStyle = rg;
          ctx.lineWidth = w;
          ctx.beginPath();
          ctx.moveTo(20, 0);
          ctx.lineTo(length, 0);
          ctx.stroke();
          ctx.restore();
        }

        // ── LAYER 5: Diffraction spikes ──
        for (let i = 0; i < spikeAngles.length; i++) {
          const spikeAngle = spikeAngles[i] + elapsed * 0.00003;
          const spikeLen = 500 + Math.sin(elapsed * 0.0006 + i) * 40;

          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(spikeAngle);

          // Draw spike in both directions
          const sg = ctx.createLinearGradient(-spikeLen, 0, spikeLen, 0);
          sg.addColorStop(0, 'transparent');
          sg.addColorStop(0.2, 'rgba(255,230,180,0.08)');
          sg.addColorStop(0.45, 'rgba(255,250,230,0.3)');
          sg.addColorStop(0.5, 'rgba(255,255,255,0.5)');
          sg.addColorStop(0.55, 'rgba(255,250,230,0.3)');
          sg.addColorStop(0.8, 'rgba(255,230,180,0.08)');
          sg.addColorStop(1, 'transparent');
          ctx.strokeStyle = sg;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-spikeLen, 0);
          ctx.lineTo(spikeLen, 0);
          ctx.stroke();
          ctx.restore();
        }

        // ── LAYER 6: Anamorphic streak — tilted ~20° right ──
        const streakW = W * 1.2;
        const streakH = 3 + 2.5 * Math.sin(elapsed * 0.0008);
        const streakAlpha = 0.85 + 0.15 * Math.sin(elapsed * 0.0006);
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(20 * Math.PI / 180);
        const sg2 = ctx.createLinearGradient(-streakW / 2, 0, streakW / 2, 0);
        sg2.addColorStop(0, 'transparent');
        sg2.addColorStop(0.15, `rgba(200,220,255,${0.03 * streakAlpha})`);
        sg2.addColorStop(0.35, `rgba(255,240,220,${0.1 * streakAlpha})`);
        sg2.addColorStop(0.45, `rgba(255,255,255,${0.25 * streakAlpha})`);
        sg2.addColorStop(0.5, `rgba(255,255,255,${0.4 * streakAlpha})`);
        sg2.addColorStop(0.55, `rgba(255,255,255,${0.25 * streakAlpha})`);
        sg2.addColorStop(0.65, `rgba(255,240,220,${0.1 * streakAlpha})`);
        sg2.addColorStop(0.85, `rgba(200,220,255,${0.03 * streakAlpha})`);
        sg2.addColorStop(1, 'transparent');
        ctx.fillStyle = sg2;
        ctx.fillRect(-streakW / 2, -streakH, streakW, streakH * 2);
        ctx.restore();

        // ── LAYER 7: Bright core disc ──
        const coreDiscR = 35;
        const cdGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, coreDiscR);
        cdGrad.addColorStop(0, 'rgba(255,255,255,1)');
        cdGrad.addColorStop(0.3, 'rgba(255,255,250,0.95)');
        cdGrad.addColorStop(0.6, 'rgba(255,255,240,0.5)');
        cdGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = cdGrad;
        ctx.fillRect(sx - coreDiscR, sy - coreDiscR, coreDiscR * 2, coreDiscR * 2);

        // ── LAYER 8: Iris rainbow ring ──
        const irisBaseR = 140 + 5 * Math.sin(elapsed * 0.0005);
        const irisAlpha = 0.7 + 0.3 * Math.sin(elapsed * 0.0003 + 1.5);
        for (let i = 0; i < irisColors.length; i++) {
          const [cr, cg, cb] = irisColors[i];
          const a = [0.04, 0.05, 0.05, 0.04, 0.04, 0.03][i] * irisAlpha;
          ctx.beginPath();
          ctx.arc(sx, sy, irisBaseR - 2.5 + i, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${a})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // ── LAYER 9: Chromatic lens flares ──
        const cosA = Math.cos(axisAngle);
        const sinA = Math.sin(axisAngle);

        for (const f of flareElements) {
          const fx = sx + cosA * axisDist * f.dist;
          const fy = sy + sinA * axisDist * f.dist;

          // Skip if off screen
          if (fx < -f.size * 2 || fx > W + f.size * 2 || fy < -f.size * 2 || fy > H + f.size * 2) continue;

          const pulse = 1 + Math.sin(elapsed * 0.002 + f.dist * 8) * 0.1;
          const r = f.size * pulse;

          if (f.type === 'filled') {
            const fg = ctx.createRadialGradient(fx, fy, 0, fx, fy, r);
            fg.addColorStop(0, `rgba(${f.color[0]},${f.color[1]},${f.color[2]},${f.alpha})`);
            fg.addColorStop(0.6, `rgba(${f.color[0]},${f.color[1]},${f.color[2]},${f.alpha * 0.3})`);
            fg.addColorStop(1, 'transparent');
            ctx.fillStyle = fg;
            ctx.beginPath();
            ctx.arc(fx, fy, r, 0, Math.PI * 2);
            ctx.fill();
          } else if (f.type === 'ring') {
            ctx.beginPath();
            ctx.arc(fx, fy, r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${f.color[0]},${f.color[1]},${f.color[2]},${f.alpha})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          } else {
            // Chromatic: 3 RGB-separated circles
            const offset = 3;
            // Red channel — offset backward along axis
            ctx.beginPath();
            ctx.arc(fx - cosA * offset, fy - sinA * offset, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,80,60,${f.alpha})`;
            ctx.fill();
            // Green channel — center
            ctx.beginPath();
            ctx.arc(fx, fy, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(80,255,120,${f.alpha * 0.8})`;
            ctx.fill();
            // Blue channel — offset forward along axis
            ctx.beginPath();
            ctx.arc(fx + cosA * offset, fy + sinA * offset, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(80,120,255,${f.alpha})`;
            ctx.fill();
          }
        }

        // ── LAYER 10: Hexagonal aperture ghosts ──
        for (const hex of hexGhosts) {
          const hx = sx + cosA * axisDist * hex.dist;
          const hy = sy + sinA * axisDist * hex.dist;

          if (hx < -hex.size * 2 || hx > W + hex.size * 2 || hy < -hex.size * 2 || hy > H + hex.size * 2) continue;

          const hPulse = hex.size * (1 + Math.sin(elapsed * 0.0015 + hex.dist * 5) * 0.08);

          ctx.save();
          ctx.translate(hx, hy);
          ctx.rotate(rotation * hex.rotMul);

          if (hex.filled) {
            // Filled with radial gradient
            const hg = ctx.createRadialGradient(0, 0, 0, 0, 0, hPulse);
            hg.addColorStop(0, 'rgba(255,240,200,0.08)');
            hg.addColorStop(1, 'transparent');
            drawHexPath(hPulse);
            ctx.fillStyle = hg;
            ctx.fill();
          }

          // Chromatic fringe: 3 slightly offset outlines
          const fringeColors = ['rgba(255,100,80,0.06)', 'rgba(80,255,120,0.05)', 'rgba(80,100,255,0.06)'];
          for (let fi = 0; fi < 3; fi++) {
            drawHexPath(hPulse - 1 + fi);
            ctx.strokeStyle = fringeColors[fi];
            ctx.lineWidth = 1;
            ctx.stroke();
          }

          ctx.restore();
        }

        // ── LAYER 11: Innermost core overburn ──
        ctx.globalCompositeOperation = 'source-over';
        const burnR = 15;
        const burnGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, burnR);
        burnGrad.addColorStop(0, 'rgba(255,255,255,1)');
        burnGrad.addColorStop(0.5, 'rgba(255,255,255,0.8)');
        burnGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = burnGrad;
        ctx.fillRect(sx - burnR, sy - burnR, burnR * 2, burnR * 2);

        sunAnimId.current = requestAnimationFrame(draw);
      }

      sunAnimId.current = requestAnimationFrame(draw);
      sunCleanup.current = null;
    }


    // Guard: prevent exit observer from resetting during animation
    let animGuard = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (zone2Fired.current) return;
        zone2Fired.current = true;
        animGuard = true;

        // Lock scroll — use position:fixed trick for Safari compatibility
        const section = content.closest('section');
        const targetScrollY = section
          ? section.getBoundingClientRect().top + window.scrollY
          : window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${targetScrollY}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';

        // t=0: bright flash ON + start sun canvas
        flash.style.transition = 'opacity 0.12s ease-in';
        flash.style.opacity = '1';
        sunCanvas.style.opacity = '1';
        startSunAnimation(sunCanvas);

        // t=150ms: flash fades
        setTimeout(() => {
          flash.style.transition = 'opacity 0.5s ease-out';
          flash.style.opacity = '0';
        }, 150);

        // t=5s: sun fades out permanently
        setTimeout(() => {
          sunCanvas.style.transition = 'opacity 1s ease-out';
          sunCanvas.style.opacity = '0';
          setShowNav(true);
          setTimeout(() => {
            cancelAnimationFrame(sunAnimId.current);
            sunCleanup.current?.();
          }, 1000);
        }, 3000);

        // t=350ms: reveal all content with a single 0.5s fade
        setTimeout(() => {
          const children = content.children;
          for (let i = 0; i < children.length; i++) {
            const child = children[i] as HTMLElement;
            child.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
          }
        }, 350);

        // Unlock scroll after animation completes
        setTimeout(() => {
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.left = '';
          document.body.style.right = '';
          document.body.style.width = '';
          document.body.style.overflow = '';
          window.scrollTo({ top: targetScrollY, behavior: 'instant' as ScrollBehavior });
        }, 1400);

        // Allow exit observer to work after animation settles
        setTimeout(() => {
          animGuard = false;
        }, 2500);
      },
      { threshold: 0.15 }
    );

    observer.observe(trigger);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(sunAnimId.current);
      sunCleanup.current?.();
    };
  }, []);

  return (
    <main className="overflow-x-hidden" style={{ background: '#0a0a0c' }}>

      {/* Floating Navbar — fades in after sun disappears */}
      <div
        className="transition-opacity duration-1000 ease-in-out"
        style={{ opacity: showNav ? 1 : 0, pointerEvents: showNav ? 'auto' : 'none' }}
      >
        <MiniNavbar />
      </div>

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
      <div ref={heroWrapperRef} className="relative z-10" style={{ height: '100vh', background: '#0a0a0c' }}>
      <section className="sticky top-0 relative flex flex-col h-screen overflow-hidden" style={{ background: '#0a0a0c' }}>
        {/* Rain canvas with goo filter */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          style={isMobile || isSafari ? undefined : { filter: 'url(#goo)' }}
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
                  WebkitClipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                  background: HOUSE_COLOR,
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
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
                  <Image src="/logo-white-simple.png" alt="SOTI" fill className="object-contain" />
                </div>
              </div>
            </div>

            {/* House Body */}
            <div className="border-x border-b backdrop-blur-sm" style={{ background: HOUSE_COLOR, borderColor: '#3a3a48' }}>
              <div className="px-6 pt-3 sm:pt-6 pb-2 sm:pb-6">
                {/* Hero text + CTA */}
                <div className="flex flex-col items-center justify-center py-4 sm:py-12">
                  <div className="relative w-full text-center">
                    <div className="space-y-6 sm:space-y-10">
                      <h1 className="text-[2.5rem] sm:text-[3rem] font-bold leading-[1.1] tracking-tight" style={{ fontFamily: 'var(--font-instrument-serif)', color: '#d0d0dd' }}>
                        {heroTitle}
                      </h1>
                      <div className="flex items-center justify-center gap-3 flex-wrap">
                        <h2 className="text-[1.2rem] sm:text-[1.4rem] font-light" style={{ color: '#8a8a9a' }}>{heroSubtitle}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* CTA at bottom of house */}
              <div ref={arrowRef} className="flex items-center justify-center gap-2 pb-4 sm:pb-8">
                <a
                  href={TALLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-3 text-sm font-semibold text-white/70 border border-white/30 rounded-full hover:text-white hover:border-white/60 transition-all duration-200 cursor-pointer"
                >
                  I want to join the next one
                </a>
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
      <div className="relative -mt-px" data-light-section style={{ background: '#FFF8F0' }}>

        {/* Flash overlay — fills the entire viewport on trigger */}
        <div
          ref={flashRef}
          className="fixed inset-0 pointer-events-none z-50"
          style={{
            background: 'radial-gradient(ellipse at center 30%, #ffffff 0%, #FFF8F0 20%, #FFD166 45%, #FF6B2B60 70%, transparent 100%)',
            opacity: 0,
          }}
        />

        {/* Transition: sharp dark → cream cutoff + sun canvas anchored here */}
        <div ref={zone2TriggerRef} className="relative overflow-hidden" style={{ height: '80px', background: 'linear-gradient(to bottom, #0a0a0c 0%, #0a0a0c 20%, #1a1410 45%, #FFF8F0 100%)' }}>
          {/* Static warm glow underneath */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[800px] h-[400px] pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, #FFD16640 0%, #FF6B2B15 35%, transparent 65%)' }} />
        </div>

        {/* ============================================= */}
        {/* SECTION: Valencia Hero Intro                   */}
        {/* ============================================= */}
        {/* Sun lens flare canvas — fixed overlay above all content */}
        <canvas
          ref={sunCanvasRef}
          className="fixed top-0 left-0 pointer-events-none"
          style={{ width: '100dvw', height: '100dvh', opacity: 0, transition: 'opacity 0.3s ease-in', zIndex: 9999 }}
        />

        <section className="relative w-full min-h-screen flex flex-col justify-center pt-7 sm:pt-16 pb-10 sm:pb-14">
          <div ref={zone2ContentRef} className="relative z-20 mx-auto w-full max-w-3xl px-6 sm:px-10 text-center">
            <div className="flex justify-center mb-2 sm:mb-5" style={{ opacity: 0, transform: 'translateY(30px)' }}>
              <div className="relative w-28 h-12 sm:w-36 sm:h-16">
                <Image src="/logo-simple.png" alt="SOTI" fill className="object-contain" />
              </div>
            </div>
            <h2 className="mt-2 sm:mt-6 text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05]" style={{ fontFamily: 'var(--font-space-mono)', color: '#1a1a1a', opacity: 0, transform: 'translateY(30px)' }}>
              Valencia
            </h2>
            <h3 className="mt-1 sm:mt-2 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-space-mono)', color: '#1a1a1a', opacity: 0, transform: 'translateY(30px)' }}>
              20-26 April
            </h3>
            <p className="mt-2 sm:mt-4 text-sm sm:text-base leading-relaxed max-w-xl mx-auto sm:whitespace-nowrap text-center" style={{ fontFamily: 'var(--font-space-mono)', color: '#6b5e52', opacity: 0, transform: 'translateY(30px)' }}>
              [We host 1-week houses for<br className="sm:hidden" /> people who build things]
            </p>

            {/* Image Carousel */}
            <div
              className="mt-4 sm:mt-8 mb-2 sm:mb-4 relative w-full overflow-hidden"
              style={{ height: '260px', opacity: 0, transform: 'translateY(30px)' }}
              onTouchStart={(e) => { (e.currentTarget as HTMLElement).dataset.touchX = String(e.touches[0].clientX); }}
              onTouchEnd={(e) => {
                const startX = Number((e.currentTarget as HTMLElement).dataset.touchX);
                const endX = e.changedTouches[0].clientX;
                const diff = startX - endX;
                if (Math.abs(diff) > 40) {
                  setCarouselIdx((prev: number) => diff > 0 ? (prev + 1) % 3 : (prev + 2) % 3);
                }
              }}
            >
              {/* Arrow left */}
              <button
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full transition-all hover:bg-black/10"
                style={{ color: '#6b5e52' }}
                onClick={() => setCarouselIdx((prev: number) => (prev + 2) % 3)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              {/* Arrow right */}
              <button
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full transition-all hover:bg-black/10"
                style={{ color: '#6b5e52' }}
                onClick={() => setCarouselIdx((prev: number) => (prev + 1) % 3)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
              <div className="relative w-full h-full flex items-center justify-center">
                {carouselImages.map((src: string, i: number) => {
                  const pos = (i - carouselIdx + 3) % 3;
                  const isCenter = pos === 0;
                  const isRight = pos === 1;
                  return (
                    <div
                      key={i}
                      onClick={() => !isCenter && setCarouselIdx(i)}
                      className="absolute transition-all duration-500 ease-in-out rounded-2xl overflow-hidden"
                      style={{
                        width: isCenter ? '300px' : '220px',
                        height: isCenter ? '200px' : '155px',
                        left: '50%',
                        top: '50%',
                        transform: `translate(-50%, -50%) translateX(${isCenter ? '0px' : isRight ? '140px' : '-140px'})`,
                        zIndex: isCenter ? 5 : 3,
                        cursor: isCenter ? 'default' : 'pointer',
                        opacity: isCenter ? 1 : 0.5,
                      }}
                    >
                      <Image src={src} alt="" fill className="object-cover" sizes="(min-width: 640px) 300px, 220px" />
                    </div>
                  );
                })}
              </div>
              {/* Dots */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {carouselImages.map((_: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setCarouselIdx(i)}
                    className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                    style={{ background: i === carouselIdx ? '#FF6B2B' : '#1a1a1a30' }}
                  />
                ))}
              </div>
            </div>

            {/* Progress + Apply */}
            <div className="mt-3 sm:mt-6 mx-auto w-full max-w-md" style={{ opacity: 0, transform: 'translateY(30px)' }}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-space-mono)', color: '#1a1a1a' }}>
                    {valenciaCount}/20 builders are confirmed
                  </span>
                  <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-space-mono)', color: '#1a1a1a' }}>
                    {Math.round((valenciaCount / 20) * 100)}%
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: '#1a1a1a10' }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.round((valenciaCount / 20) * 100)}%`, background: '#FF6B2B' }} />
                </div>
                <div className="flex flex-col items-center gap-4 pt-2">
                  <div className="relative group inline-block">
                    <div className="absolute inset-0 -m-2 rounded-full hidden sm:block opacity-40 filter blur-lg pointer-events-none transition-all duration-300 ease-out group-hover:opacity-60 group-hover:blur-xl group-hover:-m-3" style={{ background: '#FF6B2B' }} />
                    <a
                      href={TALLY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative z-10 px-7 py-3 text-sm font-bold rounded-full transition-all duration-200 cursor-pointer"
                      style={{ background: '#FF6B2B', color: '#FFF8F0' }}
                    >
                      Apply to the house
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
      {/* END data-light-section wrapper */}

      {/* Transition: warm → dark */}
      <div className="w-full h-32" style={{ background: 'linear-gradient(to bottom, #FFF8F0, #000000)' }} />

      <div className="relative" style={{ background: '#000000' }}>
        {/* ============================================= */}
        {/* SECTION: Manifesto                             */}
        {/* ============================================= */}
        <section id="1" className="relative z-40 w-full scroll-mt-32 md:scroll-mt-40" style={{ background: '#000000' }}>
          <div className="mx-auto w-full max-w-2xl px-6 sm:px-10 py-16 sm:py-24">
            <div className="mb-8 text-center">
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white" style={{ fontFamily: 'var(--font-space-mono)' }}>Our Manifesto</h3>
            </div>
            <div className="text-center text-balance text-xl sm:text-2xl leading-relaxed max-w-2xl flex flex-col gap-5 mx-auto text-white">
              <RevealText text="We grew up online, through forums, pixels and late-night calls." className="text-white" />
              <RevealText text="We build in public, meet offline, and chase that first feeling of discovering the internet." className="text-white" />
              <RevealText text="We're digital natives who enjoy disconnecting with other passionate builders." className="text-white" />
              <RevealText text="Our community is global, our connections are real, and our gatherings never forget." className="text-white" />
            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* SECTION: SOTI Community Progress               */}
        {/* ============================================= */}
        <section className="relative z-40 w-full pb-10 sm:pb-14 pt-6 sm:pt-8" style={{ background: '#000000' }}>
          <div className="mx-auto w-full max-w-md px-6 sm:px-10">
            <div className="w-full space-y-4">
              <h3 className="text-center text-2xl sm:text-3xl font-semibold tracking-tight text-white" style={{ fontFamily: 'var(--font-space-mono)' }}>
                SOTI Community
              </h3>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-white/60" style={{ fontFamily: 'var(--font-space-mono)' }}>
                  {totalSeats}/{totalSeats > 128 ? totalSeats + 5 : 128} seats filled for 2026
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.round((totalSeats / (totalSeats > 128 ? totalSeats + 5 : 128)) * 100)}%`, background: '#ffffff' }} />
              </div>
              <div className="flex justify-center pt-3">
                <div className="relative group inline-block">
                  <div className="absolute inset-0 -m-2 rounded-full hidden sm:block bg-gray-100 opacity-40 filter blur-lg pointer-events-none transition-all duration-300 ease-out group-hover:opacity-60 group-hover:blur-xl group-hover:-m-3" />
                  <a
                    href={TALLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 px-7 py-3 text-sm font-semibold text-black bg-gradient-to-br from-gray-100 to-gray-300 rounded-full hover:from-gray-200 hover:to-gray-400 transition-all duration-200 cursor-pointer"
                  >
                    Apply to join the family
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* SECTION: Houses / Events                       */}
        {/* ============================================= */}
        <section id="2" className="relative z-40 w-full scroll-mt-32 md:scroll-mt-40" style={{ background: '#000000' }}>
          <div className="mx-auto w-full max-w-6xl px-6 sm:px-10 py-20 sm:py-32">

            {/* Section header */}
            <div className="mb-6 flex items-center gap-4">
              <span className="text-xs tracking-[0.3em] uppercase text-white/40 font-medium" style={{ fontFamily: 'var(--font-space-mono)' }}>03</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="mb-16 sm:mb-20">
              <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-space-mono)' }}>Houses</h3>
              <p className="mt-4 text-lg text-white/50 max-w-lg">Where builders come together. One week. One place. No distractions.</p>
            </div>

            {/* Featured — Next House */}
            <div className="mb-20 sm:mb-24">
              <div className="relative rounded-3xl overflow-hidden group cursor-pointer" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="relative w-full aspect-[3/4] sm:aspect-[21/8]">
                  <Image src="/landing-house.jpg" alt="Valencia, Spain" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="100vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 lg:p-16">
                  <div className="max-w-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold tracking-wider text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-sm">NEXT HOUSE</span>
                      <span className="text-sm text-white/50">April 2026</span>
                    </div>
                    <h4 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-space-mono)' }}>Valencia</h4>
                    <p className="text-white/60 text-base sm:text-lg mb-6">Spain &middot; 1 week &middot; 20-26 April</p>
                    <a href={TALLY_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-full transition-all duration-300 bg-white text-black hover:bg-white/90 hover:scale-105">
                      JOIN THE WAITLIST
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Past Houses — Editorial timeline */}
            <div className="mb-8 flex items-center gap-4">
              <span className="text-xs tracking-[0.2em] uppercase text-white/30 font-medium" style={{ fontFamily: 'var(--font-space-mono)' }}>Past editions</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>

              {/* Past House: Barcelona */}
              <a href="https://www.notion.so/valeramarcos/Castellter-ol-Winter-House-28dbff6a5cda80109b9fcbbc2873c83f?source=copy_link" target="_blank" rel="noopener noreferrer" className="group relative bg-black">
                <div className="relative w-full aspect-[4/3]">
                  <Image src="/barcelona-together.png" alt="Barcelona, Spain" fill className="object-cover transition-transform duration-700 group-hover:scale-105 brightness-75 group-hover:brightness-90" sizes="(min-width: 768px) 50vw, 100vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                </div>
                <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8">
                  <div className="flex justify-between items-start">
                    <span className="text-xs tracking-[0.15em] uppercase text-white/80 font-medium" style={{ fontFamily: 'var(--font-space-mono)' }}>Edition 02</span>
                    <span className="text-xs text-white/80">Dec 2025</span>
                  </div>
                  <div>
                    <h4 className="text-2xl sm:text-3xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-space-mono)' }}>Barcelona</h4>
                    <p className="text-white/50 text-sm mb-3">Winter Edition &middot; Castellter&ccedil;ol, Spain</p>
                    <span className="inline-flex items-center gap-1.5 text-sm text-white/60 group-hover:text-white transition-colors">
                      View recap
                      <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </span>
                  </div>
                </div>
              </a>

              {/* Past House: Italy */}
              <a href="https://www.notion.so/valeramarcos/Taranto-La-Settimana-1f6bff6a5cda8083a794dd49975cf9ce?source=copy_link" target="_blank" rel="noopener noreferrer" className="group relative bg-black">
                <div className="relative w-full aspect-[4/3]">
                  <Image src="/events/italia.jpg" alt="Taranto, Italy" fill className="object-cover transition-transform duration-700 group-hover:scale-105 brightness-75 group-hover:brightness-90" sizes="(min-width: 768px) 50vw, 100vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                </div>
                <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8">
                  <div className="flex justify-between items-start">
                    <span className="text-xs tracking-[0.15em] uppercase text-white/80 font-medium" style={{ fontFamily: 'var(--font-space-mono)' }}>Edition 01</span>
                    <span className="text-xs text-white/80">Sept 2025</span>
                  </div>
                  <div>
                    <h4 className="text-2xl sm:text-3xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-space-mono)' }}>La Settimana</h4>
                    <p className="text-white/50 text-sm mb-3">Great Minds &middot; Taranto, Italy</p>
                    <span className="inline-flex items-center gap-1.5 text-sm text-white/60 group-hover:text-white transition-colors">
                      View recap
                      <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </span>
                  </div>
                </div>
              </a>

            </div>

          </div>
        </section>

        {/* ============================================= */}
        {/* SECTION: Schedule                              */}
        {/* ============================================= */}
        <section className="relative z-40 w-full py-8 sm:py-12" style={{ background: '#000000' }}>
          <div className="mx-auto w-full max-w-4xl px-6 sm:px-10">
            <div className="mb-8 text-center">
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2 text-white" style={{ fontFamily: 'var(--font-space-mono)' }}>
                Last Schedule
              </h3>
              <p className="text-white/60">Weekly program structure</p>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <div className="min-w-full rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                <table className="w-full table-fixed">
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <th className="w-32 px-4 py-4 text-left text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>Time</th>
                      <th className="px-4 py-4 text-center text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>Mon</th>
                      <th className="px-4 py-4 text-center text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>Tue</th>
                      <th className="px-4 py-4 text-center text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>Wed</th>
                      <th className="px-4 py-4 text-center text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>Thu</th>
                      <th className="px-4 py-4 text-center text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>Fri</th>
                      <th className="px-4 py-4 text-center text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>Sat</th>
                      <th className="px-4 py-4 text-center text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>Sun</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td className="px-4 py-4 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.05)' }}>09:00–13:00</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: 'rgba(255,255,255,0.6)' }}>Check In</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: 'rgba(255,255,255,0.6)' }}>Work Time</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: 'rgba(255,255,255,0.6)' }}>Work Time</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: 'rgba(255,255,255,0.6)' }}>Work Time</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: 'rgba(255,255,255,0.6)' }}>Work Time</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: 'rgba(255,255,255,0.6)' }}>Demo Day</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: 'rgba(255,255,255,0.6)' }}>Morning activity</td>
                    </tr>
                    <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td className="px-4 py-4 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.04)' }}>13:00–15:00</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: 'rgba(255,255,255,0.6)' }}>Lunch</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: 'rgba(255,255,255,0.6)' }}>Lunch</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: 'rgba(255,255,255,0.6)' }}>Lunch</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: 'rgba(255,255,255,0.6)' }}>Lunch</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: 'rgba(255,255,255,0.6)' }}>Lunch</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: 'rgba(255,255,255,0.6)' }}>Public Event – Paella (60 Attendees)</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: 'rgba(255,255,255,0.6)' }}>Lunch</td>
                    </tr>
                    <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td className="px-4 py-4 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.05)' }}>15:00–18:00</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: 'rgba(255,255,255,0.6)' }}>Work Time</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: 'rgba(255,255,255,0.6)' }}>Work Time</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: 'rgba(255,255,255,0.6)' }}>Work Time</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: 'rgba(255,255,255,0.6)' }}>Work Time</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: 'rgba(255,255,255,0.6)' }}>Work Time</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: 'rgba(255,255,255,0.6)' }}>DJ + Drinks</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: 'rgba(255,255,255,0.6)' }}>Reflect & Harvest</td>
                    </tr>
                    <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <td className="px-4 py-4 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.04)' }}>18:00+</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: 'rgba(255,255,255,0.6)' }}>Intros & Goals</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: 'rgba(255,255,255,0.6)' }}>Inspiration talk</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: 'rgba(255,255,255,0.6)' }}>Network Afternoon</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: 'rgba(255,255,255,0.6)' }}>Chef Dinner</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: 'rgba(255,255,255,0.6)' }}>Demo Day</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: 'rgba(255,255,255,0.6)' }}>DJ + Drinks</td>
                      <td className="px-4 py-4 text-sm text-center h-20" style={{ color: 'rgba(255,255,255,0.6)' }}>Check out</td>
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
                <div key={d.day} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <h4 className="font-bold text-base mb-3 text-white" style={{ fontFamily: 'var(--font-space-mono)' }}>{d.day}</h4>
                  <div className="space-y-2 text-sm text-white/60">
                    {d.slots.map((slot, j) => {
                      const colors = ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.04)', 'rgba(255,255,255,0.03)', 'rgba(255,255,255,0.02)'];
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
        <section className="relative z-40 w-full" style={{ background: '#000000' }}>
          <div className="mx-auto w-full max-w-2xl px-6 sm:px-10 py-16 sm:py-24">
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4 text-center text-white" style={{ fontFamily: 'var(--font-space-mono)' }}>Led by</h3>
            <p className="mb-12 text-center text-base text-white/60">Meet the builders behind SOTI</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              {/* Marcos */}
              <div className="rounded-2xl p-6 transition-all hover:shadow-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden" style={{ boxShadow: '0 0 0 3px rgba(255,255,255,0.15)' }}>
                    <Image src="/marcos.jpeg" alt="Marcos Valera" fill className="object-cover" sizes="96px" />
                  </div>
                  <h4 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-space-mono)' }}>Marcos Valera</h4>
                  <div className="flex gap-4 items-center">
                    <a href="https://www.youtube.com/@MarcosValera" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70" style={{ color: 'rgba(255,255,255,0.6)' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
                    <a href="https://x.com/_MarcosValera" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70" style={{ color: 'rgba(255,255,255,0.6)' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
                    <a href="https://www.linkedin.com/in/valeramarcos/" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70" style={{ color: 'rgba(255,255,255,0.6)' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-geist-sans)', color: 'rgba(255,255,255,0.6)' }}>GTM @ ElevenLabs. building community.</p>
                </div>
              </div>

              {/* Juan Pablo */}
              <div className="rounded-2xl p-6 transition-all hover:shadow-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden" style={{ boxShadow: '0 0 0 3px rgba(255,255,255,0.15)' }}>
                    <Image src="/juan-pablo.jpeg" alt="Juan Pablo" fill className="object-cover" sizes="96px" />
                  </div>
                  <h4 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-space-mono)' }}>Juan Pablo</h4>
                  <div className="flex gap-4 items-center">
                    <a href="https://x.com/jpgallegoar" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70" style={{ color: 'rgba(255,255,255,0.6)' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
                    <a href="https://github.com/jpgallegoar" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70" style={{ color: 'rgba(255,255,255,0.6)' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>
                    <a href="https://www.linkedin.com/in/jpgallegoar/" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70" style={{ color: 'rgba(255,255,255,0.6)' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-geist-sans)', color: 'rgba(255,255,255,0.6)' }}>Researcher and CTO.</p>
                </div>
              </div>

              {/* Dani */}
              <div className="rounded-2xl p-6 transition-all hover:shadow-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden" style={{ boxShadow: '0 0 0 3px rgba(255,255,255,0.15)' }}>
                    <Image src="/dani.png" alt="Dani Diestre" fill className="object-cover" sizes="96px" />
                  </div>
                  <h4 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-space-mono)' }}>Dani Diestre</h4>
                  <div className="flex gap-4 items-center">
                    <a href="https://www.youtube.com/@danidiestre" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70" style={{ color: 'rgba(255,255,255,0.6)' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
                    <a href="https://github.com/danidiestre" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70" style={{ color: 'rgba(255,255,255,0.6)' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>
                    <a href="https://www.linkedin.com/in/danidiestre/" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70" style={{ color: 'rgba(255,255,255,0.6)' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-geist-sans)', color: 'rgba(255,255,255,0.6)' }}>Co-Founder Autentic, Youtube Creator</p>
                </div>
              </div>

              {/* Aniol */}
              <div className="rounded-2xl p-6 transition-all hover:shadow-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden" style={{ boxShadow: '0 0 0 3px rgba(255,255,255,0.15)' }}>
                    <Image src="/aniol.jpeg" alt="Aniol Carreras" fill className="object-cover" sizes="96px" />
                  </div>
                  <h4 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-space-mono)' }}>Aniol Carreras</h4>
                  <div className="flex gap-4 items-center">
                    <a href="https://x.com/carrerasaniol" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70" style={{ color: 'rgba(255,255,255,0.6)' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
                    <a href="https://www.linkedin.com/in/aniolcarreras" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70" style={{ color: 'rgba(255,255,255,0.6)' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-geist-sans)', color: 'rgba(255,255,255,0.6)' }}>Co-Founder Autentic. Events Creator - Leading Product Fest (Madrid, 3 editions)</p>
                </div>
              </div>

              {/* Saura */}
              <div className="rounded-2xl p-6 transition-all hover:shadow-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden" style={{ boxShadow: '0 0 0 3px rgba(255,255,255,0.15)' }}>
                    <Image src="/saura.jpeg" alt="Jose Saura" fill className="object-cover" sizes="96px" />
                  </div>
                  <h4 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-space-mono)' }}>Jose Saura</h4>
                  <div className="flex gap-4 items-center">
                    <a href="https://x.com/iamsaura_" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70" style={{ color: 'rgba(255,255,255,0.6)' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
                    <a href="https://github.com/eddsaura" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70" style={{ color: 'rgba(255,255,255,0.6)' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>
                    <a href="https://www.linkedin.com/in/jesauraoller/" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70" style={{ color: 'rgba(255,255,255,0.6)' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-geist-sans)', color: 'rgba(255,255,255,0.6)' }}>Indiehacker - Paellas CEO - Starting on / IG / Tiktok - Skool community $1000MRR - DJ</p>
                </div>
              </div>

              {/* Adrian */}
              <div className="rounded-2xl p-6 transition-all hover:shadow-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden" style={{ boxShadow: '0 0 0 3px rgba(255,255,255,0.15)' }}>
                    <Image src="/adrian.png" alt="Adrian Valera" fill className="object-cover" sizes="96px" />
                  </div>
                  <h4 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-space-mono)' }}>Adrian Valera</h4>
                  <div className="flex gap-4 items-center">
                    <a href="https://github.com/adrixo" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70" style={{ color: 'rgba(255,255,255,0.6)' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>
                    <a href="https://linkedin.com/in/adrian-valera" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70" style={{ color: 'rgba(255,255,255,0.6)' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-geist-sans)', color: 'rgba(255,255,255,0.6)' }}>Engineer & Researcher. Building communities with love.</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* SECTION: Final CTA                             */}
        {/* ============================================= */}
        <section className="relative z-40 w-full" style={{ background: '#000000' }}>
          <div className="mx-auto w-full max-w-2xl px-6 sm:px-10 py-20 sm:py-28 text-center">
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white" style={{ fontFamily: 'var(--font-space-mono)' }}>Build something that matters</h3>
            <p className="mt-4 text-base text-white/70">Not another community.</p>
            <p className="text-base text-white/70">Join the new generation of builders now</p>
            <div className="mt-8">
              <div className="relative group inline-block">
                <div className="absolute inset-0 -m-2 rounded-full hidden sm:block bg-gray-100 opacity-40 filter blur-lg pointer-events-none transition-all duration-300 ease-out group-hover:opacity-60 group-hover:blur-xl group-hover:-m-3" />
                <a href={TALLY_URL} target="_blank" rel="noopener noreferrer" className="relative z-10 px-6 py-3 text-sm font-semibold text-black bg-gradient-to-br from-gray-100 to-gray-300 rounded-full hover:from-gray-200 hover:to-gray-400 transition-all duration-200">Apply to join the family</a>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================= */}
        {/* SECTION: Footer                                */}
        {/* ============================================= */}
        <footer className="w-full border-t border-white/10" style={{ background: '#000000' }}>
          <div className="mx-auto w-full max-w-2xl px-6 sm:px-10 py-12 sm:py-16">
            <div className="space-y-8">
              <div>
                <div className="flex mb-4">
                  <div className="relative w-40 h-14">
                    <Image src="/logo-white-simple.png" alt="SOTI Isotope" fill className="object-contain" priority={false} />
                  </div>
                </div>
                <p className="text-white/60 mr-12 text-sm" style={{ fontFamily: 'var(--font-dm-mono)' }}>people you&apos;d actually want to spend a night, a week, or a lifetime building with.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <h5 className="text-white/80 text-xs tracking-wider mb-3" style={{ fontFamily: 'var(--font-dm-mono)' }}>QUICK_LINKS</h5>
                  <ul className="space-y-2 text-sm" style={{ fontFamily: 'var(--font-dm-mono)' }}>
                    <li><Link href="/#1" className="text-white/70 hover:text-white transition-colors">&gt; Manifesto</Link></li>
                    <li><Link href="/#2" className="text-white/70 hover:text-white transition-colors">&gt; Houses</Link></li>
                    <li><a href={TALLY_URL} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">&gt; Apply to become a member</a></li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-white/80 text-xs tracking-wider mb-3" style={{ fontFamily: 'var(--font-dm-mono)' }}>FIND_US</h5>
                  <p className="text-white/50 text-sm mt-2" style={{ fontFamily: 'var(--font-dm-mono)' }}>only in real life.<br />we don&apos;t do social media.<br />we do moments that matter.</p>
                </div>
              </div>
              <div className="pt-6 text-white/30 text-xs" style={{ fontFamily: 'var(--font-dm-mono)' }}>&copy; {new Date().getFullYear()} SOTI</div>
            </div>
          </div>
        </footer>

      </div>


    </main>
  );
}
