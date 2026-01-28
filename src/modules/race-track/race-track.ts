// src/modules/race-track/race-track.ts
import { prefersReducedMotion } from '../../utils/dom.ts';

/**
 * Race track step configuration.
 */
interface RaceStep {
  text: string;
  duration: number;
}

/**
 * DIY setup steps that show slow progress.
 */
const DIY_STEPS: RaceStep[] = [
  { text: 'Installing dependencies...', duration: 800 },
  { text: 'Configuring ESLint...', duration: 600 },
  { text: 'Setting up TypeScript...', duration: 700 },
  { text: 'Adding Prettier...', duration: 400 },
  { text: 'Configuring Jest...', duration: 600 },
  { text: 'Fixing type errors...', duration: 900 },
  { text: 'Setting up Stripe...', duration: 500 },
  { text: 'Still configuring...', duration: 800 },
];

/**
 * Total duration for DIY lane animation.
 */
const DIY_TOTAL_DURATION = DIY_STEPS.reduce((sum, step) => sum + step.duration, 0);

/**
 * Basalt instant completion time in ms.
 */
const BASALT_DURATION = 400;

/**
 * Initialize the race track performance visualizer.
 * Animates comparison between DIY setup and Basalt.
 * @returns Cleanup function
 */
export function initRaceTrack(): () => void {
  const raceTrack = document.querySelector<HTMLElement>('.race-track');
  if (!raceTrack) {
    return () => undefined;
  }

  const diyProgress = raceTrack.querySelector<HTMLElement>('.race-lane--diy .race-progress-fill');
  const diyStatus = raceTrack.querySelector<HTMLElement>('.race-lane--diy .race-status-text');
  const basaltProgress = raceTrack.querySelector<HTMLElement>('.race-lane--basalt .race-progress-fill');
  const basaltStatus = raceTrack.querySelector<HTMLElement>('.race-lane--basalt .race-status-text');
  const basaltTime = raceTrack.querySelector<HTMLElement>('.race-lane--basalt .race-time');

  if (!diyProgress || !diyStatus || !basaltProgress || !basaltStatus || !basaltTime) {
    return () => undefined;
  }

  let animationFrame: number | null = null;
  let timeouts: number[] = [];
  let isRunning = false;

  /**
   * Reset the race track to initial state.
   */
  const reset = (): void => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
    timeouts.forEach((t) => clearTimeout(t));
    timeouts = [];
    isRunning = false;

    diyProgress.style.width = '0%';
    diyStatus.textContent = 'Waiting...';
    diyStatus.classList.remove('race-status--done', 'race-status--error');

    basaltProgress.style.width = '0%';
    basaltStatus.textContent = 'Ready';
    basaltStatus.classList.remove('race-status--done');
    basaltTime.textContent = '';
    basaltTime.classList.remove('race-time--visible');
  };

  /**
   * Run the race animation.
   */
  const runRace = (): void => {
    if (isRunning) return;
    isRunning = true;

    const reducedMotion = prefersReducedMotion();

    // Basalt: instant completion
    if (reducedMotion) {
      basaltProgress.style.transition = 'none';
      basaltProgress.style.width = '100%';
      basaltStatus.textContent = 'Done!';
      basaltStatus.classList.add('race-status--done');
      basaltTime.textContent = `${BASALT_DURATION}ms`;
      basaltTime.classList.add('race-time--visible');
    } else {
      basaltProgress.style.transition = `width ${BASALT_DURATION}ms ease-out`;
      basaltProgress.style.width = '100%';

      const basaltDone = window.setTimeout(() => {
        basaltStatus.textContent = 'Done!';
        basaltStatus.classList.add('race-status--done');
        basaltTime.textContent = `${BASALT_DURATION}ms`;
        basaltTime.classList.add('race-time--visible');
      }, BASALT_DURATION);
      timeouts.push(basaltDone);
    }

    // DIY: slow step-by-step progress
    let elapsed = 0;
    let stepIndex = 0;

    const animateDiy = (): void => {
      if (stepIndex >= DIY_STEPS.length) {
        // Never actually finishes in the animation
        diyStatus.textContent = 'Still working...';
        diyStatus.classList.add('race-status--error');
        return;
      }

      const step = DIY_STEPS[stepIndex];
      diyStatus.textContent = step.text;

      const stepProgress = ((elapsed + step.duration) / DIY_TOTAL_DURATION) * 85; // Cap at 85%

      if (reducedMotion) {
        diyProgress.style.transition = 'none';
        diyProgress.style.width = `${Math.min(stepProgress, 85)}%`;
      } else {
        diyProgress.style.transition = `width ${step.duration}ms linear`;
        diyProgress.style.width = `${Math.min(stepProgress, 85)}%`;
      }

      elapsed += step.duration;
      stepIndex++;

      if (stepIndex < DIY_STEPS.length) {
        const nextTimeout = window.setTimeout(animateDiy, step.duration);
        timeouts.push(nextTimeout);
      } else {
        // Show "still working" after all steps
        const finalTimeout = window.setTimeout(() => {
          diyStatus.textContent = 'Still configuring...';
          diyStatus.classList.add('race-status--error');
        }, step.duration);
        timeouts.push(finalTimeout);
      }
    };

    animateDiy();
  };

  // Intersection observer to trigger animation when visible
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          reset();
          // Small delay before starting
          const startTimeout = window.setTimeout(runRace, 300);
          timeouts.push(startTimeout);
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(raceTrack);

  // Replay button
  const replayBtn = raceTrack.querySelector<HTMLButtonElement>('.race-replay');
  const handleReplay = (): void => {
    reset();
    const replayTimeout = window.setTimeout(runRace, 100);
    timeouts.push(replayTimeout);
  };

  replayBtn?.addEventListener('click', handleReplay);

  return () => {
    observer.disconnect();
    reset();
    replayBtn?.removeEventListener('click', handleReplay);
  };
}
