(function () {
  // Nav: transparent at top, frosted glass after scrolling; mobile menu toggle
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
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

  // Contact Sales dialog: always gives feedback, even when no mail app is configured
  var modal = document.getElementById('salesModal');
  var salesBtn = document.getElementById('salesBtn');
  var copyBtn = document.getElementById('smCopy');
  var EMAIL = 'sales@codeflux.ai';
  function openModal() { modal.hidden = false; document.body.style.overflow = 'hidden'; }
  function closeModal() { modal.hidden = true; document.body.style.overflow = ''; }
  salesBtn.addEventListener('click', function (e) { e.preventDefault(); openModal(); });
  document.getElementById('smClose').addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
  copyBtn.addEventListener('click', function () {
    function done() { copyBtn.classList.add('copied'); setTimeout(function () { copyBtn.classList.remove('copied'); }, 1800); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(EMAIL).then(done, fallback);
    } else { fallback(); }
    function fallback() {
      var t = document.createElement('textarea');
      t.value = EMAIL; document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); done(); } catch (err) {}
      document.body.removeChild(t);
    }
  });

  // Scroll reveal
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // Spotlight follows cursor on all card-like blocks (event delegation)
  var SPOT = '.card, .flow-item, .stat, .cs, .quote, .os, .contact-card';
  document.addEventListener('mousemove', function (e) {
    var c = e.target.closest ? e.target.closest(SPOT) : null;
    if (!c) return;
    var r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });

  // Detect OS and highlight matching download card
  var ua = navigator.userAgent;
  var os = /Android|iPhone|iPad/i.test(ua) ? '' : /Mac/i.test(ua) ? 'mac' : /Win/i.test(ua) ? 'win' : /Linux|X11/i.test(ua) ? 'linux' : '';
  if (os) {
    var card = document.getElementById('os-' + os);
    if (card) card.classList.add('detected');
    var label = document.getElementById('hero-dl-label');
    window.CF_OS = os;
    if (window.CF_refreshHeroLabel) window.CF_refreshHeroLabel();
    var base = 'https://github.com/ContessaIntelligence/codeflux/releases/download/v0.1.1/';
    var direct = { mac: 'CodeFlux-mac-arm64.app.tar', win: 'CodeFlux-win-x64.exe', linux: 'CodeFlux-linux-x86_64.AppImage' };
    var heroBtn = label && label.closest('a');
    if (heroBtn) heroBtn.href = base + direct[os];
  }
})();
