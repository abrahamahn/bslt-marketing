// src/modules/lightning-ide/lightning-ide.ts
import { prefersReducedMotion } from '../../utils/dom.ts';

/**
 * File that gets added to the IDE tree.
 */
interface IDEFile {
  name: string;
  type: 'file' | 'folder';
  delay: number;
}

/**
 * Files that appear after running the command.
 */
const NEW_FILES: IDEFile[] = [
  { name: 'stripe.ts', type: 'file', delay: 100 },
  { name: 'pricing-table.tsx', type: 'file', delay: 200 },
  { name: 'webhook-handler.ts', type: 'file', delay: 300 },
];

/**
 * Command to type out.
 */
const COMMAND = 'npx basalt add subscription';

/**
 * Typing speed in ms per character.
 */
const TYPE_SPEED = 40;

/**
 * Initialize the lightning IDE interactions.
 * Handles click to trigger typing animation and file tree population.
 * @returns Cleanup function
 */
export function initLightningIDE(): () => void {
  const ide = document.querySelector<HTMLElement>('.lightning-ide');
  if (!ide) {
    return () => undefined;
  }

  const addBtn = ide.querySelector<HTMLButtonElement>('.lightning-add-btn');
  const terminalInput = ide.querySelector<HTMLElement>('.lightning-terminal-input');
  const cursor = ide.querySelector<HTMLElement>('.lightning-cursor');
  const fileList = ide.querySelector<HTMLElement>('.lightning-files-new');
  const toast = ide.querySelector<HTMLElement>('.lightning-toast');

  if (!addBtn || !terminalInput || !fileList || !toast) {
    return () => undefined;
  }

  let timeouts: number[] = [];
  let isAnimating = false;

  /**
   * Reset the IDE to initial state.
   */
  const reset = (): void => {
    timeouts.forEach((t) => clearTimeout(t));
    timeouts = [];
    isAnimating = false;

    terminalInput.textContent = '';
    cursor?.classList.remove('lightning-cursor--hidden');
    fileList.innerHTML = '';
    toast.classList.remove('lightning-toast--visible');
    addBtn.disabled = false;
  };

  /**
   * Show toast notification.
   */
  const showToast = (): void => {
    toast.classList.add('lightning-toast--visible');

    const hideToast = window.setTimeout(() => {
      toast.classList.remove('lightning-toast--visible');
    }, 3000);
    timeouts.push(hideToast);
  };

  /**
   * Add files to the file tree.
   */
  const addFiles = (): void => {
    NEW_FILES.forEach((file) => {
      const addFile = window.setTimeout(() => {
        const fileEl = document.createElement('div');
        fileEl.className = 'lightning-file lightning-file--new';
        fileEl.innerHTML = `
          <svg class="lightning-file-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z"/>
          </svg>
          <span>${file.name}</span>
        `;
        fileList.appendChild(fileEl);

        // Trigger animation
        requestAnimationFrame(() => {
          fileEl.classList.add('lightning-file--visible');
        });
      }, file.delay);
      timeouts.push(addFile);
    });

    // Show toast after all files
    const toastDelay = window.setTimeout(showToast, NEW_FILES.length * 100 + 100);
    timeouts.push(toastDelay);

    // Re-enable button after animation
    const enableBtn = window.setTimeout(() => {
      isAnimating = false;
      addBtn.disabled = false;
    }, 2000);
    timeouts.push(enableBtn);
  };

  /**
   * Type out the command character by character.
   */
  const typeCommand = (): void => {
    const reducedMotion = prefersReducedMotion();

    if (reducedMotion) {
      // Skip animation
      terminalInput.textContent = COMMAND;
      cursor?.classList.add('lightning-cursor--hidden');
      addFiles();
      return;
    }

    let index = 0;
    const typeChar = (): void => {
      if (index < COMMAND.length) {
        terminalInput.textContent = COMMAND.slice(0, index + 1);
        index++;
        const nextChar = window.setTimeout(typeChar, TYPE_SPEED);
        timeouts.push(nextChar);
      } else {
        // Done typing, hide cursor and add files
        cursor?.classList.add('lightning-cursor--hidden');
        const startFiles = window.setTimeout(addFiles, 200);
        timeouts.push(startFiles);
      }
    };

    typeChar();
  };

  /**
   * Handle add button click.
   */
  const handleClick = (): void => {
    if (isAnimating) return;
    isAnimating = true;
    addBtn.disabled = true;

    // Reset first if there's existing content
    if (terminalInput.textContent) {
      reset();
      const startDelay = window.setTimeout(() => {
        isAnimating = true;
        addBtn.disabled = true;
        typeCommand();
      }, 100);
      timeouts.push(startDelay);
    } else {
      typeCommand();
    }
  };

  addBtn.addEventListener('click', handleClick);

  // Auto-trigger on scroll into view
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isAnimating && !terminalInput.textContent) {
          const autoStart = window.setTimeout(handleClick, 500);
          timeouts.push(autoStart);
          observer.disconnect();
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(ide);

  return () => {
    observer.disconnect();
    reset();
    addBtn.removeEventListener('click', handleClick);
  };
}
