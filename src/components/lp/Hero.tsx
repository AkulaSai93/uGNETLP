import Image from "next/image";
import { ApplyForm } from "./ApplyForm";


export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative bg-canvas">
      {/* Full-bleed painted landscape */}
      <div className="relative isolate overflow-hidden pb-[260px] sm:pb-40 lg:min-h-[calc(100svh-33px)] lg:pb-40">
        <Image
          src="/images/ugnet-hero-painted.png"
          alt="Painted landscape: a student on a grassy hill looking out at a modern campus beneath a bright sky"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="animate-hero-zoom -z-20 object-cover object-[50%_100%] sm:object-[50%_80%]"
        />
        {/* soft shade behind the text so white copy reads on the sky */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_55%_at_50%_38%,rgba(12,48,104,0.38),rgba(12,48,104,0)_70%)]"
        />

        {/* bottom overlay: fades the landscape into the white page below */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[14%] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.6)_65%,#fff_100%)] lg:h-[12%]"
        />

        {/* Centred copy + form */}
        <div className="mx-auto max-w-[920px] px-4 pt-10 text-center sm:pt-14 lg:pt-[8vh]">
          <h1
            id="hero-title"
            className="animate-rise font-display text-[clamp(2.4rem,5.4vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-white [animation-delay:80ms] [text-shadow:0_2px_24px_rgba(8,32,72,0.35)]"
          >
            Graduate job&#8209;ready with an{" "}
            <span className="whitespace-nowrap text-accent [text-shadow:0_2px_18px_rgba(255,255,255,0.35)]">AI&#8209;First B.Tech</span>{" "}
            in CSE
          </h1>

          <p className="animate-rise mx-auto mt-5 max-w-[600px] text-[16px] leading-[1.6] text-white/95 [animation-delay:160ms] [text-shadow:0_1px_12px_rgba(8,32,72,0.45)] lg:text-[17.5px]">
            A 4-year, on-campus programme built around real code, real projects and real jobs. Your admission starts with
            uGNET.
          </p>

          <div className="animate-rise mt-8 [animation-delay:240ms]">
            <ApplyForm />
          </div>
        </div>
      </div>

    </section>
  );
}
