"use client";

import { useState } from "react";
import { categories, filterProjects } from "@/data/projects";
import { ProjectCard } from "@/components/projects";

export function ProjectBrowser() {
  const [active, setActive] = useState<string>("All");
  const visible = filterProjects(active);
  const groups = ["Architecture", "Interior", "Landscape"].map(category => ({ category, items: visible.filter(project => project.category === category) })).filter(group => group.items.length);
  return <><div className="filter-navigation" role="group" aria-label="Filter projects by category">{categories.map(category => <button key={category} onClick={() => setActive(category)} aria-pressed={active === category} className={active === category ? "active" : ""}>{category}</button>)}</div><p className="sr-only" role="status">{visible.length} projects shown{active !== "All" ? ` in ${active}` : ""}.</p><div className="browse-groups" key={active}>{groups.map(group => <section className="browse-group" key={group.category} aria-label={`${group.category} projects`}><div className="group-title"><h3 className="eyebrow">{group.category}</h3><span className="eyebrow">{String(group.items.length).padStart(2,"0")}</span></div><div className="browse-grid">{group.items.map(project => <ProjectCard project={project} key={project.id} />)}</div></section>)}</div></>;
}
