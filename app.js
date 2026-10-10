(function () {
  document.documentElement.classList.add("js");
  var fs = 18;
  function $(id) { return document.getElementById(id); }
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
    document.querySelectorAll("aside a[data-cap]").forEach(function (a) {
      var okCap = !cap || a.getAttribute("data-cap") === cap;
      var okQ = !q || (a.getAttribute("data-search") || "").indexOf(q) !== -1;
      a.style.display = okCap && okQ ? "" : "none";
    });
    document.querySelectorAll("aside details.nav-cap").forEach(function (d) {
      var vis = [].slice.call(d.querySelectorAll("a[data-cap]")).some(function (a) {
        return a.style.display !== "none";
      });
      d.style.display = vis ? "" : "none";
      if (q || cap) d.open = vis && (!!q || d.getAttribute("data-cap") === cap);
    });
    var c = $("count");
    if (c && tot) c.textContent = n + " de " + tot + " cares";
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
    document.querySelectorAll("aside details.nav-cap").forEach(function (d) {
      if (d.querySelector("a.act")) d.open = true;
    });
    var vista = $("vista");
    if (vista) vista.scrollTop = 0;
    if (id === "mapa") initMap();
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
        return L.marker([p.lat, p.lon]).addTo(mapObj).bindPopup(
          "<strong>" + p.nom + "</strong><br>" + p.que
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
  }
  function printArbre(size) {
    var st = document.getElementById("print-page-size");
    if (!st) {
      st = document.createElement("style");
      st.id = "print-page-size";
      document.head.appendChild(st);
    }
    st.textContent = "@page { size: " + size + " landscape; margin: 8mm; }";
    document.documentElement.setAttribute("data-print-arbre", size);
    window.print();
  }
  window.addEventListener("afterprint", function () {
    document.documentElement.removeAttribute("data-print-arbre");
    var st = document.getElementById("print-page-size");
    if (st) st.textContent = "";
  });
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
    var pa = e.target.closest("[data-print-arbre]");
    if (pa) {
      e.preventDefault();
      printArbre(pa.getAttribute("data-print-arbre"));
    }
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
  window.addEventListener("hashchange", function () { show(); });
  setMode("resum");
  applyLlista();
  show();
})();
