import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const read = path => readFileSync(new URL("../"+path,import.meta.url),"utf8");
const files=["impressum.html","datenschutz.html"];
for(const file of files) {
 const html=read(file);
 assert.ok(!/\[\[[A-Z_]+\]\]/.test(html),file+": Anbieter-/Kontaktangaben fehlen");
 assert.ok(!/content="noindex, nofollow"/.test(html),file+": Entwurfs-noindex noch aktiv");
 assert.ok(!/Entwurf vor Veröffentlichung|Entwurfsfassung, vor Livegang/.test(html),file+": Entwurfskennzeichnung noch vorhanden");
}
const index=read("index.html");
assert.ok(index.includes('./impressum.html') && index.includes('./datenschutz.html'),"Links im Footer fehlen");
console.log("Publish gate: Rechtstexte ausgefüllt und freigegeben.");
