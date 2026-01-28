// src/modules/bento/bento.ts
import { prefersReducedMotion } from '../../utils/dom.ts';

/**
 * Initialize the bento grid animations.
 * Handles intersection observer for reveal animations.
 * @returns Cleanup function
 */
export function initBento(): () => void {
  const bentoCards = document.querySelectorAll<HTMLElement>('.bento-card');

  if (bentoCards.length === 0) {
    return () => undefined;
  }

  // Skip animations if reduced motion preferred
  if (prefersReducedMotion()) {
    bentoCards.forEach((card) => {
      card.classList.add('bento-card--visible');
    });
    return () => undefined;
  }

  // Intersection observer for reveal animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('bento-card--visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  bentoCards.forEach((card) => {
    observer.observe(card);
  });

  // Animate lighthouse gauge
  const gauge = document.querySelector<SVGCircleElement>('.lighthouse-gauge-fill');
  if (gauge) {
    const animateGauge = (): void => {
      gauge.style.strokeDashoffset = '0';
    };

    const gaugeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            requestAnimationFrame(animateGauge);
            gaugeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    const gaugeContainer = gauge.closest('.bento-card');
    if (gaugeContainer) {
      gaugeObserver.observe(gaugeContainer);
    }
  }

  return () => {
    observer.disconnect();
  };
}
