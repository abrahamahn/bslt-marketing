// src/modules/scroll-animate/scroll-animate.ts
import { prefersReducedMotion } from '../../utils/dom.ts';

/**
 * Initialize scroll-triggered fade-in animations.
 * Elements with .fade-in class will animate when they enter the viewport.
 * @returns Cleanup function to disconnect observer
 * @complexity O(n) where n is the number of observed elements
 */
export function initScrollAnimate(): () => void {
  // Skip animations if user prefers reduced motion
  if (prefersReducedMotion()) {
    document.querySelectorAll('.fade-in').forEach((el) => {
      el.classList.add('visible');
    });
    return () => undefined;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Stop observing once visible
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  // Observe all fade-in elements
  document.querySelectorAll('.fade-in').forEach((el) => {
    observer.observe(el);
  });

  return () => {
    observer.disconnect();
  };
}
