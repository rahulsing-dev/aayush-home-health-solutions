/**
 * Services. To add a service: append an object here. It automatically appears in the
 * navigation, services page, home page, footer, enquiry form options, and gets its own
 * page at /services/<slug> (via src/pages/services/[slug].astro).
 *
 * All description text below is carried over from the previous website.
 */
import type { Service } from '../lib/types';

export const services: Service[] = [
  {
    slug: 'home-nursing',
    title: 'Home Nursing',
    icon: 'activity',
    summary:
      'Trained, empathetic nursing staff who give the best possible care to elderly persons and patients, in the comfort of your own home.',
    description: [
      'We at Aayush are committed to make sure that you, and your loved ones who need support and care due to certain health conditions, are never left to feel helpless.',
      'Our staff are adequately trained on nursing and the other necessary skills including soft skills. They give the best possible care to the elderly persons or the patients who need continued or fixed-period assistance in the comfort zone of your homes.',
      'We have a range of male and female staff, starting from freshly trained to those having many years of experience in hospitals and home nursing.',
    ],
    highlights: [
      'Care delivered at home, in a familiar and comfortable setting',
      'Continued or fixed-period assistance, based on your need',
      'Staff trained in nursing, other necessary skills and soft skills',
      'Male and female staff, from freshly trained to many years of hospital and home-nursing experience',
    ],
    image: {
      alt: 'A nurse assisting an elderly person at home',
      src: '/images/home-nursing.webp',
      ratio: '4 / 3',
      width: 1200,
      height: 900,
    },
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
