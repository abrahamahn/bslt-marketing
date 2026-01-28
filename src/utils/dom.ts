// src/utils/dom.ts

/**
 * Type-safe querySelector wrapper.
 * @param selector - CSS selector string
 * @param parent - Parent element to search within (defaults to document)
 * @returns The element or null if not found
 */
export function $(selector: string, parent: ParentNode = document): Element | null {
  return parent.querySelector(selector);
}

/**
 * Type-safe querySelector wrapper that throws if element not found.
 * Use when the element is required for the module to function.
 * @param selector - CSS selector string
 * @param parent - Parent element to search within (defaults to document)
 * @throws Error if element not found
 */
export function $required<T extends Element = Element>(
  selector: string,
  parent: ParentNode = document
): T {
  const element = parent.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Required element not found: ${selector}`);
  }
  return element;
}

/**
 * Type-safe querySelectorAll wrapper.
 * @param selector - CSS selector string
 * @param parent - Parent element to search within (defaults to document)
 * @returns NodeList of matching elements
 */
export function $$(selector: string, parent: ParentNode = document): NodeListOf<Element> {
  return parent.querySelectorAll(selector);
}

/**
 * Add event listener with automatic cleanup support.
 * @param target - Element or window to attach listener to
 * @param event - Event name
 * @param handler - Event handler function
 * @param options - Event listener options
 * @returns Cleanup function to remove the listener
 */
export function on<K extends keyof HTMLElementEventMap>(
  target: HTMLElement | Window | Document,
  event: K,
  handler: (e: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions
): () => void {
  target.addEventListener(event, handler as EventListener, options);
  return () => target.removeEventListener(event, handler as EventListener, options);
}

/**
 * Check if user prefers reduced motion.
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Copy text to clipboard.
 * @param text - Text to copy
 * @returns Promise that resolves when copy is complete
 */
export async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}
