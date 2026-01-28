// src/modules/navbar/navbar.ts
import { on, prefersReducedMotion } from '../../utils/dom.ts';

const SCROLL_THRESHOLD = 50;
const SCROLLED_CLASS = 'header--scrolled';

/**
 * Initialize navbar scroll behavior.
 * Adds solid background with blur when user scrolls past threshold.
 */
export function initNavbar(): () => void {
  const header = document.querySelector<HTMLElement>('header');
  if (!header) return () => undefined;

  // Capture reference for closure
  const headerEl = header;
  let ticking = false;

  function updateHeader(): void {
    const scrollY = window.scrollY;
    const isScrolled = scrollY > SCROLL_THRESHOLD;

    if (isScrolled && !headerEl.classList.contains(SCROLLED_CLASS)) {
      headerEl.classList.add(SCROLLED_CLASS);
    } else if (!isScrolled && headerEl.classList.contains(SCROLLED_CLASS)) {
      headerEl.classList.remove(SCROLLED_CLASS);
    }

    ticking = false;
  }

  function onScroll(): void {
    if (!ticking) {
      // Use requestAnimationFrame for smooth performance
      if (prefersReducedMotion()) {
        updateHeader();
      } else {
        requestAnimationFrame(updateHeader);
      }
      ticking = true;
    }
  }

  // Initial check
  updateHeader();

  // Attach scroll listener
  const cleanup = on(window as unknown as HTMLElement, 'scroll', onScroll, { passive: true });

  return cleanup;
}
