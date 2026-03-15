/* ============================================================
   ELESH VAISHNAV — PORTFOLIO SCRIPT
   Matrix Rain · Typing · Cursor · Scroll Reveal · Counter
   ============================================================ */

// ── MATRIX RAIN ──────────────────────────────────────────────
(function initMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas.getContext('2d');

  let W, H, cols, drops;
  const FONT_SIZE = 14;
  const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF<>{}[]|/\\'.split('');

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cols = Math.floor(W / FONT_SIZE);
    drops = Array(cols).fill(1);
  }
  resize();
  window.addEventListener('resize', resize);

  function drawMatrix() {
    ctx.fillStyle = 'rgba(2, 12, 6, 0.05)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#00ff88';
    ctx.font = FONT_SIZE + 'px Share Tech Mono';

    drops.forEach((y, i) => {
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];
      const x = i * FONT_SIZE;

      // Brightest character at the head
      ctx.fillStyle = '#afffcf';
      ctx.fillText(char, x, y * FONT_SIZE);

      // Rest of the trail
      ctx.fillStyle = '#00ff88';
      ctx.fillText(char, x, (y - 1) * FONT_SIZE);

      if (y * FONT_SIZE > H && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }
  setInterval(drawMatrix, 50);
})();


// ── CUSTOM CURSOR ─────────────────────────────────────────────
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail = document.getElementById('cursor-trail');
  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    trail.style.left = trailX + 'px';
    trail.style.top = trailY + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Scale cursor on hoverable elements
  const hoverEls = document.querySelectorAll('a, button, .project-card, .skill-tag, .stat-box');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      trail.style.width = '48px';
      trail.style.height = '48px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '12px';
      cursor.style.height = '12px';
      trail.style.width = '32px';
      trail.style.height = '32px';
    });
  });
})();


// ── NAVBAR SCROLL ─────────────────────────────────────────────
(function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
})();


// ── TYPING ANIMATION ──────────────────────────────────────────
(function initTyping() {
  const target = document.getElementById('typing-target');
  const phrases = [
    'AI Developer & ML Engineer',
    'Computer Vision Builder',
    'Generative AI Explorer',
    'Interactive UI Crafter',
    'Python & React Dev',
    'Vibe Coder 🚀'
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let pauseTimer = null;

  function type() {
    const phrase = phrases[phraseIdx];

    if (isDeleting) {
      charIdx--;
      target.textContent = phrase.slice(0, charIdx);
    } else {
      charIdx++;
      target.textContent = phrase.slice(0, charIdx);
    }

    let delay = isDeleting ? 55 : 95;

    if (!isDeleting && charIdx === phrase.length) {
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 400;
    }

    pauseTimer = setTimeout(type, delay);
  }

  // Start after hero animation plays
  setTimeout(type, 1400);
})();


// ── SCROLL REVEAL ─────────────────────────────────────────────
(function initReveal() {
  const els = document.querySelectorAll(
    '.about-grid, .about-text p, .stat-box, .about-card, ' +
    '.skill-category, .skill-tags, .project-card, ' +
    '.contact-left, .contact-form, footer'
  );
  els.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children a bit
        entry.target.style.transitionDelay = (i * 0.05) + 's';
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
})();


// ── COUNTER ANIMATION ─────────────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  let started = false;

  function runCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target, 10);
      const duration = 1800;
      const step = target / (duration / 16);
      let current = 0;

      const interval = setInterval(() => {
        current = Math.min(current + step, target);
        counter.textContent = Math.floor(current);
        if (current >= target) clearInterval(interval);
      }, 16);
    });
  }

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      runCounters();
    }
  }, { threshold: 0.5 });

  const statsEl = document.querySelector('.about-stats');
  if (statsEl) observer.observe(statsEl);
})();


// ── SKILL BAR ANIMATION ───────────────────────────────────────
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const w = el.dataset.width + '%';
        setTimeout(() => { el.style.width = w; }, 200);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(f => observer.observe(f));
})();


// ── CONTACT FORM ──────────────────────────────────────────────
(function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit span');
    const original = btn.textContent;

    btn.textContent = 'SENDING...';
    setTimeout(() => {
      btn.textContent = '✓ MESSAGE_SENT()';
      form.reset();
      setTimeout(() => { btn.textContent = original; }, 3000);
    }, 1200);
  });
})();


// ── NAV SMOOTH SCROLL + ACTIVE STATE ──────────────────────────
(function initNavScroll() {
  const links = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 200) current = s.id;
    });
    links.forEach(l => {
      l.style.color = l.getAttribute('href') === '#' + current
        ? 'var(--green)' : '';
    });
  });
})();


// ── GLITCH ON RANDOM INTERVALS ────────────────────────────────
(function initRandomGlitch() {
  const glitchEls = document.querySelectorAll('.glitch');
  setInterval(() => {
    const el = glitchEls[Math.floor(Math.random() * glitchEls.length)];
    el.style.textShadow = '2px 0 #ff003c, -2px 0 #00e5ff';
    setTimeout(() => { el.style.textShadow = ''; }, 120);
  }, 2500);
})();


// ── SKILL TAG RIPPLE ──────────────────────────────────────────
(function initTagRipple() {
  document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute; border-radius:50%;
        background:rgba(0,255,136,0.3);
        width:100px; height:100px;
        left:${e.offsetX - 50}px; top:${e.offsetY - 50}px;
        transform:scale(0); pointer-events:none;
        animation:ripple-anim 0.5s ease-out forwards;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });

  // Inject ripple keyframe
  const style = document.createElement('style');
  style.textContent = '@keyframes ripple-anim { to { transform:scale(3); opacity:0; } }';
  document.head.appendChild(style);
})();
