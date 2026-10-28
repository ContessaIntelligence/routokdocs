(function () {
  var D = window.CF_I18N || {};
  var root = document.documentElement;
  var LANGS = { 'en': 'English', 'zh-Hant': '繁體中文', 'zh-CN': '简体中文' };
  var els = Array.prototype.slice.call(document.querySelectorAll('[data-i18n]'));

  // English is the default markup: snapshot it as the English dictionary.
  var en = {
    'meta.title': document.title,
    'meta.desc': (document.querySelector('meta[name="description"]') || {}).content || '',
    'hero.dlos': 'Download for {os}'
  };
  els.forEach(function (el) { en[el.getAttribute('data-i18n')] = el.innerHTML; });
  D.en = en;

  var state = { lang: 'en' };
  var OSN = { mac: 'macOS', win: 'Windows', linux: 'Linux' };

  function splitMotto() {
    var idx = 0;
    document.querySelectorAll('.motto-cn span').forEach(function (s) {
      s.innerHTML = s.textContent.split('').map(function (ch) {
        return '<em style="animation-delay:' + (2.4 + 0.15 * idx++) + 's">' + ch + '</em>';
      }).join('');
    });
  }

  function heroLabel() {
    var label = document.getElementById('hero-dl-label');
    if (!label) return;
    var os = window.CF_OS;
    var dict = D[state.lang] || en;
    label.textContent = os ? (dict['hero.dlos'] || en['hero.dlos']).replace('{os}', OSN[os]) : (dict['hero.dl'] || en['hero.dl']);
  }

  function apply(lang) {
    if (!D[lang]) lang = 'en';
    state.lang = lang;
    var dict = D[lang];
    els.forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      var v = dict[k];
      if (v == null) v = en[k];
      if (el.innerHTML !== v) el.innerHTML = v;
    });
    root.lang = lang;
    document.title = dict['meta.title'] || en['meta.title'];
    var m = document.querySelector('meta[name="description"]');
    if (m) m.content = dict['meta.desc'] || en['meta.desc'];
    var cur = document.getElementById('lang-cur');
    if (cur) cur.textContent = LANGS[lang];
    document.querySelectorAll('#lang .lang-menu button').forEach(function (b) {
      b.classList.toggle('on', b.getAttribute('data-lang') === lang);
    });
    splitMotto();
    heroLabel();
    root.className = root.className.replace(/\s?i18n-wait/, '');
  }

  window.CF_setLang = function (lang) {
    try { localStorage.setItem('cf-lang', lang); } catch (e) {}
    apply(lang);
  };
  window.CF_refreshHeroLabel = heroLabel;

  var box = document.getElementById('lang');
  if (box) {
    var btn = box.querySelector('.lang-btn');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = box.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    box.querySelectorAll('.lang-menu button').forEach(function (b) {
      b.addEventListener('click', function () {
        window.CF_setLang(b.getAttribute('data-lang'));
        box.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('click', function () { box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') box.classList.remove('open'); });
  }

  var saved = 'en';
  try { saved = localStorage.getItem('cf-lang') || 'en'; } catch (e) {}
  apply(saved);
})();
