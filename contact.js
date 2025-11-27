/**
 * Neonfolio - Contact Page JavaScript
 * Handles form submission and validation for the contact page
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize navigation toggle
  initNavToggle();
  
  // Highlight active navigation item
  highlightActiveNav();
  
  // Initialize contact form
  initContactForm();
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
        (currentPath.includes('contact') && href === 'contact.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Initialize contact form handling
 */
function initContactForm() {
  const form = document.querySelector('form');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const name = form.querySelector('input[name="name"]')?.value.trim();
      const email = form.querySelector('input[name="email"]')?.value.trim();
      const message = form.querySelector('textarea[name="message"]')?.value.trim();
      
      // Validation
      if (!name || !email || !message) {
        showMessage('Please fill in all fields', 'error');
        return;
      }
      
      if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
      }
      
      // Store contact message in localStorage
      const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
      messages.push({
        id: Date.now(),
        name,
        email,
        message,
        createdAt: new Date().toISOString()
      });
      
      localStorage.setItem('contact_messages', JSON.stringify(messages));
      
      // Log submission
      console.log('Contact message submitted:', { name, email, message });
      
      showMessage('Thank you! Your message has been received. We will get back to you soon.', 'success');
      
      // Reset form after submission
      setTimeout(() => {
        form.reset();
      }, 1500);
    });
  }
}

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
    max-width: 400px;
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
  
  // Remove message after 5 seconds
  setTimeout(() => {
    messageDiv.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => messageDiv.remove(), 300);
  }, 5000);
}

/**
 * Log page analytics
 */
function logPageView() {
  console.log('Page viewed: Contact');
}

// Log page view on load
logPageView();
