import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { projects, categories, filterProjects, getProject, getNextProject } from "../src/data/projects";

test("sixteen unique concepts have complete content and local images", () => {
  assert.equal(projects.length,16);
  for (const key of ["id","slug","title","image"] as const) assert.equal(new Set(projects.map(project => project[key])).size,16);
  for (const project of projects) {
    assert.equal(project.stage,"Concept");
    assert.ok(project.narrative.length >= 2);
    assert.ok(new Set(project.gallery).size >= 3);
    for (const image of [project.image,...project.gallery]) assert.ok(existsSync(`public${image}`),image);
  }
});
test("filters match tags and do not invent categories", () => {
  assert.deepEqual(filterProjects("All"),projects);
  for (const category of categories.slice(1)) {
    const filtered = filterProjects(category);
    assert.ok(filtered.length > 0);
    assert.ok(filtered.every(project => project.tags.includes(category)));
  }
  assert.deepEqual(filterProjects("unknown"),[]);
});
test("project navigation resolves and cycles; unknown slugs stay unknown", () => {
  for (const project of projects) assert.equal(getProject(project.slug),project);
  assert.equal(getNextProject(projects.at(-1)!.slug),projects[0]);
  assert.equal(getProject("missing"),undefined);
  assert.equal(getNextProject("missing"),undefined);
});
