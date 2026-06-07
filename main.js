/* =====================================================
   THE HARVEST TABLE — main.js
   Mobile nav · Scroll reveal · Parallax · Menu tabs · Forms
   ===================================================== */

(function initNav() {
  const nav    = document.getElementById('nav');
  const toggle = document.querySelector('.nav__toggle');
  const links  = document.querySelector('.nav__links');

  if (!nav) return;

  // Scroll: transparent → solid
  function onScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      const isOpen = links.classList.toggle('is-open');
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on ESC
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('is-open')) {
        links.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });

    // Close on link click
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }
})();


(function markActiveLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(function (a) {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });
})();


(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

  els.forEach(function (el) { observer.observe(el); });
})();


(function initParallax() {
  const heroBg = document.querySelector('.hero__bg');
  if (!heroBg) return;

  // Disable on mobile for performance
  if (window.matchMedia('(max-width: 768px)').matches) return;

  window.addEventListener('scroll', function () {
    const scrolled = window.scrollY;
    heroBg.style.transform = 'translateY(' + (scrolled * 0.28) + 'px)';
  }, { passive: true });
})();


(function initMenuTabs() {
  const tabBtns   = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  if (!tabBtns.length) return;

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const target = btn.getAttribute('data-tab');

      tabBtns.forEach(function (b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(function (p) {
        p.classList.remove('is-active');
      });

      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      const panel = document.getElementById('tab-' + target);
      if (panel) panel.classList.add('is-active');
    });
  });

  // Keyboard navigation
  tabBtns.forEach(function (btn, i) {
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') {
        const next = tabBtns[i + 1] || tabBtns[0];
        next.focus();
        next.click();
      }
      if (e.key === 'ArrowLeft') {
        const prev = tabBtns[i - 1] || tabBtns[tabBtns.length - 1];
        prev.focus();
        prev.click();
      }
    });
  });
})();


(function initForms() {
  document.querySelectorAll('form[data-form]').forEach(function (form) {
    const status = form.querySelector('.form-status');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const data     = new FormData(form);
      const submitBtn = form.querySelector('[type="submit"]');

      submitBtn.disabled    = true;
      submitBtn.textContent = 'Sending…';

      // ─────────────────────────────────────────────
      // TO WIRE A REAL BACKEND:
      //
      // Option 1 — Formspree:
      //   Set form action="https://formspree.io/f/YOUR_ID" method="POST"
      //   Remove this JS handler; Formspree handles it.
      //
      // Option 2 — EmailJS:
      //   emailjs.sendForm('SERVICE_ID', 'TEMPLATE_ID', form)
      //     .then(() => showStatus(true))
      //     .catch(() => showStatus(false));
      //
      // Option 3 — Custom API:
      //   fetch('/api/contact', { method: 'POST', body: data })
      //     .then(r => r.ok ? showStatus(true) : showStatus(false));
      // ─────────────────────────────────────────────

      // Demo: simulate success after 800ms
      setTimeout(function () {
        showStatus(true);
        form.reset();
        submitBtn.disabled    = false;
        submitBtn.textContent = submitBtn.getAttribute('data-label') || 'Send';
      }, 800);

      function showStatus(success) {
        if (!status) return;
        status.className = 'form-status ' + (success ? 'form-status--success' : 'form-status--error');
        status.textContent = success
          ? (form.dataset.success || 'Thank you — we\'ll be in touch shortly.')
          : (form.dataset.error  || 'Something went wrong. Please call us directly.');
        status.style.display = 'block';
        status.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });
})();
