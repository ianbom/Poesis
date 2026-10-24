import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const candidates = JSON.parse(await readFile(new URL("../src/data/asset-candidates.json", import.meta.url), "utf8"));
const root = new URL("../public/images/", import.meta.url);
await mkdir(root, { recursive: true });
const covers = [["exterior",11],["landscape",3],["exterior",10],["exterior",6],["exterior",8],["exterior",13],["interior",7],["interior",4],["exterior",7],["interior",6],["architecture",7],["interior",12],["landscape",6],["exterior",4],["interior",9],["landscape",2]];
const extras = [["studio","exterior",10],["material","architecture",9],["enquiry","interior",6],["team-1","portrait",0],["team-2","portrait",14],["team-3","portrait",5],["team-4","portrait",11],["team-5","portrait",1]];
const selected = covers.map(([group,index], position) => ({ name:`project-${String(position+1).padStart(2,"0")}`, ...candidates[group][index], width:1920 }));
for (const group of ["exterior","interior","architecture","landscape"]) {
  candidates[group].forEach((photo,index) => {
    if (group === "exterior" && [0,9,14].includes(index) || group === "interior" && index === 3 || group === "architecture" && [0,3,13].includes(index)) return;
    selected.push({ name:`detail-${group}-${index}`, ...photo, width:1400 });
  });
}
extras.forEach(([name,group,index]) => selected.push({ name, ...candidates[group][index], width:name.startsWith("team")?700:1800 }));
const manifest = [];
for (let offset=0;offset<selected.length;offset+=8) {
  await Promise.all(selected.slice(offset,offset+8).map(async photo => {
    const url = new URL(photo.image); url.search = `?auto=format&fit=max&w=${photo.width}&q=85&fm=jpg`;
    const destination = new URL(`${photo.name}.jpg`,root);
    if (!existsSync(destination)) {
      const response = await fetch(url, { signal:AbortSignal.timeout(45000) });
      if (!response.ok) throw new Error(`${photo.name}: ${response.status}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes[0]!==255 || bytes[1]!==216) throw new Error(`${photo.name}: not a JPEG`);
      await writeFile(destination,bytes);
    }
    manifest.push({ file:`/images/${photo.name}.jpg`, source:photo.page, photographer:photo.author, originalAlt:photo.alt, download:url.href, license:"Unsplash License", licenseUrl:"https://unsplash.com/license", retrieved:"2026-10-24" });
    console.log(photo.name);
  }));
}
manifest.sort((first,second)=>first.file.localeCompare(second.file));
await writeFile(new URL("../src/data/assets.json",import.meta.url),JSON.stringify(manifest,null,2)+"\n");
