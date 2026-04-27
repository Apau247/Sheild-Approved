(function() {
  'use strict';

  /* ---------- Mobile Menu & Search Overlay ---------- */
  var menuToggle = document.getElementById('menuToggle');
  var menuClose = document.getElementById('menuClose');
  var mobileMenu = document.getElementById('mobileMenu');
  var searchToggle = document.querySelector('.search-toggle');
  var searchClose = document.getElementById('searchClose');
  var searchOverlay = document.getElementById('searchOverlay');
  var mainNav = document.getElementById('mainNav');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function() { mobileMenu.classList.add('active'); });
  }
  if (menuClose && mobileMenu) {
    menuClose.addEventListener('click', function() { mobileMenu.classList.remove('active'); });
  }
  if (searchToggle && searchOverlay) {
    searchToggle.addEventListener('click', function() { searchOverlay.classList.add('active'); });
  }
  if (searchClose && searchOverlay) {
    searchClose.addEventListener('click', function() { searchOverlay.classList.remove('active'); });
  }

  // Close mobile menu when clicking any link inside it
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() { mobileMenu.classList.remove('active'); });
    });
  }

  // Main nav shadow on scroll
  window.addEventListener('scroll', function() {
    if (!mainNav) return;
    if (window.pageYOffset > 120) {
      mainNav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)';
    } else {
      mainNav.style.boxShadow = 'none';
    }
  });

  /* ---------- Smooth Scroll for Anchor Links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      if (!href || href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var headerOffset = 105;
        var elementPosition = target.getBoundingClientRect().top;
        var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    });
  });

  /* ---------- Auth-Aware Navigation ---------- */
  function updateAuthNav() {
    var currentUserRaw = localStorage.getItem('ivsCurrentUser');
    var topBarRight = document.querySelector('.top-bar-right');
    var mobileNav = document.querySelector('.mobile-nav');

    // If page already has a portal logout button, don't replace top-bar-right
    var hasClientLogout = document.getElementById('clientLogout');
    var hasAdminLogout = document.getElementById('adminLogout');

    if (hasClientLogout) {
      if (mobileNav && !mobileNav.querySelector('a[href="client-portal.html"]')) {
        var cpLink = document.createElement('a');
        cpLink.href = 'client-portal.html';
        cpLink.textContent = 'Client Portal';
        mobileNav.insertBefore(cpLink, mobileNav.firstChild);
      }
      return;
    }

    if (hasAdminLogout) {
      if (mobileNav && !mobileNav.querySelector('a[href="admin-dashboard.html"]')) {
        var adLink = document.createElement('a');
        adLink.href = 'admin-dashboard.html';
        adLink.textContent = 'Admin Dashboard';
        mobileNav.insertBefore(adLink, mobileNav.firstChild);
      }
      return;
    }

    if (!topBarRight) return;

    if (!currentUserRaw) {
      // Ensure default mobile nav links exist
      if (mobileNav) {
        var needsSignup = !mobileNav.querySelector('a[href="signup.html"]');
        var needsLogin = !mobileNav.querySelector('a[href="login.html"]');
        if (needsSignup) {
          var su = document.createElement('a');
          su.href = 'signup.html';
          su.textContent = 'Sign Up';
          mobileNav.insertBefore(su, mobileNav.firstChild);
        }
        if (needsLogin) {
          var li = document.createElement('a');
          li.href = 'login.html';
          li.textContent = 'Login';
          mobileNav.insertBefore(li, mobileNav.children[1] || null);
        }
      }
      return;
    }

    var currentUser;
    try {
      currentUser = JSON.parse(currentUserRaw);
    } catch (e) { return; }

    // Update top-bar-right
    if (currentUser.role === 'admin') {
      topBarRight.innerHTML = '<a href="admin-dashboard.html" class="btn-request-access">Admin Dashboard</a><a href="#" id="navLogout" class="btn-secure-vault">Logout</a>';
    } else {
      topBarRight.innerHTML = '<a href="client-portal.html" class="btn-request-access">Client Portal</a><a href="#" id="navLogout" class="btn-secure-vault">Logout</a>';
    }

    var logoutBtn = document.getElementById('navLogout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('ivsCurrentUser');
        window.location.href = 'index.html';
      });
    }

    // Update mobile nav
    if (mobileNav) {
      var portalHref = currentUser.role === 'admin' ? 'admin-dashboard.html' : 'client-portal.html';
      var portalText = currentUser.role === 'admin' ? 'Admin Dashboard' : 'Client Portal';
      if (!mobileNav.querySelector('a[href="' + portalHref + '"]')) {
        var pl = document.createElement('a');
        pl.href = portalHref;
        pl.textContent = portalText;
        mobileNav.insertBefore(pl, mobileNav.firstChild);
      }
    }
  }

  updateAuthNav();
})();

