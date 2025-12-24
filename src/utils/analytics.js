// Google Analytics 4 implementation
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

/**
 * Initialize Google Analytics
 * Called once when the app starts
 */
export const initGA = () => {
  // Only initialize if measurement ID is provided and not a placeholder
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === "G-XXXXXXXXXX") {
    console.warn("Google Analytics: No valid measurement ID provided");
    return;
  }

  // Load gtag.js script
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false, // Disable automatic page view, we'll handle it manually
  });
};

/**
 * Track page view
 * Call this on route changes
 */
export const trackPageView = (path, title) => {
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === "G-XXXXXXXXXX") return;

  if (window.gtag) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title || document.title,
    });
  }
};

/**
 * Track custom events
 * @param {string} action - The event action (e.g., 'click', 'search', 'share')
 * @param {string} category - The event category (e.g., 'engagement', 'video', 'article')
 * @param {string} label - The event label (e.g., article title, button name)
 * @param {number} value - The event value (optional)
 */
export const trackEvent = (action, category, label, value) => {
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === "G-XXXXXXXXXX") return;

  if (window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
