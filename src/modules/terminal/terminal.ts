// src/modules/terminal/terminal.ts
import { on, copyToClipboard, prefersReducedMotion } from '../../utils/dom.ts';

/** Command to type in the terminal */
const COMMAND = 'npx create-basalt-app my-saas';

/** Output lines to display after command execution */
const OUTPUT_LINES = [
  '  Creating Basalt project in ./my-saas...',
  '  Cloning monorepo structure...',
  '  Installing dependencies...',
  '  Setting up TypeScript configuration...',
  '  Configuring Fastify server...',
  '  Initializing PostgreSQL schema...',
  '  Setting up authentication...',
  '  Configuring Stripe webhooks...',
  '  Installing React + Vite frontend...',
  '  Running initial build...',
  '',
  '  <span class="terminal-success">Success!</span> Created my-saas at ./my-saas',
  '  <span class="terminal-muted">Done in 1.4s.</span>',
];

/** Typing speed in milliseconds per character */
const TYPING_SPEED = 50;

/** Delay between output lines in milliseconds */
const OUTPUT_LINE_DELAY = 80;

/** Delay before starting output after command is typed */
const OUTPUT_START_DELAY = 400;

/**
 * Terminal animation state.
 */
interface TerminalState {
  phase: 'idle' | 'typing' | 'executing' | 'complete';
  charIndex: number;
  lineIndex: number;
  animationId: number | null;
}

/**
 * Initialize the terminal hero animation.
 * Types out the create command and displays scrolling output.
 * @returns Cleanup function to stop animations and remove listeners
 * @complexity O(n) where n is command length + output lines
 */
export function initTerminal(): () => void {
  const terminalInput = document.querySelector<HTMLElement>('.terminal-input');
  const terminalOutput = document.querySelector<HTMLElement>('.terminal-output');
  const terminalCursor = document.querySelector<HTMLElement>('.terminal-cursor');
  const copyBtn = document.querySelector<HTMLButtonElement>('.copy-command');
  const commandText = document.querySelector<HTMLElement>('.command-text');

  if (!terminalInput || !terminalOutput) {
    return () => undefined;
  }

  // Capture references for closure safety
  const inputEl = terminalInput;
  const outputEl = terminalOutput;
  const cursorEl = terminalCursor;

  const state: TerminalState = {
    phase: 'idle',
    charIndex: 0,
    lineIndex: 0,
    animationId: null,
  };

  const cleanupFns: (() => void)[] = [];

  /**
   * Type a single character and schedule next.
   */
  function typeNextChar(): void {
    if (state.phase !== 'typing') return;

    if (state.charIndex < COMMAND.length) {
      inputEl.textContent = COMMAND.slice(0, state.charIndex + 1);
      state.charIndex++;
      state.animationId = window.setTimeout(typeNextChar, TYPING_SPEED);
    } else {
      // Typing complete, start output
      state.phase = 'executing';
      if (cursorEl) {
        cursorEl.classList.add('terminal-cursor--hidden');
      }
      state.animationId = window.setTimeout(showNextLine, OUTPUT_START_DELAY);
    }
  }

  /**
   * Show the next output line.
   */
  function showNextLine(): void {
    if (state.phase !== 'executing') return;

    if (state.lineIndex < OUTPUT_LINES.length) {
      const line = document.createElement('div');
      line.className = 'terminal-line';
      line.innerHTML = OUTPUT_LINES[state.lineIndex];
      outputEl.appendChild(line);

      // Auto-scroll to bottom
      outputEl.scrollTop = outputEl.scrollHeight;

      state.lineIndex++;
      state.animationId = window.setTimeout(showNextLine, OUTPUT_LINE_DELAY);
    } else {
      state.phase = 'complete';
    }
  }

  /**
   * Start the terminal animation.
   */
  function startAnimation(): void {
    // Reset state
    state.phase = 'typing';
    state.charIndex = 0;
    state.lineIndex = 0;
    inputEl.textContent = '';
    outputEl.innerHTML = '';

    if (cursorEl) {
      cursorEl.classList.remove('terminal-cursor--hidden');
    }

    // If reduced motion, show final state immediately
    if (prefersReducedMotion()) {
      inputEl.textContent = COMMAND;
      OUTPUT_LINES.forEach((text) => {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = text;
        outputEl.appendChild(line);
      });
      state.phase = 'complete';
      if (cursorEl) {
        cursorEl.classList.add('terminal-cursor--hidden');
      }
      return;
    }

    typeNextChar();
  }

  /**
   * Handle copy button click.
   */
  async function handleCopy(): Promise<void> {
    if (!copyBtn || !commandText) return;

    try {
      await copyToClipboard('npx create-basalt-app');
      copyBtn.classList.add('copy-command--copied');
      copyBtn.setAttribute('aria-label', 'Copied!');

      // Reset after 2 seconds
      window.setTimeout(() => {
        copyBtn.classList.remove('copy-command--copied');
        copyBtn.setAttribute('aria-label', 'Copy command');
      }, 2000);
    } catch {
      // Fallback: select text if clipboard fails
      const range = document.createRange();
      range.selectNodeContents(commandText);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }

  // Set up copy button
  if (copyBtn) {
    cleanupFns.push(on(copyBtn, 'click', handleCopy));
  }

  // Start animation on page load
  // Small delay to ensure page is ready
  const startTimeout = window.setTimeout(startAnimation, 500);

  // Cleanup function
  return () => {
    if (state.animationId !== null) {
      window.clearTimeout(state.animationId);
    }
    window.clearTimeout(startTimeout);
    cleanupFns.forEach((fn) => fn());
  };
}
