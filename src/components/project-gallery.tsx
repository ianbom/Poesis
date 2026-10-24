"use client";

import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import { useState } from "react";

export function ProjectGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const move = (direction: number) => setActive(previous => (previous + direction + images.length) % images.length);
  return <Dialog.Root open={open} onOpenChange={setOpen}><div className="project-gallery">{images.map((image, index) => <Dialog.Trigger asChild key={image}><button className={`gallery-tile gallery-tile-${index}`} onClick={() => setActive(index)} aria-label={`Expand ${title} image ${index + 1}`}><Image src={image} alt={`${title} - ${index === 0 ? "architectural perspective" : index === 1 ? "material and spatial study" : "detail and atmosphere"}`} fill sizes="(max-width:640px) 88vw, 48vw" className="cover-image" /><span className="gallery-expand"><Expand size={19} strokeWidth={1.3} /></span><span className="gallery-index eyebrow">0{index + 1}</span></button></Dialog.Trigger>)}</div><Dialog.Portal><Dialog.Overlay className="gallery-overlay" /><Dialog.Content className="gallery-dialog" onKeyDown={event => { if (event.key === "ArrowRight") move(1); if (event.key === "ArrowLeft") move(-1); }}><Dialog.Title className="sr-only">{title} gallery</Dialog.Title><Dialog.Description className="sr-only">Use the previous and next buttons or arrow keys to browse. Escape closes the gallery.</Dialog.Description><div className="lightbox-image"><Image src={images[active]} alt={`${title} - gallery image ${active + 1}`} fill sizes="95vw" style={{ objectFit: "contain" }} /></div><div className="lightbox-bottom"><p>{title} <span className="muted">/ {active + 1} of {images.length}</span></p><div><button onClick={() => move(-1)} aria-label="Previous image"><ArrowLeft size={22} strokeWidth={1.3} /></button><button onClick={() => move(1)} aria-label="Next image"><ArrowRight size={22} strokeWidth={1.3} /></button></div></div><Dialog.Close className="gallery-close" aria-label="Close gallery"><X size={25} strokeWidth={1.3} /></Dialog.Close></Dialog.Content></Dialog.Portal></Dialog.Root>;
}
