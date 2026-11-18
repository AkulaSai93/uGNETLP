"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { CheckCircle2 } from "lucide-react";
import { GlowButton } from "./GlowButton";
import { OtpInput } from "./OtpInput";
import { sendOtp, submitLead, verifyOtp } from "./leadApi";

gsap.registerPlugin(useGSAP);

const MOBILE_RE = /^[6-9]\d{9}$/;
const RESEND_AFTER = 30; // seconds

type Step = "details" | "otp" | "done";

const fmtMobile = (m: string) => `+91 ${m.slice(0, 5)} ${m.slice(5)}`;

/**
 * Hero lead form with OTP verification:
 * 1. details — mobile + name, "Get OTP"
 * 2. otp     — 6-digit code, verify, resend after 30s, change number
 * 3. done    — confirmation
 * Desktop: one row per step. Phones: full-width card, one field per line.
 */
export function ApplyForm() {
  const [step, setStep] = useState<Step>("details");
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [touched, setTouched] = useState({ mobile: false, name: false });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const root = useRef<HTMLDivElement>(null);

  const mobileOk = MOBILE_RE.test(mobile);
  const nameOk = name.trim().length >= 2;
  const mobileErr = touched.mobile && !mobileOk;
  const nameErr = touched.name && !nameOk;

  // resend countdown
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  // each step slides in
  useGSAP(
    () => {
      gsap.fromTo("[data-step]", { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: "expo.out" });
    },
    { scope: root, dependencies: [step] },
  );

  async function requestOtp(e?: FormEvent) {
    e?.preventDefault();
    setTouched({ mobile: true, name: true });
    if (!mobileOk || !nameOk || busy) return;
    setBusy(true);
    setError("");
    const res = await sendOtp(mobile);
    setBusy(false);
    if (!res.ok) return setError(res.error);
    setCode("");
    setStep("otp");
    setResendIn(RESEND_AFTER);
  }

  async function verify(e?: FormEvent) {
    e?.preventDefault();
    if (code.length !== 6 || busy) return;
    setBusy(true);
    setError("");
    const res = await verifyOtp(mobile, code);
    if (!res.ok) {
      setBusy(false);
      return setError(res.error);
    }
    const lead = await submitLead({ mobile, name: name.trim() });
    setBusy(false);
    if (!lead.ok) return setError(lead.error);
    setStep("done");
  }

  async function resend() {
    if (resendIn > 0 || busy) return;
    setBusy(true);
    setError("");
    const res = await sendOtp(mobile);
    setBusy(false);
    if (!res.ok) return setError(res.error);
    setCode("");
    setResendIn(RESEND_AFTER);
  }

  // submit automatically once all six digits are in
  useEffect(() => {
    if (step === "otp" && code.length === 6) void verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, step]);

  const card =
    "rounded-[4px] bg-white/95 p-2.5 shadow-[0_20px_50px_-20px_rgba(10,40,90,0.55)] backdrop-blur sm:p-1.5";
  const boxed =
    "h-[52px] rounded-[4px] border border-black/[0.12] bg-white sm:h-12 sm:rounded-none sm:border-0 sm:bg-transparent";
  const fieldText =
    "w-full min-w-0 bg-transparent text-[16px] text-ink outline-none placeholder:text-[#8a93a3] sm:text-[15px]";
  const note = "text-[12.5px] font-medium leading-[1.6] text-white";

  return (
    <div ref={root} id="apply" className="mx-auto w-full max-w-[720px] scroll-mt-24">
      {step === "details" && (
        <form data-step onSubmit={requestOtp} noValidate>
          <div className={`${card} flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-0`}>
            <label className="sr-only" htmlFor="mobile">
              Mobile number
            </label>
            <div
              className={`${boxed} flex min-w-0 items-center gap-2 px-3.5 sm:flex-1 ${mobileErr ? "border-accent ring-2 ring-accent/30 sm:ring-0" : ""}`}
            >
              <span className="shrink-0 text-[16px] font-medium leading-none text-body sm:text-[15px]">+91</span>
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
                aria-describedby="form-msg"
                className={`${fieldText} h-full`}
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
              aria-describedby="form-msg"
              className={`${boxed} ${fieldText} px-3.5 sm:flex-1 ${nameErr ? "border-accent ring-2 ring-accent/30 sm:ring-0" : ""}`}
            />
            <GlowButton
              type="submit"
              size="md"
              fullWidth
              disabled={!mobileOk || !nameOk || busy}
              className="shrink-0 sm:w-auto [&>span:last-child]:h-[52px] sm:[&>span:last-child]:h-[45px]"
            >
              {busy ? "Sending OTP…" : "Get OTP"}
            </GlowButton>
          </div>

          <p id="form-msg" aria-live="polite" className="mt-2 min-h-[18px] text-[12.5px] font-bold text-accent">
            {[mobileErr && "Enter a valid 10-digit mobile number.", nameErr && "Please enter your full name.", error]
              .filter(Boolean)
              .join(" ")}
          </p>
          <p className={note}>
            We&apos;ll send a one-time code to verify your number. By continuing, you agree to our{" "}
            <a href="/terms-and-conditions" className="font-bold underline underline-offset-2 hover:text-white/80">
              Terms
            </a>{" "}
            and{" "}
            <a href="/privacy-policy" className="font-bold underline underline-offset-2 hover:text-white/80">
              Privacy Policy
            </a>
            .
          </p>
        </form>
      )}

      {step === "otp" && (
        <form data-step onSubmit={verify} noValidate>
          <div className={`${card} flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 sm:pl-4`}>
            <div className="text-left sm:flex-1">
              <p className="text-[14px] font-semibold text-ink">Enter the 6-digit code</p>
              <p className="mt-0.5 text-[13px] text-body">
                Sent to {fmtMobile(mobile)} ·{" "}
                <button
                  type="button"
                  onClick={() => {
                    setStep("details");
                    setError("");
                  }}
                  className="font-semibold text-accent underline underline-offset-2"
                >
                  Change
                </button>
              </p>
            </div>
            <OtpInput value={code} onChange={setCode} invalid={!!error} disabled={busy} />
            <GlowButton
              type="submit"
              size="md"
              fullWidth
              disabled={code.length !== 6 || busy}
              className="shrink-0 sm:w-auto [&>span:last-child]:h-[52px] sm:[&>span:last-child]:h-[48px]"
            >
              {busy ? "Verifying…" : "Verify"}
            </GlowButton>
          </div>

          <p aria-live="polite" className="mt-2 min-h-[18px] text-[12.5px] font-bold text-accent">
            {error}
          </p>
          <p className={note}>
            Didn&apos;t get it?{" "}
            {resendIn > 0 ? (
              <span>Resend in 0:{String(resendIn).padStart(2, "0")}</span>
            ) : (
              <button type="button" onClick={resend} className="font-bold underline underline-offset-2 hover:text-white/80">
                Resend code
              </button>
            )}{" "}
            · Prefer to talk?{" "}
            <a href="tel:18002108080" className="font-bold underline underline-offset-2 hover:text-white/80">
              1800 210 8080
            </a>
          </p>
        </form>
      )}

      {step === "done" && (
        <div
          data-step
          className="flex items-center justify-center gap-3 rounded-[4px] bg-white/95 px-5 py-4 text-left shadow-[0_20px_50px_-20px_rgba(10,40,90,0.5)]"
        >
          <CheckCircle2 className="size-7 shrink-0 text-accent" aria-hidden="true" />
          <p className="text-[14.5px] leading-snug text-ink">
            <span className="font-semibold">Number verified — you&apos;re registered.</span> Our admissions team will call
            you on {fmtMobile(mobile)} to schedule your uGNET.
          </p>
        </div>
      )}
    </div>
  );
}
