import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  return (
    <Link href={`/project/${project.slug}`} className={cn("project-card", featured && "featured-card")}>
      <div className="project-image">
        <Image src={project.image} alt={`${project.title} - ${project.description}`} fill sizes={featured ? "(max-width:640px) 88vw, 44vw" : "(max-width:640px) 88vw, (max-width:991px) 42vw, 22vw"} className="cover-image" />
        <span className="project-discover">View project <ArrowUpRight size={18} strokeWidth={1.3} /></span>
      </div>
      <div className="project-caption">
        <div><h3>{project.title}</h3><p>{project.category} <span aria-hidden="true">&middot;</span> {project.year}</p></div>
        <ArrowUpRight className="project-arrow" size={19} strokeWidth={1.2} />
      </div>
    </Link>
  );
}
