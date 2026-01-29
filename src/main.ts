// src/main.ts
import './styles/main.css';
import './modules/navbar/navbar.css';
import './modules/terminal/terminal.css';
import './modules/command-palette/command-palette.css';
import './modules/pricing/pricing.css';
import './modules/code-tabs/code-tabs.css';
import './modules/marquee/marquee.css';
import './modules/bento/bento.css';
import './modules/changelog/changelog.css';
import './modules/social-proof/social-proof.css';
import './modules/race-track/race-track.css';
import './modules/integrations-grid/integrations-grid.css';
import './modules/lightning-ide/lightning-ide.css';
import './modules/open-source/open-source.css';
import './modules/quality/quality.css';
import './modules/ownership/ownership.css';
import './modules/sovereignty/sovereignty.css';
import './modules/tooling/tooling.css';
import './modules/specs-list/specs-list.css';
import './modules/deep-tech/deep-tech.css';
import './modules/asset/asset.css';
import './modules/team-scale/team-scale.css';
import './modules/gems/gems.css';

import { initNavbar } from './modules/navbar/navbar.ts';
import { initKeyboardShortcuts } from './modules/keyboard/keyboard.ts';
import { initTerminal } from './modules/terminal/terminal.ts';
import { initCommandPalette } from './modules/command-palette/command-palette.ts';
import { initPricing } from './modules/pricing/pricing.ts';
import { initCodeTabs } from './modules/code-tabs/code-tabs.ts';
import { initMarquee } from './modules/marquee/marquee.ts';
import { initBento } from './modules/bento/bento.ts';
import { initChangelog } from './modules/changelog/changelog.ts';
import { initSocialProof } from './modules/social-proof/social-proof.ts';
import { initRaceTrack } from './modules/race-track/race-track.ts';
import { initIntegrationsGrid } from './modules/integrations-grid/integrations-grid.ts';
import { initLightningIDE } from './modules/lightning-ide/lightning-ide.ts';
import { initScrollAnimate } from './modules/scroll-animate/scroll-animate.ts';
import { initChatAnimation } from './modules/chat-animation/chat-animation.ts';

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
  cleanupFns.push(initTerminal());
  cleanupFns.push(initCommandPalette());
  cleanupFns.push(initPricing());
  cleanupFns.push(initCodeTabs());
  cleanupFns.push(initMarquee());
  cleanupFns.push(initBento());
  cleanupFns.push(initChangelog());
  cleanupFns.push(initSocialProof());
  cleanupFns.push(initRaceTrack());
  cleanupFns.push(initIntegrationsGrid());
  cleanupFns.push(initLightningIDE());
  cleanupFns.push(initScrollAnimate());
  cleanupFns.push(initChatAnimation());

  // Reveal page after CSS loads (prevents FOUC)
  document.body.classList.add('loaded');
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
