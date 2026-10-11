import { mkdtempSync, copyFileSync, cpSync, mkdirSync, rmSync, readdirSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const root=dirname(dirname(fileURLToPath(import.meta.url)));
const output=join(root,"dist");
execFileSync(process.execPath,[join(root,"scripts/check-publish.mjs")],{stdio:"inherit"});
rmSync(output,{recursive:true,force:true});
mkdirSync(output,{recursive:true});
for(const file of ["index.html","impressum.html","datenschutz.html","llms.txt","sitemap.xml",".nojekyll"]){
 copyFileSync(join(root,file),join(output,file));
}
for(const dir of ["assets","src","content"]) cpSync(join(root,dir),join(output,dir),{recursive:true});
console.log("Static Pages bundle prepared in dist/ (no tests, README, or workflows).");
