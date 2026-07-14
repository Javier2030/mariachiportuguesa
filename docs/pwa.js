/* Banner de instalación PWA — Mariachi Azteca de Acarigua Tecalitlán */
(function () {
  var BRAND = "Mariachi Azteca de Acarigua";
  var ICON = "/icon-192.png";
  try {
    if (matchMedia("(display-mode: standalone)").matches || navigator.standalone) return; // ya instalada
    if (localStorage.getItem("pwaHide")) return; // el usuario la cerró
  } catch (e) {}

  function banner(inner) {
    var b = document.createElement("div");
    b.id = "pwaB";
    b.style.cssText = "position:fixed;left:12px;right:12px;bottom:12px;z-index:99999;background:linear-gradient(135deg,#6E1423,#3d0a12);color:#fff;border:1px solid rgba(232,199,90,.55);border-radius:16px;padding:12px 14px;display:flex;align-items:center;gap:11px;box-shadow:0 16px 44px -12px rgba(0,0,0,.75);font-family:system-ui,-apple-system,sans-serif;max-width:460px;margin:0 auto;animation:pwaUp .35s ease";
    b.innerHTML = inner;
    if (!document.getElementById("pwaKF")) {
      var s = document.createElement("style"); s.id = "pwaKF";
      s.textContent = "@keyframes pwaUp{from{transform:translateY(120%);opacity:0}to{transform:translateY(0);opacity:1}}";
      document.head.appendChild(s);
    }
    document.body.appendChild(b);
    return b;
  }
  function close() { var e = document.getElementById("pwaB"); if (e) e.remove(); try { localStorage.setItem("pwaHide", "1"); } catch (x) {} }

  var iOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  var deferred = null;

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault(); deferred = e;
    banner('<img src="' + ICON + '" width="44" height="44" style="border-radius:11px;flex:none">' +
      '<div style="flex:1;text-align:left;font-size:14px;line-height:1.3"><b style="color:#E8C75A">Instala la app</b><br>' + BRAND + ' en tu teléfono</div>' +
      '<button id="pwaGo" style="flex:none;background:linear-gradient(135deg,#E8C75A,#C9A227);color:#3d0a12;border:0;font-weight:800;padding:11px 17px;border-radius:12px;font-size:14px;cursor:pointer">Instalar</button>' +
      '<span id="pwaX" style="flex:none;color:#c9a98a;font-size:23px;line-height:1;padding:0 4px;cursor:pointer">&times;</span>');
    document.getElementById("pwaGo").onclick = function () { deferred.prompt(); deferred.userChoice.finally(close); };
    document.getElementById("pwaX").onclick = close;
  });

  if (iOS) {
    window.addEventListener("load", function () {
      setTimeout(function () {
        if (document.getElementById("pwaB")) return;
        banner('<img src="' + ICON + '" width="44" height="44" style="border-radius:11px;flex:none">' +
          '<div style="flex:1;text-align:left;font-size:13px;line-height:1.35"><b style="color:#E8C75A">Instala la app</b><br>Toca <b>Compartir</b> y luego <b>Añadir a inicio</b></div>' +
          '<span id="pwaX" style="flex:none;color:#c9a98a;font-size:23px;line-height:1;padding:0 4px;cursor:pointer">&times;</span>');
        document.getElementById("pwaX").onclick = close;
      }, 2800);
    });
  }
})();
