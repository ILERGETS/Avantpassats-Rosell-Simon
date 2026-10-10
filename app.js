(function () {
  document.documentElement.classList.add("js");
  var fs = 18;
  function $(id) { return document.getElementById(id); }
  function show(hash) {
    var id = (hash || location.hash || "#portada").replace(/^#/, "") || "portada";
    var pages = document.querySelectorAll("[data-page]");
    var found = false;
    pages.forEach(function (el) {
      var on = el.getAttribute("data-page") === id;
      el.classList.toggle("on", on);
      if (on) found = true;
    });
    if (!found) {
      var p0 = document.querySelector("[data-page='portada']");
      if (p0) p0.classList.add("on");
      id = "portada";
    }
    document.querySelectorAll("aside a[href^='#']").forEach(function (a) {
      a.classList.toggle("act", a.getAttribute("href") === "#" + id);
    });
    var vista = $("vista");
    if (vista) vista.scrollTop = 0;
  }
  function setMode(mode) {
    document.querySelectorAll(".encarada").forEach(function (box) {
      box.querySelectorAll("[data-mode]").forEach(function (t) {
        t.hidden = t.getAttribute("data-mode") !== mode;
      });
      box.querySelectorAll(".modes button").forEach(function (b) {
        b.classList.toggle("act", b.getAttribute("data-setmode") === mode);
      });
    });
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-setmode]");
    if (b) { e.preventDefault(); setMode(b.getAttribute("data-setmode")); }
    if (e.target.id === "btn-mes") { fs = Math.min(24, fs + 1); document.documentElement.style.setProperty("--fs", fs + "px"); }
    if (e.target.id === "btn-menys") { fs = Math.max(14, fs - 1); document.documentElement.style.setProperty("--fs", fs + "px"); }
    if (e.target.id === "btn-tema") {
      var cur = document.documentElement.getAttribute("data-theme") === "dark" ? "" : "dark";
      document.documentElement.setAttribute("data-theme", cur);
    }
    if (e.target.id === "btn-print") { window.print(); }
    var f = e.target.closest("[data-filtre]");
    if (f) {
      var cap = f.getAttribute("data-filtre");
      document.querySelectorAll("[data-filtre]").forEach(function (x) {
        x.classList.toggle("act", x === f);
      });
      document.querySelectorAll("aside a[data-cap]").forEach(function (a) {
        a.style.display = (!cap || a.getAttribute("data-cap") === cap) ? "" : "none";
      });
    }
  });
  $("cerca").addEventListener("input", function () {
    var q = this.value.trim().toLowerCase();
    document.querySelectorAll("aside a[data-search]").forEach(function (a) {
      var ok = !q || (a.getAttribute("data-search") || "").indexOf(q) !== -1;
      a.style.display = ok ? "" : "none";
    });
  });
  window.addEventListener("hashchange", function () { show(); });
  setMode("resum");
  show();
})();
