(function () {
  // Dark mode only - clean and focused design

  // Preloader: animate to 90% while loading, finish to 100% on window load
  (function setupPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    const bar = document.getElementById('preloaderBar');
    const label = document.getElementById('preloaderPercent');
    const barContainer = document.querySelector('.preloader__bar');
    let progress = 0;
    let targetWhileLoading = 90; // cap before full load
    let rafId = 0;
    let running = true;

    const setProgress = (p) => {
      progress = Math.max(0, Math.min(100, p));
      if (bar) bar.style.width = progress + '%';
      if (label) label.textContent = Math.round(progress) + '%';
      if (barContainer) barContainer.setAttribute('aria-valuenow', String(Math.round(progress)));
    };

    // ease out update towards target
    const tick = () => {
      if (!running) return;
      const delta = (targetWhileLoading - progress) * 0.08; // easing
      if (Math.abs(delta) > 0.05) setProgress(progress + delta);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    // Safety: if load takes too long, still advance slowly
    const safety = setInterval(() => {
      if (progress < targetWhileLoading - 1) setProgress(progress + 1);
    }, 400);

    function finish() {
      targetWhileLoading = 100;
      // Smoothly animate to 100 then hide
      const completeInterval = setInterval(() => {
        if (progress >= 99.5) {
          setProgress(100);
          clearInterval(completeInterval);
          running = false;
          cancelAnimationFrame(rafId);
          clearInterval(safety);
          preloader.classList.add('is-done');
          // remove from DOM after transition
          setTimeout(() => preloader.remove(), 550);
        } else {
          setProgress(progress + Math.max(0.6, (100 - progress) * 0.12));
        }
      }, 30);
    }

    // Finish on window load
    window.addEventListener('load', finish, { once: true });

    // Fallback: hard-finish after 12s
    setTimeout(finish, 12000);
  })();

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile menu functionality
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      
      if (isHidden) {
        mobileMenu.classList.remove('hidden');
        mobileMenuToggle.classList.add('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        // Change icon to X
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-times text-base';
      } else {
        mobileMenu.classList.add('hidden');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        // Change icon back to hamburger
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars text-base';
      }
    });

    // Close mobile menu when clicking on nav links
    const navLinks = mobileMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        // Change icon back to hamburger
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars text-base';
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add('hidden');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        // Change icon back to hamburger
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars text-base';
      }
    });

    // Close mobile menu on window resize if desktop size
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        mobileMenu.classList.add('hidden');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        // Change icon back to hamburger
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars text-base';
      }
    });
  }

  // Smooth scroll with header offset for internal anchor links
  (function setupSmoothScroll() {
    const header = document.querySelector('header');
    const getHeaderOffset = () => (header?.offsetHeight || 84) + 0; // adjust if needed
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href === '#' || href.length < 2) return; // allow default
        const target = document.querySelector(href);
        if (!target) return; // allow default if not found

        e.preventDefault();
        const offset = getHeaderOffset();
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  })();

  // Typed.js-like animation
  function createTypedAnimation(element, options = {}) {
    if (!element) return;
    
    const defaults = {
      strings: ["Text to type"],
      typeSpeed: 60,
      backSpeed: 40,
      backDelay: 2000,
      startDelay: 500,
      loop: true,
      showCursor: true,
      smartBackspace: true
    };
    
    const config = { ...defaults, ...options };
    let currentStringIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let isWaiting = false;
    
    function type() {
      if (isWaiting) return;
      
      const currentString = config.strings[currentStringIndex];
      
      if (!isDeleting) {
        // Typing
        element.textContent = currentString.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        
        if (currentCharIndex === currentString.length) {
          // Finished typing current string
          isWaiting = true;
          setTimeout(() => {
            isWaiting = false;
            isDeleting = true;
          }, config.backDelay);
        }
      } else {
        // Deleting
        if (config.smartBackspace && currentStringIndex > 0) {
          // Smart backspace: only delete until common part
          const prevString = config.strings[currentStringIndex - 1] || '';
          let commonLength = 0;
          for (let i = 0; i < Math.min(currentString.length, prevString.length); i++) {
            if (currentString[i] === prevString[i]) {
              commonLength = i + 1;
            } else {
              break;
            }
          }
          
          if (currentCharIndex > commonLength) {
            element.textContent = currentString.substring(0, currentCharIndex - 1);
            currentCharIndex--;
          } else {
            isDeleting = false;
            currentStringIndex = (currentStringIndex + 1) % config.strings.length;
            currentCharIndex = commonLength;
          }
        } else {
          // Regular backspace
          element.textContent = currentString.substring(0, currentCharIndex - 1);
          currentCharIndex--;
          
          if (currentCharIndex === 0) {
            isDeleting = false;
            currentStringIndex = (currentStringIndex + 1) % config.strings.length;
          }
        }
      }
      
      // Set cursor visibility
      if (config.showCursor) {
        element.classList.add('typing-cursor');
      } else {
        element.classList.remove('typing-cursor');
      }
      
      // Continue animation
      const speed = isDeleting ? config.backSpeed : config.typeSpeed;
      setTimeout(type, speed);
    }
    
    // Start animation
    setTimeout(type, config.startDelay);
  }

  // Initialize typing animations
  const titleEl = document.getElementById('hero-title');
  const subtitleEl = document.getElementById('hero-subtitle');
  const descEl = document.querySelector('.hero__desc');
  
  if (titleEl && subtitleEl) {
    // Type title once
    createTypedAnimation(titleEl, {
      strings: ["Rifqi Ardian"],
      typeSpeed: 120,
      loop: false,
      showCursor: false,
      startDelay: 800
    });
    
    // Type subtitle with single string, loop with pause before repeating
    setTimeout(() => {
      subtitleEl.style.opacity = '1';
      createTypedAnimation(subtitleEl, {
        strings: [
          "Junior Fullstack Developer"
        ],
        typeSpeed: 60,
        backSpeed: 40,
        backDelay: 1500,
        startDelay: 500,
        loop: true,
        showCursor: true,
        smartBackspace: false
      });
    }, 2000);

    // Description typing animation: loop with short pause
    if (descEl) {
      const originalDesc = descEl.textContent?.trim() || '';
      // Start a bit after subtitle begins
      setTimeout(() => {
        createTypedAnimation(descEl, {
          strings: [originalDesc],
          typeSpeed: 24,
          backSpeed: 18,
          backDelay: 1800,
          startDelay: 500,
          loop: true,
          showCursor: false,
          smartBackspace: false
        });
      }, 2500);
    }
  }

  // WhatsApp Contact Form Submission
  const form = document.getElementById('contactForm');
  if (form) {
    // Change this to your WhatsApp number in 62 format (no leading 0)
    const WHATSAPP_NUMBER = '6285182911840';
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = (fd.get('name') || '').toString().trim();
      const email = (fd.get('email') || '').toString().trim();
      const message = (fd.get('message') || '').toString().trim();

      if (!name || !email || !message) {
        alert('Mohon lengkapi nama, email, dan pesan.');
        return;
      }

      const text = `Halo Rifqi, saya ${name}.%0AEmail: ${encodeURIComponent(email)}%0A%0APesan:%0A${encodeURIComponent(message)}`;
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
      window.open(url, '_blank');
    });
  }



  function setupRow(rowEl, icons, direction = 'left', baseSpeed = 60) {
    if (!rowEl) return;
    rowEl.innerHTML = '';

    // Build one sequence
    function buildSequence() {
      const seq = document.createElement('div');
      seq.className = 'marquee__seq';
      for (const src of icons) {
        const chip = document.createElement('span');
        chip.className = 'chip';
        const img = document.createElement('img');
        img.src = src;
        img.alt = '';
        img.setAttribute('aria-hidden', 'true');
        chip.appendChild(img);
        seq.appendChild(chip);
      }
      return seq;
    }

    // Duplicate sequence to enable seamless loop
    const seqA = buildSequence();
    const seqB = buildSequence();
    rowEl.appendChild(seqA);
    rowEl.appendChild(seqB);

    let x = 0;
    let last = performance.now();
    let running = true;
    let speed = baseSpeed;

    const container = rowEl.parentElement; // .marquee__row

    function imagesReady(el) {
      const imgs = Array.from(el.querySelectorAll('img'));
      if (imgs.length === 0) return Promise.resolve();
      return Promise.all(
        imgs.map(img => img.complete ? Promise.resolve() : new Promise(res => {
          img.addEventListener('load', () => res(), { once: true });
          img.addEventListener('error', () => res(), { once: true });
        }))
      );
    }

    function start() {
      let contentWidth = seqA.scrollWidth; // one sequence width after images load
      if (!contentWidth) {
        // Fallback retry if widths not ready yet
        setTimeout(start, 50);
        return;
      }

      function tick(now) {
        if (!running || speed === 0) { requestAnimationFrame(tick); return; }
        const dt = Math.min(0.033, (now - last) / 1000);
        last = now;

        const dir = direction === 'left' ? -1 : 1;
        x += dir * speed * dt;

        // wrap around using single sequence width
        if (direction === 'left' && x <= -contentWidth) x += contentWidth;
        if (direction === 'right' && x >= contentWidth) x -= contentWidth;

        rowEl.style.transform = `translate3d(${Math.round(x)}px,0,0)`;
        requestAnimationFrame(tick);
      }

      requestAnimationFrame((t) => { last = t; tick(t); });
    }

    imagesReady(rowEl).then(start);

    // Pause on hover
    container?.addEventListener('mouseenter', () => { running = false; });
    container?.addEventListener('mouseleave', () => { running = true; last = performance.now(); });

    // Respect reduced motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    function handleMotion(e) { speed = e.matches ? 0 : baseSpeed; }
    handleMotion(mq);
    mq.addEventListener?.('change', handleMotion);
  }

  const row1 = document.getElementById('row1');
  const row2 = document.getElementById('row2');
  if (row1 && row2) {
    // Split icons between rows (or use same set for both)
    const half = Math.ceil(ICONS.length / 2);
    const first = ICONS.slice(0, half);
    const second = ICONS.slice(half).concat(ICONS.slice(0, Math.max(0, half - (ICONS.length - half))));

    setupRow(row1, first.length ? first : ICONS, 'left', 70);
    setupRow(row2, second.length ? second : ICONS, 'right', 70);
  }

  // Reveal on scroll (fallback if AOS not present)
  function setupReveal() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = document.querySelectorAll('.section, .card, .hero__wrap, .contact-card, .skill-item, .about-card');
    targets.forEach(el => el.classList.add('reveal'));

    if (prefersReduced) {
      targets.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.2 });

    targets.forEach(el => io.observe(el));
  }

  // Initialize AOS if available; otherwise use custom reveal
  function initAOS() {
    if (!window.AOS) return false;

    // Assign AOS attributes programmatically to existing elements in index.html
    const map = [
      ['#home .max-w-6xl > div', 'fade-up'], // hero columns
      ['section[aria-labelledby] .text-center', 'fade-up'], // section headers
      ['#projectsGrid > article', 'fade-up'], // project cards
      ['#skills .glass-dark.rounded-xl', 'zoom-in'], // skill icon chips
      ['.about-card', 'fade-up'], // about card wrapper
      ['#contact .glass-dark.rounded-2xl', 'fade-up'] // contact cards
    ];
    for (const [sel, anim] of map) {
      const nodes = document.querySelectorAll(sel);
      nodes.forEach((el, idx) => {
        el.setAttribute('data-aos', anim);
        el.setAttribute('data-aos-delay', String(Math.min(240, idx * 60)));
        el.setAttribute('data-aos-once', 'true');
      });
    }

    window.AOS.init({
      once: true,
      duration: 700,
      easing: 'ease-out-cubic',
      offset: 80,
      mirror: false,
      anchorPlacement: 'top-bottom'
    });
    return true;
  }

  function initRevealOrAOS() {
    const usedAOS = initAOS();
    if (!usedAOS) setupReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initRevealOrAOS();
      setupProjectsToggle();
    });
  } else {
    initRevealOrAOS();
    setupProjectsToggle();
  }

  // Projects: show more/less toggle
  function setupProjectsToggle() {
    const grid = document.getElementById('projectsGrid');
    const btn = document.getElementById('toggleProjectsBtn');
    if (!grid || !btn) return;

    const cards = grid.querySelectorAll('article');
    const wrapper = btn.parentElement;
    if (cards.length <= 3) {
      // Hide toggle if not needed
      wrapper && (wrapper.style.display = 'none');
      return;
    }

    // Ensure the toggle button has a stable structure: icon + label span
    btn.innerHTML = '<i class="fas fa-eye mr-2" aria-hidden="true"></i><span class="label">Lihat Semua</span>';
    const labelEl = btn.querySelector('.label');
    const iconEl = btn.querySelector('i');

    // Show only first 3 cards initially
    cards.forEach((card, index) => {
      if (index >= 3) {
        card.style.display = 'none';
      }
    });

    let isExpanded = false;
    btn.addEventListener('click', () => {
      isExpanded = !isExpanded;
      
      cards.forEach((card, index) => {
        if (index >= 3) {
          card.style.display = isExpanded ? 'block' : 'none';
        }
      });
      
      if (iconEl) iconEl.className = isExpanded ? 'fas fa-eye-slash mr-2' : 'fas fa-eye mr-2';
      if (labelEl) labelEl.textContent = isExpanded ? 'Tutup' : 'Lihat Semua';
      
      // Refresh AOS when expanding
      if (isExpanded && window.AOS?.refresh) {
        setTimeout(() => window.AOS.refresh(), 50);
      }
    });
  }
})();
