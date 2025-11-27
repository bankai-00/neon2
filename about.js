/**
 * Neonfolio - About Page JavaScript
 * Handles navigation and interactive elements for the about page
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize navigation toggle
  initNavToggle();
  
  // Highlight active navigation item
  highlightActiveNav();
  
  // Initialize observer for scroll animations
  initScrollAnimations();
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
        (currentPath.includes('about') && href === 'about.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Initialize scroll animations for content sections
 */
function initScrollAnimations() {
  const sections = document.querySelectorAll('section, .card');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });
}

/**
 * Log page analytics
 */
function logPageView() {
  console.log('Page viewed: About');
}

// Log page view on load
logPageView();
