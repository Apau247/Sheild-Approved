/* ============================================
   Iron Vault Security — Theme Scripts
   ============================================ */

(function () {
  'use strict';

  /* ---------- Mobile Menu ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const menuClose = document.getElementById('menuClose');
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => mobileMenu.classList.add('active'));
  }
  if (menuClose && mobileMenu) {
    menuClose.addEventListener('click', () => mobileMenu.classList.remove('active'));
  }

  /* ---------- Search Overlay ---------- */
  const searchToggle = document.querySelector('.search-toggle');
  const searchClose = document.getElementById('searchClose');
  const searchOverlay = document.getElementById('searchOverlay');

  if (searchToggle && searchOverlay) {
    searchToggle.addEventListener('click', () => searchOverlay.classList.add('active'));
  }
  if (searchClose && searchOverlay) {
    searchClose.addEventListener('click', () => searchOverlay.classList.remove('active'));
  }

  /* ---------- Hero Slider ---------- */
  const heroSlider = document.getElementById('heroSlider');
  const heroDots = document.querySelectorAll('.slider-dot');
  let currentSlide = 0;
  const slideCount = 4;
  let heroInterval;

  function goToSlide(index) {
    const slides = heroSlider.querySelectorAll('.slide');
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    heroDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentSlide = index;
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % slideCount);
  }

  heroDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.slide, 10);
      goToSlide(idx);
      clearInterval(heroInterval);
      heroInterval = setInterval(nextSlide, 6000);
    });
  });

  heroInterval = setInterval(nextSlide, 6000);

  /* ---------- Pricing Slider ---------- */
  const pricingSlider = document.getElementById('pricingSlider');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  let pricingIndex = 0;
  const pricingCards = pricingSlider ? pricingSlider.children.length : 0;
  const cardsVisible = window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
  const maxPricingIndex = Math.max(0, pricingCards - cardsVisible);

  function updatePricingSlider() {
    if (!pricingSlider) return;
    const cardWidth = pricingSlider.children[0]?.getBoundingClientRect().width + 30 || 0;
    pricingSlider.style.transform = `translateX(-${pricingIndex * cardWidth}px)`;
  }

  if (prevBtn && nextBtn && pricingSlider) {
    prevBtn.addEventListener('click', () => {
      pricingIndex = Math.max(0, pricingIndex - 1);
      updatePricingSlider();
    });
    nextBtn.addEventListener('click', () => {
      pricingIndex = Math.min(maxPricingIndex, pricingIndex + 1);
      updatePricingSlider();
    });
    window.addEventListener('resize', updatePricingSlider);
  }

  /* ---------- Testimonials Slider ---------- */
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const testimonialDots = document.querySelectorAll('.testimonial-dot');
  let currentTestimonial = 0;

  function goToTestimonial(index) {
    testimonialSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    testimonialDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentTestimonial = index;
  }

  testimonialDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.slide, 10);
      goToTestimonial(idx);
    });
  });

  setInterval(() => {
    goToTestimonial((currentTestimonial + 1) % testimonialSlides.length);
  }, 7000);

  /* ---------- Stats Counter ---------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  const statsSection = document.querySelector('.stats-section');
  let counted = false;

  function easeOutQuad(t) {
    return t * (2 - t);
  }

  function animateCounter(el, target, duration) {
    const start = performance.now();
    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuad(progress);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        statNumbers.forEach((el) => {
          const target = parseInt(el.dataset.target, 10);
          animateCounter(el, target, 2000);
        });
      }
    });
  }, { threshold: 0.4 });

  if (statsSection) statsObserver.observe(statsSection);

  /* ---------- Cargo Tracking ---------- */
  const trackBtn = document.getElementById('trackBtn');
  const trackInput = document.getElementById('trackInput');
  const trackingResult = document.getElementById('trackingResult');

  const demoShipments = {
    'IVS-78432': {
      status: 'In Transit',
      statusClass: 'status-in-transit',
      origin: 'London, UK',
      destination: 'Zurich, Switzerland',
      eta: '18 Jun 2025',
      progress: 65,
      contents: 'Gold bullion — 12 kg',
      current: 'Paris, France',
      courier: 'Iron Vault Secure Transport'
    },
    'IVS-99102': {
      status: 'Delivered',
      statusClass: 'status-delivered',
      origin: 'London, UK',
      destination: 'Aarhus, Denmark',
      eta: 'Delivered 12 Jun 2025',
      progress: 100,
      contents: 'Diamond collection — 45 pcs',
      current: 'Aarhus, Denmark',
      courier: 'Iron Vault Secure Transport'
    },
    'IVS-22011': {
      status: 'Processing',
      statusClass: 'status-processing',
      origin: 'New York, USA',
      destination: 'London, UK',
      eta: '22 Jun 2025',
      progress: 15,
      contents: 'Fine jewelry — 8 pcs',
      current: 'New York, USA',
      courier: 'Iron Vault Secure Transport'
    },
    'IVS-55678': {
      status: 'In Transit',
      statusClass: 'status-in-transit',
      origin: 'London, UK',
      destination: 'Singapore',
      eta: '25 Jun 2025',
      progress: 40,
      contents: 'Precious metals — 25 kg',
      current: 'Dubai, UAE',
      courier: 'Iron Vault Secure Transport'
    },
    'IVS-11223': {
      status: 'Exception',
      statusClass: 'status-exception',
      origin: 'London, UK',
      destination: 'Hong Kong',
      eta: 'Delayed — awaiting customs clearance',
      progress: 55,
      contents: 'Rare gemstones — 3 pcs',
      current: 'Frankfurt, Germany',
      courier: 'Iron Vault Secure Transport'
    }
  };

  function renderTrackingResult(id, data) {
    trackingResult.innerHTML = `
      <h4>Shipment <span style="color:var(--color-accent-gold)">${id}</span></h4>
      <div class="tracking-meta">
        <div class="tracking-meta-item">
          <span class="label">Status</span>
          <span class="value"><span class="status-badge ${data.statusClass}">${data.status}</span></span>
        </div>
        <div class="tracking-meta-item">
          <span class="label">Origin</span>
          <span class="value">${data.origin}</span>
        </div>
        <div class="tracking-meta-item">
          <span class="label">Destination</span>
          <span class="value">${data.destination}</span>
        </div>
        <div class="tracking-meta-item">
          <span class="label">ETA / Delivered</span>
          <span class="value">${data.eta}</span>
        </div>
        <div class="tracking-meta-item">
          <span class="label">Current Location</span>
          <span class="value">${data.current}</span>
        </div>
        <div class="tracking-meta-item">
          <span class="label">Contents</span>
          <span class="value">${data.contents}</span>
        </div>
      </div>
      <div class="tracking-progress">
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width: ${data.progress}%"></div>
        </div>
        <div class="tracking-progress-labels">
          <span>Collected</span>
          <span>In Transit</span>
          <span>Delivered</span>
        </div>
      </div>
    `;
    trackingResult.classList.add('active');
  }

  if (trackBtn && trackInput && trackingResult) {
    trackBtn.addEventListener('click', () => {
      const id = trackInput.value.trim().toUpperCase();
      if (!id) return;
      if (demoShipments[id]) {
        renderTrackingResult(id, demoShipments[id]);
      } else {
        trackingResult.innerHTML = `<p style="color:#c83232;font-weight:700;">Tracking ID not found. Please check the ID and try again.</p>`;
        trackingResult.classList.add('active');
      }
    });

    trackInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') trackBtn.click();
    });
  }

  /* ---------- Scroll Reveal ---------- */
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ---------- Sticky Header ---------- */
  const mainNav = document.getElementById('mainNav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (mainNav) {
      if (currentScroll > 120) {
        mainNav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)';
      } else {
        mainNav.style.boxShadow = 'none';
      }
    }
    lastScroll = currentScroll;
  });
})();

