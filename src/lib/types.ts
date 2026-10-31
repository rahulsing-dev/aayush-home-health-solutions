/** Shared types. Keep this file small and dependency-free. */

export type IconName =
  | 'phone' | 'mail' | 'clock' | 'map-pin' | 'menu' | 'close' | 'chevron-down'
  | 'arrow-right' | 'check' | 'shield-check' | 'heart' | 'home' | 'calendar'
  | 'quote' | 'user-check' | 'award' | 'activity' | 'image'
  | 'briefcase' | 'zap' | 'info';

/**
 * An image slot. While `src` is empty the UI renders a labelled placeholder with the
 * right aspect ratio. To use a real image, drop the file into /public/images and set
 * `src: '/images/your-file.jpg'`. No component or layout changes are required.
 */
export interface ImageSlot {
  src?: string;
  alt: string;
  /** CSS aspect-ratio, e.g. "4 / 3". */
  ratio: string;
  /** Recommended pixel size for the final asset (used for the placeholder label & <img> attrs). */
  width: number;
  height: number;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface Service {
  slug: string;
  title: string;
  icon: IconName;
  summary: string;
  /** Long-form description paragraphs (verified content from the previous website). */
  description: string[];
  highlights: string[];
  image: ImageSlot;
}

export interface Office {
  id: string;
  name: string;
  addressLines: string[];
  contacts: { name?: string; phones: string[] }[];
}
