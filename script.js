// Portfolio Scripts - Rifqi Ardian
// - Theme toggle (dark/light) with smooth transitions and persistence
// - Skills ping-pong marquee animation
// - Footer year

(function () {
  const html = document.documentElement;
  const toggleBtn = document.getElementById('themeToggle');
  const icon = toggleBtn?.querySelector('.toggle__icon');

  // Initialize theme: localStorage > prefers-color-scheme > default (dark)
  const stored = localStorage.getItem('theme');
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

  function applyTheme(mode) {
    if (mode === 'light') {
      html.setAttribute('data-theme', 'light');
    } else {
      html.removeAttribute('data-theme');
    }
  }

  const initial = stored || (prefersLight ? 'light' : 'dark');
  applyTheme(initial);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch {}
    });
  }

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile menu functionality
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      const isActive = navMenu.classList.contains('active');
      
      if (isActive) {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      } else {
        navMenu.classList.add('active');
        mobileMenuToggle.classList.add('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
      }
    });

    // Close mobile menu when clicking on nav links
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenuToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close mobile menu on window resize if desktop size
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

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
  
  if (titleEl && subtitleEl) {
    // Type title once
    createTypedAnimation(titleEl, {
      strings: ["Rifqi Ardian"],
      typeSpeed: 120,
      loop: false,
      showCursor: false,
      startDelay: 800
    });
    
    // Type subtitle with multiple strings
    setTimeout(() => {
      subtitleEl.style.opacity = '1';
      createTypedAnimation(subtitleEl, {
        strings: [
          "Junior Fullstack Dev",
          "Building modern web apps",
          "Creating beautiful UX/UI",
          "Passionate about clean code",
          "Always learning new tech"
        ],
        typeSpeed: 60,
        backSpeed: 40,
        backDelay: 2000,
        startDelay: 500,
        loop: true,
        showCursor: true,
        smartBackspace: true
      });
    }, 2000);
  }

  // WhatsApp Contact Form Submission
  const form = document.getElementById('contactForm');
  if (form) {
    // Change this to your WhatsApp number in 62 format (no leading 0)
    const WHATSAPP_NUMBER = '62895412630703';
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

  // Skills marquee continuous (two rows, icons only)
  const ICONS = [
    'assets/icons/mysql.svg',
    'assets/icons/php.svg',
    'assets/icons/postman.svg',
    'assets/icons/python.svg',
    'assets/icons/tailwind.svg',
    'assets/icons/vscode.svg',
  ];

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
})();
