/**
 * Neonfolio - Showcase Page JavaScript
 * Handles project display and filtering for the showcase page
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize navigation toggle
  initNavToggle();
  
  // Highlight active navigation item
  highlightActiveNav();
  
  // Initialize showcase features
  initShowcase();
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
        (currentPath.includes('showcase') && href === 'showcase.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Initialize showcase features
 */
function initShowcase() {
  // Add click handlers to project cards
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', function() {
      handleProjectCardClick(this);
    });
    
    // Add hover effect
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
  
  // Load projects from localStorage
  loadProjectsFromStorage();
}

/**
 * Handle project card click
 */
function handleProjectCardClick(card) {
  const title = card.querySelector('h3');
  const description = card.querySelector('p');
  
  if (title && description) {
    console.log('Clicked project:', {
      title: title.textContent,
      description: description.textContent
    });
    
    // Show project details (can be expanded later)
    showProjectDetails(title.textContent, description.textContent);
  }
}

/**
 * Show project details in a modal or alert
 */
function showProjectDetails(title, description) {
  const details = `
Project: ${title}
${description}

To view the full project details, connect to a project management system.
  `;
  
  // Create a simple notification instead of alert
  showMessage(`Selected: ${title}`, 'info');
}

/**
 * Load projects from localStorage (if any)
 */
function loadProjectsFromStorage() {
  const projects = JSON.parse(localStorage.getItem('showcase_projects') || '[]');
  
  if (projects.length > 0) {
    console.log('Loaded projects from storage:', projects);
  }
}

/**
 * Save project to localStorage
 */
function saveProjectToShowcase(project) {
  const projects = JSON.parse(localStorage.getItem('showcase_projects') || '[]');
  projects.push({
    id: Date.now(),
    ...project,
    createdAt: new Date().toISOString()
  });
  localStorage.setItem('showcase_projects', JSON.stringify(projects));
}

/**
 * Filter projects by category (expandable)
 */
function filterProjects(category) {
  const projects = document.querySelectorAll('.project-card');
  
  projects.forEach(project => {
    // Can add category data attribute to project cards for filtering
    project.style.display = 'block';
  });
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
  
  // Remove message after 3 seconds
  setTimeout(() => {
    messageDiv.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => messageDiv.remove(), 300);
  }, 3000);
}

/**
 * Log page analytics
 */
function logPageView() {
  console.log('Page viewed: Showcase');
}

// Log page view on load
logPageView();
