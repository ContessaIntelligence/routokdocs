(function () {
  'use strict';
  // Account logic for the website, wired to the shared new-api backend.
  // See docs-internal/new-api-integration.md for the endpoint mapping and deployment notes.
  var API = (window.CF_API_BASE || '/api').replace(/\/$/, '');
  // Subscription plans in new-api are shared with the model-API business; only plans
  // whose title matches this pattern are treated as CodeFlux Pro.
  var PRO_PLAN = window.CF_PRO_PLAN_MATCH || /codeflux.*pro/i;
  var TOKEN_KEY = 'cf-at', USER_KEY = 'cf-user', NEXT_KEY = 'cf-oauth-next';
  var page = document.body.getAttribute('data-page') || '';
  var q = new URLSearchParams(location.search);

  function $(id) { return document.getElementById(id); }
  function lang() { return document.documentElement.lang || 'en'; }

  /* ---------------- messages (client-side text only; server messages arrive already translated) ---------------- */
  var M = {
    'en': {
      invalid_email: 'Please enter a valid email address.',
      weak_password: 'Password must be 8–128 characters and include letters and numbers.',
      pw_mismatch: 'The two passwords do not match.',
      need_agree: 'Please read and accept the Terms of Service and Privacy Policy.',
      code_invalid: 'Please enter the 6-character code from the email.',
      captcha: 'Please complete the human verification first.',
      network: 'Cannot reach the server. Check your connection and try again.',
      server: 'Something went wrong on our side. Please try again later.',
      reg_unavailable: 'Email registration is not open yet. Please try again later or contact support@routok.com.',
      code_sent: 'We sent a 6-character verification code to your email. It is valid for 10 minutes.',
      code_resent: 'A new code has been sent.',
      registered: 'Account created. Please sign in.',
      reset_sent: 'If this email is registered, a password reset link has been sent. Open the link in the email to continue.',
      need_more: 'This account needs an extra verification step (such as two-factor authentication). Please complete sign-in in the console.',
      console: 'Open console',
      show: 'Show', hide: 'Hide', wait: 'Resend in {n}s', resend: 'Resend code',
      plan_free: 'Free', plan_pro: 'Pro', never: 'Never', none: '—', verified: 'Email', unverified: 'Not verified',
      st_active: 'Active', st_expired: 'Expired', st_cancelled: 'Cancelled', current: 'This device', remove: 'Sign out',
      no_subs: 'No subscriptions yet.', no_devices: 'No signed-in devices.',
      pay_unavailable: 'Online payment is being activated and is not open yet. To subscribe now, email sales@routok.com and we will arrange it for you.',
      redirecting: 'Redirecting to secure payment…',
      per_month: '/ month', per_year: '/ year',
      new_pw_note: 'This is a system-generated password. Sign in with it, then change it in your account settings.',
      nav_login: 'Sign in', nav_account: 'My account', signing_in: 'Signing you in…', oauth_fail: 'Sign-in with this provider failed.',
      cur_pw_needed: 'Please enter your current password.', pw_same: 'The new password must be different from the current one.', pw_changed: 'Password updated. Your other devices have been signed out.'
    },
    'zh-CN': {
      invalid_email: '请输入有效的邮箱地址。',
      weak_password: '密码需为 8–128 位，且同时包含字母和数字。',
      pw_mismatch: '两次输入的密码不一致。',
      need_agree: '请先阅读并同意《服务条款》和《隐私政策》。',
      code_invalid: '请输入邮件中的 6 位验证码。',
      captcha: '请先完成人机验证。',
      network: '无法连接服务器，请检查网络后重试。',
      server: '服务暂时出现问题，请稍后再试。',
      reg_unavailable: '邮箱注册暂未开放，请稍后再试，或联系 support@routok.com。',
      code_sent: '已向你的邮箱发送 6 位验证码，10 分钟内有效。',
      code_resent: '新的验证码已发送。',
      registered: '账号已创建，请登录。',
      reset_sent: '如果该邮箱已注册，重置密码链接已发送，请打开邮件中的链接继续。',
      need_more: '该账号需要额外验证（例如两步验证），请到控制台完成登录。',
      console: '打开控制台',
      show: '显示', hide: '隐藏', wait: '{n} 秒后可重发', resend: '重新发送验证码',
      plan_free: '免费版', plan_pro: '专业版', never: '永久', none: '—', verified: '邮箱', unverified: '未验证',
      st_active: '生效中', st_expired: '已过期', st_cancelled: '已取消', current: '当前设备', remove: '退出登录',
      no_subs: '暂无订阅记录。', no_devices: '暂无已登录设备。',
      pay_unavailable: '在线支付正在开通中，暂未开放。如需立即订阅，请发送邮件至 sales@routok.com，我们将为你办理。',
      redirecting: '正在跳转到安全支付页面…',
      per_month: '/ 月', per_year: '/ 年',
      new_pw_note: '这是系统生成的密码。请用它登录，然后在账号设置中修改。',
      nav_login: '登录', nav_account: '我的账号', signing_in: '正在登录…', oauth_fail: '使用该方式登录失败。',
      cur_pw_needed: '请输入当前密码。', pw_same: '新密码不能与当前密码相同。', pw_changed: '密码已更新，其他设备已退出登录。'
    },
    'zh-Hant': {
      invalid_email: '請輸入有效的電子郵件地址。',
      weak_password: '密碼需為 8–128 位，且同時包含字母和數字。',
      pw_mismatch: '兩次輸入的密碼不一致。',
      need_agree: '請先閱讀並同意《服務條款》和《隱私權政策》。',
      code_invalid: '請輸入郵件中的 6 位驗證碼。',
      captcha: '請先完成人機驗證。',
      network: '無法連線伺服器，請檢查網路後重試。',
      server: '服務暫時出現問題，請稍後再試。',
      reg_unavailable: '電子郵件註冊暫未開放，請稍後再試，或聯絡 support@routok.com。',
      code_sent: '已向你的電子郵件發送 6 位驗證碼，10 分鐘內有效。',
      code_resent: '新的驗證碼已發送。',
      registered: '帳號已建立，請登入。',
      reset_sent: '如果該電子郵件已註冊，重設密碼連結已發送，請開啟郵件中的連結繼續。',
      need_more: '該帳號需要額外驗證（例如兩步驟驗證），請到控制台完成登入。',
      console: '開啟控制台',
      show: '顯示', hide: '隱藏', wait: '{n} 秒後可重發', resend: '重新發送驗證碼',
      plan_free: '免費版', plan_pro: '專業版', never: '永久', none: '—', verified: '電子郵件', unverified: '未驗證',
      st_active: '生效中', st_expired: '已過期', st_cancelled: '已取消', current: '目前裝置', remove: '登出',
      no_subs: '暫無訂閱記錄。', no_devices: '暫無已登入裝置。',
      pay_unavailable: '線上支付正在開通中，暫未開放。如需立即訂閱，請寄信至 sales@routok.com，我們將為你辦理。',
      redirecting: '正在跳轉到安全支付頁面…',
      per_month: '/ 月', per_year: '/ 年',
      new_pw_note: '這是系統產生的密碼。請用它登入，然後在帳號設定中修改。',
      nav_login: '登入', nav_account: '我的帳號', signing_in: '正在登入…', oauth_fail: '使用該方式登入失敗。',
      cur_pw_needed: '請輸入目前密碼。', pw_same: '新密碼不能與目前密碼相同。', pw_changed: '密碼已更新，其他裝置已登出。'
    }
  };
  function t(key, vars) {
    var s = (M[lang()] || M.en)[key] || M.en[key] || key;
    if (vars) for (var k in vars) s = s.replace('{' + k + '}', vars[k]);
    return s;
  }

  /* ---------------- HTTP layer ---------------- */
  function acceptLang() { var l = lang(); return l === 'zh-Hant' ? 'zh-TW' : l; }
  function raw(path, o) {
    o = o || {};
    var h = { 'Accept': 'application/json', 'Accept-Language': acceptLang() };
    if (o.token) h['Authorization'] = 'Bearer ' + o.token;
    if (o.headers) for (var hk in o.headers) h[hk] = o.headers[hk];
    var init = { method: o.method || 'GET', headers: h, credentials: 'include' };
    if (o.body !== undefined) { h['Content-Type'] = 'application/json'; init.body = JSON.stringify(o.body); }
    return fetch(API + path, init).then(function (r) {
      return r.text().then(function (txt) {
        var j = null;
        try { j = txt ? JSON.parse(txt) : null; } catch (e) {}
        return { status: r.status, json: j };
      });
    }, function () { return { status: 0, json: null }; });
  }
  // new-api wraps replies as {success,message,data}; payment endpoints reply {message:"success",data}.
  function norm(res) {
    var j = res.json || {};
    var ok = res.status >= 200 && res.status < 300 && (j.success === true || (j.success === undefined && j.message === 'success'));
    return { ok: ok, status: res.status, msg: typeof j.message === 'string' ? j.message : '', data: j.data };
  }
  function errText(n) {
    if (n.status === 0) return t('network');
    if (n.msg && n.msg !== 'success') return n.msg;
    return t('server');
  }

  /* ---------------- session (short-lived access token + refresh cookie) ---------------- */
  function getToken() {
    try {
      var o = JSON.parse(localStorage.getItem(TOKEN_KEY) || 'null');
      if (o && o.t && o.exp * 1000 > Date.now() + 20000) return o.t;
    } catch (e) {}
    return null;
  }
  function saveAuth(d) {
    try {
      var exp = Number(d.access_expires_at) || 0;
      if (exp > 1e12) exp = Math.floor(exp / 1000);
      localStorage.setItem(TOKEN_KEY, JSON.stringify({ t: d.access_token, exp: exp }));
      var u = d.user || {};
      var hint = u.email || u.username;
      if (hint) localStorage.setItem(USER_KEY, hint);
    } catch (e) {}
    mePromise = null;
  }
  function clearAuth() {
    try { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); } catch (e) {}
    mePromise = null;
  }
  var refreshing = null;
  function refresh() {
    if (!refreshing) refreshing = raw('/user/auth/refresh', { method: 'POST' }).then(function (r) {
      refreshing = null;
      var n = norm(r);
      if (n.ok && n.data && n.data.access_token) { saveAuth(n.data); return n.data; }
      return null;
    });
    return refreshing;
  }
  // Authenticated call: use the stored token, refresh through the cookie when it is missing or rejected.
  function authed(path, o) {
    o = o || {};
    function go(tok) { o.token = tok; return raw(path, o).then(norm); }
    var first = getToken();
    var p = first ? Promise.resolve(first) : refresh().then(function (d) { return d && d.access_token; });
    return p.then(function (tok) {
      if (!tok) return { ok: false, status: 401, msg: '', data: null };
      return go(tok).then(function (n) {
        if (n.status !== 401) return n;
        return refresh().then(function (d) { return d ? go(d.access_token) : n; });
      });
    });
  }
  var mePromise = null;
  function me() {
    if (!mePromise) {
      var hinted = false;
      try { hinted = !!localStorage.getItem(USER_KEY); } catch (e) {}
      // Anonymous visitors cost no network request.
      if (!hinted && !getToken()) mePromise = Promise.resolve(null);
      else mePromise = authed('/user/self').then(function (n) {
        if (n.ok && n.data) return n.data;
        if (n.status === 401) clearAuth();
        return null;
      });
      mePromise.then(function (u) { setNav(u); });
    }
    return mePromise;
  }

  /* ---------------- site status (feature switches) + Turnstile ---------------- */
  var statusP = null;
  function status() {
    if (!statusP) statusP = raw('/status').then(norm).then(function (n) { return n.ok && n.data ? n.data : {}; });
    return statusP;
  }
  function makeTurnstile(box) {
    var api = { token: '', needed: false, reset: function () {} };
    if (!box) return Promise.resolve(api);
    return status().then(function (s) {
      if (!s.turnstile_check || !s.turnstile_site_key) return api;
      api.needed = true;
      var id = null;
      function draw() {
        if (id !== null) return;
        id = window.turnstile.render(box, {
          sitekey: s.turnstile_site_key,
          callback: function (tok) { api.token = tok; },
          'expired-callback': function () { api.token = ''; },
          'error-callback': function () { api.token = ''; }
        });
      }
      api.reset = function () { api.token = ''; if (id !== null && window.turnstile) window.turnstile.reset(id); };
      if (window.turnstile) draw();
      else {
        var sc = document.createElement('script');
        sc.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        sc.async = true;
        sc.onload = draw;
        document.head.appendChild(sc);
      }
      return api;
    });
  }
  function withTs(path, ts) {
    if (!ts || !ts.needed) return path;
    return path + (path.indexOf('?') < 0 ? '?' : '&') + 'turnstile=' + encodeURIComponent(ts.token);
  }

  /* ---------------- password encryption (only when the admin enables it) ---------------- */
  function b64(buf) { var a = new Uint8Array(buf), s = ''; for (var i = 0; i < a.length; i++) s += String.fromCharCode(a[i]); return btoa(s); }
  function pemToDer(pem) {
    var s = atob(pem.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '')), a = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) a[i] = s.charCodeAt(i);
    return a.buffer;
  }
  function encryptPassword(pw, kid, pem) {
    var enc = new TextEncoder(), nonce = crypto.getRandomValues(new Uint8Array(12)), aes = null, subtle = crypto.subtle;
    return subtle.importKey('spki', pemToDer(pem), { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt']).then(function (pub) {
      return subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt']).then(function (k) {
        aes = k; return subtle.exportKey('raw', k);
      }).then(function (rawKey) {
        return subtle.encrypt({ name: 'RSA-OAEP', label: enc.encode('password-v2') }, pub, rawKey);
      }).then(function (wrapped) {
        return subtle.encrypt({ name: 'AES-GCM', iv: nonce, additionalData: enc.encode('password-v2:' + kid) }, aes, enc.encode(pw)).then(function (ct) {
          return 'v2.' + b64(wrapped) + '.' + b64(nonce) + '.' + b64(ct);
        });
      });
    });
  }
  // {password} or, when the admin enabled login encryption, {password_encrypted, encryption_key_id}
  function pwFields(password) {
    return status().then(function (s) {
      if (!s.password_login_encryption_enabled) return { password: password };
      return raw('/user/login/encryption-key').then(norm).then(function (n) {
        if (!n.ok || !n.data || !n.data.enabled) return { password: password };
        return encryptPassword(password, n.data.kid, n.data.public_key).then(function (c) {
          return { password_encrypted: c, encryption_key_id: n.data.kid };
        });
      });
    });
  }
  function loginBody(username, password) {
    return pwFields(password).then(function (f) { f.username = username; return f; });
  }
  // -> {ok, needMore, msg, status}
  function doLogin(username, password, ts) {
    return loginBody(username, password).then(function (body) {
      return raw(withTs('/user/login', ts), { method: 'POST', body: body });
    }).then(norm).then(function (n) {
      if (n.ok && n.data && n.data.access_token) { saveAuth(n.data); return { ok: true }; }
      if (n.ok) return { ok: false, needMore: true };
      return { ok: false, msg: errText(n), status: n.status };
    });
  }

  /* ---------------- nav button ---------------- */
  var navAuth = $('navAuth'), navLinks = $('navLinks'), mAuth = null;
  if (navAuth && navLinks) { mAuth = document.createElement('a'); mAuth.className = 'nav-m-auth'; navLinks.appendChild(mAuth); }
  function syncMenuAuth() {
    if (!mAuth) return;
    mAuth.setAttribute('href', navAuth.getAttribute('href'));
    mAuth.textContent = t(navAuth.classList.contains('logged') ? 'nav_account' : 'nav_login');
  }
  function setNav(user) {
    if (!navAuth) return;
    if (user) { navAuth.classList.add('logged'); navAuth.setAttribute('href', 'account.html'); }
    else { navAuth.classList.remove('logged'); navAuth.setAttribute('href', 'login.html'); }
    syncMenuAuth();
  }
  var hint0 = null;
  try { hint0 = localStorage.getItem(USER_KEY); } catch (e) {}
  setNav(hint0);
  new MutationObserver(syncMenuAuth).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  if (page !== 'account' && page !== 'oauth') me();

  /* ---------------- shared UI helpers ---------------- */
  function show(el, kind, text) { if (!el) return; el.className = 'msg-box show ' + kind; el.textContent = text; }
  function hide(el) { if (el) { el.className = 'msg-box'; el.textContent = ''; } }
  function busy(btn, on) { if (!btn) return; btn.disabled = !!on; btn.setAttribute('aria-busy', on ? 'true' : 'false'); }
  function validEmail(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s) && s.length <= 254; }
  function pwOk(p) { return p.length >= 8 && p.length <= 128 && /[a-z]/i.test(p) && /\d/.test(p); }
  function pwScore(p) {
    var s = 0;
    if (p.length >= 8) s++;
    if (/[a-z]/i.test(p) && /\d/.test(p)) s++;
    if (p.length >= 12) s++;
    if (/[^a-z0-9]/i.test(p) && /[A-Z]/.test(p)) s++;
    return p ? Math.max(s, 1) : 0;
  }
  function nextUrl() {
    var n = q.get('next');
    if (n && /^[a-z0-9_-]+\.html(\?[\w=&-]*)?(#[\w-]*)?$/i.test(n)) return n; // same-site pages only
    if (q.get('plan') === 'pro') return 'checkout.html?plan=pro&cycle=year';
    return 'account.html';
  }
  // carry the purchase intent (plan / next page) across login <-> register
  function keepPlan(href) {
    var parts = [];
    if (q.get('plan')) parts.push('plan=' + encodeURIComponent(q.get('plan')));
    if (q.get('next')) parts.push('next=' + encodeURIComponent(q.get('next')));
    return parts.length ? href + (href.indexOf('?') < 0 ? '?' : '&') + parts.join('&') : href;
  }
  function fmtTime(sec) {
    if (!sec) return t('none');
    var d = new Date(sec * 1000);
    return isNaN(d) ? t('none') : d.toLocaleDateString(lang() === 'en' ? 'en-US' : lang(), { year: 'numeric', month: 'short', day: 'numeric' });
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function cooldown(btn, secs) {
    var left = secs; btn.disabled = true;
    (function tick() {
      if (left <= 0) { btn.disabled = false; btn.textContent = t('resend'); return; }
      btn.textContent = t('wait', { n: left }); left--; setTimeout(tick, 1000);
    })();
  }
  function hexCode(el) { el.addEventListener('input', function () { this.value = this.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6).toLowerCase(); }); }

  Array.prototype.forEach.call(document.querySelectorAll('.pw button'), function (b) {
    b.textContent = t('show');
    b.addEventListener('click', function () {
      var inp = b.parentNode.querySelector('input'), on = inp.type === 'password';
      inp.type = on ? 'text' : 'password'; b.textContent = on ? t('hide') : t('show');
    });
  });
  new MutationObserver(function () {
    Array.prototype.forEach.call(document.querySelectorAll('.pw button'), function (b) {
      b.textContent = b.parentNode.querySelector('input').type === 'password' ? t('show') : t('hide');
    });
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  /* ---------------- OAuth (GitHub + OIDC/Google) ---------------- */
  function siteOrigin(s) { return (s.server_address || location.origin).replace(/\/$/, ''); }
  function startOAuth(provider, box) {
    status().then(function (s) {
      raw('/oauth/state', { method: 'POST', body: { provider: provider, intent: 'login' } }).then(norm).then(function (n) {
        var state = n.ok && n.data && n.data.flow_token;
        if (!state) return show(box, 'err', errText(n));
        try { sessionStorage.setItem(NEXT_KEY, nextUrl()); } catch (e) {}
        var url;
        if (provider === 'github') {
          url = 'https://github.com/login/oauth/authorize?client_id=' + encodeURIComponent(s.github_client_id) + '&state=' + encodeURIComponent(state) + '&scope=' + encodeURIComponent('user:email');
        } else {
          url = s.oidc_authorization_endpoint + (s.oidc_authorization_endpoint.indexOf('?') < 0 ? '?' : '&') +
            'client_id=' + encodeURIComponent(s.oidc_client_id) + '&redirect_uri=' + encodeURIComponent(siteOrigin(s) + '/oauth/oidc') +
            '&response_type=code&scope=' + encodeURIComponent('openid profile email') + '&state=' + encodeURIComponent(state);
        }
        location.href = url;
      });
    });
  }
  var oauthBtns = document.querySelectorAll('[data-oauth]');
  if (oauthBtns.length) {
    status().then(function (s) {
      var any = false;
      Array.prototype.forEach.call(oauthBtns, function (b) {
        var p = b.getAttribute('data-oauth'), on = p === 'github' ? !!(s.github_oauth && s.github_client_id) : !!(s.oidc_enabled && s.oidc_client_id && s.oidc_authorization_endpoint);
        b.hidden = !on; if (on) any = true;
        if (on && p === 'oidc' && !/google/i.test(s.oidc_authorization_endpoint || '')) {
          var sp = b.querySelector('span'); sp.removeAttribute('data-i18n'); sp.textContent = (s.oidc_display_name || 'SSO');
        }
      });
      var wrap = $('oauthWrap'); if (wrap) wrap.hidden = !any;
    });
    Array.prototype.forEach.call(oauthBtns, function (b) {
      b.addEventListener('click', function () { startOAuth(b.getAttribute('data-oauth'), $('formMsg')); });
    });
  }
  if (q.get('registered') && $('formMsg')) show($('formMsg'), 'ok', t('registered'));

  /* ---------------- LOGIN ---------------- */
  if (page === 'login') {
    me().then(function (u) { if (u) location.replace(nextUrl()); });
    if ($('toRegister')) $('toRegister').setAttribute('href', keepPlan('register.html'));
    var lts = null;
    makeTurnstile($('turnstile')).then(function (x) { lts = x; });
    $('loginForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var email = $('email').value.trim(), pw = $('password').value, btn = $('submitBtn'), box = $('formMsg');
      hide(box); $('email').removeAttribute('aria-invalid');
      if (!validEmail(email)) { $('email').setAttribute('aria-invalid', 'true'); return show(box, 'err', t('invalid_email')); }
      if (!pw) return show(box, 'err', t('weak_password'));
      if (lts && lts.needed && !lts.token) return show(box, 'err', t('captcha'));
      busy(btn, true);
      doLogin(email, pw, lts).then(function (r) {
        busy(btn, false);
        if (r.ok) return location.replace(nextUrl());
        if (lts) lts.reset();
        if (r.needMore) return showMore(box);
        show(box, 'err', r.msg);
      });
    });
  }
  function showMore(box) {
    status().then(function (s) {
      show(box, 'info', t('need_more'));
      if (s.server_address) {
        var a = document.createElement('a');
        a.href = s.server_address; a.textContent = ' ' + t('console'); a.style.textDecoration = 'underline';
        box.appendChild(a);
      }
    });
  }

  /* ---------------- REGISTER (one page: email + code + password) ---------------- */
  if (page === 'register') {
    var ts = null, sendBtn = $('sendBtn'), regMsg = $('formMsg');
    if ($('toLogin')) $('toLogin').setAttribute('href', keepPlan('login.html'));
    if ((q.get('plan') === 'pro' || /^checkout\.html/.test(q.get('next') || '')) && $('planChip')) $('planChip').hidden = false;
    me().then(function (u) { if (u) location.replace(nextUrl()); });
    makeTurnstile($('turnstile')).then(function (x) { ts = x; });
    var pwInput = $('password'), meter = $('pwMeter');
    pwInput.addEventListener('input', function () { meter.setAttribute('data-s', pwScore(pwInput.value)); });
    hexCode($('code'));

    // If the backend has not enabled email verification (or SMTP), say so up front instead of failing later.
    status().then(function (s) {
      if (s.email_verification === false) {
        show(regMsg, 'err', t('reg_unavailable'));
        sendBtn.disabled = true; $('submitBtn').disabled = true;
      }
    });

    sendBtn.addEventListener('click', function () {
      var email = $('email').value.trim();
      hide(regMsg); $('email').removeAttribute('aria-invalid');
      if (!validEmail(email)) { $('email').setAttribute('aria-invalid', 'true'); return show(regMsg, 'err', t('invalid_email')); }
      if (ts && ts.needed && !ts.token) return show(regMsg, 'err', t('captcha'));
      sendBtn.disabled = true;
      raw(withTs('/verification?email=' + encodeURIComponent(email), ts)).then(norm).then(function (n) {
        if (ts) ts.reset(); // Turnstile tokens are single-use
        if (n.ok) { show(regMsg, 'ok', t('code_sent')); $('code').focus(); return cooldown(sendBtn, 60); }
        sendBtn.disabled = false;
        show(regMsg, 'err', errText(n));
      });
    });

    $('regForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var email = $('email').value.trim(), code = $('code').value, pw = pwInput.value, pw2 = $('password2').value, btn = $('submitBtn');
      hide(regMsg); $('email').removeAttribute('aria-invalid');
      if (!validEmail(email)) { $('email').setAttribute('aria-invalid', 'true'); return show(regMsg, 'err', t('invalid_email')); }
      if (!/^[0-9a-f]{6}$/.test(code)) return show(regMsg, 'err', t('code_invalid'));
      if (!pwOk(pw)) return show(regMsg, 'err', t('weak_password'));
      if (pw !== pw2) return show(regMsg, 'err', t('pw_mismatch'));
      if (!$('agree').checked) return show(regMsg, 'err', t('need_agree'));
      if (ts && ts.needed && !ts.token) return show(regMsg, 'err', t('captcha'));
      busy(btn, true);
      // new-api needs a username (max 20): derive one from the email; people sign in with the email itself.
      var local = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').slice(0, 12) || 'user';
      var rnd = '', cs = 'abcdefghijklmnopqrstuvwxyz0123456789', buf = crypto.getRandomValues(new Uint8Array(6));
      for (var i = 0; i < buf.length; i++) rnd += cs.charAt(buf[i] % cs.length);
      raw(withTs('/user/register', ts), { method: 'POST', body: { username: local + '_' + rnd, password: pw, email: email, verification_code: code } }).then(norm).then(function (n) {
        if (!n.ok) { busy(btn, false); if (ts) ts.reset(); return show(regMsg, 'err', errText(n)); }
        // Turnstile tokens are single-use, so with it on we send people to the sign-in page instead of auto-login.
        if (ts && ts.needed) return location.replace(keepPlan('login.html?registered=1'));
        doLogin(email, pw, null).then(function (r) {
          if (r.ok) return location.replace(nextUrl());
          location.replace(keepPlan('login.html?registered=1'));
        });
      });
    });
  }

  /* ---------------- FORGOT (sends the reset link) ---------------- */
  if (page === 'forgot') {
    var fts = null;
    makeTurnstile($('turnstile')).then(function (x) { fts = x; });
    $('reqForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var email = $('email').value.trim(), box = $('formMsg'), btn = $('submitBtn');
      hide(box); $('email').removeAttribute('aria-invalid');
      if (!validEmail(email)) { $('email').setAttribute('aria-invalid', 'true'); return show(box, 'err', t('invalid_email')); }
      if (fts && fts.needed && !fts.token) return show(box, 'err', t('captcha'));
      busy(btn, true);
      raw(withTs('/reset_password?email=' + encodeURIComponent(email), fts)).then(norm).then(function (n) {
        busy(btn, false); if (fts) fts.reset();
        // The server answers the same way whether or not the email exists.
        if (n.ok) { btn.disabled = true; setTimeout(function () { btn.disabled = false; }, 30000); return show(box, 'ok', t('reset_sent')); }
        show(box, 'err', errText(n));
      });
    });
  }

  /* ---------------- RESET (link target /user/reset?email=&token=) ---------------- */
  if (page === 'reset') {
    var rEmail = q.get('email') || '', rTok = q.get('token') || '';
    if (!rEmail || !rTok) { $('resetBox').hidden = true; show($('resetMsg'), 'err', t('server')); }
    $('resetBtn').addEventListener('click', function () {
      var btn = this; busy(btn, true); hide($('resetMsg'));
      raw('/user/reset', { method: 'POST', body: { email: rEmail, token: rTok } }).then(norm).then(function (n) {
        if (!n.ok || typeof n.data !== 'string') { busy(btn, false); return show($('resetMsg'), 'err', errText(n)); }
        $('resetBox').hidden = true; $('doneBox').hidden = false; $('newPw').textContent = n.data;
        $('copyPw').onclick = function () {
          var done = function () { $('copyPw').classList.add('done'); };
          if (navigator.clipboard) navigator.clipboard.writeText(n.data).then(done, function () {}); else done();
        };
      });
    });
  }

  /* ---------------- OAUTH CALLBACK (/oauth/<provider>?code=&state=) ---------------- */
  if (page === 'oauth') {
    var m = location.pathname.match(/\/oauth\/([a-z0-9_-]+)\/?$/i);
    var provider = q.get('provider') || (m && m[1]) || '', box = $('formMsg');
    var err = q.get('error');
    if (err) { show(box, 'err', q.get('error_description') || err); }
    else if (!provider || !q.get('code') || !q.get('state')) { show(box, 'err', t('oauth_fail')); }
    else {
      raw('/oauth/' + encodeURIComponent(provider) + '?code=' + encodeURIComponent(q.get('code')) + '&state=' + encodeURIComponent(q.get('state'))).then(norm).then(function (n) {
        if (n.ok && n.data && n.data.access_token) {
          saveAuth(n.data);
          var next = 'account.html';
          try { next = sessionStorage.getItem(NEXT_KEY) || next; sessionStorage.removeItem(NEXT_KEY); } catch (e) {}
          return location.replace(next);
        }
        $('oauthSpin').hidden = true;
        if (n.ok) return showMore(box);
        show(box, 'err', errText(n));
      });
    }
    if (box.className.indexOf('show') >= 0) $('oauthSpin').hidden = true;
  }

  /* ---------------- ACCOUNT ---------------- */
  if (page === 'account') {
    var state = { user: null, plans: [], subs: [], sessions: null, loaded: false };
    var CO = window.CF_CO; // purchase flow helpers (assets/checkout.js)

    function money(amount, cur) {
      var c = (cur || 'USD').toUpperCase();
      try { return new Intl.NumberFormat(lang() === 'en' ? 'en-US' : lang(), { style: 'currency', currency: c, currencyDisplay: 'narrowSymbol', maximumFractionDigits: amount % 1 ? 2 : 0 }).format(amount); }
      catch (e) { return c + ' ' + amount; }
    }
    function months(p) { return p.duration_unit === 'year' ? 12 * p.duration_value : p.duration_unit === 'month' ? p.duration_value : p.duration_unit === 'day' ? p.duration_value / 30 : 1; }
    // Prices are always listed (published price list); real backend plans replace them once payments are open.
    function proPlans() {
      if (CO && state.user && CO.isBypass(state.user.email)) return CO.catalogPlans();
      var live = state.plans.filter(function (p) { return PRO_PLAN.test(p.title || ''); }).sort(function (a, b) { return months(a) - months(b); });
      return live.length ? live : (CO ? CO.catalogPlans() : []);
    }
    function activePro() {
      var ids = {}, now = Date.now() / 1000, best = 0;
      proPlans().forEach(function (p) { ids[p.id] = true; });
      state.subs.forEach(function (s) {
        var x = s.subscription; if (!x) return;
        if (ids[x.plan_id] && x.status === 'active' && x.end_time > now && x.end_time > best) best = x.end_time;
      });
      if (CO && state.user && CO.isBypass(state.user.email)) best = Math.max(best, CO.activeProEnd(state.user.email) / 1000);
      return best;
    }
    var selectedPlan = null;
    function render() {
      var u = state.user; if (!u) return;
      CO = window.CF_CO; // loaded after this file, so read it at render time
      var proEnd = activePro(), pro = proEnd > 0;
      var nm = u.email || u.username || '?';
      $('avatar').textContent = nm.charAt(0).toUpperCase();
      $('uEmail').textContent = nm;
      var bp = $('uPlan'); bp.textContent = pro ? t('plan_pro') : t('plan_free'); bp.className = 'badge-plan' + (pro ? ' pro' : '');
      $('kvEmail').textContent = u.email || t('none');
      $('kvUser').textContent = u.username || t('none');
      var ids = []; if (u.github_id) ids.push('GitHub'); if (u.oidc_id) ids.push('OIDC'); ids.push(t('verified'));
      $('kvLogin').textContent = ids.join(', ');
      $('kvPlan').textContent = pro ? t('plan_pro') : t('plan_free');
      $('kvExp').textContent = pro ? fmtTime(proEnd) : t('never');
      $('upgrade').setAttribute('data-pro', pro ? '1' : '0');
      var pp = $('pwPanel'); if (pp) pp.hidden = !u.has_password;

      // plan cards
      var plans = proPlans(), cards = $('planCards');
      if (!plans.length) {
        cards.innerHTML = ''; $('checkoutBtn').disabled = true;
        if (state.loaded) show($('checkoutMsg'), 'info', t('pay_unavailable'));
      } else {
        if (!selectedPlan || !plans.some(function (p) { return String(p.id) === String(selectedPlan); })) selectedPlan = plans[plans.length - 1].id;
        cards.innerHTML = plans.map(function (p) {
          var per = months(p) >= 12 ? t('per_year') : t('per_month');
          return '<label><input type="radio" name="plan" value="' + p.id + '"' + (String(p.id) === String(selectedPlan) ? ' checked' : '') + '><b>' + esc(p.title) + '</b><span class="p">' + esc(money(p.price_amount, p.currency)) + ' <small>' + esc(per) + '</small></span><span class="s">' + esc(p.subtitle || '') + '</span></label>';
        }).join('');
        $('checkoutBtn').disabled = false;
        hide($('checkoutMsg'));
      }

      var sb = $('subsBody'), byId = {};
      state.plans.forEach(function (p) { byId[p.id] = p; });
      var rows = state.subs.map(function (s) { return s.subscription; }).filter(Boolean);
      sb.innerHTML = rows.length ? '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>' + esc($('thPlan').textContent) + '</th><th>' + esc($('thStatus').textContent) + '</th><th>' + esc($('thFrom').textContent) + '</th><th>' + esc($('thTo').textContent) + '</th></tr></thead><tbody>' +
        rows.map(function (x) {
          var st = x.status === 'active' && x.end_time <= Date.now() / 1000 ? 'expired' : x.status;
          return '<tr><td>' + esc(byId[x.plan_id] ? byId[x.plan_id].title : '#' + x.plan_id) + '</td><td>' + esc(t('st_' + st) === 'st_' + st ? st : t('st_' + st)) + '</td><td>' + esc(fmtTime(x.start_time)) + '</td><td>' + esc(fmtTime(x.end_time)) + '</td></tr>';
        }).join('') + '</tbody></table></div>' : '<div class="empty">' + esc(t('no_subs')) + '</div>';

      // orders: only locally recorded (complimentary) orders appear here; the backend has no per-user order list yet
      var ob = $('ordersBody');
      if (ob && CO) {
        var list = CO.ordersFor(u.email); // the backend has no per-user order list yet; only locally recorded orders appear here
        ob.parentNode.hidden = !list.length;
        ob.innerHTML = list.length ? '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>' + esc(CO.t('col_order')) + '</th><th>' + esc(CO.t('col_plan')) + '</th><th>' + esc(CO.t('col_amount')) + '</th><th>' + esc(CO.t('col_status')) + '</th><th>' + esc(CO.t('col_date')) + '</th><th></th></tr></thead><tbody>' +
          list.map(function (o) {
            var info = o.status === 'paid' ? CO.refundInfo(o) : null;
            var acts = o.status === 'paid'
              ? '<a class="linkbtn" href="receipt.html?order=' + encodeURIComponent(o.id) + '">' + esc(CO.t('act_receipt')) + '</a>' + (info.eligible ? ' · <a class="linkbtn" href="refund-request.html?order=' + encodeURIComponent(o.id) + '">' + esc(CO.t('act_refund')) + '</a>' : '')
              : '';
            return '<tr><td>' + esc(o.id) + '</td><td>' + esc(CO.planTitle(o.cycle)) + '</td><td>' + esc(CO.fmtMoney(CO.paidAmount(o), o.currency)) + (o.complimentary ? ' <span class="hint">· ' + esc(CO.t('rc_comp')) + '</span>' : '') + '</td><td><span class="pill ' + esc(o.status) + '">' + esc(CO.t('st_' + o.status)) + '</span></td><td>' + esc(CO.fmtDate(o.paidAt || o.createdAt)) + '</td><td style="white-space:nowrap">' + acts + '</td></tr>';
          }).join('') + '</tbody></table></div>' : '<div class="empty">' + esc(CO.t('orders_empty')) + '</div>';
      }

      var db = $('devicesBody');
      if (state.sessions && state.sessions.length) {
        db.innerHTML = '<div class="tbl-wrap"><table class="tbl"><tbody>' + state.sessions.map(function (d) {
          var ua = String(d.user_agent || '').replace(/\s*\(.*?\)\s*/g, ' ').slice(0, 60);
          return '<tr><td>' + esc(ua || d.login_method || '') + '<br><span class="hint">' + esc(d.ip || '') + '</span></td><td>' + esc(fmtTime(d.last_active_at)) + '</td><td style="text-align:right">' +
            (d.current ? '<span class="hint">' + esc(t('current')) + '</span>' : '<button type="button" class="linkbtn" data-rm="' + esc(d.sid) + '">' + esc(t('remove')) + '</button>') + '</td></tr>';
        }).join('') + '</tbody></table></div>';
      } else db.innerHTML = '<div class="empty">' + esc(t('no_devices')) + '</div>';
    }
    new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    // checkout.js (orders, demo plan state) loads after this file: draw again once every script is in
    window.addEventListener('load', function () { render(); });

    me().then(function (u) {
      if (!u) return location.replace('login.html?next=account.html');
      state.user = u;
      $('loading').hidden = true; $('acct').hidden = false;
      render();
      if (q.get('plan') === 'pro') { var up = $('upgrade'); if (up) up.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      Promise.all([
        authed('/subscription/plans'),
        authed('/subscription/self'),
        authed('/user/sessions')
      ]).then(function (r) {
        state.plans = r[0].ok && Array.isArray(r[0].data) ? r[0].data.map(function (x) { return x.plan; }).filter(Boolean) : [];
        state.subs = r[1].ok && r[1].data && Array.isArray(r[1].data.all_subscriptions) ? r[1].data.all_subscriptions : [];
        state.sessions = r[2].ok && Array.isArray(r[2].data) ? r[2].data : [];
        state.loaded = true; render();
      });
    });

    $('planCards').addEventListener('change', function (e) { if (e.target.name === 'plan') selectedPlan = e.target.value; });
    $('devicesBody').addEventListener('click', function (e) {
      var sid = e.target.getAttribute && e.target.getAttribute('data-rm');
      if (!sid) return;
      authed('/user/sessions/' + encodeURIComponent(sid), { method: 'DELETE' }).then(function (n) {
        if (n.ok) { state.sessions = state.sessions.filter(function (d) { return d.sid !== sid; }); render(); }
      });
    });
    // Purchasing happens on the checkout page (order summary, billing details, terms, payment).
    $('checkoutBtn').addEventListener('click', function () {
      CO = window.CF_CO;
      var plan = proPlans().filter(function (p) { return String(p.id) === String(selectedPlan); })[0];
      location.href = 'checkout.html?plan=pro&cycle=' + (plan && months(plan) >= 12 ? 'year' : 'month');
    });
    // Change password: prove the current password to get a one-time security proof, then submit the new one with it.
    var pwForm = $('pwForm');
    if (pwForm) {
      $('newpw').addEventListener('input', function () { $('pwMeter').setAttribute('data-s', pwScore(this.value)); });
      pwForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var cur = $('curpw').value, nw = $('newpw').value, nw2 = $('newpw2').value, box = $('pwMsg'), btn = $('pwBtn');
        hide(box);
        if (!cur) return show(box, 'err', t('cur_pw_needed'));
        if (!pwOk(nw)) return show(box, 'err', t('weak_password'));
        if (nw !== nw2) return show(box, 'err', t('pw_mismatch'));
        if (nw === cur) return show(box, 'err', t('pw_same'));
        busy(btn, true);
        pwFields(cur).then(function (f) {
          f.method = 'password'; f.scope = 'account.password.change';
          return authed('/verify', { method: 'POST', body: f });
        }).then(function (v) {
          if (!v.ok || !v.data || !v.data.proof_token) { busy(btn, false); return show(box, 'err', errText(v)); }
          return authed('/user/self', { method: 'PUT', headers: { 'X-Security-Proof': v.data.proof_token }, body: { password: nw, original_password: cur } }).then(function (n) {
            busy(btn, false);
            if (!n.ok) return show(box, 'err', errText(n));
            if (n.data && n.data.access_token) saveAuth(n.data);
            pwForm.reset(); $('pwMeter').setAttribute('data-s', '0');
            show(box, 'ok', t('pw_changed'));
          });
        });
      });
    }
    $('logoutBtn').addEventListener('click', function () {
      busy(this, true);
      authed('/user/auth/logout', { method: 'POST' }).then(function () { clearAuth(); location.replace('index.html'); });
    });
  }

  /* ---------------- PRICING: billing cycle toggle + CTA ---------------- */
  if (page === 'pricing') {
    var btns = document.querySelectorAll('.bill-toggle button');
    Array.prototype.forEach.call(btns, function (b) {
      b.addEventListener('click', function () {
        Array.prototype.forEach.call(btns, function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        document.body.setAttribute('data-cycle', b.getAttribute('data-cycle'));
      });
    });
    document.body.setAttribute('data-cycle', 'year');
  }

  // The pricing page "Get Pro" buttons follow the selected billing period.
  if (page === 'pricing') {
    var cta = document.querySelectorAll('[data-cta-pro]');
    Array.prototype.forEach.call(document.querySelectorAll('.bill-toggle button'), function (b) {
      b.addEventListener('click', function () {
        Array.prototype.forEach.call(cta, function (a) { a.setAttribute('href', 'checkout.html?plan=pro&cycle=' + b.getAttribute('data-cycle')); });
      });
    });
  }

  // used by the purchase-flow pages (assets/checkout.js)
  window.CF_AUTH = {
    me: me, authed: authed, status: status,
    logout: function () { return authed('/user/auth/logout', { method: 'POST' }).then(function () { clearAuth(); }); }
  };
})();
