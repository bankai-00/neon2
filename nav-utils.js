/**
 * Neonfolio - Shared Navigation Utilities
 * Common functions used across all pages
 */

/**
 * Initialize common navigation features for all pages
 */
function initCommonNav() {
  initNavToggle();
  highlightActiveNav();
}

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
  const currentFile = currentPath.split('/').pop() || 'index.html';
  
  document.querySelectorAll('.nav-list a').forEach(link => {
    const href = link.getAttribute('href');
    const isActive = href === currentFile || 
                    (currentFile === '' && href === 'index.html') ||
                    (currentPath.endsWith('/') && href === 'index.html');
    
    if (isActive) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Show notification message to user
 */
function showMessage(message, type = 'info', duration = 4000) {
  const messageDiv = document.createElement('div');
  
  const bgColor = type === 'error' ? '#ff6b6b' : 
                  type === 'success' ? '#51cf66' : 
                  '#00F5FF';
  
  const textColor = (type === 'error' || type === 'success') ? '#fff' : '#000';
  
  messageDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    background: ${bgColor};
    color: ${textColor};
    border-radius: 8px;
    z-index: 9999;
    animation: slideIn 0.3s ease;
    font-weight: 600;
    max-width: 400px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  `;
  
  messageDiv.textContent = message;
  document.body.appendChild(messageDiv);
  
  // Add animation styles if not already present
  if (!document.querySelector('style[data-nav-util]')) {
    const style = document.createElement('style');
    style.setAttribute('data-nav-util', 'true');
    style.textContent = `
      @keyframes slideIn {
        from { 
          transform: translateX(400px); 
          opacity: 0; 
        }
        to { 
          transform: translateX(0); 
          opacity: 1; 
        }
      }
      @keyframes slideOut {
        from { 
          transform: translateX(0); 
          opacity: 1; 
        }
        to { 
          transform: translateX(400px); 
          opacity: 0; 
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Remove message after specified duration
  setTimeout(() => {
    messageDiv.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => messageDiv.remove(), 300);
  }, duration);
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Simple hash function for passwords (demo only - use proper hashing on backend)
 */
function hashPassword(password) {
  return btoa(password); // Base64 encode - NOT SECURE, for demo only
}

/**
 * Store data in localStorage with error handling
 */
function storeData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Failed to store data:', e);
    return false;
  }
}

/**
 * Retrieve data from localStorage with error handling
 */
function getData(key, defaultValue = null) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error('Failed to retrieve data:', e);
    return defaultValue;
  }
}

/**
 * Get current user from localStorage
 */
function getCurrentUser() {
  return getData('currentUser', null);
}

/**
 * Set current user in localStorage
 */
function setCurrentUser(user) {
  return storeData('currentUser', user);
}

/**
 * Clear current user (logout)
 */
function clearCurrentUser() {
  try {
    localStorage.removeItem('currentUser');
    return true;
  } catch (e) {
    console.error('Failed to clear user:', e);
    return false;
  }
}

/**
 * Format date for display
 */
function formatDate(date, format = 'short') {
  const d = new Date(date);
  
  if (format === 'long') {
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  });
}

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Export functions for use in other scripts
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initCommonNav,
    initNavToggle,
    highlightActiveNav,
    showMessage,
    isValidEmail,
    hashPassword,
    storeData,
    getData,
    getCurrentUser,
    setCurrentUser,
    clearCurrentUser,
    formatDate,
    debounce
  };
}
