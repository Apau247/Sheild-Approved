(function() {
  'use strict';

  /* ---------- Toast Notification System ---------- */
  window.showToast = function(message, type) {
    type = type || 'info';
    var container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(function() {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(120%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(function() { toast.remove(); }, 300);
    }, 4000);
  };

  /* ---------- Offline / Online Detection ---------- */
  var offlineIndicator = document.getElementById('offlineIndicator');
  if (!offlineIndicator) {
    offlineIndicator = document.createElement('div');
    offlineIndicator.id = 'offlineIndicator';
    offlineIndicator.className = 'offline-indicator';
    offlineIndicator.textContent = 'You are offline. Some features may be limited.';
    document.body.appendChild(offlineIndicator);
  }

  function updateOnlineStatus() {
    if (navigator.onLine) {
      offlineIndicator.classList.remove('active');
      showToast('You are back online.', 'success');
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(function(reg) {
          if (reg.sync) {
            reg.sync.register('sync-forms').catch(function() {});
          }
        });
      }
    } else {
      offlineIndicator.classList.add('active');
      showToast('You are offline. Changes will sync when connection is restored.', 'error');
    }
  }

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);

  /* ---------- Session Timeout ---------- */
  var SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  var WARNING_TIME = 2 * 60 * 1000; // 2 minutes warning
  var lastActivity = Date.now();
  var timeoutWarningShown = false;

  function resetActivity() {
    lastActivity = Date.now();
    timeoutWarningShown = false;
    var overlay = document.getElementById('sessionTimeoutOverlay');
    if (overlay) overlay.classList.remove('active');
  }

  ['click', 'keydown', 'mousemove', 'touchstart', 'scroll'].forEach(function(evt) {
    window.addEventListener(evt, resetActivity, { passive: true });
  });

  function checkSessionTimeout() {
    var elapsed = Date.now() - lastActivity;
    var overlay = document.getElementById('sessionTimeoutOverlay');

    if (elapsed > SESSION_TIMEOUT) {
      localStorage.removeItem('ivsCurrentUser');
      window.location.href = 'login.html?timeout=1';
      return;
    }

    if (elapsed > SESSION_TIMEOUT - WARNING_TIME && !timeoutWarningShown) {
      timeoutWarningShown = true;
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'sessionTimeoutOverlay';
        overlay.className = 'session-timeout-overlay';
        overlay.innerHTML = '<div class="session-timeout-card">' +
          '<h3>Session Expiring Soon</h3>' +
          '<p>Your session will expire in 2 minutes due to inactivity. Click anywhere to stay logged in.</p>' +
          '<button class="btn" onclick="document.getElementById(\'sessionTimeoutOverlay\').classList.remove(\'active\');">Stay Logged In</button>' +
          '</div>';
        document.body.appendChild(overlay);
      }
      overlay.classList.add('active');
    }
  }

  // Only run session timeout on authenticated pages
  if (localStorage.getItem('ivsCurrentUser')) {
    setInterval(checkSessionTimeout, 30000);
  }

  /* ---------- PWA Install Prompt ---------- */
  var deferredPrompt;
  window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    deferredPrompt = e;
    var installBtn = document.getElementById('pwaInstallBtn');
    if (!installBtn) {
      installBtn = document.createElement('button');
      installBtn.id = 'pwaInstallBtn';
      installBtn.className = 'btn pwa-install-btn';
      installBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Install App';
      document.body.appendChild(installBtn);
    }
    installBtn.style.display = 'inline-flex';
    installBtn.addEventListener('click', function() {
      installBtn.style.display = 'none';
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function(choice) {
        if (choice.outcome === 'accepted') {
          showToast('App installed successfully!', 'success');
        }
        deferredPrompt = null;
      });
    });
  });

  /* ---------- Mobile Table Card Labels ---------- */
  function applyTableCardLabels() {
    var tables = document.querySelectorAll('.cargo-table');
    tables.forEach(function(table) {
      var headers = table.querySelectorAll('thead th');
      var headerTexts = [];
      headers.forEach(function(th) { headerTexts.push(th.textContent.trim()); });
      var rows = table.querySelectorAll('tbody tr');
      rows.forEach(function(row) {
        var cells = row.querySelectorAll('td');
        cells.forEach(function(cell, idx) {
          if (headerTexts[idx]) {
            cell.setAttribute('data-label', headerTexts[idx]);
          }
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyTableCardLabels);
  } else {
    applyTableCardLabels();
  }

  /* ---------- Form Validation Helpers ---------- */
  window.validateForm = function(form) {
    var valid = true;
    var fields = form.querySelectorAll('input[required], select[required], textarea[required]');
    fields.forEach(function(field) {
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = '#c83232';
      } else {
        field.style.borderColor = '';
      }
    });
    return valid;
  };

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

})();
