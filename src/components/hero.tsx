"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";

const slides = [
  { image: "/images/project-01.jpg", alt: "The Obsidian Residence - considered contemporary architecture", label: "The Obsidian Residence", number: "01" },
  { image: "/images/project-03.jpg", alt: "Casa Monolith - a study in sculptural form and natural light", label: "Casa Monolith", number: "03" },
  { image: "/images/project-05.jpg", alt: "Pavilion North - architecture in dialogue with its setting", label: "Pavilion North", number: "05" },
];
export function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (paused || media.matches) return;
    const timer = window.setInterval(() => {
      if (!media.matches && !document.hidden) setActive(previous => (previous + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [paused]);
  return <section className="hero" aria-label="Selected architectural perspectives" aria-roledescription="carousel">{slides.map((slide, index) => <div key={slide.image} className={`hero-slide ${index === active ? "active" : ""}`} aria-hidden={index !== active}><Image src={slide.image} alt={slide.alt} fill priority={index === 0} sizes="100vw" className="cover-image" /></div>)}<div className="hero-shade" /><div className="container hero-content"><div className="hero-lead"><p className="eyebrow">Form. Space. Perspective.</p><h1>Architecture in<br />its purest form.</h1></div><div className="hero-meta"><p>Considered spaces.<br />{" "}Enduring perspectives.</p><span className="eyebrow">{slides[active].number} / {slides[active].label}</span></div></div><div className="hero-controls"><div className="hero-indicators">{slides.map((slide, index) => <button key={slide.image} aria-label={`Show ${slide.label}`} aria-pressed={index === active} className={index === active ? "active" : ""} onClick={() => setActive(index)}><span /></button>)}</div><button className="slideshow-pause" aria-label={paused ? "Play slideshow" : "Pause slideshow"} onClick={() => setPaused(!paused)}>{paused ? <Play size={13} /> : <Pause size={13} />}</button></div></section>;
}
