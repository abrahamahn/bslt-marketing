// src/modules/command-palette/command-palette.ts
import { on, copyToClipboard } from '../../utils/dom.ts';

/**
 * Command option for the palette.
 */
interface CommandOption {
  id: string;
  label: string;
  shortcut?: string;
  action: () => void;
}

/** Available commands */
const COMMANDS: CommandOption[] = [
  {
    id: 'pricing',
    label: 'Go to Pricing',
    shortcut: 'P',
    action: () => {
      const el = document.getElementById('pricing');
      el?.scrollIntoView({ behavior: 'smooth' });
    },
  },
  {
    id: 'features',
    label: 'Go to Features',
    shortcut: 'F',
    action: () => {
      const el = document.getElementById('features');
      el?.scrollIntoView({ behavior: 'smooth' });
    },
  },
  {
    id: 'docs',
    label: 'Open Documentation',
    shortcut: 'D',
    action: () => window.open('https://docs.basalt.dev', '_blank'),
  },
  {
    id: 'github',
    label: 'Open GitHub',
    shortcut: 'G',
    action: () => window.open('https://github.com/basalt-dev/basalt', '_blank'),
  },
  {
    id: 'copy',
    label: 'Copy Install Command',
    action: async () => {
      await copyToClipboard('npx create-basalt-app');
    },
  },
];

/** Modal element ID */
const MODAL_ID = 'command-palette';

/** Currently active option index */
let activeIndex = 0;

/** Filtered commands based on search */
let filteredCommands: CommandOption[] = [...COMMANDS];

/** Reference to cleanup functions */
const cleanupFns: (() => void)[] = [];

/** Reference to the modal element */
let modalEl: HTMLElement | null = null;

/** Reference to the input element */
let inputEl: HTMLInputElement | null = null;

/** Reference to the results container */
let resultsEl: HTMLElement | null = null;

/** Previously focused element before modal opened */
let previouslyFocused: HTMLElement | null = null;

/**
 * Create the command palette modal HTML.
 * @returns The modal element
 */
function createModal(): HTMLElement {
  const modal = document.createElement('div');
  modal.id = MODAL_ID;
  modal.className = 'cmd-palette';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Command palette');
  modal.innerHTML = `
    <div class="cmd-palette-backdrop" aria-hidden="true"></div>
    <div class="cmd-palette-content">
      <div class="cmd-palette-search">
        <svg class="cmd-palette-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          type="text"
          class="cmd-palette-input"
          placeholder="Type a command..."
          aria-label="Search commands"
          autocomplete="off"
        />
        <kbd class="cmd-palette-esc">ESC</kbd>
      </div>
      <div class="cmd-palette-results" role="listbox" aria-label="Commands"></div>
    </div>
  `;
  return modal;
}

/**
 * Render the command results.
 */
function renderResults(): void {
  if (!resultsEl) return;

  if (filteredCommands.length === 0) {
    resultsEl.innerHTML = '<div class="cmd-palette-empty">No commands found</div>';
    return;
  }

  resultsEl.innerHTML = filteredCommands
    .map(
      (cmd, index) => `
      <button
        type="button"
        class="cmd-palette-option ${index === activeIndex ? 'cmd-palette-option--active' : ''}"
        role="option"
        aria-selected="${index === activeIndex}"
        data-index="${index}"
      >
        <span class="cmd-palette-option-label">${cmd.label}</span>
        ${cmd.shortcut ? `<kbd class="cmd-palette-option-shortcut">${cmd.shortcut}</kbd>` : ''}
      </button>
    `
    )
    .join('');
}

/**
 * Filter commands based on search query.
 * @param query - Search query
 * @complexity O(n) where n is number of commands
 */
function filterCommands(query: string): void {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    filteredCommands = [...COMMANDS];
  } else {
    filteredCommands = COMMANDS.filter((cmd) =>
      cmd.label.toLowerCase().includes(normalizedQuery)
    );
  }

  activeIndex = 0;
  renderResults();
}

/**
 * Execute the currently selected command.
 */
function executeSelected(): void {
  const cmd = filteredCommands[activeIndex];
  if (cmd) {
    closeCommandPalette();
    cmd.action();
  }
}

/**
 * Open the command palette.
 */
export function openCommandPalette(): void {
  if (modalEl) return; // Already open

  // Store currently focused element
  previouslyFocused = document.activeElement as HTMLElement | null;

  // Create and insert modal
  modalEl = createModal();
  document.body.appendChild(modalEl);

  // Get references
  inputEl = modalEl.querySelector<HTMLInputElement>('.cmd-palette-input');
  resultsEl = modalEl.querySelector<HTMLElement>('.cmd-palette-results');
  const backdrop = modalEl.querySelector<HTMLElement>('.cmd-palette-backdrop');

  // Reset state
  activeIndex = 0;
  filteredCommands = [...COMMANDS];
  renderResults();

  // Show modal with animation
  requestAnimationFrame(() => {
    modalEl?.classList.add('cmd-palette--open');
    inputEl?.focus();
  });

  // Handle input
  if (inputEl) {
    cleanupFns.push(
      on(inputEl, 'input', () => {
        filterCommands(inputEl?.value ?? '');
      })
    );
  }

  // Handle keyboard navigation
  cleanupFns.push(
    on(document as unknown as HTMLElement, 'keydown', handleKeydown)
  );

  // Handle backdrop click
  if (backdrop) {
    cleanupFns.push(on(backdrop, 'click', closeCommandPalette));
  }

  // Handle option clicks
  if (resultsEl) {
    cleanupFns.push(
      on(resultsEl, 'click', (e: Event) => {
        const target = e.target as HTMLElement;
        const option = target.closest<HTMLElement>('.cmd-palette-option');
        if (option) {
          const index = parseInt(option.dataset.index ?? '0', 10);
          activeIndex = index;
          executeSelected();
        }
      })
    );
  }
}

/**
 * Close the command palette.
 */
export function closeCommandPalette(): void {
  if (!modalEl) return;

  modalEl.classList.remove('cmd-palette--open');

  // Remove after animation
  const modal = modalEl;
  window.setTimeout(() => {
    modal.remove();
  }, 150);

  modalEl = null;
  inputEl = null;
  resultsEl = null;

  // Cleanup listeners
  cleanupFns.forEach((fn) => fn());
  cleanupFns.length = 0;

  // Restore focus
  previouslyFocused?.focus();
  previouslyFocused = null;
}

/**
 * Handle keyboard events in the palette.
 * @param e - Keyboard event
 */
function handleKeydown(e: KeyboardEvent): void {
  switch (e.key) {
    case 'Escape':
      e.preventDefault();
      closeCommandPalette();
      break;

    case 'ArrowDown':
      e.preventDefault();
      activeIndex = (activeIndex + 1) % filteredCommands.length;
      renderResults();
      break;

    case 'ArrowUp':
      e.preventDefault();
      activeIndex = (activeIndex - 1 + filteredCommands.length) % filteredCommands.length;
      renderResults();
      break;

    case 'Enter':
      e.preventDefault();
      executeSelected();
      break;

    case 'Tab':
      // Trap focus within modal
      e.preventDefault();
      break;
  }
}

/**
 * Initialize the command palette module.
 * Integrates with keyboard shortcuts to open on Cmd+K / Ctrl+K.
 * @returns Cleanup function
 */
export function initCommandPalette(): () => void {
  // Listen for Cmd+K / Ctrl+K
  function handleGlobalKeydown(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (modalEl) {
        closeCommandPalette();
      } else {
        openCommandPalette();
      }
    }
  }

  const cleanup = on(document as unknown as HTMLElement, 'keydown', handleGlobalKeydown);

  return () => {
    cleanup();
    closeCommandPalette();
  };
}
