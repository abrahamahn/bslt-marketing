// src/main.ts
import './styles/main.css';
import './modules/navbar/navbar.css';

import { initNavbar } from './modules/navbar/navbar.ts';
import { initKeyboardShortcuts } from './modules/keyboard/keyboard.ts';

// Cleanup functions for hot module replacement
const cleanupFns: (() => void)[] = [];

/**
 * Initialize all modules.
 */
function init(): void {
  // Update footer year
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear().toString();
  }

  // Initialize modules
  cleanupFns.push(initNavbar());
  cleanupFns.push(initKeyboardShortcuts());
}

/**
 * Cleanup all modules (for HMR).
 */
function cleanup(): void {
  cleanupFns.forEach((fn) => fn());
  cleanupFns.length = 0;
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Hot Module Replacement support
if (import.meta.hot) {
  import.meta.hot.dispose(cleanup);
}
