// src/modules/changelog/changelog.ts
import { on } from '../../utils/dom.ts';

/**
 * Changelog entry data.
 */
interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

/** Changelog data (inline for static site) */
const CHANGELOG: ChangelogEntry[] = [
  {
    version: '1.0.0',
    date: '2026-01-15',
    changes: [
      'Initial release of BSLT Engine',
      'Full monorepo setup with Turborepo',
      'React + Vite frontend with TanStack Query',
      'Fastify API with session-based auth',
      'Stripe subscription webhooks',
      'PostgreSQL with Drizzle ORM',
    ],
  },
  {
    version: '0.9.0',
    date: '2026-01-01',
    changes: [
      'Beta release for early adopters',
      'Core authentication flow',
      'Basic Stripe integration',
      'Initial documentation',
    ],
  },
];

/** Modal element reference */
let modalEl: HTMLElement | null = null;

/** Previously focused element */
let previouslyFocused: HTMLElement | null = null;

/** Cleanup functions */
const cleanupFns: (() => void)[] = [];

/**
 * Create the changelog modal HTML.
 * @returns The modal element
 */
function createModal(): HTMLElement {
  const modal = document.createElement('div');
  modal.id = 'changelog-modal';
  modal.className = 'changelog-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Changelog');

  const entriesHtml = CHANGELOG.map(
    (entry) => `
    <div class="changelog-entry">
      <div class="changelog-entry-header">
        <span class="changelog-version">v${entry.version}</span>
        <span class="changelog-date">${formatDate(entry.date)}</span>
      </div>
      <ul class="changelog-changes">
        ${entry.changes.map((change) => `<li>${change}</li>`).join('')}
      </ul>
    </div>
  `
  ).join('');

  modal.innerHTML = `
    <div class="changelog-backdrop" aria-hidden="true"></div>
    <div class="changelog-content">
      <div class="changelog-header">
        <h2 class="changelog-title">What's New</h2>
        <button class="changelog-close" type="button" aria-label="Close changelog">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <div class="changelog-body">
        ${entriesHtml}
      </div>
    </div>
  `;

  return modal;
}

/**
 * Format date string for display.
 * @param dateStr - ISO date string
 * @returns Formatted date
 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Open the changelog modal.
 */
function openChangelog(): void {
  if (modalEl) return;

  previouslyFocused = document.activeElement as HTMLElement | null;

  modalEl = createModal();
  document.body.appendChild(modalEl);

  const backdrop = modalEl.querySelector<HTMLElement>('.changelog-backdrop');
  const closeBtn = modalEl.querySelector<HTMLButtonElement>('.changelog-close');

  requestAnimationFrame(() => {
    modalEl?.classList.add('changelog-modal--open');
    closeBtn?.focus();
  });

  if (backdrop) {
    cleanupFns.push(on(backdrop, 'click', closeChangelog));
  }

  if (closeBtn) {
    cleanupFns.push(on(closeBtn, 'click', closeChangelog));
  }

  cleanupFns.push(
    on(document as unknown as HTMLElement, 'keydown', handleKeydown)
  );
}

/**
 * Close the changelog modal.
 */
function closeChangelog(): void {
  if (!modalEl) return;

  modalEl.classList.remove('changelog-modal--open');

  const modal = modalEl;
  window.setTimeout(() => {
    modal.remove();
  }, 150);

  modalEl = null;

  cleanupFns.forEach((fn) => fn());
  cleanupFns.length = 0;

  previouslyFocused?.focus();
  previouslyFocused = null;
}

/**
 * Handle keyboard events.
 */
function handleKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape') {
    e.preventDefault();
    closeChangelog();
  }
}

/**
 * Initialize the changelog widget.
 * Attaches click handler to version badge in navbar.
 * @returns Cleanup function
 */
export function initChangelog(): () => void {
  const versionBadge = document.querySelector<HTMLElement>('.version-badge');

  if (!versionBadge) {
    return () => undefined;
  }

  // Make badge interactive
  versionBadge.setAttribute('role', 'button');
  versionBadge.setAttribute('tabindex', '0');
  versionBadge.setAttribute('aria-label', 'View changelog');
  versionBadge.style.cursor = 'pointer';

  const handleClick = (): void => openChangelog();
  const handleKeypress = (e: KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openChangelog();
    }
  };

  const clickCleanup = on(versionBadge, 'click', handleClick);
  const keypressCleanup = on(versionBadge, 'keydown', handleKeypress);

  return () => {
    clickCleanup();
    keypressCleanup();
    closeChangelog();
  };
}
