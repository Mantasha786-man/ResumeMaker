// responsive.js - Utility functions and styles for mobile responsiveness

// Function to detect if the device is mobile
export const isMobile = () => {
  return window.innerWidth <= 768;
};

// Function to handle responsive behavior
export const handleResponsive = () => {
  const width = window.innerWidth;
  if (width <= 600) {
    // Mobile specific code
    document.body.classList.add('mobile-view');
  } else {
    document.body.classList.remove('mobile-view');
  }
};

// Add event listener for resize
window.addEventListener('resize', handleResponsive);
handleResponsive(); // Initial call

// CSS styles for mobile view
export const mobileStyles = `
  @media (max-width: 600px) {
    .navbar {
      flex-direction: column;
      height: auto;
      padding: 10px;
    }
    .navbar .logo {
      margin-bottom: 10px;
    }
    .navbar .nav-links {
      flex-direction: column;
      width: 100%;
      text-align: center;
    }
    .resume-container {
      padding: 10px;
      font-size: 14px;
    }
    .resume-header {
      text-align: center;
    }
    .resume-section {
      margin-bottom: 20px;
    }
    .resume-item {
      padding: 10px;
      margin-bottom: 10px;
    }
    .skills-grid {
      grid-template-columns: 1fr;
    }
    .contact-info {
      flex-direction: column;
      gap: 10px;
    }
    .links {
      justify-content: center;
      flex-wrap: wrap;
    }
  }
`;

// Inject styles into the head
const style = document.createElement('style');
style.textContent = mobileStyles;
document.head.appendChild(style);
