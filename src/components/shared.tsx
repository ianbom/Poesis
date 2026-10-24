import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { principles, team } from "@/data/site";

export function SectionHeading({ label, title, link }: { label: string; title: string; link?: { href: string; label: string } }) {
  return <div className="section-heading" data-reveal><div><p className="eyebrow">{label}</p><h2>{title}</h2></div>{link && <Link className="text-link" href={link.href}>{link.label}<ArrowUpRight size={17} strokeWidth={1.3} /></Link>}</div>;
}
export function PagePlate({ label, title, image, alt }: { label: string; title: string; image: string; alt: string }) {
  return <section className="page-plate"><Image src={image} alt={alt} fill priority sizes="100vw" className="cover-image" /><div className="plate-shade" /><div className="container plate-content"><p className="eyebrow">{label}</p><h1>{title}</h1></div></section>;
}
export function Principles() {
  return <section className="section section-raised"><div className="container"><SectionHeading label="How we work" title="Three principles. One considered practice." /><div className="principles-grid">{principles.map((principle, index) => <article key={principle.title} data-reveal><span className="eyebrow accent">0{index + 1}</span><h3>{principle.title}</h3><p>{principle.description}</p></article>)}</div></div></section>;
}
export function Team() {
  return <section className="section team-section"><div className="container"><SectionHeading label="People" title="Different perspectives. A shared intention." /><div className="team-grid">{team.map(person => <article key={person.name} className="team-person" data-reveal><div className="team-image"><Image src={person.image} alt={`${person.name} - ${person.role}`} fill sizes="(max-width:560px) 44vw, (max-width:991px) 28vw, 18vw" className="cover-image" /></div><h3>{person.name}</h3><p className="eyebrow">{person.role}</p></article>)}</div></div></section>;
}
export function ContactCTA() {
  return <section className="contact-cta"><div className="container" data-reveal><p className="eyebrow">A conversation, a beginning</p><h2>A new space begins<br />with a conversation.</h2><p>Tell us what you imagine. We&apos;ll explore how to bring it into form.</p><Link className="button button-light" href="/enquiry">Start a Project<ArrowUpRight size={17} strokeWidth={1.3} /></Link></div></section>;
}
