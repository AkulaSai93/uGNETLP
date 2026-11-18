"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const stats = [
  { value: "4 Years", label: "On-campus B.Tech in CSE" },
  { value: "uGNET", label: "Online proctored entrance test" },
  { value: "50%", label: "Minimum in PCM, Class 12" },
  { value: "Under 20", label: "Years of age as of July 2026" },
  { value: "Up to 100%", label: "Scholarship" },
  { value: "MAANG", label: "Experts teach you" },
];

const BASE_SPEED = 38; // px per second

function StatList({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {stats.map((s) => (
        <li key={s.label} className="flex items-center">
          <span className="flex items-baseline gap-1.5 whitespace-nowrap px-5 text-[13px] leading-none">
            <span className="font-bold text-white">{s.value}</span>
            <span className="font-medium text-white/80">{s.label}</span>
          </span>
          <span aria-hidden="true" className="size-1 rotate-45 bg-white/70" />
        </li>
      ))}
    </ul>
  );
}

/**
 * Thin red marquee of uGNET facts, stuck to the top of the page.
 * GSAP drives the loop: it slides down on load, scrolls left at a steady pace,
 * speeds up with scroll velocity and eases back, and pauses on hover.
 */
export function DataStrip() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = track.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(root.current, { yPercent: -100 }, { yPercent: 0, duration: 0.9, ease: "expo.out", delay: 0.1 });

        let x = 0;
        let boost = 0;
        let paused = false;
        const half = () => el.scrollWidth / 2;
        const setX = gsap.quickSetter(el, "x", "px");

        const tick = (_t: number, dt: number) => {
          if (paused) return;
          x -= ((BASE_SPEED + boost) * dt) / 1000;
          const w = half();
          if (w > 0 && -x >= w) x += w;
          setX(x);
          boost *= 0.92; // ease the scroll boost back down
        };
        gsap.ticker.add(tick);

        const st = ScrollTrigger.create({
          onUpdate: (self) => {
            boost = Math.min(Math.abs(self.getVelocity()) / 6, 420);
          },
        });

        const enter = () => (paused = true);
        const leave = () => (paused = false);
        root.current?.addEventListener("mouseenter", enter);
        root.current?.addEventListener("mouseleave", leave);

        return () => {
          gsap.ticker.remove(tick);
          st.kill();
          root.current?.removeEventListener("mouseenter", enter);
          root.current?.removeEventListener("mouseleave", leave);
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} role="region" aria-label="uGNET 2026 at a glance" className="sticky top-0 z-50 bg-accent">
      <div className="marquee-mask py-2.5">
        <div ref={track} className="flex w-max will-change-transform">
          <StatList />
          <StatList hidden />
        </div>
      </div>
    </div>
  );
}
