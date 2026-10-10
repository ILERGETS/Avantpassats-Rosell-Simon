/**
 * Helpers purs per al menú d’impressió / descàrrega.
 * Compatible amb Node (tests) i amb el navegador (global QVPrint).
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.QVPrint = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function normalizeLang(lg, langs, fallback) {
    var list = langs || [];
    var fb = fallback || "ca";
    if (lg && list.indexOf(lg) !== -1) return lg;
    if (list.indexOf(fb) !== -1) return fb;
    return list[0] || fb;
  }

  function shouldShowOpts(printLang) {
    return typeof printLang === "string" && printLang.length > 0;
  }

  /** Opcions de descàrrega un cop hi ha llengua. */
  function printChoices() {
    return ["arbre", "arbre-a3", "llibre"];
  }

  return {
    normalizeLang: normalizeLang,
    shouldShowOpts: shouldShowOpts,
    printChoices: printChoices
  };
});
