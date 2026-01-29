// src/modules/chat-animation/chat-animation.ts

/**
 * Chat animation module - typewriter for user, streaming for AI agent.
 */

/**
 * Sleep helper for async delays.
 * @param ms - Milliseconds to sleep
 */
const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Typewriter effect - types out text character by character.
 * @param element - The element to type into
 * @param text - The text to type
 * @param speed - Typing speed in ms per character
 */
async function typeWriter(element: HTMLElement, text: string, speed = 50): Promise<void> {
  element.textContent = '';
  element.classList.remove('typewriter--done');

  for (let i = 0; i < text.length; i++) {
    element.textContent += text[i];
    await sleep(speed);
  }

  element.classList.add('typewriter--done');
}

/**
 * Stream text effect - renders text like Claude.ai with character fade-in.
 * @param element - The element to stream into
 * @param text - The text to stream (supports **bold** markdown)
 * @param speed - Speed in ms per character
 */
async function streamText(element: HTMLElement, text: string, speed = 15): Promise<void> {
  element.innerHTML = '';
  element.classList.add('stream-text--visible');

  // Add cursor
  const cursor = document.createElement('span');
  cursor.className = 'stream-cursor';
  element.appendChild(cursor);

  // Parse markdown bold
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  for (const part of parts) {
    const isBold = part.startsWith('**') && part.endsWith('**');
    const content = isBold ? part.slice(2, -2) : part;

    for (let i = 0; i < content.length; i++) {
      const char = document.createElement('span');
      char.className = 'stream-char';
      char.textContent = content[i];

      if (isBold) {
        const strong = element.querySelector('strong:last-of-type') as HTMLElement | null;
        if (strong && strong.nextSibling === cursor) {
          strong.appendChild(char);
        } else {
          const newStrong = document.createElement('strong');
          newStrong.appendChild(char);
          element.insertBefore(newStrong, cursor);
        }
      } else {
        element.insertBefore(char, cursor);
      }

      await sleep(speed);
    }
  }

  // Remove cursor when done
  cursor.remove();
}

/**
 * Stream a line of text (for list items, status).
 * @param element - The element to stream into
 * @param text - The text to stream
 * @param speed - Speed in ms per character
 */
async function streamLine(element: HTMLElement, text: string, speed = 12): Promise<void> {
  element.innerHTML = '';
  element.classList.add('stream-line--visible');

  // Check if text contains code-like content
  const codeMatch = text.match(/^(\d+\.\s+(?:Update|Regenerate)\s+)(.+)$/);
  const statusMatch = text.match(/^(Context Loaded:\s+)(.+)$/);

  if (codeMatch) {
    // Number + action prefix
    const prefix = document.createTextNode(codeMatch[1]);
    element.appendChild(prefix);

    // Code part
    const code = document.createElement('code');
    element.appendChild(code);

    for (let i = 0; i < codeMatch[2].length; i++) {
      code.textContent += codeMatch[2][i];
      await sleep(speed);
    }
  } else if (statusMatch) {
    // Status prefix
    const prefix = document.createTextNode(statusMatch[1]);
    element.appendChild(prefix);

    // Code part
    const code = document.createElement('code');
    element.appendChild(code);

    for (let i = 0; i < statusMatch[2].length; i++) {
      code.textContent += statusMatch[2][i];
      await sleep(speed);
    }
  } else {
    // Plain text
    for (let i = 0; i < text.length; i++) {
      element.textContent += text[i];
      await sleep(speed);
    }
  }
}

/**
 * Run the full chat animation sequence.
 * @param container - The chat interface container
 */
async function runChatAnimation(container: HTMLElement): Promise<void> {
  const userMsg = container.querySelector<HTMLElement>('.chat-msg--user');
  const aiMsg = container.querySelector<HTMLElement>('.chat-msg--ai');

  if (!userMsg || !aiMsg) return;

  const userText = userMsg.querySelector<HTMLElement>('.typewriter');
  const aiText = aiMsg.querySelector<HTMLElement>('.stream-text');
  const aiLines = aiMsg.querySelectorAll<HTMLElement>('.stream-line');

  if (!userText || !aiText) return;

  const userTextContent = userText.dataset.text ?? '';
  const aiTextContent = aiText.dataset.text ?? '';

  // Reset state
  userMsg.classList.add('chat-msg--hidden');
  aiMsg.classList.add('chat-msg--hidden');
  userText.textContent = '';
  userText.classList.remove('typewriter--done');
  aiText.innerHTML = '';
  aiText.classList.remove('stream-text--visible');
  aiLines.forEach((line) => {
    line.innerHTML = '';
    line.classList.remove('stream-line--visible');
  });

  // Step 1: Show user message bubble
  await sleep(300);
  userMsg.classList.remove('chat-msg--hidden');

  // Step 2: Typewriter effect for user input
  await sleep(200);
  await typeWriter(userText, userTextContent, 45);

  // Step 3: Show AI message bubble
  await sleep(400);
  aiMsg.classList.remove('chat-msg--hidden');

  // Step 4: Stream AI response
  await sleep(200);
  await streamText(aiText, aiTextContent, 18);

  // Step 5: Stream each line
  for (const line of aiLines) {
    await sleep(100);
    const lineText = line.dataset.text ?? '';
    await streamLine(line, lineText, 14);
  }
}

/**
 * Initialize chat animation with intersection observer.
 * @returns Cleanup function
 */
export function initChatAnimation(): () => void {
  const chatInterface = document.querySelector<HTMLElement>('[data-chat-animation]');

  if (!chatInterface) {
    return () => undefined;
  }

  let hasRun = false;
  let animationPromise: Promise<void> | null = null;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasRun) {
          hasRun = true;
          animationPromise = runChatAnimation(chatInterface);
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(chatInterface);

  // Optional: Add replay functionality
  const replayHandler = async (): Promise<void> => {
    if (animationPromise) {
      await animationPromise;
    }
    hasRun = true;
    animationPromise = runChatAnimation(chatInterface);
  };

  chatInterface.addEventListener('click', replayHandler);

  return () => {
    observer.disconnect();
    chatInterface.removeEventListener('click', replayHandler);
  };
}
