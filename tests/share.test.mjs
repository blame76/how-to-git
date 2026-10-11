import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { emptyProgress, completeStep } from "../src/progress.mjs";
import {
  PUBLIC_COURSE_URL, overallProgress, shareQuestion, publicStepUrl,
  isPublishedLocation, shareDraft, shareCopy
} from "../src/share.mjs";

const course = JSON.parse(readFileSync(new URL("../content/course.json", import.meta.url), "utf8"));
const chapter = course.modules[0];
const step = chapter.steps[0];
const quiz = chapter.steps.find(item => item.type === "quiz");

test("181 Pflichtschritte in acht Kapiteln, Boni werden nicht mitgezählt", () => {
  assert.equal(course.modules.length, 8);
  assert.deepEqual(overallProgress(course, emptyProgress()), {done:0,total:181});
  const all = course.modules.reduce((acc, module) => module.steps.filter(s => s.type !== "expert")
    .reduce((a, s) => completeStep(a, module.id, s.id), acc), emptyProgress());
  assert.deepEqual(overallProgress(course, all), {done:181,total:181});
});

test("Frage recycelt vorhandenen Inhalt und verrät keine Antwort", () => {
  assert.equal(shareQuestion(quiz), quiz.prompt.trim().replace(/\s+/g, " "));
  assert.equal(shareQuestion({title:"Staging",type:"reading"}), "Was steckt hinter „Staging“?");
  assert.equal(shareQuestion({title:"Rettung?",type:"reading"}), "Rettung?");
  assert.equal(shareQuestion({title:"X",type:"quiz",prompt:"Sehr lang ".repeat(40)}),
    "Wie würdest du bei „X“ entscheiden?");
  assert.equal(shareQuestion({title:"Unwichtig",shareQuestion:" Warum jetzt?  "}),"Warum jetzt?");
});

test("Abschnittslinks sind stabil und bei Pages korrekt im Unterverzeichnis", () => {
  const url = publicStepUrl(chapter, step);
  assert.equal(url, PUBLIC_COURSE_URL + "#/lektion/" + chapter.id + "/" + step.id);
  assert.equal(publicStepUrl({id:"k a"}, {id:"a/b"}), PUBLIC_COURSE_URL + "#/lektion/k%20a/a%2Fb");
});

test("Lokale und private Vorschau wird nicht als veröffentlicht behandelt", () => {
  assert.equal(isPublishedLocation("http://localhost:8000/#/"), false);
  assert.equal(isPublishedLocation("file:///tmp/index.html"), false);
  assert.equal(isPublishedLocation("https://github.com/blame76/how-to-git"), false);
  assert.equal(isPublishedLocation(PUBLIC_COURSE_URL + "#/lektion/a/b"), true);
  assert.equal(isPublishedLocation("https://blame76.github.io/anderes/"), false);
});

test("Einzelabschnitte, Kapitel und Kurs erzeugen unterschiedliche Texte und Ziele", () => {
  const state = chapter.steps.filter(s => s.type !== "expert").reduce((p,s) =>
    completeStep(p, chapter.id, s.id), emptyProgress());
  const base={course,module:chapter,step:quiz,progress:state};
  const one=shareDraft({...base,kind:"step"});
  const chapterShare=shareDraft({...base,kind:"chapter"});
  const courseShare=shareDraft({...base,kind:"course"});
  assert.notEqual(one.text,chapterShare.text);
  assert.notEqual(chapterShare.text,courseShare.text);
  assert.match(one.text,/Eine Git-Frage/);
  assert.match(chapterShare.text,/12 \/ 12/);
  assert.match(courseShare.text,/12 \/ 181/);
  assert.equal(courseShare.url,PUBLIC_COURSE_URL);
  assert.ok(one.url.includes(quiz.id));
  assert.equal(shareCopy(one),one.text+"\n\n"+one.url);
  assert.ok(!one.url.includes("completed"));
  for(const forbidden of quiz.correct) assert.ok(!one.text.includes(quiz.explanations[forbidden]));
});
