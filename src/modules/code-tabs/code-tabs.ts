// src/modules/code-tabs/code-tabs.ts
import { on, $$, copyToClipboard } from '../../utils/dom.ts';

/**
 * Initialize the code tabs module.
 * Handles tab switching and copy functionality for code examples.
 * @returns Cleanup function
 */
export function initCodeTabs(): () => void {
  const container = document.querySelector<HTMLElement>('.code-tabs');

  if (!container) {
    return () => undefined;
  }

  // Capture reference for closure safety
  const containerEl = container;
  const cleanupFns: (() => void)[] = [];

  const tabs = $$('.code-tab', containerEl);
  const panels = $$('.code-panel', containerEl);
  const copyBtns = $$('.code-copy', containerEl);

  /**
   * Switch to a specific tab.
   * @param tabId - ID of the tab to activate
   */
  function switchTab(tabId: string): void {
    // Update tab states
    tabs.forEach((tab) => {
      const isActive = (tab as HTMLElement).dataset.tab === tabId;
      tab.classList.toggle('code-tab--active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });

    // Update panel visibility
    panels.forEach((panel) => {
      const isActive = (panel as HTMLElement).dataset.panel === tabId;
      panel.classList.toggle('code-panel--active', isActive);
      (panel as HTMLElement).hidden = !isActive;
    });
  }

  /**
   * Handle tab click.
   */
  function handleTabClick(e: Event): void {
    const target = e.target as HTMLElement;
    const tab = target.closest<HTMLElement>('.code-tab');
    if (tab?.dataset.tab) {
      switchTab(tab.dataset.tab);
    }
  }

  /**
   * Handle copy button click.
   */
  async function handleCopy(e: Event): Promise<void> {
    const target = e.target as HTMLElement;
    const btn = target.closest<HTMLButtonElement>('.code-copy');
    if (!btn) return;

    const panelId = btn.dataset.panel;
    const panel = containerEl.querySelector<HTMLElement>(`[data-panel="${panelId}"]`);
    const codeEl = panel?.querySelector<HTMLElement>('code');

    if (!codeEl) return;

    // Get text content (strips HTML tags)
    const code = codeEl.textContent ?? '';

    try {
      await copyToClipboard(code);
      btn.classList.add('code-copy--copied');
      btn.setAttribute('aria-label', 'Copied!');

      window.setTimeout(() => {
        btn.classList.remove('code-copy--copied');
        btn.setAttribute('aria-label', 'Copy code');
      }, 2000);
    } catch {
      // Fallback: select text
      const range = document.createRange();
      range.selectNodeContents(codeEl);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }

  // Attach tab click handlers
  tabs.forEach((tab) => {
    cleanupFns.push(on(tab as HTMLElement, 'click', handleTabClick));
  });

  // Attach copy handlers
  copyBtns.forEach((btn) => {
    cleanupFns.push(on(btn as HTMLElement, 'click', handleCopy));
  });

  // Handle keyboard navigation
  function handleKeydown(e: KeyboardEvent): void {
    const target = e.target as HTMLElement;
    if (!target.classList.contains('code-tab')) return;

    const tabsArray = Array.from(tabs) as HTMLElement[];
    const currentIndex = tabsArray.indexOf(target);

    let nextIndex = -1;

    switch (e.key) {
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % tabsArray.length;
        break;
      case 'ArrowLeft':
        nextIndex = (currentIndex - 1 + tabsArray.length) % tabsArray.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = tabsArray.length - 1;
        break;
    }

    if (nextIndex >= 0) {
      e.preventDefault();
      const nextTab = tabsArray[nextIndex];
      nextTab.focus();
      if (nextTab.dataset.tab) {
        switchTab(nextTab.dataset.tab);
      }
    }
  }

  cleanupFns.push(on(containerEl, 'keydown', handleKeydown));

  return () => {
    cleanupFns.forEach((fn) => fn());
  };
}
