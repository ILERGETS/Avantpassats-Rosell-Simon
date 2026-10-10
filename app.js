(function () {
  document.documentElement.classList.add("js");
  var fs = 18;
  function $(id) { return document.getElementById(id); }
  var I18N = {};
  try {
    I18N = JSON.parse(($("i18n-data") && $("i18n-data").textContent) || "{}");
  } catch (e) { I18N = {}; }
  var LANGS = I18N.langs || ["ca"];
  var lang = "ca";
  try {
    var saved = localStorage.getItem("qv_lang");
    if (saved && LANGS.indexOf(saved) !== -1) lang = saved;
  } catch (e2) {}
  function U() {
    return (I18N.ui && (I18N.ui[lang] || I18N.ui.ca)) || {};
  }
  function filtreActiu() {
    var on = document.querySelector(".chip.on, [data-filtre].on, [data-filtre].act");
    return on ? (on.getAttribute("data-filtre") || "") : "";
  }
  function applyLlista() {
    var cap = filtreActiu();
    var q = ($("cerca") && $("cerca").value.trim().toLowerCase()) || "";
    var n = 0, tot = 0;
    document.querySelectorAll(".lc").forEach(function (a) {
      tot += 1;
      var okCap = !cap || a.getAttribute("data-cap") === cap;
      var okQ = !q || (a.getAttribute("data-search") || "").indexOf(q) !== -1;
      var ok = okCap && okQ;
      a.style.display = ok ? "" : "none";
      if (ok) n += 1;
    });
    if (q && location.hash.replace(/^#/, "") !== "index-quadern") {
      location.hash = "index-quadern";
    }
    var c = $("count");
    if (c && tot) {
      var fmt = U().count || "{n} de {tot} cares";
      c.textContent = fmt.replace("{n}", String(n)).replace("{tot}", String(tot));
    }
  }
  function applyI18n() {
    document.querySelectorAll(".i18n").forEach(function (el) {
      el.hidden = el.getAttribute("data-l") !== lang;
    });
  }
  function updateMapLang() {
    var el = document.getElementById("map-dietari");
    if (!el || !el._pts || !el._marks) return;
    el._pts.forEach(function (p, i) {
      var q = (p.que_i18n && p.que_i18n[lang]) || p.que;
      if (el._marks[i]) {
        el._marks[i].bindPopup("<strong>" + p.nom + "</strong><br>" + q);
      }
    });
  }
  function setLang(lg) {
    if (LANGS.indexOf(lg) === -1) lg = "ca";
    lang = lg;
    try { localStorage.setItem("qv_lang", lang); } catch (e3) {}
    document.documentElement.lang = (I18N.html && I18N.html[lang]) || lang;
    applyI18n();
    var cerca = $("cerca");
    if (cerca) {
      cerca.placeholder = U().search || "";
      cerca.setAttribute("aria-label", U().search || "");
    }
    var tmap = { "btn-menys": "font_minus", "btn-mes": "font_plus", "btn-tema": "dark", "btn-print": "print", "btn-menu": "menu" };
    Object.keys(tmap).forEach(function (id) {
      var el = $(id);
      if (el && U()[tmap[id]]) el.title = U()[tmap[id]];
      if (id === "btn-menu" && el && U().menu) el.setAttribute("aria-label", U().menu);
    });
    var lab = $("lang-lab");
    if (lab) lab.textContent = (I18N.label && I18N.label[lang]) || lang;
    var lbtn = $("langbtn");
    var srcImg = document.querySelector('#langmenu button[data-l="' + lang + '"] img');
    if (lbtn && srcImg) {
      var img = lbtn.querySelector("img");
      if (img) img.src = srcImg.getAttribute("src");
      lbtn.setAttribute("aria-expanded", "false");
    }
    document.querySelectorAll("#langmenu button").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-l") === lang);
    });
    var menu = $("langmenu");
    if (menu) menu.classList.remove("on");
    var prev = $("nav-prev");
    if (prev) prev.textContent = U().prev || prev.textContent;
    var next = $("nav-next");
    if (next) next.textContent = U().next || next.textContent;
    var np = $("nav-peu");
    if (np && U().nav_pages) np.setAttribute("aria-label", U().nav_pages);
    applyLlista();
    updateMapLang();
  }
  var ORDRE_FRONT = [
    "portada", "sobre", "proleg", "agraiments", "fet",
    "context", "magi", "qui", "arbre", "temps", "notes", "mapa",
    "index-quadern"
  ];
  function pageIds() {
    var cares = [];
    document.querySelectorAll("[data-page]").forEach(function (el) {
      var pid = el.getAttribute("data-page") || "";
      if (/^\d{2}-(esquerra|dreta)$/.test(pid) && pid !== "31-dreta") cares.push(pid);
    });
    return ORDRE_FRONT.concat(cares, ["comiat"]);
  }
  function goTop() {
    var z = function () {
      var vista = $("vista");
      if (vista) vista.scrollTop = 0;
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    z();
    requestAnimationFrame(function () { requestAnimationFrame(z); });
  }
  function updatePeu(id) {
    var ids = pageIds();
    var i = ids.indexOf(id);
    var prev = $("nav-prev");
    var next = $("nav-next");
    if (!prev || !next) return;
    if (i > 0) {
      prev.href = "#" + ids[i - 1];
      prev.classList.remove("is-off");
    } else {
      prev.removeAttribute("href");
      prev.classList.add("is-off");
    }
    if (i >= 0 && i < ids.length - 1) {
      next.href = "#" + ids[i + 1];
      next.classList.remove("is-off");
    } else {
      next.removeAttribute("href");
      next.classList.add("is-off");
    }
  }
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
    document.querySelectorAll("aside details.nav-grup").forEach(function (d) {
      if (d.querySelector("a.act")) d.open = true;
    });
    updatePeu(id);
    goTop();
    if (id === "mapa") initMap();
    setNav(false);
  }
  function setNav(on) {
    document.documentElement.classList.toggle("nav-open", !!on);
    var b = $("btn-menu");
    if (b) b.setAttribute("aria-expanded", on ? "true" : "false");
  }
  var mapObj = null;
  function initMap() {
    var el = document.getElementById("map-dietari");
    var raw = document.getElementById("punts-mapa");
    if (!el || !raw || typeof L === "undefined") return;
    var pts = JSON.parse(raw.textContent || "[]");
    if (!pts.length) return;
    if (!mapObj) {
      mapObj = L.map(el);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap"
      }).addTo(mapObj);
      el._marks = pts.map(function (p) {
        var q0 = (p.que_i18n && p.que_i18n[lang]) || p.que;
        return L.marker([p.lat, p.lon]).addTo(mapObj).bindPopup(
          "<strong>" + p.nom + "</strong><br>" + q0
        );
      });
      el._pts = pts;
    }
    var b = L.latLngBounds(pts.map(function (p) { return [p.lat, p.lon]; }));
    mapObj.fitBounds(b, { padding: [28, 28], maxZoom: 8 });
    setTimeout(function () { mapObj.invalidateSize(); }, 250);
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
    applyI18n();
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
    if (e.target.id === "langbtn" || e.target.closest("#langbtn")) {
      e.preventDefault();
      var lm = $("langmenu");
      if (lm) {
        lm.classList.toggle("on");
        var lb0 = $("langbtn");
        if (lb0) lb0.setAttribute("aria-expanded", lm.classList.contains("on") ? "true" : "false");
      }
    }
    var lp = e.target.closest("#langmenu button[data-l]");
    if (lp) {
      e.preventDefault();
      setLang(lp.getAttribute("data-l"));
    }
    if (!e.target.closest(".langsel")) {
      var lm2 = $("langmenu");
      if (lm2) lm2.classList.remove("on");
      var lb1 = $("langbtn");
      if (lb1) lb1.setAttribute("aria-expanded", "false");
    }
    if (e.target.id === "btn-menu" || e.target.closest("#btn-menu")) {
      e.preventDefault();
      setNav(!document.documentElement.classList.contains("nav-open"));
    }
    if (e.target.id === "scrim") { setNav(false); }
    if (e.target.closest("aside a[href^='#']")) { setNav(false); }
    var pm = e.target.closest(".punt-mapa");
    if (pm && mapObj) {
      var i = parseInt(pm.getAttribute("data-i"), 10);
      var el = document.getElementById("map-dietari");
      var pts = el && el._pts;
      if (pts && pts[i]) {
        mapObj.setView([pts[i].lat, pts[i].lon], 12);
        if (el._marks && el._marks[i]) el._marks[i].openPopup();
      }
    }
    var f = e.target.closest("[data-filtre]");
    if (f) {
      document.querySelectorAll("[data-filtre]").forEach(function (x) {
        x.classList.toggle("on", x === f);
        x.classList.toggle("act", x === f);
      });
      applyLlista();
      if (location.hash.replace(/^#/, "") !== "index-quadern") {
        location.hash = "index-quadern";
      }
    }
  });
  if ($("cerca")) {
    $("cerca").addEventListener("input", function () { applyLlista(); });
  }
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.addEventListener("hashchange", function () { show(); });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 1024) setNav(false);
  });
  setMode("resum");
  setLang(lang);
  show();
})();
