"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";

export function ConsultationGuide() {
  const items = [
    ["The first conversation", "Tell us about the place, the people who will use it, and the possibilities you see. Site information, a rough brief and a few images are useful starting points, but a fully formed idea is not necessary."],
    ["A considered scope", "We explore the disciplines your project may need, the decisions already made, and the questions still open. Together, these define a clear starting point for the design process."],
    ["Time and investment", "Every project has its own scale and complexity. A proposed scope, programme and fee would be discussed directly before any appointment. No figures are calculated or agreed through this form."],
    ["What happens next", "Review your enquiry and open an email draft. Add any plans or reference images in your email client, then send it when you are ready. Nothing is transmitted by this website."],
  ];
  return <AccordionPrimitive.Root type="single" collapsible defaultValue="guide-0" className="guide-accordion">{items.map(([title, text], index) => <AccordionPrimitive.Item value={`guide-${index}`} key={title} className="guide-item"><AccordionPrimitive.Header><AccordionPrimitive.Trigger className="guide-trigger"><span className="eyebrow">0{index + 1}</span><span>{title}</span><Plus size={19} strokeWidth={1.2} /></AccordionPrimitive.Trigger></AccordionPrimitive.Header><AccordionPrimitive.Content className="guide-content"><p>{text}</p></AccordionPrimitive.Content></AccordionPrimitive.Item>)}</AccordionPrimitive.Root>;
}
