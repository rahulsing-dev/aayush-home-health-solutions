/**
 * Navigation. Service links are generated from content/services.ts, so adding a service
 * updates the menus automatically. Edit this file to add / reorder / rename pages.
 */
import type { NavItem } from '../lib/types';
import { services } from '../content/services';

export const mainNav: NavItem[] = [
  {
    label: 'Services',
    href: '/services',
    // A dropdown only makes sense with more than one service.
    children: services.length > 1 ? services.map((s) => ({ label: s.title, href: `/services/${s.slug}` })) : undefined,
  },
  { label: 'About Us', href: '/about' },
  { label: 'Why Aayush', href: '/why-aayush' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Career', href: '/career' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQs', href: '/faqs' },
];

export const headerCta = { label: 'Make an Enquiry', href: '/contact' };

export const footerLegal: NavItem[] = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Site Map', href: '/site-map' },
];
