/* AI PROFOOD — page behaviour */
(function () {
  var posts = window.POSTS || [];
  var PAGE_SIZE = 3;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* Homepage: latest blogpost */
  var latest = document.querySelector("[data-latest]");
  if (latest && posts[0]) {
    var p = posts[0];
    latest.querySelector("[data-latest-img]").src = p.image;
    latest.querySelector("[data-latest-date]").textContent = p.date;
    latest.querySelector("[data-latest-title]").textContent = p.title;
    latest.querySelector("[data-latest-abstract]").textContent = p.abstract;
    latest.querySelector("[data-latest-link]").href = "article.html#" + p.id;
  }

  /* Homepage: objective cards — hover on desktop, tap on touch screens */
  document.querySelectorAll(".obj").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      document.querySelectorAll(".obj").forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
      btn.setAttribute("aria-expanded", open ? "false" : "true");
    });
  });

  /* News page: grid + load more */
  var grid = document.querySelector("[data-post-grid]");
  if (grid) {
    var shown = 0;
    var moreBtn = document.querySelector("[data-load-more]");
    var render = function () {
      var next = posts.slice(shown, shown + PAGE_SIZE);
      grid.insertAdjacentHTML("beforeend", next.map(function (p) {
        return '<li class="card"><a href="article.html#' + esc(p.id) + '">' +
          '<span class="date">' + esc(p.date) + '</span>' +
          '<span class="card-img"><img src="' + esc(p.image) + '" alt="" loading="lazy"></span>' +
          '<h2>' + esc(p.title) + '</h2><p>' + esc(p.abstract) + '</p></a></li>';
      }).join(""));
      shown += next.length;
      if (moreBtn) moreBtn.hidden = shown >= posts.length;
    };
    render();
    if (moreBtn) moreBtn.addEventListener("click", render);
  }

  /* Article page */
  var art = document.querySelector("[data-article]");
  if (art) {
    var show = function () {
      var id = (location.hash || "").slice(1);
      var p = posts.filter(function (x) { return x.id === id; })[0] || posts[0];
      if (!p) return;
      document.title = p.title + " | AI PROFOOD";
      art.querySelector("[data-a-date]").textContent = p.date;
      art.querySelector("[data-a-title]").textContent = p.title;
      art.querySelector("[data-a-intro]").textContent = p.intro || "";
      var img = art.querySelector("[data-a-img]");
      img.src = p.image; img.alt = "";
      art.querySelector("[data-a-body]").innerHTML = (p.body || []).map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("");
      window.scrollTo(0, 0);
    };
    show();
    window.addEventListener("hashchange", show);
  }
})();
