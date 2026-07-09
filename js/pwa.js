// PWA install support: service worker registration + "Add to Home Screen" button.
//
// Chrome (desktop & Android) fires `beforeinstallprompt` when the app is
// installable; we stash that event and show the button. iOS Safari never fires
// it, so there we show the button anyway (when not already installed) and
// display step-by-step instructions instead of a native prompt.

(() => {
  // --- service worker ---
  if ("serviceWorker" in navigator) {
    // Relative path keeps the scope correct on GitHub Pages (/wordvoyage/).
    navigator.serviceWorker.register("sw.js").catch((e) => console.warn("SW registration failed:", e));
  }

  const btn = document.getElementById("btn-install");
  if (!btn) return;

  // Already running as an installed app? Never show the button.
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true; // iOS Safari's non-standard flag

  // iPadOS 13+ reports as MacIntel, hence the maxTouchPoints check.
  const isIos =
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  let deferredPrompt = null;

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // suppress Chrome's mini-infobar; we show our own button
    deferredPrompt = e;
    if (!isStandalone) btn.style.display = "";
  });

  // Fired on successful install (Chrome). Hide the button for good.
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    btn.style.display = "none";
  });

  // iOS: no install event exists, so offer manual instructions.
  if (isIos && !isStandalone) btn.style.display = "";

  btn.addEventListener("click", async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      // The stashed event is single-use either way; if dismissed, Chrome may
      // fire beforeinstallprompt again later, which re-shows the button.
      deferredPrompt = null;
      if (outcome === "accepted") btn.style.display = "none";
    } else if (isIos) {
      document.getElementById("ios-install-modal").classList.add("visible");
    }
  });
})();
