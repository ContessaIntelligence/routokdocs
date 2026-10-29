(function () {
  // Shared behaviour for the About / Docs pages (main.js is home-page only).
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');

  // Nav: frosted glass after scrolling; mobile menu toggle
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 12); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  function closeMenu() { links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('menu-open'); }
  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    nav.classList.toggle('menu-open', open);
  });
  links.addEventListener('click', function (e) { if (e.target.tagName === 'A') closeMenu(); });

  // Per-page <title> for pages that share one i18n dictionary
  // (body[data-title-zh-cn] / body[data-title-zh-hant]); runs after i18n.js has set the title.
  var TT = { 'zh-CN': document.body.getAttribute('data-title-zh-cn'), 'zh-Hant': document.body.getAttribute('data-title-zh-hant') };
  if (TT['zh-CN'] || TT['zh-Hant']) {
    var setTitle = function () { var v = TT[document.documentElement.lang]; if (v) document.title = v; };
    setTitle();
    if ('MutationObserver' in window) new MutationObserver(setTitle).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // Cursor spotlight on cards (same effect as the home page)
  var SPOT = '.card, .flow-item, .stat, .cs, .contact-card';
  document.addEventListener('mousemove', function (e) {
    var c = e.target.closest ? e.target.closest(SPOT) : null;
    if (!c) return;
    var r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });

  // ---------------- Docs only ----------------
  var doc = document.querySelector('.doc');
  if (!doc) return;

  var COPY = { 'en': ['Copy', 'Copied'], 'zh-CN': ['复制', '已复制'], 'zh-Hant': ['複製', '已複製'] };
  function labels() { return COPY[document.documentElement.lang] || COPY.en; }

  // Copy buttons on code blocks. Re-applied after every language switch
  // because i18n.js replaces the innerHTML of the translated containers.
  function decorate() {
    var l = labels();
    doc.querySelectorAll('pre').forEach(function (pre) {
      var b = pre.querySelector('.copy-code');
      if (!b) {
        b = document.createElement('button');
        b.type = 'button';
        b.className = 'copy-code';
        pre.appendChild(b);
      }
      if (!b.classList.contains('done')) b.textContent = l[0];
    });
  }
  doc.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.copy-code') : null;
    if (!b) return;
    var code = b.parentNode.querySelector('code') || b.parentNode;
    var text = code.innerText.replace(/\n$/, '');
    function done() {
      b.classList.add('done'); b.textContent = labels()[1];
      setTimeout(function () { b.classList.remove('done'); b.textContent = labels()[0]; }, 1600);
    }
    function fallback() {
      var t = document.createElement('textarea');
      t.value = text; t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); done(); } catch (err) {}
      document.body.removeChild(t);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
  });
  decorate();
  if ('MutationObserver' in window) {
    var pending = false;
    new MutationObserver(function () {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () { pending = false; decorate(); });
    }).observe(doc, { childList: true, subtree: true });
    new MutationObserver(decorate).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }

  // Sidebar: collapsible on small screens, always open on desktop
  var side = document.getElementById('docSide');
  var mq = window.matchMedia('(max-width: 980px)');
  function syncSide() { if (side) side.open = !mq.matches; }
  syncSide();
  if (mq.addEventListener) mq.addEventListener('change', syncSide); else if (mq.addListener) mq.addListener(syncSide);
  if (side) side.addEventListener('click', function (e) {
    if (e.target.tagName === 'A' && mq.matches) side.open = false;
  });

  // Scroll-spy: highlight the sidebar entry of the heading currently in view
  var sideLinks = side ? Array.prototype.slice.call(side.querySelectorAll('a[href^="#"]')) : [];
  var ids = {};
  sideLinks.forEach(function (a) { ids[a.getAttribute('href').slice(1)] = true; });
  var ticking = false;
  function spy() {
    ticking = false;
    var hs = Array.prototype.filter.call(doc.querySelectorAll('h2[id], h3[id]'), function (h) {
      return ids[h.id];
    });
    var cur = null;
    for (var i = 0; i < hs.length; i++) {
      if (hs[i].getBoundingClientRect().top <= 130) cur = hs[i].id; else break;
    }
    if (!cur && hs.length) cur = hs[0].id;
    var active = null;
    sideLinks.forEach(function (a) {
      var on = a.getAttribute('href') === '#' + cur;
      a.classList.toggle('on', on);
      if (on) active = a;
    });
    // keep the active entry visible inside the sticky sidebar
    if (active && !mq.matches) {
      var box = side.getBoundingClientRect(), r = active.getBoundingClientRect();
      if (r.top < box.top + 40) side.scrollTop -= (box.top + 40 - r.top);
      else if (r.bottom > box.bottom - 40) side.scrollTop += (r.bottom - box.bottom + 40);
    }
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(spy); } }, { passive: true });
  window.addEventListener('resize', spy);
  window.addEventListener('hashchange', spy);
  spy();
})();
