/**
 * Page content blocks that are shared or too structured for Markdown.
 * Which statements are verified and which still need the owner's confirmation is tracked
 * in docs/CONTENT-AUDIT.md. Do not add claims here that are not listed there as verified.
 */
import type { GalleryItem, IconName, ImageSlot, Opening, Quote, WhyReason } from '../lib/types';
import { services } from './services';

/**
 * Home page hero. The headline is the previous site's verified hero message; `titleAccent` is the
 * part of it drawn in the brand gradient. The lead condenses verified facts (Home Nursing text,
 * site description); see docs/CONTENT-AUDIT.md.
 */
export const hero = {
  eyebrow: 'Home nursing care in Bangalore',
  title: 'Your Home, Our Care',
  titleAccent: 'Our Care',
  lead:
    'Skilled, trustworthy nursing staff who care for elderly persons and patients in the comfort of their own home, for a fixed period or for as long as you need.',
  image: {
    alt: 'A nurse in teal scrubs holding the hands of a smiling elderly woman as she rises from her wheelchair at home',
    src: 'nurse-helping-elderly-woman-rise-from-wheelchair.jpg',
    ratio: '4 / 3',
    width: 1024,
    height: 768,
    // The subjects sit in the right two-thirds of this wide photo; keep them in frame when cropped.
    position: '98% 50%',
  } satisfies ImageSlot,
};

/** Second hero message from the previous site's slider, now a standalone feature band. */
export const homeAwayFromHome = {
  title: 'A Home Away From Home',
  body:
    'It is true that there is no place like home, especially for the elderly and the sick, who often depend on others for their care. However, with true care and concern shown by genuinely empathetic staff who are skilled and dependable, a home away from home is possible.',
  image: {
    alt: 'A caregiver in blue scrubs pushing an elderly man in a wheelchair along a tree-lined path at sunset',
    src: 'home-away-from-home.webp',
    ratio: '3 / 2',
    width: 1200,
    height: 800,
  } satisfies ImageSlot,
};

export const trustFacts: { icon: IconName; label: string; value: string }[] = [
  { icon: 'clock', label: 'Availability', value: 'Reachable 24/7' },
  { icon: 'shield-check', label: 'Our staff', value: 'Background verified' },
  { icon: 'map-pin', label: 'Based in', value: 'Bangalore' },
  { icon: 'award', label: 'Founded', value: 'February 2020' },
];

/**
 * The team's own photos (src/assets/gallery/). Each one appears once on /about: the header uses
 * `headerPhoto` (the sharpest portrait) and the gallery uses the rest (a unit test checks that nothing repeats).
 */
const headerPhoto: ImageSlot = {
  src: 'caregiver-with-elderly-woman-in-saree.jpg',
  alt: 'An elderly woman in a silk saree with her arm around a smiling young caregiver at home',
  ratio: '4 / 5',
  width: 600,
  height: 750,
  position: '50% 30%',
};

const gardenPhoto: ImageSlot = {
  src: 'caregiver-with-elderly-man-in-garden.jpg',
  alt: 'A caregiver and an elderly gentleman smiling together in a sunny garden',
  ratio: '3 / 4',
  width: 960,
  height: 1280,
  position: '50% 35%',
};

/**
 * About text from the previous website, lightly copy-edited on 28 Nov 2026 (capitalisation, articles,
 * "promoter" \u2192 "founder" to match the rest of the site); the meaning is unchanged (docs/CONTENT-AUDIT.md).
 */
export const about = {
  story: [
    'Aayush Home Health Solutions is a Bangalore-based home health service agency offering high-quality home nursing services.',
    "Our founder\u2019s own experience, when his father became a cancer patient, sowed the seeds of Aayush as he went through the agony of balancing a career with the commitment to caring for aged and sick parents. He understood how critical genuine service at an affordable cost, assurance of safety and punctuality are in home health services, and they became ingrained in the Aayush ethos.",
    "Aayush ensures trained, trustworthy and empathetic staff, compassionate caring and a one point solution for those in need. Our founder\u2019s background in the Indian Armed Forces has made duty, commitment and client satisfaction paramount at Aayush.",
  ],
  founder: {
    name: 'Santosh Kumar Singh',
    role: 'Founder & CEO',
    bio: [
      'Santosh Kumar Singh is the founder and Chief Executive Officer of Aayush Home Health Solutions. His never-say-die spirit, determination and kind-hearted nature grew even stronger during his years with the Indian Navy.',
      'Being an empathetic individual, it was only natural that he chose the home health industry as his domain after retiring from the services. Before launching Aayush, he had a highly successful engagement as a senior manager with a leading home health solutions company.',
      'Santosh Kumar Singh launched Aayush Home Health Solutions in February 2020 in Bangalore.',
    ],
    image: {
      alt: 'Portrait of Santosh Kumar Singh, Founder & CEO',
      src: 'founder-portrait.jpeg',
      ratio: '4 / 5',
      width: 800,
      height: 1000,
      position: '50% 40%',
    } satisfies ImageSlot,
    /** Service background, shown as a badge beside the portrait. */
    badge: 'Indian Navy veteran',
    /**
     * "A Message from Our Founder" (home page) and the pull quote on /about. Written on 28 Nov 2026
     * in the founder's voice from the verified About text only; the founder to approve the wording
     * (logged in docs/CONTENT-AUDIT.md).
     */
    quote: 'I know what it is to worry about a parent while trying to hold everything else together. Aayush exists so that no family has to carry that alone.',
    message: [
      'When my father was diagnosed with cancer, I found myself doing what so many sons and daughters do: trying to keep up with my career while making sure he was cared for properly. It showed me how much families need help they can genuinely rely on.',
      'Good care at home comes down to a few simple things: people who are trained and kind, who arrive on time, who keep your loved one safe, and care that does not cost more than a family can bear. Those lessons became the foundation of Aayush.',
      'My years in the Indian Navy taught me duty and commitment, and we bring the same spirit into every home. When you welcome us in, we never forget that we are looking after someone’s mother, father or grandparent, with the dignity they deserve.',
    ],
  },
  /** /about page header. */
  headline: 'Home care that begins with family',
  headerImage: headerPhoto,
  /** Shown as a band on /about. Taittiriya Upanishad 1.11.2. */
  heritageQuote: {
    text: 'Matru devo bhava. Pitru devo bhava.',
    lang: 'sa-Latn',
    translation: 'Honour your mother as God. Honour your father as God.',
    author: 'Taittiriya Upanishad',
  } satisfies Quote,
  /**
   * /about "Moments of care" gallery, in display order. Photos are the team's own (src/assets/gallery/,
   * originals in docs/media-originals/). `size` sets the tile shape; the order below fills a 4-column
   * grid with no gaps (2 columns on phones and tablets), so re-check the layout if you reorder.
   */
  gallery: [
    {
      kind: 'photo', size: 'feature', caption: 'Company and conversation at home',
      image: { src: 'caregiver-with-elderly-man-in-living-room.jpg', alt: 'A caregiver kneeling beside a smiling elderly man on a sofa in his living room, with fresh flowers in the foreground', ratio: '4 / 3', width: 1280, height: 960, position: '50% 45%' },
    },
    {
      kind: 'photo', size: 'tall', caption: 'Gentle, patient attention',
      image: gardenPhoto,
    },
    {
      kind: 'video', size: 'tall', caption: 'Guided exercise to rebuild strength',
      video: { src: 'assisted-arm-exercise-session.mp4', poster: 'assisted-arm-exercise-session-poster.jpg', label: 'A caregiver guides a man in a wheelchair through arm-strengthening exercises with an overhead pulley', ratio: '3 / 4' },
    },
    {
      kind: 'photo', size: 'wide', caption: 'Shared smiles',
      image: { src: 'caregiver-and-elderly-man-sharing-a-smile.jpg', alt: 'A smiling young caregiver with his arm around an elderly man in a red shirt, who is grinning', ratio: '2 / 1', width: 1310, height: 600, position: '50% 30%' },
    },
    {
      kind: 'quote', size: 'small',
      quote: { text: 'Wrinkles should merely indicate where smiles have been.', author: 'Mark Twain', source: 'Following the Equator' },
    },
    {
      kind: 'photo', size: 'small', caption: 'Respect for every elder',
      image: { src: 'caregiver-with-elderly-woman-at-home.jpg', alt: 'A young caregiver resting her head beside a very elderly woman, both looking at the camera', ratio: '1 / 1', width: 960, height: 1280, position: '50% 45%' },
    },
    {
      kind: 'photo', size: 'wide', caption: 'Days out, not just days in',
      image: { src: 'elderly-man-in-wheelchair-on-festival-outing.jpg', alt: 'An elderly man in a wheelchair at a festival with two companions standing beside him', ratio: '4 / 3', width: 1600, height: 1200, position: '50% 40%' },
    },
    {
      kind: 'photo', size: 'wide', caption: 'Part of the family',
      image: { src: 'caregivers-with-elderly-couple-at-home.jpg', alt: 'Three smiling caregivers with an elderly couple at home, the gentleman waving at the camera', ratio: '5 / 3', width: 1260, height: 758, position: '50% 40%' },
    },
    {
      kind: 'quote', size: 'banner',
      quote: { text: 'There are only four kinds of people in the world: those who have been caregivers, those who are currently caregivers, those who will be caregivers, and those who will need caregivers.', author: 'Rosalynn Carter' },
    },
  ] satisfies GalleryItem[] as GalleryItem[],
  principles: [
    { icon: 'heart' as IconName, title: 'Compassionate caring', text: 'Trained, trustworthy and empathetic staff who treat every client like family.' },
    { icon: 'shield-check' as IconName, title: 'Safety and punctuality', text: 'Assurance of safety and punctuality sits at the centre of how we deliver home health services.' },
    { icon: 'user-check' as IconName, title: 'One point solution', text: 'A single partner for home nursing care for those in need.' },
  ],
};

/**
 * /why-aayush and the home page "Why Aayush" section. Built from verified facts only: the previous
 * site's three Why Aayush points (prompt response and punctuality, skilled and background verified
 * staff, the founder's armed forces background), the About and Home Nursing text, "reachable 24/7",
 * and verbatim excerpts of the two real reviews. Wording written for the redesign is logged in
 * docs/CONTENT-AUDIT.md. `featured: true` picks the four cards on the home page.
 */
export const whyAayush = {
  headline: 'Prompt, compassionate care your family can rely on',
  intro:
    'Genuine service, assurance of safety and punctuality, and caring, trustworthy staff have been the foundation of Aayush since the day we began.',
  homeIntro:
    'Prompt response, trained and caring staff, and one team to call for the care your loved one needs at home.',
  headerImage: {
    src: 'caregiver-with-elderly-man-in-living-room.jpg',
    alt: 'A caregiver kneeling beside a smiling elderly man in a living room',
    ratio: '4 / 5',
    width: 960,
    height: 1200,
    // Landscape photo cropped to portrait: keep the caregiver and the gentleman centred.
    position: '56% 50%',
  } satisfies ImageSlot,
  reasons: [
    {
      icon: 'zap', tone: 'blue', featured: true,
      title: 'Prompt and responsive',
      text: 'Punctuality has been a founding value of Aayush from day one, and our team is reachable 24/7 by phone, WhatsApp and email.',
      proof: 'Reachable 24/7',
    },
    {
      icon: 'graduation-cap', tone: 'teal', featured: true,
      title: 'Trained, compassionate staff',
      text: 'Our staff are trained in nursing and other necessary skills, including soft skills, so care is skilled as well as kind.',
      proof: 'Nursing & soft skills',
    },
    {
      icon: 'user-check', tone: 'plum', featured: true,
      title: 'Care planned around the person',
      text: 'We start with the patient: the support they need, where they live and for how long. Care can be ongoing or for a fixed period, with male or female staff.',
      proof: 'Ongoing or fixed-period',
    },
    {
      icon: 'users', tone: 'sun',
      title: 'Reliable support for families',
      text: 'A one point solution for those in need: a single team to talk to, from the first call to day-to-day care, so your family is never left to feel helpless.',
      proof: 'One point of contact',
    },
    {
      icon: 'shield-check', tone: 'teal', featured: true,
      title: 'Safety, professionalism and dignity',
      text: 'Background verified staff, assurance of safety, and care that respects the dignity of every elder and patient we look after.',
      proof: 'Background verified staff',
    },
    {
      icon: 'home-plus', tone: 'blue',
      title: 'Healthcare in the comfort of home',
      text: `${services.length} home health services, from trained attendants and elder care to nursing and physiotherapy, in the comfort and familiarity of your own home.`,
      proof: `${services.length} services at home`,
    },
  ] satisfies WhyReason[] as WhyReason[],
  /** Founder card on /why-aayush: the previous site's "Promoter background" point. */
  founderNote: 'Our founder’s service background with the Indian Armed Forces has made duty, commitment and client satisfaction paramount at Aayush.',
  /** "Timely help" band on /why-aayush. */
  promptCare: {
    eyebrow: 'Our commitment',
    title: 'Timely help, from the very first call',
    text: 'When someone you love needs care, waiting is the hardest part. That is why punctuality sits at the heart of how Aayush works.',
    points: [
      { icon: 'clock' as IconName, title: 'Reachable 24/7', text: 'Call, WhatsApp or email us at any hour, and talk to someone who can help.' },
      { icon: 'calendar' as IconName, title: 'On time, every time', text: 'Assurance of punctuality is one of the founding values of Aayush.' },
      { icon: 'users' as IconName, title: 'Care that continues', text: 'If a caregiver has to step away unexpectedly, we work to arrange a timely replacement.' },
    ],
  },
  /**
   * Verbatim excerpts of real reviews (testimonials.ts, never `sample`), shown on /why-aayush.
   * A unit test checks that each excerpt appears word for word in the review it names.
   */
  familyWords: [
    { testimonial: 'kanchana-seshadri', excerpt: 'They also have ensured a timely and appropriate replacement if the deployed staff had to leave unplanned due to some personal emergency. This has given me a lot of peace of mind.' },
    { testimonial: 'pankaj-kumar', excerpt: 'Santosh\u2019s team gives truly compassionate care and that is such a big relief for my father and all of us in the family.' },
  ],
};

/** /services "The Aayush standard". Every point restates verified facts (Home Nursing text, Why Aayush, FAQs). */
export const servicePromise = {
  eyebrow: 'The Aayush standard',
  title: 'Whichever service you choose, the same care',
  intro: 'Skilled and trustworthy staff, compassionate caring, and one point solution for those in need.',
  points: [
    { icon: 'graduation-cap' as IconName, title: 'Trained staff', text: 'Trained in nursing and other necessary skills, including soft skills.' },
    { icon: 'shield-check' as IconName, title: 'Background verified', text: 'Skilled, trustworthy staff, background verified for your peace of mind.' },
    { icon: 'users' as IconName, title: 'Male and female staff', text: 'From freshly trained to many years of hospital and home-nursing experience.' },
    { icon: 'calendar' as IconName, title: 'Continued or fixed-period', text: 'Care for as long as you need it, ongoing or for a set period.' },
    { icon: 'clock' as IconName, title: 'Safety and punctuality', text: 'Founding values that sit at the centre of how we deliver care.' },
    { icon: 'heart' as IconName, title: 'Care that feels like home', text: 'Care in the comfort and familiarity of your own home.' },
  ],
  image: {
    src: 'home-away-from-home.webp',
    alt: 'A caregiver pushing an elderly person in a wheelchair along a path at sunset',
    ratio: '4 / 5',
    width: 800,
    height: 1000,
  } satisfies ImageSlot,
};

/**
 * A typical care journey written for this rebuild (confirmation pending, see docs/CONTENT-AUDIT.md).
 * Shown as "How it works" and as the steps of the FAQ "How do I arrange care?".
 */
export const process = {
  eyebrow: 'Getting started',
  title: 'How it works',
  intro: 'Getting started is simple. Here is the typical path from your first call to care at home.',
  steps: [
    { title: 'Reach out', text: 'Call, WhatsApp or email us, or send an enquiry through the contact form. We are reachable 24/7.' },
    { title: 'Share your needs', text: 'Tell us about the patient, the kind of support needed, the location and the expected duration.' },
    { title: 'Get matched with care', text: 'We discuss suitable options, including the right staff for the situation, before anything begins.' },
    { title: 'Care begins', text: 'Care starts at the agreed time, with our team available if anything needs to change.' },
  ],
};

/**
 * Careers. The intro and the three benefits are from the previous website. The Nursing Aid
 * opening is from the owner's handwritten brief (docs/design-references/carrier_opportunities_content_ref.jpeg,
 * Oct 2026). The first opening is featured on /career and announced on the home page; with no
 * openings both fall back to a general "join our team" message.
 */
export const career = {
  intro:
    'If you are a caring and compassionate individual aiming to make a mark in the home healthcare sector, you are welcome to join our team. We ensure best-in-class training, competitive remuneration and a professional service environment for our employees.',
  openings: [
    {
      id: 'nursing-aid',
      title: 'Nursing Aid',
      location: 'Bangalore',
      summary: 'We are looking for young men and women to work as Nursing Aids in Bangalore, caring for elderly persons and patients in their own homes.',
      requirements: [
        { icon: 'graduation-cap', label: 'Qualification', value: '10th, 12th, ANM, GNM or B.Sc. Nursing', note: 'Nursing students can also apply' },
        { icon: 'languages', label: 'Language', value: 'English or Hindi', note: 'Compulsory' },
        { icon: 'user-check', label: 'Age', value: '18 years and above' },
        { icon: 'map-pin', label: 'Location', value: 'Bangalore', note: 'Open to men and women' },
      ],
      /** Shown as the role's highlight. */
      studyWhileWorking: 'Interested candidates can also study Nursing while working.',
      lookingFor: [
        'You are a caring and compassionate person',
        'You have passed 10th or 12th, hold an ANM, GNM or B.Sc. Nursing qualification, or are a nursing student',
        'You can speak English or Hindi',
        'You are 18 years or older',
        'You want to build a career in home healthcare in Bangalore',
      ],
    },
  ] satisfies Opening[] as Opening[],
  benefits: [
    { icon: 'award', title: 'Best-in-class training', text: 'We invest in training so you can give the best possible care.' },
    { icon: 'book-open', title: 'Study Nursing while working', text: 'Keep earning while you study for a Nursing qualification and grow your career in healthcare.' },
    { icon: 'briefcase', title: 'Competitive remuneration', text: 'Fair and competitive pay for the important work you do.' },
    { icon: 'heart', title: 'Professional service environment', text: 'Join a team that values compassion, duty and commitment.' },
    { icon: 'home', title: 'Work that matters', text: 'Help elderly persons and patients receive dependable care in the comfort of their own homes.' },
    { icon: 'shield-check', title: 'Built on duty and commitment', text: 'Our founder’s Indian Navy background shapes how we work: duty, commitment and respect for every client.' },
  ] satisfies { icon: IconName; title: string; text: string }[] as { icon: IconName; title: string; text: string }[],
  /** The application steps after first contact were written for this page (confirmation pending, see docs/CONTENT-AUDIT.md). */
  applySteps: [
    { title: 'Send us your details', text: 'WhatsApp, call or email us with your name, age, qualification, the languages you speak and your area in Bangalore.' },
    { title: 'Talk to our team', text: 'We will get in touch to tell you more about the role and answer your questions.' },
    { title: 'Training, then care', text: 'Begin with our training, then start supporting clients and their families at home.' },
  ],
  image: {
    src: 'responsive-communication.webp',
    alt: 'A smiling nurse taking notes while chatting with an elderly couple in their living room',
    ratio: '4 / 3',
    width: 1200,
    height: 900,
  } satisfies ImageSlot,
  fitImage: {
    src: 'home-nursing.webp',
    alt: 'A nurse in teal scrubs sharing a notebook with a smiling elderly woman holding a cup of tea',
    ratio: '1 / 1',
    width: 1000,
    height: 1000,
  } satisfies ImageSlot,
};

/** Pre-filled WhatsApp message for applying to a role. */
export const applyMessage = (role?: string) =>
  role
    ? `Hello Aayush Home Health, I would like to apply for the ${role} position.`
    : 'Hello Aayush Home Health, I would like to know about working with your team.';
