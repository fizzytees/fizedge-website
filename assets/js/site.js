/* FizEdge Projects — site behaviour. No dependencies. */
(function () {
  'use strict';
  var cfg = window.FIZEDGE_CONFIG || {};
  var cp = cfg.coolprez || { status: 'in-development', storeUrl: '' };
  var root = document.documentElement;
  var base = root.getAttribute('data-root') || ''; // relative path to site root, e.g. "../"

  /* ---------- mobile menu ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    var label = toggle.querySelector('.label');
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.hidden = !open;
      if (label) label.textContent = open ? 'Close' : 'Menu';
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
    });
    window.matchMedia('(min-width: 861px)').addEventListener('change', function (m) { if (m.matches) setOpen(false); });
  }

  /* ---------- Coolprez status ---------- */
  var states = {
    'in-development': {
      chip: 'In development', cta: 'Discover Coolprez', href: base + 'brands/coolprez/',
      sticker: 'Coolprez ✦ in development ✦ coolprez ✦ in development ✦ ',
      line: 'Coolprez is in development. See what the brand is about and follow along for launch news.',
      pageCta: 'Follow the launch', pageHref: '#launch', title: 'In the works.',
      pageLine: 'Coolprez is in development. We will share launch news as soon as it is ready.'
    },
    'launch-list': {
      chip: 'Coming soon', cta: 'Join the launch list', href: base + 'brands/coolprez/#launch',
      sticker: 'Coolprez ✦ coming soon ✦ coolprez ✦ coming soon ✦ ',
      line: 'Coolprez is coming soon. Join the list to hear the moment it opens.',
      pageCta: 'Join the launch list', pageHref: '#launch', title: 'Be first in line.',
      pageLine: 'Coolprez is coming soon. Leave your email and we will tell you the moment it opens.'
    },
    'live': {
      chip: 'Now open', cta: 'Shop Coolprez', href: cp.storeUrl || (base + 'brands/coolprez/'),
      sticker: 'Coolprez ✦ now open ✦ coolprez ✦ now open ✦ ',
      line: 'The Coolprez store is open. Custom tees for you, your event or your business.',
      pageCta: 'Shop Coolprez', pageHref: cp.storeUrl || '#launch', title: 'Now open.',
      pageLine: 'Custom tees for you, your event or your business.'
    }
  };
  var s = states[cp.status] || states['in-development'];
  var external = cp.status === 'live' && !!cp.storeUrl;
  root.setAttribute('data-coolprez', states[cp.status] ? cp.status : 'in-development');

  var each = function (sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); };
  each('[data-cp="chip"]', function (el) { el.textContent = s.chip; });
  each('[data-cp="line"]', function (el) { el.textContent = s.line; });
  each('[data-cp="sticker"]', function (el) { el.textContent = s.sticker; });
  each('[data-cp="title"]', function (el) { el.textContent = s.title; });
  each('[data-cp="page-line"]', function (el) { el.textContent = s.pageLine; });
  var setLink = function (el, text, href) {
    var t = el.querySelector('.t'); if (t) t.textContent = text;
    el.setAttribute('href', href);
    var arr = el.querySelector('.arr');
    if (external && /^https?:/.test(href)) {
      el.setAttribute('target', '_blank'); el.setAttribute('rel', 'noopener');
      if (arr) arr.textContent = '↗';
      if (!el.querySelector('.visually-hidden')) {
        var sr = document.createElement('span'); sr.className = 'visually-hidden'; sr.textContent = ' (opens the Coolprez store in a new tab)'; el.appendChild(sr);
      }
    } else if (arr && el.hasAttribute('data-down') && href.charAt(0) === '#') { arr.textContent = '↓'; }
  };
  each('[data-cp="cta"]', function (el) { setLink(el, s.cta, s.href); });
  each('[data-cp="page-cta"]', function (el) { setLink(el, s.pageCta, s.pageHref); });
  each('[data-cp-show]', function (el) {
    el.hidden = el.getAttribute('data-cp-show').split(' ').indexOf(cp.status) === -1;
  });

  /* ---------- before / after slider ---------- */
  each('.ba', function (ba) {
    var input = ba.querySelector('input[type="range"]');
    if (!input) return;
    var update = function () { ba.style.setProperty('--pos', input.value + '%'); };
    input.addEventListener('input', update); update();
  });


  /* ---------- testimonial video: play when on screen, pause when scrolled away ---------- */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  each('.auto-video', function (v) {
    var card = v.closest('.video-card');
    var btn = card && card.querySelector('.sound-btn');
    var userPaused = false, auto = false, visible = false;
    v.addEventListener('pause', function () { if (!auto && visible) userPaused = true; auto = false; });
    v.addEventListener('play', function () { userPaused = false; });
    v.addEventListener('volumechange', function () { if (btn) btn.hidden = !v.muted; });
    if (btn) btn.addEventListener('click', function () { v.muted = false; v.volume = 1; var p = v.play(); if (p && p.catch) p.catch(function () {}); });
    if (!('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        visible = en.isIntersecting && en.intersectionRatio >= 0.5;
        if (visible) {
          if (!userPaused && !reduceMotion) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        } else if (!v.paused) { auto = true; v.pause(); }
      });
    }, { threshold: [0, 0.5, 1] }).observe(v);
  });


  /* ---------- FAQ: search, open linked answers ---------- */
  var faqQ = document.getElementById('faq-q');
  if (faqQ) {
    var items = Array.prototype.slice.call(document.querySelectorAll('.faq-page details'));
    var groups = Array.prototype.slice.call(document.querySelectorAll('.faq-group'));
    var empty = document.getElementById('faq-empty');
    var count = document.getElementById('faq-count');
    faqQ.addEventListener('input', function () {
      var q = faqQ.value.trim().toLowerCase();
      var shown = 0;
      items.forEach(function (d) {
        var hit = !q || d.textContent.toLowerCase().indexOf(q) !== -1;
        d.hidden = !hit; if (hit) shown++;
        d.open = !!(q && hit);
      });
      groups.forEach(function (g) { g.hidden = !g.querySelector('details:not([hidden])'); });
      empty.hidden = shown !== 0;
      if (count) count.textContent = shown + (shown === 1 ? ' answer' : ' answers');
    });
  }
  var openFromHash = function () {
    var id = window.location.hash.slice(1);
    var el = id && document.getElementById(id);
    if (el && el.tagName === 'DETAILS') { el.open = true; }
  };
  window.addEventListener('hashchange', openFromHash); openFromHash();

  /* ---------- legal contents: highlight the section in view ---------- */
  var toc = document.querySelector('.legal-toc');
  if (toc && 'IntersectionObserver' in window) {
    var links = {};
    Array.prototype.forEach.call(toc.querySelectorAll('a[href^="#"]'), function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var current = null;
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var next = links[en.target.id];
        if (!next || next === current) return;
        if (current) { current.classList.remove('active'); current.removeAttribute('aria-current'); }
        current = next; current.classList.add('active'); current.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    Object.keys(links).forEach(function (id) { var sec = document.getElementById(id); if (sec) spy.observe(sec); });
  }


  /* ---------- copy email buttons ---------- */
  each('.copy-email', function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy'); var tag = btn.querySelector('.copy-tag');
      var done = function () { btn.classList.add('copied'); if (tag) tag.textContent = 'Copied'; setTimeout(function () { btn.classList.remove('copied'); if (tag) tag.textContent = 'Copy'; }, 2000); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { window.location.href = 'mailto:' + text; });
      else window.location.href = 'mailto:' + text;
    });
  });

  /* ---------- forms ---------- */
  var emailOk = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); };

  var showError = function (input, msg) {
    var id = input.id + '-error';
    var err = document.getElementById(id);
    if (!msg) {
      input.removeAttribute('aria-invalid');
      if (err) err.remove();
      var d = (input.getAttribute('aria-describedby') || '').split(' ').filter(function (x) { return x && x !== id; }).join(' ');
      if (d) input.setAttribute('aria-describedby', d); else input.removeAttribute('aria-describedby');
      return;
    }
    input.setAttribute('aria-invalid', 'true');
    if (!err) {
      err = document.createElement('p'); err.className = 'field-error'; err.id = id;
      input.insertAdjacentElement('afterend', err);
      var ds = (input.getAttribute('aria-describedby') || '');
      input.setAttribute('aria-describedby', (ds + ' ' + id).trim());
    }
    err.textContent = msg;
  };

  var send = function (form) {
    var endpoint = form.getAttribute('action') || cfg.formEndpoint;
    return fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error('Request failed'); return r; });
  };

  /* contact form */
  var contact = document.getElementById('contact-form');
  if (contact) {
    var groups = contact.querySelectorAll('[data-for-type]');
    var submitLabel = contact.querySelector('[type="submit"] .t');
    var subject = contact.querySelector('input[name="_subject"]');
    var setType = function (type) {
      Array.prototype.forEach.call(groups, function (g) {
        var on = g.getAttribute('data-for-type') === type;
        g.hidden = !on; g.disabled = !on;
      });
      if (submitLabel) submitLabel.textContent = type === 'artwork' ? 'Send project details' : 'Send message';
      if (subject) subject.value = 'New website inquiry: ' + ({ artwork: 'Apparel project', coolprez: 'Coolprez', business: 'Business / partnership' }[type] || type);
    };
    var params = new URLSearchParams(window.location.search);
    var pre = params.get('type');
    var radios = contact.querySelectorAll('input[name="inquiry_type"]');
    Array.prototype.forEach.call(radios, function (r) {
      if (pre && r.value === pre) r.checked = true;
      r.addEventListener('change', function () { if (r.checked) setType(r.value); });
    });
    var checked = contact.querySelector('input[name="inquiry_type"]:checked');
    setType(checked ? checked.value : 'artwork');


    each('[data-pick]', function (a) {
      a.addEventListener('click', function () {
        var r = contact.querySelector('input[name="inquiry_type"][value="' + a.getAttribute('data-pick') + '"]');
        if (r) { r.checked = true; setType(r.value); }
      });
    });
    var summary = document.getElementById('form-errors');
    var status = document.getElementById('form-status');
    contact.addEventListener('submit', function (e) {
      e.preventDefault();
      var problems = [];
      var name = contact.querySelector('#c-name');
      var email = contact.querySelector('#c-email');
      var msg = contact.querySelector('[data-for-type]:not([hidden]) textarea[data-required]');
      if (!name.value.trim()) { showError(name, 'Enter your name.'); problems.push({ el: name, text: 'your name' }); } else showError(name);
      if (!emailOk(email.value)) { showError(email, 'Enter an email address like name@example.com.'); problems.push({ el: email, text: 'your email address' }); } else showError(email);
      if (msg) {
        if (msg.value.trim().length < 3) { showError(msg, 'Add a short description so we can reply properly.'); problems.push({ el: msg, text: 'a short message' }); } else showError(msg);
      }
      if (problems.length) {
        summary.hidden = false;
        summary.innerHTML = '';
        var h = document.createElement('strong'); h.textContent = 'Please fix ' + (problems.length === 1 ? '1 thing' : problems.length + ' things') + ' before sending:';
        var ul = document.createElement('ul'); ul.style.paddingLeft = '1.1em';
        problems.forEach(function (p) {
          var li = document.createElement('li'); var a = document.createElement('a');
          a.href = '#' + p.el.id; a.textContent = 'Add ' + p.text; a.style.color = 'inherit';
          a.addEventListener('click', function (ev) { ev.preventDefault(); p.el.focus(); });
          li.appendChild(a); ul.appendChild(li);
        });
        summary.appendChild(h); summary.appendChild(ul);
        summary.focus();
        return;
      }
      summary.hidden = true;
      var btn = contact.querySelector('[type="submit"]');
      btn.disabled = true; if (submitLabel) submitLabel.textContent = 'Sending…';
      send(contact).then(function () {
        var done = document.getElementById('form-done');
        var first = name.value.trim().split(/\s+/)[0];
        done.querySelector('[data-first]').textContent = first || 'there';
        done.querySelector('[data-email]').textContent = email.value.trim();
        document.getElementById('contact-start').hidden = true;
        done.hidden = false; done.focus();
        window.scrollTo({ top: done.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
      }).catch(function () {
        btn.disabled = false;
        var c = contact.querySelector('input[name="inquiry_type"]:checked'); setType(c ? c.value : 'artwork');
        status.hidden = false;
        status.textContent = 'Your message could not be sent. Please try again, or email 244project@fizedge.com directly.';
      });
    });
    var again = document.getElementById('send-another');
    if (again) again.addEventListener('click', function () {
      contact.reset(); setType('artwork');
      document.getElementById('form-done').hidden = true;
      document.getElementById('contact-start').hidden = false;
      contact.querySelector('#c-name').focus();
    });
  }

  /* launch-list form (Coolprez page) */
  var launch = document.getElementById('launch-form');
  if (launch) {
    launch.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = launch.querySelector('#l-email');
      if (!emailOk(email.value)) {
        showError(email, 'Enter an email address like name@example.com.');
        launch.classList.remove('shake'); void launch.offsetWidth; launch.classList.add('shake');
        email.focus(); return;
      }
      showError(email);
      var btn = launch.querySelector('[type="submit"]'); btn.disabled = true;
      send(launch).then(function () {
        launch.hidden = true;
        var ok = document.getElementById('launch-done');
        ok.querySelector('[data-email]').textContent = email.value.trim();
        ok.hidden = false; ok.focus();
      }).catch(function () {
        btn.disabled = false;
        showError(email, 'That didn’t go through. Please try again in a moment.');
      });
    });
  }

  // ---------- team print: ink-pull swap ----------
  (function () {
    var tp = document.querySelector('.team-print'); if (!tp) return;
    var imgs = tp.querySelectorAll('.tp-img'), n = tp.querySelector('.tp-n'), i = 0, busy = false;
    var dots = document.querySelectorAll('.tp-dots button');
    if (imgs.length < 2) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches, visible = true, timer;
    if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(tp);
    function mark(k) { if (n) n.textContent = '0' + (k + 1); each('.tp-dots button', function (d, x) { d.classList.toggle('on', x === k); d.setAttribute('aria-selected', x === k); }); }
    function go(k, auto) {
      if (busy || k === i) return; if (auto && (!visible || document.hidden)) return;
      var cur = imgs[i], nx = imgs[k];
      if (reduce) { cur.classList.remove('on'); nx.classList.add('on'); i = k; mark(k); return; }
      busy = true;
      tp.classList.remove('pulling'); void tp.offsetWidth; tp.classList.add('pulling');
      cur.classList.add('outgoing'); nx.classList.add('incoming'); mark(k);
      setTimeout(function () { cur.classList.remove('on', 'outgoing'); nx.classList.remove('incoming'); nx.classList.add('on'); i = k; busy = false; }, 1300);
    }
    function start() { clearInterval(timer); if (!reduce) timer = setInterval(function () { go((i + 1) % imgs.length, true); }, 5200); }
    Array.prototype.forEach.call(dots, function (d, x) { d.addEventListener('click', function () { go(x); start(); }); });
    start();
  })();
})();
