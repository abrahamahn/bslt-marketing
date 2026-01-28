// src/modules/integrations-grid/integrations-grid.ts

/**
 * Integration item configuration.
 */
interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
}

/**
 * All supported integrations.
 */
const INTEGRATIONS: Integration[] = [
  // Payment
  { id: 'stripe', name: 'Stripe', category: 'Payment', description: 'Webhooks, Checkout Sessions, Customer Portal' },
  { id: 'lemonsqueezy', name: 'LemonSqueezy', category: 'Payment', description: 'Merchant of record, global tax compliance' },
  // Auth
  { id: 'google', name: 'Google', category: 'Auth', description: 'OAuth 2.0 social login, one-click sign in' },
  { id: 'github', name: 'GitHub', category: 'Auth', description: 'Developer-focused OAuth authentication' },
  { id: 'magic', name: 'Magic Links', category: 'Auth', description: 'Passwordless email authentication' },
  { id: 'mfa', name: 'MFA', category: 'Auth', description: 'TOTP-based two-factor authentication' },
  // Ops
  { id: 'docker', name: 'Docker', category: 'Ops', description: 'Multi-stage builds, 80MB production images' },
  { id: 'railway', name: 'Railway', category: 'Ops', description: 'One-click deploy, automatic scaling' },
  { id: 'vercel', name: 'Vercel', category: 'Ops', description: 'Edge deployment, serverless functions' },
  { id: 'aws', name: 'AWS S3', category: 'Ops', description: 'File uploads, presigned URLs, CDN ready' },
  // Data
  { id: 'postgresql', name: 'PostgreSQL', category: 'Data', description: 'Production database with Drizzle ORM' },
  { id: 'redis', name: 'Redis', category: 'Data', description: 'Session storage, caching, rate limiting' },
  // Tools
  { id: 'posthog', name: 'PostHog', category: 'Tools', description: 'Product analytics, feature flags, A/B tests' },
  { id: 'sentry', name: 'Sentry', category: 'Tools', description: 'Error tracking, performance monitoring' },
  { id: 'resend', name: 'Resend', category: 'Tools', description: 'Transactional emails, React email templates' },
];

/**
 * Initialize the integrations grid interactions.
 * Handles hover effects and description updates.
 * @returns Cleanup function
 */
export function initIntegrationsGrid(): () => void {
  const grid = document.querySelector<HTMLElement>('.integrations-grid');
  const description = document.querySelector<HTMLElement>('.integrations-description');

  if (!grid || !description) {
    return () => undefined;
  }

  const items = grid.querySelectorAll<HTMLElement>('.integration-item');
  const defaultText = description.dataset.default ?? 'Hover over an integration to learn more';

  /**
   * Handle mouse enter on integration item.
   * @param e - Mouse event
   */
  const handleMouseEnter = (e: Event): void => {
    const target = e.currentTarget as HTMLElement;
    const id = target.dataset.integration;
    const integration = INTEGRATIONS.find((i) => i.id === id);

    if (integration) {
      description.innerHTML = `<strong>${integration.name}</strong>: ${integration.description}`;
      description.classList.add('integrations-description--active');
    }
  };

  /**
   * Handle mouse leave on integration item.
   */
  const handleMouseLeave = (): void => {
    description.textContent = defaultText;
    description.classList.remove('integrations-description--active');
  };

  items.forEach((item) => {
    item.addEventListener('mouseenter', handleMouseEnter);
    item.addEventListener('mouseleave', handleMouseLeave);
  });

  return () => {
    items.forEach((item) => {
      item.removeEventListener('mouseenter', handleMouseEnter);
      item.removeEventListener('mouseleave', handleMouseLeave);
    });
  };
}
