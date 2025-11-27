/**
 * Neonfolio - Index Page JavaScript
 * Handles navigation and interactive elements for the home page
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize navigation toggle
  initNavToggle();
  
  // Highlight active navigation item
  highlightActiveNav();
  
  // Add smooth scroll behavior for CTA buttons
  addSmoothScroll();
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
        (currentPath.includes('index') && href === 'index.html') ||
        (currentPath.endsWith('/') && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Add smooth scroll behavior to section links
 */
function addSmoothScroll() {
  document.querySelectorAll('a[href*="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Only handle same-page links
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}

/**
 * Log page analytics (optional - can be connected to a service later)
 */
function logPageView() {
  console.log('Page viewed: Home');
}

// Log page view on load
logPageView();
