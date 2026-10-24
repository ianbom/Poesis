import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projects, getProject, getNextProject } from "@/data/projects";
import { ProjectGallery } from "@/components/project-gallery";

export function generateStaticParams() { return projects.map(project => ({ slug: project.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return { title: "Project not found" };
  return { title: project.title, description: project.description, openGraph: { title: `${project.title} - Atelier Arvena`, description: project.description, images: [{ url: project.image }] } };
}
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const next = getNextProject(project.slug)!;
  return <><section className="detail-hero"><Image src={project.image} alt={`${project.title} - ${project.description}`} fill priority sizes="100vw" className="cover-image" /><div className="plate-shade" /><div className="container detail-hero-content"><p className="eyebrow">{project.location} <span aria-hidden="true">/</span> {project.year}</p><h1>{project.title}</h1></div></section><section className="detail-meta-section"><div className="container detail-meta">{[["Discipline",project.category],["Setting",project.location],["Year",String(project.year)],["Design stage",project.stage]].map(([label,value]) => <div key={label}><h2 className="eyebrow">{label}</h2><p>{value}</p></div>)}</div></section><section className="section detail-story-section"><div className="container detail-story" data-reveal><div><p className="eyebrow">The idea</p><h2>{project.description}</h2><div className="material-list"><p className="eyebrow">Material palette</p><p>{project.materials.join(" / ")}</p></div></div><div className="story-copy">{project.narrative.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<Link className="text-link" href="/enquiry">Discuss a similar direction <ArrowUpRight size={17} strokeWidth={1.3} /></Link></div></div></section><section className="section detail-gallery-section"><div className="container"><p className="eyebrow gallery-label">Gallery / 0{project.gallery.length} perspectives</p><ProjectGallery images={project.gallery} title={project.title} /></div></section><section className="detail-next"><div className="container next-project-layout"><div><p className="eyebrow">Next perspective</p><Link className="next-project-title" href={`/project/${next.slug}`}>{next.title}<ArrowUpRight size={35} strokeWidth={1} /></Link><Link href="/projects" className="text-link"><ArrowLeft size={16} strokeWidth={1.3} />Back to Work</Link></div><Link href={`/project/${next.slug}`} className="next-project-image" aria-label={`View ${next.title}`}><Image src={next.image} alt={next.title} fill sizes="(max-width:640px) 40vw, 25vw" className="cover-image" /></Link></div></section></>;
}
