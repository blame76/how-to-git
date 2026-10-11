import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const course=JSON.parse(read("content/course.json"));
const step=(module,id)=>course.modules.find(m=>m.id===module).steps.find(s=>s.id===id);

test("Gemeldete inhaltliche Korrekturen sind in den Kursdaten vorhanden",()=>{
 const merge=step("branches-merge-rebase","frage-merge-fertig");
 assert.ok(merge.explanations.c.includes("kann den Merge tatsächlich abschließen"));
 assert.ok(merge.explanations.c.includes("Konfliktmarkern"));
 assert.ok(step("synchronisieren","vorher-status").body[0].includes("nicht auf die Festplatte"));
 assert.ok(step("synchronisieren","stand-auf-github").body[2].includes("genau einen Commit"));
 assert.ok(step("branches-merge-rebase","zweite-spur").body[1].includes("Nicht committete Änderungen"));
 assert.ok(step("git-mit-coding-agenten","eigenen-diff-lesen").command.includes("git diff HEAD"));
 assert.ok(step("sicherheit-automation","frage-action-pin").explanations.b.includes("üblicherweise"));
});

test("Range-diff-Praxis liefert das erklärte Ausrufezeichen im Wegwerf-Repository",()=>{
 const folder=mkdtempSync(join(tmpdir(),"how-to-git-range-"));
 try{
  const git=(...args)=>execFileSync("git",args,{cwd:folder,encoding:"utf8"});
  git("init","-b","main");
  git("config","user.name","Course Tester");
  git("config","user.email","course-tester@example.test");
  writeFileSync(join(folder,"README"),"Übungsrepository\n");
  git("add","README");
  git("commit","-m","start");
  const shell=step("werkzeuge-git-hasen","labor-vergleich-statt-ratearbeit").command;
  const output=execFileSync("bash",["-eu","-c",shell],{cwd:folder,encoding:"utf8"});
  assert.match(output,/! 1:/);
  assert.match(output,/Zeile 05/);
 } finally { rmSync(folder,{recursive:true,force:true}); }
});

test("Git kann aufgelösten Konflikt entgegen einer früheren Falschantwort mit commit -am abschließen",()=>{
 const folder=mkdtempSync(join(tmpdir(),"how-to-git-merge-"));
 try{
  const git=(...args)=>execFileSync("git",args,{cwd:folder,encoding:"utf8"});
  git("init","-b","main");
  git("config","user.name","Course Tester");
  git("config","user.email","course-tester@example.test");
  const file=join(folder,"file.txt");
  writeFileSync(file,"Version 1\n");git("add",".");git("commit","-m","Start");
  git("switch","-c","feature");writeFileSync(file,"Feature\n");git("commit","-am","Feature");
  git("switch","main");writeFileSync(file,"Main\n");git("commit","-am","Main");
  try {git("merge","feature"); assert.fail("Konflikt erwartet");}catch(error){if(error.name==="AssertionError")throw error;}
  writeFileSync(file,"Aufgelöst\n");
  git("commit","-am","Konflikt bereinigt");
  assert.equal(git("status","--porcelain").trim(),"");
  assert.equal(git("rev-list","--parents","-n","1","HEAD").trim().split(" ").length,3);
 }finally{rmSync(folder,{recursive:true,force:true});}
});

test("Impressum und Datenschutz nutzen die freigegebenen Angaben der bestehenden Website",()=>{
 const html=read("index.html");
 for(const page of ["impressum.html","datenschutz.html"]){
  assert.ok(html.includes('./'+page));
  const text=read(page);
  assert.match(text,/Benjamin Lam/);
  assert.match(text,/Schwachhauser Heerstraße 100/);
  assert.match(text,/28209 Bremen/);
  assert.match(text,/mailto:benjamin-lam@outlook\.de/);
  assert.ok(!text.includes("[[POSTAL_ADDRESS]]"));
  assert.ok(!text.includes("[[CONTACT_EMAIL]]"));
  assert.match(text,/name="robots" content="noindex, nofollow"/);
 }
});

test("Publish-Gate verweigert weiterhin das Deployment der ungeprüften Entwurfsseiten",()=>{
 try{
  execFileSync(process.execPath,[fileURLToPath(new URL("../scripts/check-publish.mjs",import.meta.url))],{stdio:"pipe"});
  assert.fail("Freigabe vor rechtlicher Prüfung erwartet");
 }catch(error){
  if(error.name==="AssertionError")throw error;
  assert.notEqual(error.status,0);
  assert.match(String(error.stderr),/Entwurfs-noindex noch aktiv/);
 }
});

test("MIT-Lizenz ist dokumentiert und Teil des statischen Pages-Bundles",()=>{
 const license=read("LICENSE"),readme=read("README.md"),builder=read("scripts/build-pages.mjs");
 assert.match(license,/^MIT License\n/);
 assert.match(license,/Copyright \(c\) 2026 Benjamin Lam/);
 assert.ok(readme.includes("[LICENSE](LICENSE)"));
 assert.ok(builder.includes('"LICENSE"'));
});

test("Deployment ist ausschließlich manuell aktivierbar",()=>{
 const workflow=read(".github/workflows/pages.yml");
 assert.match(workflow,/workflow_dispatch/);
 assert.ok(!workflow.includes("on:\n  push:"));
 assert.ok(workflow.includes("github.ref == 'refs/heads/main'"));
 assert.ok(workflow.includes("npm run build:pages"));
 assert.ok(workflow.includes("    permissions:\n      contents: read\n      pages: read\n"));
 assert.ok(existsSync(new URL("../.nojekyll",import.meta.url)));
});
