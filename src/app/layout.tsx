import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import "lenis/dist/lenis.css";
import "./globals.css";

/** Plus Jakarta Sans, 400–800: the site's only typeface, body and display. */
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "uGNET 2026: Apply for B.Tech CSE Admission | uGSOT",
  description:
    "Apply for uGNET 2026 — the entrance test for upGrad School of Technology's AI-first, 4-year on-campus B.Tech in Computer Science.",
};

/* Marks <html> as JS-enabled before first paint, so reveal-on-load elements can
   start hidden without ever hiding content from no-JS visitors. */
const JS_FLAG = "document.documentElement.classList.add('js')";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      </head>
      <body className="flex min-h-full flex-col bg-canvas selection:bg-accent selection:text-white">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
