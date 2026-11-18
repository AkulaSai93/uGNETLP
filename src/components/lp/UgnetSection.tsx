"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BookA, ClipboardCheck, CodeXml, Download, Sigma } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";
import { GlowButton } from "./GlowButton";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* The illustration is drawn on a fixed 820×336 canvas and scaled to fit. */
const W = 820;
const H = 336;

/** Icon boxes for the three uGNET sections, and the connector each one draws into the screen. */
const NODES = [
  { key: "maths", label: "Maths", Icon: Sigma, left: 50, top: 60, path: "M122 96 H166 Q176 96 176 106 V112 Q176 122 186 122 H232" },
  { key: "logic", label: "Logic & code", Icon: CodeXml, left: 40, top: 220, path: "M112 256 H166 Q176 256 176 246 V236 Q176 226 186 226 H232" },
  { key: "verbal", label: "Verbal", Icon: BookA, left: 740, top: 50, path: "M628 150 H690 Q700 150 700 140 V96 Q700 86 710 86 H740" },
];

/**
 * TODO: set to the uGNET Preparation Kit file (e.g. "/downloads/ugnet-preparation-kit.pdf").
 * While empty, "Download Preparation Kit" takes people to the registration form,
 * since the kit is shared with registered candidates.
 */
const PREP_KIT_URL = "";

/** "Download Preparation Kit" — the file when PREP_KIT_URL is set, else the registration form. */
function PrepKitLink({ className = "", label = "Download Preparation Kit" }: { className?: string; label?: string }) {
  return (
    <a
      href={PREP_KIT_URL || "#apply"}
      {...(PREP_KIT_URL ? { download: "" } : {})}
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[4px] border border-accent bg-white font-semibold text-accent transition-colors hover:bg-accent hover:text-white ${className}`}
    >
      <Download className="size-[16px] shrink-0" strokeWidth={2.2} aria-hidden="true" />
      {label}
    </a>
  );
}

/** Four-point sparkle, centred on (0,0), radius 1. */
const SPARKLE = "M0 -1 C0.08 -0.3 0.3 -0.08 1 0 C0.3 0.08 0.08 0.3 0 1 C-0.08 0.3 -0.3 0.08 -1 0 C-0.3 -0.08 -0.08 -0.3 0 -1 Z";

/**
 * "Admissions Starts with uGNET": the site's heading and intro, then a
 * line illustration: an outlined MacBook showing the uGNET test, icon boxes for its three
 * sections wired to it with thin connectors, and a red scholarship card
 * shown on the screen with the two CTAs. GSAP draws the lines, pops the boxes,
 * reveals the screen content, sends pulses along the wires and twinkles the sparkles.
 */
export function UgnetSection() {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // fit the 820×336 canvas to the available width (measured on layout and on
  // every resize; not ResizeObserver, which some embedded browsers never fire)
  useLayoutEffect(() => {
    const el = frame.current;
    if (!el) return;
    const fit = () => setScale(Math.min(1.2, el.getBoundingClientRect().width / W));
    fit();
    window.addEventListener("resize", fit);
    window.addEventListener("load", fit);
    return () => {
      window.removeEventListener("resize", fit);
      window.removeEventListener("load", fit);
    };
  }, []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const wires = q<SVGPathElement>("[data-wire]");
        wires.forEach((p) => {
          const len = p.getTotalLength();
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        });

        gsap
          .timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: { trigger: frame.current, start: "top 75%", toggleActions: "play none none none" },
          })
          .fromTo(q("[data-screen]"), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1 }, 0)
          .fromTo(q("[data-skel]"), { scaleX: 0 }, { scaleX: 1, duration: 0.9, stagger: 0.08, ease: "power3.out" }, 0.35)
          .fromTo(q("[data-pick]"), { scale: 0 }, { scale: 1, duration: 0.5, ease: "back.out(3)" }, 0.8)
          .fromTo(q("[data-screen-item]"), { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.1 }, 0.6)
          .to(wires, { strokeDashoffset: 0, duration: 1.1, stagger: 0.15, ease: "power2.inOut" }, 0.5)
          .fromTo(
            q("[data-node]"),
            { scale: 0.6, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: 0.8, stagger: 0.15, ease: "back.out(2)" },
            0.9,
          )
          .fromTo(
            q("[data-sparkle]"),
            { scale: 0, rotate: -90, autoAlpha: 0 },
            { scale: 1, rotate: 0, autoAlpha: 1, duration: 0.9, stagger: 0.12, ease: "back.out(2)" },
            1.6,
          )
          .add(() => {
            // idle loops once everything is in
            gsap.to(q("[data-pulse]"), { strokeDashoffset: -400, duration: 2.6, ease: "none", repeat: -1, stagger: 0.6 });
            gsap.to(q("[data-pulse]"), { autoAlpha: 1, duration: 0.4 });
            q("[data-sparkle]").forEach((el, i) =>
              gsap.to(el, { scale: 0.7, rotate: 45, duration: 1.6 + i * 0.5, ease: "sine.inOut", yoyo: true, repeat: -1 }),
            );
          });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="ugnet" className="bg-canvas pb-6 pt-12 lg:pb-8 lg:pt-16">
      <div className="container-page">
        <SectionHeading
          title="Admissions Starts with"
          accent="uGNET"
          intro="uGNET is our admission and scholarship test for aspiring Computer Science students."
        />

        <div ref={frame} className="mx-auto mt-6 w-full max-w-[984px] lg:mt-4">
          <div
            style={{ height: H * scale }}
            className="relative mx-auto overflow-hidden"
          >
            <div
              style={{ width: W, height: H, transform: `translateX(-50%) scale(${scale})` }}
              className="absolute left-1/2 top-0 origin-top"
            >
              {/* connectors (+ red pulses travelling along them) */}
              <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none" aria-hidden="true" className="absolute inset-0">
                {NODES.map((n) => (
                  <g key={n.key}>
                    <path data-wire d={n.path} stroke="#0b0d12" strokeWidth="1.4" strokeLinecap="round" />
                    <path
                      data-pulse
                      d={n.path}
                      stroke="#e4002b"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeDasharray="14 386"
                      strokeDashoffset="0"
                      opacity="0"
                    />
                  </g>
                ))}
              </svg>

              {/* MacBook: screen (lid) */}
              <div
                data-screen
                className="absolute rounded-t-[18px] rounded-b-[6px] border-[1.5px] border-ink bg-white"
                style={{ left: 230, top: 30, width: 400, height: 282 }}
              >
                <span aria-hidden="true" className="absolute left-1/2 top-[7px] size-[5px] -translate-x-1/2 rounded-full bg-ink/70" />
                {/* display area inside the bezel */}
                <div className="absolute inset-[16px_12px_12px] overflow-hidden rounded-[4px] border border-black/[0.1] px-5 pt-4">
                  <div className="flex items-center gap-2.5">
                    <ClipboardCheck className="size-[20px] text-ink" strokeWidth={1.8} aria-hidden="true" />
                    <span className="text-[17px] font-semibold tracking-[-0.02em] text-ink">uGNET 2026</span>
                    <span className="ml-auto rounded-full border border-ink/80 px-2 py-0.5 font-mono text-[11px] font-semibold text-ink">
                      120:00
                    </span>
                  </div>

                  <div className="my-3 h-px bg-black/[0.12]" />

                  {/* the selected answer row */}
                  <div className="flex items-center gap-3">
                    <span className="size-7 rounded-[6px] bg-ink" />
                    <span className="flex flex-col gap-1.5">
                      <span data-skel className="h-[7px] w-[120px] origin-left rounded-full bg-ink" />
                      <span data-skel className="h-[7px] w-[64px] origin-left rounded-full bg-ink" />
                    </span>
                    <span data-pick className="ml-auto size-[16px] rounded-full bg-accent" />
                  </div>

                  <div className="my-3 h-px bg-black/[0.08]" />

                  <p data-screen-item className="whitespace-nowrap text-[24px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
                    Up to <span className="text-accent">100%</span> scholarship
                  </p>
                  <p data-screen-item className="mt-1 text-[12.5px] text-body">Based on your uGNET score</p>

                  {/* CTAs inside the screen (tablet and up; phones get full-size ones below the drawing) */}
                  <div data-screen-item className="mt-3 flex gap-2 max-sm:hidden">
                    <GlowButton href="#apply" size="sm" className="shrink-0 [&>span:last-child]:gap-1.5 [&>span:last-child]:px-3 [&>span:last-child]:py-1.5 [&>span:last-child]:text-[12px]">
                      Apply Now
                    </GlowButton>
                    <PrepKitLink label="Download Prep Kit" className="shrink-0 gap-1.5 px-2.5 py-[5px] text-[12px] [&>svg]:size-[13px]" />
                  </div>
                </div>
              </div>

              {/* MacBook: base, with the hinge notch */}
              <div
                data-screen
                className="absolute rounded-b-[16px] rounded-t-[3px] border-[1.5px] border-ink bg-white"
                style={{ left: 180, top: 312, width: 500, height: 16 }}
              >
                <span aria-hidden="true" className="absolute left-1/2 top-[-1.5px] h-[6px] w-[78px] -translate-x-1/2 rounded-b-[6px] border-[1.5px] border-t-0 border-ink" />
              </div>

              {/* icon boxes for the three sections */}
              {NODES.map(({ key, label, Icon, left, top }) => (
                <div key={key} data-node className="absolute flex flex-col items-center" style={{ left, top, width: 72 }}>
                  <span className="grid size-[72px] place-items-center rounded-[14px] border-[1.5px] border-ink bg-white">
                    <Icon className="size-7 text-ink" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <span className="mt-2 whitespace-nowrap text-[13px] font-medium text-body">{label}</span>
                </div>
              ))}

              {/* sparkles */}
              <svg data-sparkle aria-hidden="true" className="absolute" style={{ left: 756, top: 226 }} width="40" height="40" viewBox="-1.2 -1.2 2.4 2.4">
                <path d={SPARKLE} fill="none" stroke="#0b0d12" strokeWidth="0.06" strokeLinejoin="round" />
              </svg>
              <svg data-sparkle aria-hidden="true" className="absolute" style={{ left: 170, top: 6 }} width="24" height="24" viewBox="-1.2 -1.2 2.4 2.4">
                <path d={SPARKLE} fill="#e4002b" />
              </svg>
              <svg data-sparkle aria-hidden="true" className="absolute" style={{ left: 712, top: 306 }} width="18" height="18" viewBox="-1.2 -1.2 2.4 2.4">
                <path d={SPARKLE} fill="none" stroke="#0b0d12" strokeWidth="0.1" />
              </svg>
            </div>
          </div>
        </div>

        {/* phones: full-size CTAs under the drawing (the ones inside the Mac are too small to tap there) */}
        <div className="mx-auto mt-5 flex max-w-[420px] flex-col gap-3 sm:hidden">
          <GlowButton href="#apply" size="lg" className="w-full [&>span:last-child]:w-full">
            Apply Now
          </GlowButton>
          <PrepKitLink className="px-6 py-[13px] text-[16px]" />
        </div>
      </div>
    </section>
  );
}
