/* ═══════════════════════════════════════════════════════════════════
   script.js — Naveen P Portfolio
   Features:
     • Loading screen         • Dark / Light theme toggle
     • Sticky navbar          • Mobile hamburger menu
     • Smooth scroll + AOS   • Typewriter effect
     • Counter animation      • Skill bar animati.on
     • Project filter         • EmailJS contact form
     • Form validation        • Honeypot spam protection
     • Scroll-to-top button   • Active nav link on scroll
     • Dynamic footer year
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

/* ────────────────────────────────────────────────────────────────
   0. EMAILJS CONFIGURATION
   Replace the three placeholder strings with your real values.
   Get them at https://www.emailjs.com → Account / Email Services / Email Templates
   The same values must match those in index.html data attributes.
──────────────────────────────────────────────────────────────── */
const EMAILJS_PUBLIC_KEY   = 'rc5Gzf4ME16IdA9nD';   // EmailJS Public Key
const EMAILJS_SERVICE_ID   = 'service_b26sm6p';     // EmailJS Service ID
const EMAILJS_TEMPLATE_ID  = 'template_1oyfyab';    // EmailJS Template ID

/* ────────────────────────────────────────────────────────────────
   1. LOADING SCREEN
──────────────────────────────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loading-screen');
  if (!loader) return;

  // Hide loader after page has painted + 1.9 s animation
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      // Allow body to scroll once loader gone
      document.body.style.overflow = '';
    }, 1900);
  });

  // Fallback: hide after 4 s no matter what
  setTimeout(() => loader.classList.add('hidden'), 4000);

  // Prevent scroll while loading
  document.body.style.overflow = 'hidden';
})();

/* ────────────────────────────────────────────────────────────────
   2. FOOTER YEAR
──────────────────────────────────────────────────────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ────────────────────────────────────────────────────────────────
   3. DARK / LIGHT THEME TOGGLE
──────────────────────────────────────────────────────────────── */
(function initTheme() {
  const html        = document.documentElement;
  const toggleBtn   = document.getElementById('theme-toggle');
  const themeIcon   = document.getElementById('theme-icon');
  const STORAGE_KEY = 'portfolio-theme';

  // Resolve saved or system preference
  const getPreferred = () =>
    localStorage.getItem(STORAGE_KEY) ||
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

  const applyTheme = (theme) => {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  };

  applyTheme(getPreferred());

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }
})();

/* ────────────────────────────────────────────────────────────────
   4. STICKY NAVBAR + ACTIVE LINK TRACKING
──────────────────────────────────────────────────────────────── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const navLinks  = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section[id]');

  // Add 'scrolled' class when past 80 px
  const handleScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 80);

    // Highlight active nav link
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active',
        link.getAttribute('href') === `#${current}`);
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run on init
})();

/* ────────────────────────────────────────────────────────────────
   5. MOBILE HAMBURGER MENU
──────────────────────────────────────────────────────────────── */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;

  const toggle = (open) => {
    hamburger.classList.toggle('open', open);
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  };

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('open');
    toggle(!isOpen);
  });

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => toggle(false));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) toggle(false);
  });

  const navbar = document.getElementById('navbar');
})();

/* ────────────────────────────────────────────────────────────────
   6. TYPEWRITER EFFECT
──────────────────────────────────────────────────────────────── */
(function initTypewriter() {
  const el     = document.getElementById('typewriter');
  if (!el) return;

  const titles = [
    'Full Stack Developer',
    'Frontend Developer',
    'React JS Developer',
    'UI/UX Enthusiast',
    'Problem Solver',
  ];

  let titleIdx  = 0;
  let charIdx   = 0;
  let isDeleting = false;
  const TYPING_SPEED   = 100;
  const DELETING_SPEED = 55;
  const PAUSE_AFTER    = 2000;
  const PAUSE_BEFORE   = 400;

  const type = () => {
    const current = titles[titleIdx];
    if (isDeleting) {
      el.textContent = current.substring(0, --charIdx);
    } else {
      el.textContent = current.substring(0, ++charIdx);
    }

    let delay = isDeleting ? DELETING_SPEED : TYPING_SPEED;

    if (!isDeleting && charIdx === current.length) {
      delay = PAUSE_AFTER;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      titleIdx   = (titleIdx + 1) % titles.length;
      delay = PAUSE_BEFORE;
    }

    setTimeout(type, delay);
  };

  // Start after a short delay (hero loads first)
  setTimeout(type, 800);
})();

/* ────────────────────────────────────────────────────────────────
   7. INTERSECTION OBSERVER — AOS & SKILL BARS & COUNTERS
──────────────────────────────────────────────────────────────── */
(function initScrollAnimations() {
  /* ── 7a. Generic AOS (data-aos) elements ── */
  const aosEls = document.querySelectorAll('[data-aos]');

  const aosObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.aosDelay || 0;
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, parseInt(delay));
        aosObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  aosEls.forEach(el => aosObserver.observe(el));

  /* ── 7b. Skill progress bars ── */
  const skillBars = document.querySelectorAll('.skill-bar');

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const target = bar.dataset.width || '0';
        // Small delay for visual polish
        setTimeout(() => {
          bar.style.width = `${target}%`;
        }, 200);
        barObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.4 });

  skillBars.forEach(bar => barObserver.observe(bar));

  /* ── 7c. Counter animation ── */
  const counters = document.querySelectorAll('.stat-num');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(el => counterObserver.observe(el));
})();

/**
 * Animate a number element from 0 to its data-target value.
 * @param {HTMLElement} el
 */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target || '0', 10);
  const duration = 1600; // ms
  const step     = duration / target;
  let current    = 0;

  const tick = () => {
    current = Math.min(current + 1, target);
    el.textContent = current;
    if (current < target) setTimeout(tick, step);
  };

  setTimeout(tick, 400);
}

/* ────────────────────────────────────────────────────────────────
   8. PROJECT FILTER
──────────────────────────────────────────────────────────────── */
(function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active tab
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const category = card.dataset.category;
        const show     = filter === 'all' || category === filter;
        card.style.display = show ? '' : 'none';
      });
    });
  });
})();

/* ────────────────────────────────────────────────────────────────
   9. SCROLL-TO-TOP BUTTON
──────────────────────────────────────────────────────────────── */
(function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ────────────────────────────────────────────────────────────────
   10. SMOOTH SCROLL for hash links
──────────────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const navHeight = document.getElementById('navbar')?.offsetHeight || 68;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ────────────────────────────────────────────────────────────────
   11. CONTACT FORM — Validation + EmailJS submission
──────────────────────────────────────────────────────────────── */
(function initContactForm() {
  const form       = document.getElementById('contact-form');
  if (!form) return;

  const statusEl   = document.getElementById('form-status');
  const submitBtn  = document.getElementById('submit-btn');

  /* Read EmailJS config from HTML data attributes (fallback to constants) */
  const publicKey  = form.dataset.emailjsPublicKey  || EMAILJS_PUBLIC_KEY;
  const serviceId  = form.dataset.emailjsServiceId  || EMAILJS_SERVICE_ID;
  const templateId = form.dataset.emailjsTemplateId || EMAILJS_TEMPLATE_ID;

  /* Initialise EmailJS */
  if (typeof emailjs !== 'undefined') {
    emailjs.init(publicKey);
  } else {
    console.warn('EmailJS SDK not loaded. Form will not send emails until it is available.');
  }

  /* ── Validation helpers ── */
  const VALIDATORS = {
    name: {
      test: v => v.trim().length >= 2,
      msg:  'Please enter your full name (at least 2 characters).',
    },
    email: {
      test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      msg:  'Please enter a valid email address.',
    },
    phone: {
      test: v => !v.trim() || /^[+0-9\s\-()]{7,20}$/.test(v.trim()),
      msg:  'Please enter a valid phone number.',
    },
    subject: {
      test: v => v.trim().length >= 2,
      msg:  'Please enter a subject.',
    },
    message: {
      test: v => v.trim().length >= 20,
      msg:  'Your message should be at least 20 characters.',
    },
  };

  /**
   * Validate a single field, update its visual state, and return validity.
   * @param {HTMLInputElement|HTMLTextAreaElement} field
   * @returns {boolean}
   */
  const validateField = (field) => {
    const key     = field.name;
    const rule    = VALIDATORS[key];
    if (!rule) return true; // no rule → pass

    const wrap    = field.closest('.input-wrap');
    const errEl   = document.getElementById(`${key}-error`);
    const valid   = rule.test(field.value);

    if (wrap) {
      wrap.classList.toggle('error',   !valid);
      wrap.classList.toggle('success',  valid && field.value.trim() !== '');
    }
    if (errEl) errEl.textContent = valid ? '' : rule.msg;
    return valid;
  };

  /* Live validation on blur */
  Object.keys(VALIDATORS).forEach(key => {
    const field = form.querySelector(`[name="${key}"]`);
    if (field) {
      field.addEventListener('blur',  () => validateField(field));
      field.addEventListener('input', () => {
        if (field.closest('.input-wrap')?.classList.contains('error')) {
          validateField(field);
        }
      });
    }
  });

  /* ── Show status message ── */
  const showStatus = (type, msg) => {
    if (!statusEl) return;
    statusEl.className = `form-status ${type}`;
    statusEl.textContent = msg;
    // Scroll into view on mobile
    statusEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    // Auto-clear after 7 s
    setTimeout(() => {
      statusEl.className = 'form-status';
      statusEl.textContent = '';
    }, 7000);
  };

  /* ── Reset UI ── */
  const setLoading = (loading) => {
    if (!submitBtn) return;
    submitBtn.classList.toggle('loading', loading);
    submitBtn.disabled = loading;
  };

  /* ── Form submit ── */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    /* Honeypot check */
    const honeypot = form.querySelector('[name="_honeypot"]');
    if (honeypot && honeypot.value.trim() !== '') {
      // Bot detected — silently reset
      form.reset();
      return;
    }

    /* Validate all fields */
    const fields   = form.querySelectorAll('input[name], textarea[name]');
    let allValid   = true;
    fields.forEach(field => {
      if (field.name === '_honeypot') return;
      if (!validateField(field)) allValid = false;
    });
    if (!allValid) {
      showStatus('error', '⚠️ Please fix the highlighted errors before sending.');
      return;
    }

    /* Check EmailJS is available */
    if (typeof emailjs === 'undefined') {
      showStatus('error', '❌ Email service not available. Please contact me directly.');
      return;
    }

    /* ── Throttle: 1 submission per 60 s ── */
    const THROTTLE_KEY = 'form_last_sent';
    const lastSent     = parseInt(sessionStorage.getItem(THROTTLE_KEY) || '0', 10);
    const now          = Date.now();
    if (now - lastSent < 60_000) {
      const wait = Math.ceil((60_000 - (now - lastSent)) / 1000);
      showStatus('error', `⏳ Please wait ${wait}s before sending another message.`);
      return;
    }

    /* Build template params */
    const params = {
      from_name:    form.querySelector('[name="name"]')?.value.trim()    || '',
      from_email:   form.querySelector('[name="email"]')?.value.trim()   || '',
      from_phone:   form.querySelector('[name="phone"]')?.value.trim()   || 'Not provided',
      subject:      form.querySelector('[name="subject"]')?.value.trim() || '',
      message:      form.querySelector('[name="message"]')?.value.trim() || '',
      reply_to:     form.querySelector('[name="email"]')?.value.trim()   || '',
    };

    setLoading(true);

    try {
      await emailjs.send(serviceId, templateId, params);

      /* Success */
      sessionStorage.setItem(THROTTLE_KEY, String(Date.now()));
      showStatus('success', '✅ Your message was sent successfully! I\'ll get back to you within 24 hours.');
      form.reset();

      // Clear validation states
      form.querySelectorAll('.input-wrap').forEach(w => {
        w.classList.remove('error', 'success');
      });
      form.querySelectorAll('.field-error').forEach(e => {
        e.textContent = '';
      });

    } catch (err) {
      console.error('EmailJS error:', err);
      const code = err?.status || '';
      const msg  = code === 429
        ? '⏳ Too many requests. Please try again in a minute.'
        : '❌ Something went wrong. Please email me directly at naveenp6655@gmail.com';
      showStatus('error', msg);
    } finally {
      setLoading(false);
    }
  });
})();

/* ────────────────────────────────────────────────────────────────
   12. KEYBOARD ACCESSIBILITY — close mobile menu on Escape
──────────────────────────────────────────────────────────────── */
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (hamburger?.classList.contains('open')) {
    hamburger.classList.remove('open');
    navLinks?.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.focus();
  }
});

/* ────────────────────────────────────────────────────────────────
   13. PERFORMANCE — lazy-load all [data-src] images
   (Fallback for browsers without native lazy loading)
──────────────────────────────────────────────────────────────── */
(function initLazyImages() {
  if ('loading' in HTMLImageElement.prototype) return; // native support

  const imgs = document.querySelectorAll('img[loading="lazy"]');
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) img.src = img.dataset.src;
        imgObserver.unobserve(img);
      }
    });
  });

  imgs.forEach(img => imgObserver.observe(img));
})();

/* ────────────────────────────────────────────────────────────────
   14. HERO PROJECT CARD HOVER — subtle parallax tilt
──────────────────────────────────────────────────────────────── */
(function initTilt() {
  const cards = document.querySelectorAll('.project-card, .skill-card');
  const MAX   = 6; // degrees

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const x     = (e.clientX - rect.left) / rect.width  - 0.5;
      const y     = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * MAX}deg) rotateX(${-y * MAX}deg) translateY(-3px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

console.log(
  '%c💻 Portfolio by Naveen P',
  'color:#a78bfa;font-weight:700;font-size:14px;',
  '\n— Built with HTML · CSS · JavaScript'
);
