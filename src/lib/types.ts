/** Shared types. Keep this file small and dependency-free. */

export type IconName =
  | 'phone' | 'mail' | 'clock' | 'map-pin' | 'menu' | 'close' | 'chevron-down'
  | 'arrow-right' | 'check' | 'shield-check' | 'heart' | 'home' | 'calendar'
  | 'quote' | 'user-check' | 'award' | 'activity' | 'image'
  | 'briefcase' | 'zap' | 'info' | 'whatsapp'
  | 'graduation-cap' | 'languages' | 'book-open' | 'users'
  | 'home-plus' | 'stethoscope' | 'syringe' | 'baby' | 'brain' | 'droplet'
  | 'heart-pulse' | 'hand-heart' | 'bed' | 'person-standing' | 'history'
  | 'play' | 'pause' | 'search' | 'indian-rupee';

/**
 * An image slot. To use a photo, put the file in `src/assets/images/` and set `src` to its
 * file name, e.g. `src: 'home-hero.webp'`. At build time it is resized into small AVIF/WebP
 * versions for phones and larger ones for desktops. While `src` is empty, a labelled placeholder
 * with the right aspect ratio is shown instead. No component or layout changes are required.
 */
export interface ImageSlot {
  /** File name inside src/assets/images/ or src/assets/gallery/ (a missing file fails the build with a clear message). */
  src?: string;
  alt: string;
  /** CSS aspect-ratio of the frame, e.g. "4 / 3". The photo is cropped to fill it. */
  ratio: string;
  /** Which part of the photo to keep when it is cropped (CSS object-position), e.g. "50% 30%". Defaults to the centre. */
  position?: string;
  /** Recommended pixel size for a new asset (shown on the placeholder). */
  width: number;
  height: number;
}

/** A short, silent looping clip. Files live in src/assets/gallery/ and are referenced by file name. */
export interface VideoSlot {
  /** MP4 (H.264) file name; keep clips short, silent and small. */
  src: string;
  /** Still image shown before the clip loads (and instead of it for reduced-motion users). */
  poster: string;
  /** Describes what the clip shows, for people who cannot see it. */
  label: string;
  ratio: string;
}

/** A quotation. Only use real, correctly attributed quotes. */
export interface Quote {
  text: string;
  author: string;
  /** Work the quote comes from, shown in italics after the author. */
  source?: string;
  /** English rendering, shown under a quote that is not in English. */
  translation?: string;
  /** BCP 47 language of `text` when it is not English, e.g. "sa-Latn". */
  lang?: string;
}

/** Tile shape in the About page gallery: feature 2×2, tall 1×2, wide 2×1, small 1×1, banner full width. */
export type TileSize = 'feature' | 'tall' | 'wide' | 'small' | 'banner';

export type GalleryItem =
  | { kind: 'photo'; size: TileSize; image: ImageSlot; caption: string }
  | { kind: 'video'; size: TileSize; video: VideoSlot; caption: string }
  | { kind: 'quote'; size: TileSize; quote: Quote };

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

/** Colour family used to tell service groups apart (defined as `.tone-*` in global.css). */
export type Tone = 'blue' | 'teal' | 'plum' | 'sun';

/** A reason to choose Aayush (/why-aayush and the home page). */
export interface WhyReason {
  icon: IconName;
  tone: Tone;
  title: string;
  text: string;
  /** A short, verified fact shown as a chip on the card, e.g. "Reachable 24/7". */
  proof: string;
  /** Shown on the home page. */
  featured?: boolean;
}

export interface ServiceCategory {
  /** URL-safe id; the group's anchor on /services is `#<id>`. */
  id: string;
  title: string;
  blurb: string;
  icon: IconName;
  tone: Tone;
}

export interface Service {
  slug: string;
  title: string;
  icon: IconName;
  /** id of a ServiceCategory. */
  category: string;
  summary: string;
  /** Long-form description paragraphs. */
  description: string[];
  highlights: string[];
  /** Photo for the service page; leave `src` empty to show the service icon instead. */
  image: ImageSlot;
  /** Shown in the home page "Our services" section (the first featured service is the large card). */
  featured?: boolean;
}

/** "Not sure where to start?" suggestions on /services. */
export interface CareSituation {
  title: string;
  text: string;
  icon: IconName;
  /** Slugs of the services that can help. */
  services: string[];
}

export interface Office {
  id: string;
  name: string;
  /** Display lines; the last line is "City – PIN". */
  addressLines: string[];
  /** Structured parts used by search-engine structured data (must match the display lines). */
  locality: string;
  region: string;
  postalCode: string;
  contacts: { name?: string; phones: string[] }[];
}

export interface Testimonial {
  /** URL-safe id; the review's anchor on /testimonials is `#review-<id>`. */
  id: string;
  /** A short headline. For real reviews it must be a verbatim excerpt of `quote` (a unit test checks this). */
  highlight: string;
  quote: string;
  author: string;
  /** Relationship to the person cared for, e.g. "Client family". */
  relation: string;
  /** Optional detail shown after the relation, e.g. the kind of care or the locality. */
  context?: string;
  photo: ImageSlot;
  /**
   * true = sample text written to fill the design, NOT a real review. Sample reviews are shown
   * only on the local dev server and are left out of every build (see `visibleTestimonials`).
   */
  sample?: boolean;
}

/** A job opening on /career. */
export interface Opening {
  /** URL-safe id; the role's anchor on /career is `#role-<id>`. */
  id: string;
  title: string;
  location: string;
  summary: string;
  requirements: { icon: IconName; label: string; value: string; note?: string }[];
  studyWhileWorking?: string;
  /** "Is this role for you?" checklist. */
  lookingFor?: string[];
}
