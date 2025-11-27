/**
 * Neonfolio - Login Page JavaScript
 * Handles form validation and submission for the login page
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize navigation toggle
  initNavToggle();
  
  // Highlight active navigation item
  highlightActiveNav();
  
  // Initialize form handling
  initLoginForm();
});

/**
 * Initialize mobile navigation toggle
 */
function initNavToggle() {
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.getElementById('nav-list');

  if (navToggle && navList) {
    navToggle.addEventListener('click', function() {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isOpen);
      navList.classList.toggle('open');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-list a').forEach(link => {
      link.addEventListener('click', function() {
        navToggle.setAttribute('aria-expanded', 'false');
        navList.classList.remove('open');
      });
    });
  }
}

/**
 * Highlight the active navigation item based on current page
 */
function highlightActiveNav() {
  const currentPath = window.location.pathname;
  
  document.querySelectorAll('.nav-list a').forEach(link => {
    const href = link.getAttribute('href');
    
    if (href === currentPath.split('/').pop() || 
        (currentPath.includes('login') && href === 'login.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Initialize login form handling
 */
function initLoginForm() {
  const form = document.querySelector('form');
  
  if (form) {
    // Seed admin user if needed (centralized in Auth)
    if (window.Auth && typeof window.Auth.seedAdminIfNeeded === 'function') {
      Auth.seedAdminIfNeeded();
    }

    // Prefill remembered email if present
    const remembered = localStorage.getItem('rememberedEmail');
    if (remembered) document.getElementById('email').value = remembered;

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const remember = document.querySelector('input[name="remember"]');

      if (!email || !password) { showMessage('Please fill in all fields', 'error'); return; }
      if (!isValidEmail(email)) { showMessage('Please enter a valid email address', 'error'); return; }

      if (!window.Auth) { showMessage('Auth module not loaded', 'error'); return; }

      const user = Auth.authenticate(email, password);
      if (!user) { showMessage('Invalid email or password', 'error'); return; }

      if (remember && remember.checked) localStorage.setItem('rememberedEmail', email);

      Auth.setCurrentUser(user);
      showMessage('Login successful — redirecting...', 'success');
      setTimeout(() => { window.location.href = 'showcase.html'; }, 600);
    });

    // Show password toggle
    const showLogin = document.getElementById('showPasswordLogin');
    if (showLogin) {
      showLogin.addEventListener('change', function() {
        const pwd = document.getElementById('password');
        if (pwd) pwd.type = this.checked ? 'text' : 'password';
      });
    }
  }
}

/**
 * Users helper: load users array
 */
// Auth functions (load/save/seed) are provided by `js/auth.js` and exposed on window.Auth

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Show message to user
 */
function showMessage(message, type = 'info') {
  const messageDiv = document.createElement('div');
  messageDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    background: ${type === 'error' ? '#ff6b6b' : type === 'success' ? '#51cf66' : '#00F5FF'};
    color: ${type === 'error' || type === 'success' ? '#fff' : '#000'};
    border-radius: 8px;
    z-index: 9999;
    animation: slideIn 0.3s ease;
    font-weight: 600;
  `;
  
  messageDiv.textContent = message;
  document.body.appendChild(messageDiv);
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(400px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  // Remove message after 4 seconds
  setTimeout(() => {
    messageDiv.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => messageDiv.remove(), 300);
  }, 4000);
}

/**
 * Log page analytics
 */
function logPageView() {
  console.log('Page viewed: Login');
}

// Log page view on load
logPageView();
