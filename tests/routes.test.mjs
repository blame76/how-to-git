import test from "node:test";
import assert from "node:assert/strict";
import { decodeHashRoute } from "../src/routes.mjs";

test("Hash-Routen werden dekodiert", () => {
  assert.equal(decodeHashRoute("#/lektion/git-modell/frage"), "lektion/git-modell/frage");
  assert.equal(decodeHashRoute("#/lektion/kapitel%20eins/schritt"), "lektion/kapitel eins/schritt");
});

test("Ungültige Prozentkodierung ergibt sicher die Startansicht", () => {
  assert.equal(decodeHashRoute("#/%"), "");
  assert.equal(decodeHashRoute("#/lektion/git-modell/%E0%A4%A"), "");
});
