"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { GlowButton } from "./GlowButton";

const MOBILE_RE = /^[6-9]\d{9}$/;

/** Inline lead form for the hero: mobile + name + submit on one row (stacked on phones). */
export function ApplyForm() {
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [touched, setTouched] = useState({ mobile: false, name: false });
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");

  const mobileOk = MOBILE_RE.test(mobile);
  const nameOk = name.trim().length >= 2;
  const canSubmit = mobileOk && nameOk && status === "idle";
  const mobileErr = touched.mobile && !mobileOk;
  const nameErr = touched.name && !nameOk;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched({ mobile: true, name: true });
    if (!mobileOk || !nameOk) return;
    setStatus("submitting");
    // TODO: POST to the SOT lead API, e.g. await fetch("/api/lead", { method: "POST", body: JSON.stringify({ mobile, name }) })
    await new Promise((r) => setTimeout(r, 600));
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div
        id="apply"
        className="mx-auto flex w-full max-w-[720px] items-center justify-center gap-3 rounded-[12px] bg-white/95 px-5 py-4 text-left shadow-[0_20px_50px_-20px_rgba(10,40,90,0.5)]"
      >
        <CheckCircle2 className="size-7 shrink-0 text-accent" aria-hidden="true" />
        <p className="text-[14.5px] leading-snug text-ink">
          <span className="font-semibold">You&apos;re registered.</span> Our admissions team will call you on +91 {mobile} to
          schedule your uGNET.
        </p>
      </div>
    );
  }

  const field =
    "h-12 w-full bg-transparent px-3.5 text-[15px] text-ink outline-none placeholder:text-[#8a93a3] focus-visible:bg-black/[0.03]";

  return (
    <form id="apply" onSubmit={onSubmit} noValidate className="mx-auto w-full max-w-[720px] scroll-mt-24">
      <div className="flex flex-col gap-1.5 rounded-[12px] bg-white/95 p-1.5 shadow-[0_20px_50px_-20px_rgba(10,40,90,0.55)] backdrop-blur sm:flex-row sm:items-center sm:gap-0">
        <label className="sr-only" htmlFor="mobile">
          Mobile number
        </label>
        <div
          className={`flex min-w-0 flex-1 items-center rounded-[8px] sm:rounded-none ${mobileErr ? "ring-2 ring-accent/60 sm:ring-0" : ""}`}
        >
          <span className="shrink-0 pl-3.5 text-[15px] font-medium leading-none text-body">+91</span>
          <input
            id="mobile"
            name="mobile"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            maxLength={10}
            placeholder="WhatsApp number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
            onBlur={() => setTouched((t) => ({ ...t, mobile: true }))}
            aria-invalid={mobileErr}
            aria-describedby="form-err"
            className={`${field} min-w-0 pl-2`}
          />
        </div>
        <span aria-hidden="true" className="hidden h-7 w-px bg-black/10 sm:block" />
        <label className="sr-only" htmlFor="name">
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          aria-invalid={nameErr}
          aria-describedby="form-err"
          className={`${field} min-w-0 flex-1 rounded-[8px] max-sm:border-t max-sm:border-black/[0.06] sm:rounded-none ${nameErr ? "ring-2 ring-accent/60 sm:ring-0" : ""}`}
        />
        <GlowButton type="submit" size="md" disabled={!canSubmit} className="shrink-0 max-sm:w-full [&>span:last-child]:h-[45px] max-sm:[&>span:last-child]:w-full">
          {status === "submitting" ? "Registering…" : "Apply for uGNET"}
        </GlowButton>
      </div>

      <p id="form-err" aria-live="polite" className="mt-2 min-h-[18px] text-[12.5px] font-bold text-accent">
        {mobileErr ? "Enter a valid 10-digit mobile number. " : ""}
        {nameErr ? "Please enter your full name." : ""}
      </p>
      <p className="text-[12.5px] font-medium leading-[1.6] text-white">
        By submitting, you agree to our{" "}
        <a href="/terms-and-conditions" className="font-bold text-white underline underline-offset-2 hover:text-white/80">
          Terms
        </a>{" "}
        and{" "}
        <a href="/privacy-policy" className="font-bold text-white underline underline-offset-2 hover:text-white/80">
          Privacy Policy
        </a>
        . Prefer to talk?{" "}
        <a href="tel:18002108080" className="font-bold text-white underline underline-offset-2 hover:text-white/80">
          1800 210 8080
        </a>
      </p>
    </form>
  );
}
