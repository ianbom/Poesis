import type { Metadata } from "next";
import { PagePlate, SectionHeading } from "@/components/shared";
import { ProjectBrowser } from "@/components/project-browser";
import { projects } from "@/data/projects";
export const metadata: Metadata = { title: "Work", description: "Explore Atelier Arvena's architecture, interior and landscape concepts. Sixteen considered perspectives on space, material and light." };
export default function WorkPage() {
  return <><PagePlate label={`Selected work / ${projects.length} perspectives`} title="Work" image="/images/project-05.jpg" alt="Pavilion North - a quiet horizontal composition in a garden setting" /><section className="section browse-section"><div className="container"><SectionHeading label="The collection" title="Architecture, interiors, and the spaces in between." /><ProjectBrowser /></div></section></>;
}
