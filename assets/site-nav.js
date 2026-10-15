/* Site menu. Add a destination by appending one entry. The open menu lists every other destination.
   Subscribe confirmation and thank-you pages are not destinations.
   Scores is the shared library for every album.
   Albums lists all eight albums, newest first. The current site is a muted "You're here" row. */
(function () {
  var pages = [
    { href: "/", label: "Album" },
    { href: "https://lackadaisicalperfection.com/scores/", label: "Scores", blank: true }
  ];

  var excluded = [
    "/subscribe/confirmed/",
    "/thank-you/",
    "/thanks/"
  ];

  var albums = [
    { href: "https://lackadaisicalperfection.com/", host: "lackadaisicalperfection.com", title: "Lackadaisical Perfection", file: "lackadaisical-perfection" },
    { href: "https://pianoreveries.com/", host: "pianoreveries.com", title: "Piano Reveries and Phantasies", file: "piano-reveries" },
    { href: "https://smittenwiththemuses.com/", host: "smittenwiththemuses.com", title: "Smitten with the Muses", file: "smitten-with-the-muses" },
    { href: "https://whereintheworldisdiane.com/", host: "whereintheworldisdiane.com", title: "Where In The World Is Diane", file: "where-in-the-world-is-diane" },
    { href: "https://cleancalmpiano.com/", host: "cleancalmpiano.com", title: "Clean Calm Piano", file: "clean-calm-piano" },
    { href: "https://tantalizingproof.com/", host: "tantalizingproof.com", title: "Tantalizing Proof", file: "tantalizing-proof" },
    { href: "https://pianoincolors.com/", host: "pianoincolors.com", title: "Piano In Colors", file: "piano-in-colors" },
    { href: "https://melodicsubtlety.com/", host: "melodicsubtlety.com", title: "Melodic Subtlety – Solo Piano", file: "melodic-subtlety" }
  ];

  function normalize(path) {
    var p = path || "/";
    var base = location.origin && location.origin !== "null"
      ? location.origin
      : "https://whereintheworldisdiane.com";
    try {
      p = new URL(p, base).pathname;
    } catch (err) {
      p = "/";
    }
    if (p === "/index.html" || p.slice(-11) === "/index.html") {
      p = p.slice(0, -10);
    }
    if (p.charAt(p.length - 1) !== "/") p += "/";
    return p;
  }

  function isExcluded(path) {
    return excluded.some(function (item) {
      return path === item || path.indexOf(item) === 0;
    });
  }

  function reducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  document.querySelectorAll('a[href*="music.apple.com"], a[href*="open.spotify.com"]').forEach(function (link) {
    link.target = "_blank";
    if (!link.rel || link.rel.indexOf("noopener") === -1) {
      link.rel = link.rel ? link.rel + " noopener" : "noopener";
    }
  });

  var here = normalize(location.pathname);
  var links = pages.filter(function (page) {
    var path = normalize(page.href);
    return path !== here && !isExcluded(path);
  });

  var button = document.createElement("button");
  button.type = "button";
  button.className = "nav-toggle";
  button.setAttribute("aria-label", "Open menu");
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", "site-menu");

  var img = document.createElement("img");
  img.src = "/assets/david-with-lp.jpg";
  img.srcset = "/assets/david-with-lp.jpg 1x, /assets/david-with-lp@2x.jpg 2x";
  img.width = 160;
  img.height = 160;
  img.alt = "";
  img.decoding = "async";
  button.appendChild(img);

  var list = document.createElement("ul");
  list.setAttribute("role", "list");
  links.forEach(function (page) {
    var item = document.createElement("li");
    var link = document.createElement("a");
    link.href = page.href;
    link.textContent = page.label;
    if (page.blank) {
      link.target = "_blank";
      link.rel = "noopener";
    }
    item.appendChild(link);
    list.appendChild(item);
  });

  var menu = document.createElement("nav");
  menu.id = "site-menu";
  menu.className = "site-menu";
  menu.setAttribute("aria-label", "Pages");
  menu.hidden = true;
  if ("inert" in menu) menu.inert = true;
  menu.appendChild(list);

  var seenHost = (location.hostname || "").toLowerCase().replace(/^www\./, "");
  var knownHost = albums.some(function (album) { return album.host === seenHost; });
  var albumHost = knownHost ? seenHost : "whereintheworldisdiane.com";

  var albumSection = document.createElement("section");
  albumSection.className = "album-section";
  albumSection.setAttribute("aria-labelledby", "album-menu-label");

  var albumLabel = document.createElement("p");
  albumLabel.id = "album-menu-label";
  albumLabel.className = "menu-label";
  albumLabel.textContent = "Albums";
  albumSection.appendChild(albumLabel);

  var albumList = document.createElement("ul");
  albumList.className = "album-list";
  albumList.setAttribute("role", "list");

  albums.forEach(function (album) {
    var item = document.createElement("li");
    var thumb = document.createElement("img");
    thumb.src = "/assets/albums/" + album.file + ".jpg";
    thumb.srcset = "/assets/albums/" + album.file + ".jpg 1x, /assets/albums/" + album.file + "@2x.jpg 2x";
    thumb.width = 48;
    thumb.height = 48;
    thumb.alt = "";
    thumb.decoding = "async";

    var title = document.createElement("span");
    title.className = "album-title";
    title.textContent = album.title;

    var text = document.createElement("span");
    text.className = "album-text";
    text.appendChild(title);

    var row;
    if (album.host === albumHost) {
      row = document.createElement("div");
      row.className = "album-here";
      row.setAttribute("aria-current", "page");
      var note = document.createElement("span");
      note.className = "here-label";
      note.textContent = "You're here";
      text.appendChild(note);
    } else {
      row = document.createElement("a");
      row.href = album.href;
      row.target = "_blank";
      row.rel = "noopener";
    }
    row.appendChild(thumb);
    row.appendChild(text);
    item.appendChild(row);
    albumList.appendChild(item);
  });

  albumSection.appendChild(albumList);
  menu.appendChild(albumSection);

  document.body.appendChild(button);
  document.body.appendChild(menu);

  var generation = 0;
  var open = false;

  function setOpenState(next) {
    open = next;
    button.setAttribute("aria-expanded", next ? "true" : "false");
    button.setAttribute("aria-label", next ? "Close menu" : "Open menu");
  }

  function finishClose(gen) {
    if (gen !== generation || open) return;
    menu.hidden = true;
    if ("inert" in menu) menu.inert = true;
  }

  function openMenu() {
    generation += 1;
    menu.hidden = false;
    if ("inert" in menu) menu.inert = false;
    if (reducedMotion()) {
      menu.classList.add("is-open");
    } else {
      menu.classList.remove("is-open");
      void menu.offsetWidth;
      menu.classList.add("is-open");
    }
    setOpenState(true);
  }

  function closeMenu(restoreFocus) {
    var gen = generation += 1;
    setOpenState(false);
    menu.classList.remove("is-open");
    if ("inert" in menu) menu.inert = true;
    if (reducedMotion()) {
      finishClose(gen);
    } else {
      var timer = setTimeout(function () { finishClose(gen); }, 400);
      menu.addEventListener("transitionend", function onEnd(event) {
        if (event.target !== menu || event.propertyName !== "opacity") return;
        menu.removeEventListener("transitionend", onEnd);
        clearTimeout(timer);
        finishClose(gen);
      });
    }
    if (restoreFocus) button.focus();
  }

  button.addEventListener("click", function (event) {
    event.stopPropagation();
    if (open) closeMenu(false);
    else openMenu();
  });

  document.addEventListener("click", function (event) {
    if (!open) return;
    if (menu.contains(event.target)) return;
    closeMenu(false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape" || !open) return;
    event.preventDefault();
    closeMenu(true);
  });
})();
