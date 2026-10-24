"use client";

import { useEffect, useRef } from "react";

export function Count({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const element = ref.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!element || motion.matches || !("IntersectionObserver" in window) || element.getBoundingClientRect().top < window.innerHeight) return;
    let frame = 0;
    element.textContent = "00";
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      const start = performance.now();
      const animate = (time: number) => {
        const progress = Math.min((time - start) / 500, 1);
        element.textContent = String(Math.round(value * (1 - Math.pow(1 - progress, 3)))).padStart(2, "0");
        if (progress < 1) frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
    }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });
    const finish = () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      element.textContent = String(value).padStart(2, "0");
    };
    const reduceMotion = () => { if (motion.matches) finish(); };
    motion.addEventListener("change", reduceMotion);
    observer.observe(element);
    return () => { finish(); motion.removeEventListener("change", reduceMotion); };
  }, [value]);
  return <><span className="sr-only">{value}</span><span ref={ref} aria-hidden="true" style={{ fontVariantNumeric:"tabular-nums" }}>{String(value).padStart(2,"0")}</span></>;
}
