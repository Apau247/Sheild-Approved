(function () {
  'use strict';

  const defaultData = {
    stats: {
      assetsSecured: 2500,
      vaultsInOperation: 1200,
      deliveriesCompleted: 300
    },
    shipments: [
      {
        trackingId: 'IVS-78432',
        status: 'In Transit',
        origin: 'London, UK',
        destination: 'Zurich, Switzerland',
        eta: '18 Jun 2026',
        progress: 65,
        contents: 'Gold bullion - 12 kg',
        current: 'Paris, France',
        courier: 'Iron Vault Secure Transport'
      },
      {
        trackingId: 'IVS-99102',
        status: 'Delivered',
        origin: 'London, UK',
        destination: 'Aarhus, Denmark',
        eta: 'Delivered 12 Jun 2026',
        progress: 100,
        contents: 'Diamond collection - 45 pcs',
        current: 'Aarhus, Denmark',
        courier: 'Iron Vault Secure Transport'
      },
      {
        trackingId: 'IVS-22011',
        status: 'Processing',
        origin: 'New York, USA',
        destination: 'London, UK',
        eta: '22 Jun 2026',
        progress: 15,
        contents: 'Fine jewelry - 8 pcs',
        current: 'New York, USA',
        courier: 'Iron Vault Secure Transport'
      },
      {
        trackingId: 'IVS-55678',
        status: 'In Transit',
        origin: 'London, UK',
        destination: 'Singapore',
        eta: '25 Jun 2026',
        progress: 40,
        contents: 'Precious metals - 25 kg',
        current: 'Dubai, UAE',
        courier: 'Iron Vault Secure Transport'
      },
      {
        trackingId: 'IVS-11223',
        status: 'Exception',
        origin: 'London, UK',
        destination: 'Hong Kong',
        eta: 'Delayed - awaiting customs clearance',
        progress: 55,
        contents: 'Rare gemstones - 3 pcs',
        current: 'Frankfurt, Germany',
        courier: 'Iron Vault Secure Transport'
      }
    ],
    assets: [
      {
        owner: 'Kenneth Johnson',
        assetName: 'Investment Gold Reserve',
        assetType: 'Bullion',
        quantity: '12 kg',
        vault: 'Vault A-12',
        status: 'Stored'
      },
      {
        owner: 'Benson Elio',
        assetName: 'Zurich Diamond Collection',
        assetType: 'Diamonds',
        quantity: '45 pcs',
        vault: 'Vault D-04',
        status: 'Verified'
      },
      {
        owner: 'Bright Archie',
        assetName: 'Estate Jewelry Set',
        assetType: 'Jewelry',
        quantity: '8 pcs',
        vault: 'Vault J-18',
        status: 'Awaiting Intake'
      },
      {
        owner: 'Lui Kyle Tan',
        assetName: 'Philippine Gold Bullion Reserve',
        assetType: 'Gold',
        quantity: '8 kg',
        vault: 'Vault P-01',
        status: 'Stored'
      },
      {
        owner: 'Lui Kyle Tan',
        assetName: 'Manila Gold Coins Collection',
        assetType: 'Gold',
        quantity: '150 pcs',
        vault: 'Vault P-02',
        status: 'Verified'
      },
      {
        owner: 'Lui Kyle Tan',
        assetName: 'Laguna Estate Gold Bars',
        assetType: 'Gold',
        quantity: '5 kg',
        vault: 'Vault P-03',
        status: 'Stored'
      }
    ],
    signups: [],
    contacts: []
  };

  let dashboardState = clone(defaultData);
  let countsAnimated = false;

  const menuToggle = document.getElementById('menuToggle');
  const menuClose = document.getElementById('menuClose');
  const mobileMenu = document.getElementById('mobileMenu');
  const searchToggle = document.querySelector('.search-toggle');
  const searchClose = document.getElementById('searchClose');
  const searchOverlay = document.getElementById('searchOverlay');
  const heroSlider = document.getElementById('heroSlider');
  const heroDots = document.querySelectorAll('.slider-dot');
  const pricingSlider = document.getElementById('pricingSlider');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const testimonialDots = document.querySelectorAll('.testimonial-dot');
  const statsSection = document.querySelector('.stats-section');
  const statNumbers = document.querySelectorAll('.stat-number');
  const mainNav = document.getElementById('mainNav');

  const trackBtn = document.getElementById('trackBtn');
  const trackInput = document.getElementById('trackInput');
  const trackingResult = document.getElementById('trackingResult');
  const trackingQuickList = document.getElementById('trackingQuickList');
  const cargoTableBody = document.getElementById('cargoTableBody');
  const assetTableBody = document.getElementById('assetTableBody');
  const dashboardMessage = document.getElementById('dashboardMessage');
  const assetForm = document.getElementById('assetForm');
  const signupForm = document.getElementById('signupForm');
  const shipmentUpdateForm = document.getElementById('shipmentUpdateForm');
  const contactForm = document.getElementById('contactForm');

  initShell();
  initSliders();
  initStatsObserver();
  initForms();
  loadDashboardData();
  startTrackingSimulation();

  function initShell() {
    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener('click', () => mobileMenu.classList.add('active'));
    }

    if (menuClose && mobileMenu) {
      menuClose.addEventListener('click', () => mobileMenu.classList.remove('active'));
    }

    if (searchToggle && searchOverlay) {
      searchToggle.addEventListener('click', () => searchOverlay.classList.add('active'));
    }

    if (searchClose && searchOverlay) {
      searchClose.addEventListener('click', () => searchOverlay.classList.remove('active'));
    }

    window.addEventListener('scroll', () => {
      if (!mainNav) {
        return;
      }

      if (window.pageYOffset > 120) {
        mainNav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)';
      } else {
        mainNav.style.boxShadow = 'none';
      }
    });
  }

  function initSliders() {
    let currentSlide = 0;
    const slides = heroSlider ? heroSlider.querySelectorAll('.slide') : [];
    const slideCount = slides.length;
    let heroInterval;

    function goToSlide(index) {
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('active', slideIndex === index);
      });

      heroDots.forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === index);
      });

      currentSlide = index;
    }

    function nextSlide() {
      if (!slideCount) {
        return;
      }

      goToSlide((currentSlide + 1) % slideCount);
    }

    heroDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const index = Number.parseInt(dot.dataset.slide || '0', 10);
        goToSlide(index);
        if (heroInterval) {
          clearInterval(heroInterval);
        }
        heroInterval = setInterval(nextSlide, 6000);
      });
    });

    if (slideCount) {
      heroInterval = setInterval(nextSlide, 6000);
    }

    let pricingIndex = 0;

    function cardsVisible() {
      if (window.innerWidth > 1024) {
        return 3;
      }

      if (window.innerWidth > 768) {
        return 2;
      }

      return 1;
    }

    function updatePricingSlider() {
      if (!pricingSlider || !pricingSlider.children.length) {
        return;
      }

      const maxIndex = Math.max(0, pricingSlider.children.length - cardsVisible());
      pricingIndex = Math.min(pricingIndex, maxIndex);
      const cardWidth = pricingSlider.children[0].getBoundingClientRect().width + 30;
      pricingSlider.style.transform = `translateX(-${pricingIndex * cardWidth}px)`;
    }

    if (prevBtn && nextBtn && pricingSlider) {
      prevBtn.addEventListener('click', () => {
        pricingIndex = Math.max(0, pricingIndex - 1);
        updatePricingSlider();
      });

      nextBtn.addEventListener('click', () => {
        const maxIndex = Math.max(0, pricingSlider.children.length - cardsVisible());
        pricingIndex = Math.min(maxIndex, pricingIndex + 1);
        updatePricingSlider();
      });

      window.addEventListener('resize', updatePricingSlider);
      updatePricingSlider();
    }

    let currentTestimonial = 0;

    function goToTestimonial(index) {
      testimonialSlides.forEach((slide, slideIndex) => {
        slide.classList.toggle('active', slideIndex === index);
      });

      testimonialDots.forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === index);
      });

      currentTestimonial = index;
    }

    testimonialDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const index = Number.parseInt(dot.dataset.slide || '0', 10);
        goToTestimonial(index);
      });
    });

    if (testimonialSlides.length) {
      setInterval(() => {
        goToTestimonial((currentTestimonial + 1) % testimonialSlides.length);
      }, 7000);
    }
  }

  function initStatsObserver() {
    function easeOutQuad(value) {
      return value * (2 - value);
    }

    function animateCounter(element, target, duration) {
      const start = performance.now();

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutQuad(progress);
        element.textContent = Math.floor(eased * target).toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
    }

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !countsAnimated) {
          countsAnimated = true;
          statNumbers.forEach((element) => {
            const target = Number.parseInt(element.dataset.target || '0', 10);
            animateCounter(element, target, 1600);
          });
        }
      });
    }, { threshold: 0.4 });

    if (statsSection) {
      statsObserver.observe(statsSection);
    }

    window.updateAnimatedStats = function updateAnimatedStats() {
      statNumbers.forEach((element) => {
        const target = Number.parseInt(element.dataset.target || '0', 10);
        element.textContent = countsAnimated ? target.toLocaleString() : '0';
      });
    };
  }

  function initForms() {
    if (trackBtn && trackInput) {
      trackBtn.addEventListener('click', handleTrackLookup);
      trackInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          handleTrackLookup();
        }
      });
    }

    if (assetForm) {
      assetForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const payload = formToObject(assetForm);
        await saveDashboardAction('addAsset', payload, 'Asset added successfully.');
        assetForm.reset();
      });
    }

    if (signupForm) {
      signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const payload = formToObject(signupForm);
        // Save to dashboard
        await saveDashboardAction('signup', payload, 'Sign up request saved.');
        // Send email (replace with your EmailJS keys)
        if (typeof sendSignupEmail === 'function') {
          await sendSignupEmail(payload, 'YOUR_TEMPLATE_ID', 'YOUR_SERVICE_ID');
        }
        signupForm.reset();
        showMessage('Signup saved and confirmation email sent!', 'success');
      });
    }

    // Premium Stripe Checkout (add to index.html/client-portal.html)
    const stripeCheckoutBtns = document.querySelectorAll('[data-stripe-upgrade]');
    stripeCheckoutBtns.forEach(btn => {
      btn.addEventListener('click', async () => {
        // Replace with your Stripe key
        const stripe = Stripe('pk_test_YOUR_KEY');
        const {error} = await stripe.redirectToCheckout({
          lineItems: [{price: 'price_YOUR_PREMIUM_PRICE_ID', quantity: 1}],
          mode: 'subscription',
          successUrl: window.location.origin + '/?success=true&session_id={CHECKOUT_SESSION_ID}',
          cancelUrl: window.location.origin + '/?canceled=true',
        });
        if (error) showMessage(error.message, 'error');
      });
    });

    if (shipmentUpdateForm) {
      shipmentUpdateForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const payload = formToObject(shipmentUpdateForm);
        payload.progress = Number.parseInt(payload.progress || '0', 10);
        await saveDashboardAction('updateShipment', payload, 'Shipment data updated.');
      });
    }

    if (contactForm) {
      contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const payload = formToObject(contactForm);
        // Save to dashboard
        await saveDashboardAction('contactRequest', payload, 'Message saved.');
        // Send email (replace with your EmailJS keys)
        if (typeof sendContactEmail === 'function') {
          await sendContactEmail(payload, 'YOUR_TEMPLATE_ID', 'YOUR_SERVICE_ID');
        }
        contactForm.reset();
        showMessage('Message saved and email sent to admin!', 'success');
      });
    }
  }

  async function loadDashboardData() {
    try {
      const response = await fetch('/api/dashboard');
      if (!response.ok) {
        throw new Error('Dashboard endpoint unavailable');
      }

      const payload = await response.json();
      dashboardState = normalizeState(payload.data || payload);
      showMessage('Connected to live dashboard data.', 'success');
    } catch (error) {
      dashboardState = normalizeState(defaultData);
      showMessage('Demo mode active. Start with Vercel or a local server to save live updates.', 'success');
    }

    renderDashboard();
  }

  async function saveDashboardAction(action, payload, successMessage) {
    try {
      const response = await fetch('/api/dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action, payload })
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      const result = await response.json();
      dashboardState = normalizeState(result.data || result);
      renderDashboard();
      showMessage(successMessage, 'success');
    } catch (error) {
      applyLocalFallback(action, payload);
      renderDashboard();
      showMessage(`${successMessage} Saved locally in demo mode.`, 'success');
    }
  }

  function applyLocalFallback(action, payload) {
    if (action === 'addAsset') {
      dashboardState.assets.unshift(payload);
      dashboardState.stats.assetsSecured += 1;
      return;
    }

    if (action === 'signup') {
      dashboardState.signups.unshift({
        ...payload,
        createdAt: new Date().toISOString()
      });
      return;
    }

    if (action === 'contactRequest') {
      dashboardState.contacts.unshift({
        ...payload,
        createdAt: new Date().toISOString()
      });
      return;
    }

    if (action === 'updateShipment') {
      upsertShipment(payload);
    }
  }

  function renderDashboard() {
    renderCargoTable();
    renderAssetTable();
    renderQuickList();
    syncStats();

    if (dashboardState.shipments.length && trackingResult && !trackingResult.innerHTML.trim()) {
      renderTrackingResult(dashboardState.shipments[0].trackingId);
    }
  }

  function renderCargoTable() {
    if (!cargoTableBody) {
      return;
    }

    cargoTableBody.innerHTML = dashboardState.shipments.map((shipment) => `
      <tr>
        <td><strong>${escapeHtml(shipment.trackingId)}</strong></td>
        <td>${escapeHtml(shipment.contents)}</td>
        <td>${escapeHtml(shipment.origin)}</td>
        <td>${escapeHtml(shipment.destination)}</td>
        <td><span class="status-badge ${statusClass(shipment.status)}">${escapeHtml(shipment.status)}</span></td>
        <td>${escapeHtml(shipment.eta)}</td>
      </tr>
    `).join('');
  }

  function renderAssetTable() {
    if (!assetTableBody) {
      return;
    }

    assetTableBody.innerHTML = dashboardState.assets.map((asset) => `
      <tr>
        <td>${escapeHtml(asset.owner)}</td>
        <td>${escapeHtml(asset.assetName)}</td>
        <td>${escapeHtml(asset.assetType)}</td>
        <td>${escapeHtml(asset.quantity)}</td>
        <td>${escapeHtml(asset.vault)}</td>
        <td>${escapeHtml(asset.status)}</td>
      </tr>
    `).join('');
  }

  function renderQuickList() {
    if (!trackingQuickList) {
      return;
    }

    trackingQuickList.innerHTML = dashboardState.shipments.slice(0, 5).map((shipment) => `
      <button type="button" class="tracking-chip" data-tracking-id="${escapeHtml(shipment.trackingId)}">
        ${escapeHtml(shipment.trackingId)}
      </button>
    `).join('');

    trackingQuickList.querySelectorAll('.tracking-chip').forEach((button) => {
      button.addEventListener('click', () => {
        if (trackInput) {
          trackInput.value = button.dataset.trackingId || '';
        }
        handleTrackLookup();
      });
    });
  }

  function renderTrackingResult(trackingId) {
    if (!trackingResult) {
      return;
    }

    const shipment = dashboardState.shipments.find((entry) => entry.trackingId.toUpperCase() === trackingId.toUpperCase());

    if (!shipment) {
      trackingResult.innerHTML = '<p style="color:#c83232;font-weight:700;">Tracking ID not found. Please check the ID and try again.</p>';
      trackingResult.classList.add('active');
      return;
    }

    trackingResult.innerHTML = `
      <h4>Shipment <span style="color:var(--color-accent-gold)">${escapeHtml(shipment.trackingId)}</span></h4>
      <div class="tracking-meta">
        <div class="tracking-meta-item">
          <span class="label">Status</span>
          <span class="value"><span class="status-badge ${statusClass(shipment.status)}">${escapeHtml(shipment.status)}</span></span>
        </div>
        <div class="tracking-meta-item">
          <span class="label">Origin</span>
          <span class="value">${escapeHtml(shipment.origin)}</span>
        </div>
        <div class="tracking-meta-item">
          <span class="label">Destination</span>
          <span class="value">${escapeHtml(shipment.destination)}</span>
        </div>
        <div class="tracking-meta-item">
          <span class="label">ETA / Delivered</span>
          <span class="value">${escapeHtml(shipment.eta)}</span>
        </div>
        <div class="tracking-meta-item">
          <span class="label">Current Location</span>
          <span class="value">${escapeHtml(shipment.current || shipment.origin)}</span>
        </div>
        <div class="tracking-meta-item">
          <span class="label">Contents</span>
          <span class="value">${escapeHtml(shipment.contents)}</span>
        </div>
      </div>
      <div class="tracking-progress">
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width: ${Number(shipment.progress) || 0}%"></div>
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

  function handleTrackLookup() {
    if (!trackInput) {
      return;
    }

    const trackingId = trackInput.value.trim().toUpperCase();
    if (!trackingId) {
      showMessage('Enter a tracking ID to search the shipment list.', 'error');
      return;
    }

    renderTrackingResult(trackingId);
  }

  function startTrackingSimulation() {
    setInterval(() => {
      let hasChanges = false;

      dashboardState.shipments = dashboardState.shipments.map((shipment) => {
        if (shipment.status === 'Delivered' || shipment.status === 'Exception') {
          return shipment;
        }

        hasChanges = true;
        const nextProgress = Math.min(100, Number(shipment.progress || 0) + (shipment.status === 'Processing' ? 3 : 2));
        const nextStatus = nextProgress >= 100 ? 'Delivered' : nextProgress >= 35 ? 'In Transit' : 'Processing';
        const nextEta = nextStatus === 'Delivered' ? `Delivered ${new Date().toLocaleDateString('en-GB')}` : shipment.eta;

        return {
          ...shipment,
          progress: nextProgress,
          status: nextStatus,
          eta: nextEta,
          current: nextStatus === 'Delivered' ? shipment.destination : shipment.current
        };
      });

      if (hasChanges) {
        renderDashboard();

        if (trackInput && trackInput.value.trim()) {
          renderTrackingResult(trackInput.value.trim());
        }
      }
    }, 8000);
  }

  function syncStats() {
    const activeDeliveries = dashboardState.shipments.filter((shipment) => shipment.status !== 'Delivered').length;
    const deliveredCount = dashboardState.shipments.filter((shipment) => shipment.status === 'Delivered').length;

    setText('opsAssetsCount', dashboardState.assets.length);
    setText('opsActiveDeliveries', activeDeliveries);
    setText('opsDeliveredCount', deliveredCount);
    setText('opsSignupCount', dashboardState.signups.length);

    setCounterTarget('assetsSecuredCount', dashboardState.stats.assetsSecured);
    setCounterTarget('vaultsCount', dashboardState.stats.vaultsInOperation);
    setCounterTarget('deliveriesCount', dashboardState.stats.deliveriesCompleted);

    if (typeof window.updateAnimatedStats === 'function') {
      window.updateAnimatedStats();
    }
  }

  function upsertShipment(payload) {
    const trackingId = String(payload.trackingId || '').trim().toUpperCase();
    const existingIndex = dashboardState.shipments.findIndex((shipment) => shipment.trackingId === trackingId);

    const shipmentRecord = {
      trackingId,
      status: payload.status || 'Processing',
      origin: payload.origin || 'London, UK',
      destination: payload.destination || 'Client Destination',
      eta: payload.eta || 'Pending schedule',
      progress: Number.parseInt(payload.progress || '0', 10),
      contents: payload.contents || 'High-value cargo',
      current: payload.current || payload.origin || 'London, UK',
      courier: payload.courier || 'Iron Vault Secure Transport'
    };

    if (existingIndex >= 0) {
      dashboardState.shipments[existingIndex] = {
        ...dashboardState.shipments[existingIndex],
        ...shipmentRecord
      };
    } else {
      dashboardState.shipments.unshift(shipmentRecord);
    }
  }

  function normalizeState(input) {
    const data = clone(input || {});
    return {
      stats: {
        assetsSecured: Number(data.stats?.assetsSecured ?? defaultData.stats.assetsSecured),
        vaultsInOperation: Number(data.stats?.vaultsInOperation ?? defaultData.stats.vaultsInOperation),
        deliveriesCompleted: Number(data.stats?.deliveriesCompleted ?? defaultData.stats.deliveriesCompleted)
      },
      shipments: Array.isArray(data.shipments) ? data.shipments : clone(defaultData.shipments),
      assets: Array.isArray(data.assets) ? data.assets : clone(defaultData.assets),
      signups: Array.isArray(data.signups) ? data.signups : [],
      contacts: Array.isArray(data.contacts) ? data.contacts : []
    };
  }

  function showMessage(message, type) {
    if (!dashboardMessage) {
      return;
    }

    dashboardMessage.textContent = message;
    dashboardMessage.className = `dashboard-message active ${type}`;
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = Number(value).toLocaleString();
    }
  }

  function setCounterTarget(id, target) {
    const element = document.getElementById(id);
    if (element) {
      element.dataset.target = String(target);
    }
  }

  function statusClass(status) {
    const normalized = String(status || '').toLowerCase();

    if (normalized.includes('deliver')) {
      return 'status-delivered';
    }

    if (normalized.includes('process')) {
      return 'status-processing';
    }

    if (normalized.includes('exception') || normalized.includes('delay')) {
      return 'status-exception';
    }

    return 'status-in-transit';
  }

  function formToObject(form) {
    const data = new FormData(form);
    const result = {};

    data.forEach((value, key) => {
      result[key] = typeof value === 'string' ? value.trim() : value;
    });

    return result;
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  // -----------------------------
  // DASHBOARD STATS ANIMATION & REFRESH
  // -----------------------------
  // INITIAL VALUES (from server)
  let dashboardData = {
    assets: 128,
    vaults: 36,
    deliveries: 214
  };

  // -----------------------------
  // ANIMATE NUMBER FUNCTION
  // -----------------------------
  function animateValue(element, start, end, duration) {
    let startTimestamp = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;

      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      const value = Math.floor(progress * (end - start) + start);
      element.innerText = value;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }

  // -----------------------------
  // UPDATE DASHBOARD UI
  // -----------------------------
  function updateDashboard(data) {
    animateValue(document.getElementById("assets"), 0, data.assets, 1500);
    animateValue(document.getElementById("vaults"), 0, data.vaults, 1500);
    animateValue(document.getElementById("deliveries"), 0, data.deliveries, 1500);
  }

  // -----------------------------
  // SIMULATE REAL DATA REFRESH
  // (replace with API later)
  // -----------------------------
  function fetchLatestData() {
    // Simulated growth (safe + realistic)
    dashboardData.assets += Math.floor(Math.random() * 3); // +0–2
    dashboardData.vaults += Math.floor(Math.random() * 1);  // +0–1
    dashboardData.deliveries += Math.floor(Math.random() * 4); // +0–3

    updateDashboard(dashboardData);

    console.log("Dashboard synced:", dashboardData);
  }

// -----------------------------
  // INITIAL LOAD
  // -----------------------------
  updateDashboard(dashboardData);

  // -----------------------------
  // SCROLL REVEAL ANIMATIONS
  // -----------------------------
  function initScrollReveal() {
    var reveals = document.querySelectorAll('.service-card, .info-card, .portal-card, .pricing-card');
    reveals.forEach(function(el) {
      el.classList.add('reveal');
    });

    var revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(function(el) {
      revealObserver.observe(el);
    });
  }

  initScrollReveal();
});

  // -----------------------------
  // PERIODIC UPDATE (NOT every second)
  // -----------------------------
  // Recommended: 30s, 1min, or 5min in real systems
  setInterval(fetchLatestData, 30000);

})();
