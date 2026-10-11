import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const read=relative=>readFileSync(new URL("../"+relative,import.meta.url),"utf8");
const index=read("index.html");
const course=JSON.parse(read("content/course.json"));
const llms=read("llms.txt");
const sitemap=read("sitemap.xml");
const base="https://blame76.github.io/how-to-git/";

function metaContent(attribute,name){
 const line=index.split("\n").find(x=>x.includes("<meta "+attribute+'="'+name+'"'));
 assert.ok(line,"Fehlendes Meta-Tag "+name);
 return line.split('content="')[1].split('"')[0];
}

test("Startseite hat konsistente allgemeine SEO- und Social-Metadaten",()=>{
 const canonical=index.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
 assert.equal(canonical,base);
 assert.equal(metaContent("property","og:url"),base);
 assert.equal(metaContent("property","og:site_name"),"How to Git & GitHub");
 assert.equal(metaContent("property","og:type"),"website");
 assert.equal(metaContent("property","og:locale"),"de_DE");
 assert.equal(metaContent("name","twitter:card"),"summary");
 assert.equal(metaContent("name","description"),metaContent("property","og:description"));
 assert.ok(metaContent("property","og:title").includes("Git"));
 assert.match(index,/<link rel="describedby" type="text\/plain" href="\.\/llms\.txt">/);
});

test("JSON-LD ist gültig und spiegelt exakt die acht Kapitel wider",()=>{
 const raw=index.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
 assert.ok(raw,"JSON-LD fehlt");
 const schema=JSON.parse(raw);
 assert.equal(schema["@context"],"https://schema.org");
 const website=schema["@graph"].find(x=>x["@type"]==="WebSite");
 const learning=schema["@graph"].find(x=>x["@type"]==="Course");
 assert.equal(website.url,base);
 assert.equal(learning.url,base);
 assert.equal(learning.inLanguage,"de-DE");
 assert.equal(learning.isAccessibleForFree,true);
 assert.deepEqual(learning.hasPart.map(p=>p.name),course.modules.map(m=>m.title));
 for(let i=0;i<course.modules.length;i++){
   const m=course.modules[i],part=learning.hasPart[i];
   assert.equal(part.description,m.description);
   assert.equal(part.url,base+"#/lektion/"+m.id+"/"+m.steps[0].id);
 }
});

test("llms.txt verzeichnet alle Kapitel und vollständige Kursdaten",()=>{
 assert.match(llms,/^# How to Git & GitHub\n/);
 assert.ok(llms.includes(base+"content/course.json"));
 assert.ok(llms.includes("181 Pflicht-Lernschritte"));
 for(const chapter of course.modules){
  assert.ok(llms.includes(chapter.title),chapter.title);
  assert.ok(llms.includes("#/lektion/"+chapter.id+"/"+chapter.steps[0].id));
 }
});

test("Sitemap enthält nur die kanonische Startseite und keine Hash-Routen",()=>{
 assert.ok(sitemap.includes("<loc>"+base+"</loc>"));
 assert.equal((sitemap.match(/<loc>/g)||[]).length,1);
 assert.ok(!sitemap.includes("#/lektion/"));
});

test("Share-UI und Share-Code sind vollständig aus dem PR entfernt",()=>{
 const app=read("src/app.mjs"),css=read("assets/styles.css");
 for(const phrase of ["shareButton(","shareDraft(","share-inline","milestoneCard(","openShareDialog("]){
   assert.ok(!app.includes(phrase),"Unerwarteter Share-Bestandteil: "+phrase);
 }
 assert.ok(!css.includes(".share-inline"));
 assert.ok(!css.includes(".share-dialog"));
 for(const path of ["src/share.mjs","tests/share.test.mjs","docs/SHARING.md"]){
   assert.equal(existsSync(new URL("../"+path,import.meta.url)),false,path);
 }
});
