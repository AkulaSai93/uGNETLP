"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MaskWord } from "@/components/motion/MaskWord";
import { ApplyForm } from "./ApplyForm";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LINE = ["Graduate", "job‑ready", "with", "an"];
const ACCENT = ["AI‑First", "B.Tech"];
const TAIL = ["in", "CSE"];

/**
 * uGNET hero, animated in the SOT site's motion language:
 * - on load: the painting settles from a slight zoom, headline words rise out
 *   of their masks one after another, then the intro and form fade up;
 * - on scroll: the painting drifts slower than the page (parallax) and the
 *   copy lifts and fades as the hero leaves.
 * Words start hidden via `.js [data-reveal]` (globals.css) so there is no flash;
 * reduced motion shows everything at once with no scroll effects.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(q("[data-reveal]"), { autoAlpha: 1 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .fromTo(q("[data-hero-img]"), { scale: 1.14 }, { scale: 1, duration: 2.4 }, 0)
          .fromTo(
            q("[data-reveal='word']"),
            { yPercent: 110, rotate: 4, autoAlpha: 0 },
            { yPercent: 0, rotate: 0, autoAlpha: 1, duration: 1.15, stagger: 0.075 },
            0.15,
          )
          .fromTo(
            q("[data-reveal='fade']"),
            { y: 24, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1, stagger: 0.1 },
            0.6,
          );

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 },
          })
          .to(q("[data-hero-parallax]"), { yPercent: 14 }, 0)
          .to(q("[data-hero-copy]"), { y: -90, autoAlpha: 0.15 }, 0);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="hero-title" className="relative bg-canvas">
      {/* Full-bleed painted landscape */}
      <div className="relative isolate overflow-hidden pb-[260px] sm:pb-40 lg:min-h-[calc(100svh-33px)] lg:pb-40">
        <div data-hero-parallax className="absolute inset-0 -z-20 will-change-transform">
          <div data-hero-img className="absolute inset-0 origin-[50%_80%]">
            <Image
              src="/images/ugnet-hero-painted.png"
              alt="Painted landscape: a student on a grassy hill looking out at a modern campus beneath a bright sky"
              fill
              priority
              quality={90}
              sizes="100vw"
              className="object-cover object-[50%_100%] sm:object-[50%_80%]"
            />
          </div>
        </div>
        {/* sky-blue tint behind the copy: calms the bright clouds so the text reads,
            in the painting's own blue (no dark shade, no text shadow) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_62%_52%_at_50%_30%,rgba(46,124,222,0.82)_0%,rgba(46,124,222,0.6)_45%,rgba(46,124,222,0)_100%)] max-sm:bg-[radial-gradient(ellipse_120%_55%_at_50%_30%,rgba(46,124,222,0.85)_0%,rgba(46,124,222,0.6)_50%,rgba(46,124,222,0)_100%)]"
        />

        {/* bottom overlay: fades the landscape into the white page below */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[14%] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.6)_65%,#fff_100%)] lg:h-[12%]"
        />

        {/* Centred copy + form */}
        <div data-hero-copy className="mx-auto max-w-[920px] px-4 pt-14 text-center will-change-transform sm:pt-20 lg:pt-[11vh]">
          <h1
            id="hero-title"
            className="font-display text-[clamp(2.4rem,5.4vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-white"
          >
            {LINE.map((w) => (
              <span key={w}>
                <MaskWord attr="hero">{w}</MaskWord>{" "}
              </span>
            ))}
            <span className="whitespace-nowrap">
              {ACCENT.map((w, i) => (
                <span key={w}>
                  <MaskWord attr="hero" className="text-accent">
                    {w}
                  </MaskWord>
                  {i < ACCENT.length - 1 ? " " : ""}
                </span>
              ))}
            </span>{" "}
            {TAIL.map((w) => (
              <span key={w}>
                <MaskWord attr="hero">{w}</MaskWord>{" "}
              </span>
            ))}
          </h1>

          <p
            data-reveal="fade"
            className="mx-auto mt-5 max-w-[600px] text-[16px] font-medium leading-[1.6] text-white lg:text-[18px]"
          >
            A 4-year, on-campus programme built around real code, real projects and real jobs. Your admission starts with
            uGNET.
          </p>

          <div data-reveal="fade" className="mt-8">
            <ApplyForm />
          </div>
        </div>
      </div>
    </section>
  );
}
