/**
 * Neonfolio - Register Page JavaScript
 * Handles form validation and submission for the register page
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize navigation toggle
  initNavToggle();
  
  // Highlight active navigation item
  highlightActiveNav();
  
  // Initialize form handling
  initRegisterForm();
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
        (currentPath.includes('register') && href === 'register.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Initialize register form handling
 */
function initRegisterForm() {
  const form = document.querySelector('form');
  
  if (form) {
    // Ensure admin user exists for local testing
    if (window.Auth && typeof Auth.seedAdminIfNeeded === 'function') Auth.seedAdminIfNeeded();
    // Add real-time password validation
    const passwordInput = form.querySelector('input[name="password"]');
    const confirmInput = form.querySelector('input[name="confirm-password"]');
    
    if (passwordInput && confirmInput) {
      confirmInput.addEventListener('input', function() {
        validatePasswordMatch(passwordInput.value, confirmInput.value);
      });
    }
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form values
      const name = form.querySelector('input[name="name"]')?.value.trim();
      const email = form.querySelector('input[name="email"]')?.value.trim();
      const password = form.querySelector('input[name="password"]')?.value;
      const confirmPassword = form.querySelector('input[name="confirm-password"]')?.value;

      // Validation
      const validation = validateForm(name, email, password, confirmPassword);
      if (!validation.valid) { showMessage(validation.message, 'error'); return; }

      if (!window.Auth) { showMessage('Auth module not loaded', 'error'); return; }

      try {
        const user = Auth.registerUser({ name, email, password });
        // Set current user (public info)
        Auth.setCurrentUser({ id: user.id, name: user.name, email: user.email });
        showMessage('Registration successful! Redirecting to showcase...', 'success');
        setTimeout(() => { window.location.href = 'showcase.html'; }, 1200);
      } catch (err) {
        showMessage(err.message || 'Registration failed', 'error');
      }
    });

    // Show passwords toggle (toggles both password and confirm fields)
    const showReg = document.getElementById('showPasswordRegister');
    if (showReg) {
      showReg.addEventListener('change', function() {
        const pwd = document.getElementById('password');
        const cpwd = document.getElementById('confirm-password');
        if (pwd) pwd.type = this.checked ? 'text' : 'password';
        if (cpwd) cpwd.type = this.checked ? 'text' : 'password';
      });
    }
  }
}

/**
 * Validate form inputs
 */
function validateForm(name, email, password, confirmPassword) {
  if (!name) return { valid: false, message: 'Please enter your name' };
  if (!email) return { valid: false, message: 'Please enter your email' };
  if (!isValidEmail(email)) return { valid: false, message: 'Please enter a valid email' };
  if (!password) return { valid: false, message: 'Please enter a password' };
  if (password.length < 6) return { valid: false, message: 'Password must be at least 6 characters' };
  if (password !== confirmPassword) return { valid: false, message: 'Passwords do not match' };
  
  return { valid: true };
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password match in real-time
 */
function validatePasswordMatch(password, confirmPassword) {
  const confirmInput = document.querySelector('input[name="confirm-password"]');
  
  if (confirmInput && confirmPassword) {
    if (password === confirmPassword) {
      confirmInput.style.borderColor = 'var(--neon-cyan)';
      confirmInput.style.backgroundColor = 'rgba(0, 245, 255, 0.05)';
    } else {
      confirmInput.style.borderColor = '#ff6b6b';
      confirmInput.style.backgroundColor = 'rgba(255, 107, 107, 0.05)';
    }
  }
}

/**
 * Simple password hash (for demo only - use proper hashing on backend)
 */
// Password hashing/storage is handled by Auth.registerUser (base64 for demo)

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
  console.log('Page viewed: Register');
}

// Log page view on load
logPageView();
