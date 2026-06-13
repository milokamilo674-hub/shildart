/* ============================================================
   ShildArt — Main JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Nav scroll effect ─────────────────────────────────── */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile menu ───────────────────────────────────────── */
  const menuBtn   = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;

  menuBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    mobileMenu.setAttribute('aria-hidden', String(!menuOpen));
    menuBtn.setAttribute('aria-label', menuOpen ? 'Cerrar menú' : 'Abrir menú');
    // Animate hamburger → X
    const spans = menuBtn.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.cssText = 'transform: translateY(6px) rotate(45deg)';
      spans[1].style.cssText = 'opacity: 0';
      spans[2].style.cssText = 'transform: translateY(-6px) rotate(-45deg)';
    } else {
      spans.forEach(s => s.style.cssText = '');
    }
  });

  // Close mobile menu when a link is clicked
  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      menuBtn.setAttribute('aria-label', 'Abrir menú');
      menuBtn.querySelectorAll('span').forEach(s => s.style.cssText = '');
    });
  });

  /* ── Product filter ────────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards       = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });

  /* ── Scroll reveal ─────────────────────────────────────── */
  // Add data-reveal to elements we want to animate
  const revealTargets = [
    '.stat',
    '.product-card',
    '.process__step',
    '.testimonial',
    '.contact__text',
    '.contact__form',
    '.section-header',
  ];

  revealTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.setAttribute('data-reveal', '');
      // Stagger siblings
      const delay = Math.min(i % 4, 3);
      if (delay > 0) el.setAttribute('data-reveal-delay', String(delay));
    });
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

  /* ── Contact form ──────────────────────────────────────── */
  const form     = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Clear previous errors
      form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
      formNote.className = 'form-note';
      formNote.textContent = '';

      const name    = form.name.value.trim();
      const email   = form.email.value.trim();
      const message = form.message.value.trim();
      let valid = true;

      if (!name) {
        form.name.classList.add('error');
        valid = false;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        form.email.classList.add('error');
        valid = false;
      }
      if (!message) {
        form.message.classList.add('error');
        valid = false;
      }

      if (!valid) {
        formNote.className = 'form-note error';
        formNote.textContent = 'Por favor completá todos los campos correctamente.';
        return;
      }

      // ── Simulate form submission ─────────────────────────
      // Replace this block with your real form submission logic.
      // Options: Formspree, EmailJS, Netlify Forms, your own API, etc.
      // ─────────────────────────────────────────────────────
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando…';

      try {
        // Example with Formspree (uncomment and add your endpoint):
        // const res = await fetch('https://formspree.io/f/YOUR_ID', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ name, email, message }),
        // });
        // if (!res.ok) throw new Error('Error');

        // DEMO: simulate 800ms delay
        await new Promise(r => setTimeout(r, 800));

        form.reset();
        formNote.className = 'form-note success';
        formNote.textContent = '¡Mensaje enviado! Te respondemos a la brevedad.';
      } catch {
        formNote.className = 'form-note error';
        formNote.textContent = 'Hubo un error. Por favor intentá de nuevo.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar mensaje';
      }
    });
  }

  /* ── Smooth active nav link on scroll ─────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a');

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(a => a.classList.remove('active'));
          const active = document.querySelector(`.nav__links a[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(s => navObserver.observe(s));

});
