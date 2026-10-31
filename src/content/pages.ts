/**
 * Page content blocks that are shared or too structured for Markdown.
 * `verified: true`  -> carried over from the previous website.
 * `verified: false` -> draft wording written for this rebuild; needs the owner's confirmation.
 */
import type { IconName, ImageSlot } from '../lib/types';

export const hero = {
  eyebrow: 'Professional home nursing care',
  title: 'Your Home, Our Care',
  lead:
    'Serious illness, injury and old age are among the most challenging times in life. While the patient endures the pain and suffering, family members get overwhelmed with emotions and the urge to ensure the best possible care. Skilled and trustworthy home nursing staff helps you cope with the situation with the least amount of stress.',
  image: {
    alt: 'A caregiver supporting an elderly person at home',
    src:"/images/home-hero.webp",
    ratio: '5 / 4',
    width: 1250,
    height: 1000,
  } satisfies ImageSlot,
  verified: true,
};

/** Second hero message from the previous site's slider, now a standalone feature band. */
export const homeAwayFromHome = {
  title: 'A Home Away From Home',
  body:
    'It is true that there is no place like home. Especially for the elderly and the sick, having high levels of dependency. However, with true care and concern displayed by genuinely empathetic staff who are skilled and dependable, a home away from home is a possibility.',
  image: {
    alt: 'A caregiver helping an elderly man use a walker',
    src: '/images/home-away-from-home.webp',
    ratio: '3 / 2',
    width: 1200,
    height: 800,
  } satisfies ImageSlot,
  verified: true,
};

export const trustFacts: { icon: IconName; label: string; value: string }[] = [
  { icon: 'clock', label: 'Availability', value: 'Reachable 24/7' },
  { icon: 'shield-check', label: 'Our staff', value: 'Background verified' },
  { icon: 'map-pin', label: 'Based in', value: 'Bangalore' },
  { icon: 'award', label: 'Founded', value: 'February 2020' },
];

export const about = {
  story: [
    'Aayush Home Health Solutions is a Bangalore based Home Health Service agency, offering high quality Home Nursing services.',
    "The promoter\u2019s own experience, when his father became a cancer patient, saw the seeds of Aayush as he went through the agony of balancing one\u2019s career and the commitment to caring for aged and sick parents. He understood the criticality of genuine service at affordable cost, assurance of safety and punctuality in Home Health Services and they became ingrained into the Aayush ethos.",
    "Aayush ensures trained, trustworthy and empathetic staff, compassionate caring as well as one point solution for those in need. The promoter\u2019s background as an Indian armed forces employee has resulted in duty and commitment as well as client satisfaction assuming paramount importance at Aayush.",
  ],
  founder: {
    name: 'Santosh Kumar Singh',
    role: 'Founder & CEO',
    bio: [
      'Santosh Kumar Singh is the founder and Chief Executive Officer of Aayush Home Health Solutions. His never say die spirit, determination and kind hearted nature got further enhanced during his stint with the Indian Navy.',
      'Being an empathetic individual, it was only natural that he chose home health industry as his domain post his retirement from the services. He had a highly successful engagement as a senior manager with a leading home health solutions company, prior to launching Aayush.',
      'Santosh Kumar Singh launched Aayush Home Health Solutions in February 2020 in Bangalore.',
    ],
    image: {
      alt: 'Portrait of Santosh Kumar Singh, Founder & CEO',
      src: '/images/founder-portrait.png',
      ratio: '4 / 5',
      width: 800,
      height: 1000,
    } satisfies ImageSlot,
  },
  principles: [
    { icon: 'heart' as IconName, title: 'Compassionate caring', text: 'Trained, trustworthy and empathetic staff who treat every client like family.' },
    { icon: 'shield-check' as IconName, title: 'Safety and punctuality', text: 'Assurance of safety and punctuality sits at the centre of how we deliver home health services.' },
    { icon: 'user-check' as IconName, title: 'One point solution', text: 'A single partner for home nursing care for those in need.' },
  ],
};

export const whyAayush: { icon: IconName; title: string; text: string; image: ImageSlot }[] = [
  {
    icon: 'zap',
    title: 'Prompt response and efficient service',
    text: 'Assurance of punctuality is one of the founding values of Aayush, and our team is reachable 24/7.',
    image: { src: '/images/carefully-selected-staff.webp', alt: 'A caregiver walking with an elderly woman using a walker', ratio: '3 / 2', width: 900, height: 600 },
  },
  {
    icon: 'shield-check',
    title: 'Skilled, background verified and trustworthy staff',
    text: 'Our staff are trained in nursing, other necessary skills and soft skills, and background verified for your peace of mind.',
    image: { src: '/images/responsive-communication.webp', alt: 'A caregiver holding the hands of an elderly person', ratio: '3 / 2', width: 900, height: 600 },
  },
  {
    icon: 'award',
    title: 'Promoter background with Indian Armed Forces',
    text: 'Our founder\u2019s service background has made duty, commitment and client satisfaction paramount at Aayush.',
    image: { src: '/images/service-led-ethos.webp', alt: 'Placeholder representing the founder\u2019s service background', ratio: '3 / 2', width: 900, height: 600 },
  },
];

/** DRAFT — a typical care journey written for this rebuild. Confirm each step with the business. */
export const process = {
  verified: false,
  title: 'How it works',
  intro: 'Getting started is simple. Here is the typical path from your first call to care at home.',
  steps: [
    { title: 'Reach out', text: 'Call, email or send an enquiry through the form. We are reachable 24/7.' },
    { title: 'Share your needs', text: 'Tell us about the patient, the kind of support needed, the location and the expected duration.' },
    { title: 'Get matched with care', text: 'We discuss suitable options, including the right staff for the situation, before anything begins.' },
    { title: 'Care begins', text: 'Care starts at the agreed time, with our team available if anything needs to change.' },
  ],
};

/** Retained from the previous site. Contact the owners to confirm permission to keep publishing these. */
export const testimonials = [
  {
    quote:
      'We have been associated with Santosh and team for over 2 years now. They very well take care of my seventy five year old father who lives on his own. The experience has been brilliant from the first interaction. The staff is well trained to deal with old people, display compassion towards them and manage their needs and temperament. The best part is that there has never been a time when Santosh and team had said \u201cNo\u201d to our needs. They also have ensured a timely and appropriate replacement if the deployed staff had to leave unplanned due to some personal emergency. This has given me a lot of peace of mind. I would like to thank Santosh and all the boys who have helped us so far and who we are sure will continue to help us going forward.',
    author: 'Kanchana Seshadri',
  },
  {
    quote:
      'We found Santosh as a godsent gift to us when my father was diagnosed with Alzheimer\u2019s disease in the beginning of last year. He along with his team has been taking very good care of my father ever since we engaged them. It would\u2019ve been impossible for me and my wife to attend to my father without one of us forgoing our careers. That would\u2019ve had serious financial implications for us. Santosh\u2019s team gives truly compassionate care and that is such a big relief for my father and all of us in the family. May god bless him and his team of committed caregivers!',
    author: 'Pankaj Kumar',
  },
];

export const testimonialImage: ImageSlot = {
  src: '/images/home_healthcare_testimonial.webp',
  alt: 'A family photo shared with the testimonials',
  ratio: '3 / 4',
  width: 900,
  height: 1200,
};

export const career = {
  intro:
    'If you are a caring and compassionate individual aiming to make a mark in Home Healthcare sector, you are welcome to join our team. We ensure best in class training, competitive remuneration and professional service environment for our employees.',
  /** Add job objects here to list them on /career: { title, location, type, summary } */
  openings: [
    // {
    // title: 'Staff Nurse',
    // location: 'Bangalore',
    // type: 'Full-time',
    // summary:
    //   'We are looking for qualified and compassionate staff nurses to provide professional nursing care to patients at home. Candidates should have good clinical knowledge and patient-care skills.',
    // },
] as { title: string; location: string; type: string; summary: string }[],
};
