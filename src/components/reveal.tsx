"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches || !("IntersectionObserver" in window)) return;
    const elements = document.querySelectorAll("[data-reveal]");
    const show = (element: Element) => {
      element.classList.remove("reveal-pending");
      element.classList.add("is-visible");
    };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { show(entry.target); observer.unobserve(entry.target); }
      });
    }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });
    elements.forEach(element => {
      if (element.classList.contains("is-visible")) return;
      if (element.getBoundingClientRect().top < window.innerHeight) show(element);
      else {
        element.classList.add("reveal-pending");
        observer.observe(element);
      }
    });
    const reduceMotion = () => {
      if (!motion.matches) return;
      observer.disconnect();
      elements.forEach(show);
    };
    motion.addEventListener("change", reduceMotion);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", reduceMotion);
      elements.forEach(element => element.classList.remove("reveal-pending"));
    };
  }, [pathname]);
  return null;
}
