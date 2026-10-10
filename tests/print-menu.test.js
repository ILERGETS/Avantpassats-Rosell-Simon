"use strict";

var assert = require("assert");
var fs = require("fs");
var path = require("path");
var QVPrint = require("../print-menu.js");

var root = path.join(__dirname, "..");

// Cas esperat: llengua vàlida
assert.strictEqual(QVPrint.normalizeLang("es", ["ca", "es", "en", "bg"], "ca"), "es");
assert.strictEqual(QVPrint.shouldShowOpts("ca"), true);
assert.deepStrictEqual(QVPrint.printChoices(), ["arbre", "arbre-a3", "llibre"]);

// Cas límit: llengua buida / desconeguda
assert.strictEqual(QVPrint.normalizeLang("", ["ca", "es"], "ca"), "ca");
assert.strictEqual(QVPrint.normalizeLang("xx", ["ca", "es"], "es"), "es");
assert.strictEqual(QVPrint.shouldShowOpts(""), false);
assert.strictEqual(QVPrint.shouldShowOpts(null), false);

// Fallada: sense llista de llengües
assert.strictEqual(QVPrint.normalizeLang("en", [], "ca"), "ca");
assert.strictEqual(QVPrint.normalizeLang("en", null, "bg"), "bg");

// Integració estàtica: botons d’arbre amb amplada igual (grid)
var css = fs.readFileSync(path.join(root, "app.css"), "utf8");
assert.ok(/\.accions-arbre\s*\{[^}]*grid-template-columns:\s*1fr 1fr/s.test(css), "accions-arbre ha de tenir columnes iguals");
assert.ok(/\.printmenu \.print-opts a[\s\S]*width:\s*100%/m.test(css), "opcions d’impressió amb amplada igual");
assert.ok(/html\.js \[data-page\]\s*\{\s*display:\s*block\s*!important/m.test(css), "impressió del llibre complet: totes les pàgines");

var html = fs.readFileSync(path.join(root, "index.html"), "utf8");
assert.ok(html.indexOf('id="printmenu"') !== -1, "cal el menú d’impressió");
assert.ok(html.indexOf('data-print-lang="ca"') !== -1, "cal selector de llengua al menú");
assert.ok(html.indexOf('data-print="llibre"') !== -1, "cal opció llibre complet");

var i18n = JSON.parse(fs.readFileSync(path.join(root, "i18n.json"), "utf8"));
["ca", "es", "en", "bg"].forEach(function (lg) {
  assert.ok(i18n.ui[lg].print_lang, "falta print_lang en " + lg);
  assert.ok(i18n.ui[lg].print_llibre, "falta print_llibre en " + lg);
});

console.log("OK: tests/print-menu.test.js");
