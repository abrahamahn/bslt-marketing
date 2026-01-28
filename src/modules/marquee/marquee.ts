// src/modules/marquee/marquee.ts
import { on, $$, prefersReducedMotion } from '../../utils/dom.ts';

/**
 * Initialize the tech stack marquee.
 * Handles pause on hover and tooltip display.
 * @returns Cleanup function
 */
export function initMarquee(): () => void {
  const marquee = document.querySelector<HTMLElement>('.marquee');

  if (!marquee) {
    return () => undefined;
  }

  // Capture reference for closure safety
  const marqueeEl = marquee;
  const cleanupFns: (() => void)[] = [];

  const track = marqueeEl.querySelector<HTMLElement>('.marquee-track');
  const items = $$('.marquee-item', marqueeEl);

  // Pause animation if reduced motion preferred
  if (prefersReducedMotion() && track) {
    track.style.animationPlayState = 'paused';
  }

  /**
   * Show tooltip for an item.
   */
  function showTooltip(item: HTMLElement): void {
    const tooltip = item.querySelector<HTMLElement>('.marquee-tooltip');
    if (tooltip) {
      tooltip.classList.add('marquee-tooltip--visible');
    }
  }

  /**
   * Hide tooltip for an item.
   */
  function hideTooltip(item: HTMLElement): void {
    const tooltip = item.querySelector<HTMLElement>('.marquee-tooltip');
    if (tooltip) {
      tooltip.classList.remove('marquee-tooltip--visible');
    }
  }

  // Attach hover handlers for tooltips
  items.forEach((item) => {
    const el = item as HTMLElement;
    cleanupFns.push(on(el, 'mouseenter', () => showTooltip(el)));
    cleanupFns.push(on(el, 'mouseleave', () => hideTooltip(el)));
    cleanupFns.push(on(el, 'focus', () => showTooltip(el)));
    cleanupFns.push(on(el, 'blur', () => hideTooltip(el)));
  });

  return () => {
    cleanupFns.forEach((fn) => fn());
  };
}
