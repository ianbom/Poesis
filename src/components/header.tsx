"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";
import { navigation, site } from "@/data/site";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return <span className="brand"><svg className="monogram" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M3 33 16 7l13 26M9 22h14M22 7l8 17 8-17" stroke="currentColor" strokeWidth="1.5" /></svg><span className="brand-rule" /><span><span className="brand-name">ATELIER ARVENA</span>{!compact && <span className="brand-description">Architecture &amp; Interior Design</span>}</span></span>;
}
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href) || (href === "/projects" && pathname.startsWith("/project/"));
  return <header className="site-header"><div className="container header-inner"><Link href="/" className="brand-link" aria-label="Atelier Arvena home"><Wordmark /></Link><nav className="desktop-nav" aria-label="Main navigation">{navigation.map(item => <Link key={item.href} href={item.href} className={item.href === "/enquiry" ? "nav-enquire" : "nav-link"} aria-current={isActive(item.href) ? "page" : undefined}>{item.label}</Link>)}</nav><Sheet open={open} onOpenChange={setOpen}><SheetTrigger asChild><button className="menu-toggle" aria-label="Open navigation"><Menu size={25} strokeWidth={1.2} /></button></SheetTrigger><SheetContent><Wordmark compact /><nav className="mobile-nav" aria-label="Mobile navigation">{navigation.map((item, index) => <SheetClose asChild key={item.href}><Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined}><span className="eyebrow">0{index + 1}</span>{item.label}</Link></SheetClose>)}</nav><div className="mobile-contact"><p className="eyebrow">Form. Space. Perspective.</p><a href={`mailto:${site.email}`}>{site.email}</a></div></SheetContent></Sheet></div></header>;
}
