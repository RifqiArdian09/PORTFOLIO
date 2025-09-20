(function () {
  // Modal helper for alert messages
  function createModalController() {
    const modal = document.getElementById('alertModal');
    if (!modal) return { open: () => {}, close: () => {} };
    const okBtn = document.getElementById('alertOkBtn');
    const overlay = modal.querySelector('[data-modal-close]');

    function open() {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
    // AOS init moved out of modal controller
    function close() {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
    okBtn?.addEventListener('click', close);
    overlay?.addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('hidden') && e.key === 'Escape') close();
    });

    return { open, close };
  }
  const AlertModal = createModalController();


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
  const descEl = document.querySelector('.hero-desc');
  
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
        // Show themed modal instead of native alert
        AlertModal.open();
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
  // Use a safe fallback to prevent errors if ICONS is not present
  const ICONS_SAFE = Array.isArray(window.ICONS) ? window.ICONS : [];
  if (row1 && row2) {
    // Split icons between rows (or use same set for both)
    const half = Math.ceil(ICONS_SAFE.length / 2);
    const first = ICONS_SAFE.slice(0, half);
    const second = ICONS_SAFE.slice(half).concat(ICONS_SAFE.slice(0, Math.max(0, half - (ICONS_SAFE.length - half))));

    setupRow(row1, first.length ? first : ICONS_SAFE, 'left', 70);
    setupRow(row2, second.length ? second : ICONS_SAFE, 'right', 70);
  }

  // Bootstrap essential behaviors only (AOS removed)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupProjectsToggle();
    });
  } else {
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
      
      // AOS removed: no refresh needed
    });
  }
})();
