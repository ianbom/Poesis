import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Wordmark } from "@/components/header";
import { navigation, services, site } from "@/data/site";

export function Footer() {
  return <footer className="site-footer"><div className="container"><div className="footer-grid"><div className="footer-brand"><Link href="/" aria-label="Atelier Arvena home"><Wordmark compact /></Link><p>A contemporary architecture and interior design practice. Considered spaces, refined materials, enduring perspectives.</p><span className="eyebrow">Form. Space. Perspective.</span></div><div><h2 className="eyebrow">Begin a conversation</h2><a className="footer-email" href={`mailto:${site.email}`}>{site.email}</a><Link className="text-link" href="/enquiry">Start an enquiry <ArrowUpRight size={15} /></Link></div><div><h2 className="eyebrow">Explore</h2><ul>{navigation.map(item => <li key={item.href}><Link href={item.href}>{item.label}</Link></li>)}</ul></div><div><h2 className="eyebrow">Disciplines</h2><ul>{services.slice(0, 5).map(service => <li key={service.title}><Link href="/about#disciplines">{service.title}</Link></li>)}</ul></div></div><div className="footer-bottom"><p>&copy; {new Date().getFullYear()} Atelier Arvena</p><p>Architecture in its purest form.</p><a href="#top">Back to top <span aria-hidden="true">&#8593;</span></a></div></div></footer>;
}
