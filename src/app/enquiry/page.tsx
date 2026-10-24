import type { Metadata } from "next";
import Image from "next/image";
import { EnquiryForm } from "@/components/enquiry-form";
import { ConsultationGuide } from "@/components/ui/accordion";
import { site } from "@/data/site";
export const metadata: Metadata = { title:"Enquire",description:"Begin a conversation with Atelier Arvena. Share your project, the spaces you imagine and the details that matter to you." };
export default function EnquiryPage() {
  return <><section className="enquiry-section"><div className="container enquiry-layout"><aside className="enquiry-aside"><Image src="/images/enquiry.jpg" alt="Warm timber and natural light in a thoughtfully composed interior" fill priority sizes="(max-width:991px) 88vw, 38vw" className="cover-image"/><p className="eyebrow">Enquiry</p><h1>Every space begins<br/>with a conversation.</h1><div className="enquiry-aside-contact"><p className="eyebrow">Atelier Arvena</p><p>Tell us about the place you imagine.<br/>A brief, a question, a possibility.</p><a href={`mailto:${site.email}`}>{site.email}</a><p>Architecture &amp; Interior Design<br/>Form. Space. Perspective.</p></div></aside><EnquiryForm/></div></section><section className="section consultation-section"><div className="container"><div className="guide-intro" data-reveal><div><p className="eyebrow">Before we begin</p><h2>Clarity from<br/>the first conversation.</h2></div><p>A thoughtful project starts with a shared understanding. Here is a little context for the conversations ahead, without assumptions about your brief, budget or timeline.</p></div><ConsultationGuide/></div></section></>;
}
