import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { emptyProgress, completeStep } from "../src/progress.mjs";
import {
  PUBLIC_COURSE_URL, overallProgress, shareQuestion, publicStepUrl,
  shareDraft, shareCopy
} from "../src/share.mjs";

const course = JSON.parse(readFileSync(new URL("../content/course.json", import.meta.url), "utf8"));
const chapter = course.modules[0];
const step = chapter.steps[0];
const quiz = chapter.steps.find(item => item.type === "quiz");
const team = course.modules.find(item => item.id === "github-im-team");

test("Fortschrittszähler behält 181 Pflichtschritte in acht Kapiteln", () => {
  assert.equal(course.modules.length, 8);
  assert.deepEqual(overallProgress(course, emptyProgress()), {done:0,total:181});
  const all = course.modules.reduce((acc, module) => module.steps.filter(s => s.type !== "expert")
    .reduce((a, s) => completeStep(a, module.id, s.id), acc), emptyProgress());
  assert.deepEqual(overallProgress(course, all), {done:181,total:181});
});

test("Originalfrage bleibt auch als längeres Szenario erhalten", () => {
  assert.equal(shareQuestion(quiz),quiz.prompt.trim().replace(/\s+/g," "));
  assert.equal(shareQuestion({title:"Staging",type:"reading"}), "Was steckt hinter „Staging“?");
  assert.equal(shareQuestion({title:"Rettung?",type:"reading"}), "Rettung?");
  assert.equal(shareQuestion({title:"X",type:"quiz",prompt:"Sehr lang ".repeat(40)}),
    "Sehr lang ".repeat(40).trim());
  assert.equal(shareQuestion({title:"Unwichtig",shareQuestion:" Warum jetzt?  "}),"Warum jetzt?");
});

test("Kapitel 04 teilt die konkrete Frage statt des Erfolgszählers", () => {
  const firstQuiz=team.steps.find(s=>s.type==="quiz");
  const share=shareDraft({module:team,step:firstQuiz,kind:"chapter",linkStep:team.steps[0]});
  assert.equal(share.text,firstQuiz.prompt+
    "\n\nEine Frage zum Weiterdenken. Mehr dazu im kostenlosen Lernprojekt How to Git & GitHub.");
  assert.ok(share.text.startsWith("Jemand schreibt im Teamchat: „Der Button ist kaputt.“"));
  assert.ok(!share.text.includes("25 / 25"));
  assert.ok(!share.text.includes("Kapitel 04 geschafft"));
  assert.equal(share.url,PUBLIC_COURSE_URL+"#/lektion/github-im-team/was-ist-eigentlich-die-aufgabe");
});

test("Abschnittslinks sind stabil und passend zu Pages-Unterverzeichnis", () => {
  const url=publicStepUrl(chapter,step);
  assert.equal(url,PUBLIC_COURSE_URL+"#/lektion/"+chapter.id+"/"+step.id);
  assert.equal(publicStepUrl({id:"k a"},{id:"a/b"}),PUBLIC_COURSE_URL+"#/lektion/k%20a/a%2Fb");
});

test("Einzelschritt, Kapitel und Kurs verwenden identischen Frage-Text, aber sinnvoll unterschiedliche Links", () => {
  const context={course,module:chapter,step:quiz,progress:emptyProgress()};
  const single=shareDraft({...context,kind:"step"});
  const chapterShare=shareDraft({...context,kind:"chapter",linkStep:chapter.steps[0]});
  const courseShare=shareDraft({...context,kind:"course"});
  assert.equal(single.text,chapterShare.text);
  assert.equal(chapterShare.text,courseShare.text);
  assert.ok(!single.text.includes("Eine Git-Frage aus Kapitel"));
  assert.ok(!single.text.includes("12 / 12"));
  assert.ok(single.url.includes(quiz.id));
  assert.ok(chapterShare.url.includes(chapter.steps[0].id));
  assert.equal(courseShare.url,PUBLIC_COURSE_URL);
  assert.equal(shareCopy(single),single.text+"\n\n"+single.url);
  assert.ok(!single.url.includes("completed"));
  for (const key of quiz.correct) assert.ok(!single.text.includes(quiz.explanations[key]));
});
