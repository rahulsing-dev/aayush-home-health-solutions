/**
 * Testimonials: the home page slider and /testimonials.
 *
 * Only the two reviews from the previous website are real. Entries with `sample: true` were
 * written to fill the design while real reviews are collected. No card shows a "sample" label,
 * so sample reviews are rendered ONLY on the local dev server and never in a build; they can
 * never be published as if they were genuine. Replace them with real, permitted reviews (and
 * delete `sample: true`) as they arrive; see docs/CONTENT-AUDIT.md.
 */
import type { ImageSlot, Testimonial } from '../lib/types';

/**
 * Shown on the home page. Turned on at the owner's request (Nov 2026). Written permission from
 * the two families to keep publishing their reviews is still open (roadmap decision D5).
 */
export const showTestimonialsOnHome = true;

/**
 * One placeholder image shared by every testimonial until real customer photos (with consent)
 * are supplied. It is an illustration, not a photo of the reviewer, so its alt text is empty
 * (decorative). When a real photo replaces it, give that entry its own `photo` with a real alt.
 * Testimonial photos are always shown square (cropped to fill, never stretched); upload square
 * images of at least 800 × 800 px with the face near the centre.
 */
export const testimonialPlaceholderPhoto: ImageSlot = {
  src: 'home_healthcare_testimonial.webp',
  alt: '',
  ratio: '1 / 1',
  width: 800,
  height: 800,
};

export const testimonials: Testimonial[] = [
  {
    id: 'kanchana-seshadri',
    highlight: 'There has never been a time when Santosh and team had said “No” to our needs.',
    quote:
      'We have been associated with Santosh and team for over 2 years now. They very well take care of my seventy five year old father who lives on his own. The experience has been brilliant from the first interaction. The staff is well trained to deal with old people, display compassion towards them and manage their needs and temperament. The best part is that there has never been a time when Santosh and team had said “No” to our needs. They also have ensured a timely and appropriate replacement if the deployed staff had to leave unplanned due to some personal emergency. This has given me a lot of peace of mind. I would like to thank Santosh and all the boys who have helped us so far and who we are sure will continue to help us going forward.',
    author: 'Kanchana Seshadri',
    relation: 'Client family',
    context: 'Elder care for over 2 years',
    photo: testimonialPlaceholderPhoto,
  },
  {
    id: 'sample-home-from-hospital',
    highlight: 'Coming home from hospital felt manageable, not frightening.',
    quote:
      'When my mother was discharged after a long hospital stay, we had no idea how we would cope at home. The Aayush team understood what she needed on the very first call, and the nurse who came was calm, patient and gentle with her. Within a few weeks Amma was moving around the house again, and we could finally breathe.',
    author: 'Meera R.',
    relation: 'Daughter of a client',
    context: 'Kalyan Nagar, Bangalore',
    photo: testimonialPlaceholderPhoto,
    sample: true,
  },
  {
    id: 'pankaj-kumar',
    highlight: 'Santosh’s team gives truly compassionate care.',
    quote:
      'We found Santosh as a godsent gift to us when my father was diagnosed with Alzheimer’s disease in the beginning of last year. He along with his team has been taking very good care of my father ever since we engaged them. It would’ve been impossible for me and my wife to attend to my father without one of us forgoing our careers. That would’ve had serious financial implications for us. Santosh’s team gives truly compassionate care and that is such a big relief for my father and all of us in the family. May god bless him and his team of committed caregivers!',
    author: 'Pankaj Kumar',
    relation: 'Client family',
    context: 'Care for a parent with Alzheimer’s',
    photo: testimonialPlaceholderPhoto,
  },
  {
    id: 'sample-through-the-night',
    highlight: 'Someone answered every time we called, even at 2 am.',
    quote:
      'My father needs help through the night, and that worried us more than anything. With Aayush we never felt alone. The attendant is attentive and respectful, and on the one night we had a concern, someone from the team picked up straight away and sorted it out. That kind of reliability is hard to find.',
    author: 'Arvind N.',
    relation: 'Son of a client',
    context: 'Hebbal, Bangalore',
    photo: testimonialPlaceholderPhoto,
    sample: true,
  },
  {
    id: 'sample-from-another-city',
    highlight: 'From another city, I finally stopped worrying about my parents.',
    quote:
      'Both my parents are in their eighties and live on their own in Bangalore while I work in Pune. Aayush found them a caregiver who treats them like family, and the team keeps me informed whenever something changes. My parents now look forward to the day, and I can focus on work knowing they are in good hands.',
    author: 'Farah S.',
    relation: 'Daughter of clients',
    context: 'Parents in Horamavu, Bangalore',
    photo: testimonialPlaceholderPhoto,
    sample: true,
  },
  {
    id: 'sample-the-right-match',
    highlight: 'They took the time to find the right person for our grandmother.',
    quote:
      'Our grandmother is particular about her routines and does not warm up to new people easily. Instead of sending whoever was free, the team asked us detailed questions and suggested a caregiver suited to her temperament. It has been months now, and she counts on that familiar, friendly face every morning.',
    author: 'Rohit and Sneha K.',
    relation: 'Grandchildren of a client',
    context: 'HSR Layout, Bangalore',
    photo: testimonialPlaceholderPhoto,
    sample: true,
  },
  {
    id: 'sample-respected-at-home',
    highlight: 'Our father feels respected, not just looked after.',
    quote:
      'Dad was a schoolteacher and is fiercely independent, so accepting help at home was hard for him. The caregiver from Aayush understood that, encouraged him to do what he could on his own and was always patient with him. He enjoys his evening walks again, and we know he is in safe, caring hands.',
    author: 'Lakshmi V.',
    relation: 'Daughter of a client',
    context: 'Malleshwaram, Bangalore',
    photo: testimonialPlaceholderPhoto,
    sample: true,
  },
];

/**
 * What the site renders (home slider and /testimonials). Sample reviews appear ONLY on the local
 * dev server (`npm run dev`) for design work; every build (preview, production) shows real
 * reviews only, so unlabelled placeholder reviews can never be published as genuine.
 */
export const visibleTestimonials = testimonials.filter((t) => !t.sample || import.meta.env.DEV);
