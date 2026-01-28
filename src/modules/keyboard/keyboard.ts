// src/modules/keyboard/keyboard.ts
import { on } from '../../utils/dom.ts';

interface KeyboardShortcut {
  key: string;
  action: () => void;
  description: string;
}

const SHORTCUTS: KeyboardShortcut[] = [
  {
    key: 'g',
    action: () => window.open('https://github.com/basalt-dev/basalt', '_blank'),
    description: 'Open GitHub',
  },
  {
    key: 'd',
    action: () => window.open('https://docs.basalt.dev', '_blank'),
    description: 'Open Documentation',
  },
  {
    key: 'p',
    action: () => {
      const pricing = document.getElementById('pricing');
      pricing?.scrollIntoView({ behavior: 'smooth' });
    },
    description: 'Go to Pricing',
  },
];

/**
 * Initialize keyboard shortcuts for developer experience.
 * - G: Open GitHub
 * - D: Open Documentation
 * - P: Go to Pricing
 */
export function initKeyboardShortcuts(): () => void {
  function handleKeydown(event: KeyboardEvent): void {
    // Ignore if user is typing in an input
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return;
    }

    // Ignore if modifier keys are pressed (Cmd+K handled by command palette)
    if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
      return;
    }

    const shortcut = SHORTCUTS.find((s) => s.key === event.key.toLowerCase());
    if (shortcut) {
      event.preventDefault();
      shortcut.action();
    }
  }

  const cleanup = on(document as unknown as HTMLElement, 'keydown', handleKeydown);

  // Log available shortcuts in dev
  if (import.meta.env.DEV) {
    console.info(
      'Keyboard shortcuts:',
      SHORTCUTS.map((s) => `${s.key.toUpperCase()} - ${s.description}`).join(', ')
    );
  }

  return cleanup;
}
