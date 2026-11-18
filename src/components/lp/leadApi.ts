/**
 * Lead + OTP calls used by the hero form.
 *
 * TODO: these are stand-ins so the flow can be built and tested. Replace each
 * body with a call to the SOT lead / OTP service. Keep the return shapes: the
 * form only reads `ok` and `error`.
 *
 * Current stub behaviour: sending always succeeds; any 6-digit code verifies,
 * except 000000, which fails so the error state can be tested.
 */

export type ApiResult = { ok: true } | { ok: false; error: string };

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Send a one-time code by SMS/WhatsApp to the given 10-digit Indian mobile number. */
export async function sendOtp(mobile: string): Promise<ApiResult> {
  // e.g. return post("/api/otp/send", { mobile: `+91${mobile}` });
  await wait(700);
  return mobile.length === 10 ? { ok: true } : { ok: false, error: "Couldn't send the code. Please try again." };
}

/** Check the code the user typed. */
export async function verifyOtp(mobile: string, code: string): Promise<ApiResult> {
  // e.g. return post("/api/otp/verify", { mobile: `+91${mobile}`, code });
  await wait(700);
  if (!/^\d{6}$/.test(code) || code === "000000") {
    return { ok: false, error: "That code isn't right. Check the SMS and try again." };
  }
  return { ok: true };
}

/** Create the uGNET application lead once the number is verified. */
export async function submitLead(lead: { mobile: string; name: string }): Promise<ApiResult> {
  // e.g. return post("/api/lead", { ...lead, source: "uGNETLP" });
  void lead;
  await wait(400);
  return { ok: true };
}
