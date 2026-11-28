/**
 * FAQs, grouped by topic on /faqs. Which answers are verified and which await the owner's review is
 * tracked in docs/CONTENT-AUDIT.md (nothing is flagged on the site). Every answer restates facts already
 * published elsewhere on the site (services.ts, pages.ts, site.ts); do not add policies, prices, payment
 * methods or guarantees here until the owner confirms them.
 * The service list in the first answer comes from the owner's brief (Nov 2026) via content/services.ts.
 */
import type { IconName, Tone } from '../lib/types';
import { slugify } from '../lib/format';
import { contact, site } from '../config/site';
import { about, process } from './pages';
import { services } from './services';

/** "A, B and C" from the service list, so the FAQ answer never drifts from content/services.ts. */
const listServices = () => {
  const names = services.map((s) => s.title);
  return names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names[0];
};

export interface FaqCategory {
  /** URL-safe id; the group's anchor on /faqs is `#<id>`. */
  id: string;
  title: string;
  blurb: string;
  icon: IconName;
  tone: Tone;
}

export interface Faq {
  q: string;
  a: string;
  /** Optional list shown under the answer (e.g. steps). */
  points?: string[];
  /** Internal links shown under the answer. */
  links?: { label: string; href: string }[];
  /** id of a FaqCategory (questions on /faqs only). */
  category?: string;
}

/** Anchor id of a question, e.g. /faqs#faq-how-quickly-can-care-start. */
export const faqId = (q: string) => `faq-${slugify(q)}`;

/** Topics on /faqs, in display order. */
export const faqCategories: FaqCategory[] = [
  { id: 'general', title: 'General information', blurb: 'Who we are, where we work and how to reach us.', icon: 'info', tone: 'blue' },
  { id: 'home-nursing', title: 'Home nursing & medical care', blurb: 'Our staff and the nursing support we provide at home.', icon: 'stethoscope', tone: 'teal' },
  { id: 'elderly-care', title: 'Elderly care', blurb: 'Day-to-day help and specialised care for older parents.', icon: 'heart', tone: 'plum' },
  { id: 'booking', title: 'Booking & scheduling', blurb: 'How to arrange care and how soon it can begin.', icon: 'calendar', tone: 'sun' },
  { id: 'pricing', title: 'Pricing', blurb: 'How charges are worked out and when you will know them.', icon: 'indian-rupee', tone: 'blue' },
  { id: 'family-support', title: 'Patient & family support', blurb: 'Support for the whole family while care continues.', icon: 'users', tone: 'teal' },
];

const phone = contact.phones[0].display;
const contactLink = { label: 'Contact us', href: '/contact' };

export const faqs: Faq[] = [
  // ---- General information ----
  {
    category: 'general',
    q: 'What services does Aayush Home Health Solutions offer?',
    a: `We provide these services in the comfort of your home: ${listServices()}. Each one is described on the Services page.`,
    links: [{ label: 'Explore all services', href: '/services' }],
  },
  {
    category: 'general',
    q: 'Where is Aayush based, and which areas do you cover?',
    a: 'Aayush is a Bangalore-based home health agency, and our office is in Horamavu, Bangalore. Care is provided in the patient’s own home. Please get in touch to confirm availability of care in your area.',
    links: [{ label: 'See our address', href: '/contact' }],
  },
  {
    category: 'general',
    q: 'Who started Aayush, and when?',
    a: `${site.name} was launched in Bangalore in ${site.foundedLabel} by ${about.founder.name}, our ${about.founder.role}. He served in the Indian Navy and later worked as a senior manager with a leading home health solutions company. The idea for Aayush grew from his own experience of balancing his career with caring for his father, who had cancer.`,
    links: [{ label: 'Read our story', href: '/about' }],
  },
  {
    category: 'general',
    q: 'How can I get in touch, and when?',
    a: `We are reachable 24/7. Call us on ${phone}, send a WhatsApp message to the same number, or email ${contact.email}. You can also send an enquiry or book a service through the contact form.`,
    links: [contactLink],
  },

  // ---- Home nursing & medical care ----
  {
    category: 'home-nursing',
    q: 'Who are the people who will care for my loved one?',
    a: 'Our staff are trained in nursing and other necessary skills including soft skills, and are background verified. We have male and female staff, from freshly trained to those with many years of experience in hospitals and home nursing.',
    links: [{ label: 'Why families choose Aayush', href: '/why-aayush' }],
  },
  {
    category: 'home-nursing',
    q: 'Are your staff background verified?',
    a: 'Yes. Our staff are background verified, so you can welcome them into your home with peace of mind.',
  },
  {
    category: 'home-nursing',
    q: 'Can we ask for a male or female caregiver?',
    a: 'We have both male and female staff. Tell us your preference when you share your requirements, and we will keep it in mind when planning care.',
  },
  {
    category: 'home-nursing',
    q: 'What is the difference between home nursing and a trained attendant?',
    a: 'A trained attendant helps with daily living: bathing, dressing, meals, moving around the home and company through the day. Home nursing is for elderly persons and patients who also need nursing care, given as advised by their doctor. If you are not sure which is right, describe the situation to us and we will help you choose.',
    links: [
      { label: 'Home Nursing', href: '/services/home-nursing' },
      { label: 'Trained Attendants', href: '/services/trained-attendants' },
    ],
  },
  {
    category: 'home-nursing',
    q: 'Can you help when a patient comes home from hospital?',
    a: 'Yes. Coming home after a hospital stay often calls for a mix of support: nursing care, physiotherapy to rebuild strength, and the right equipment at home. Care follows the advice of the treating doctor, so please keep the discharge summary handy when you talk to us.',
    links: [{ label: 'Read our hospital-to-home checklist', href: '/blog/bringing-a-parent-home-after-a-hospital-stay' }],
  },
  {
    category: 'home-nursing',
    q: 'Do you look after patients with serious illnesses at home?',
    a: 'Yes. Our palliative care focuses on comfort and dignity for people living with a serious or life-limiting illness. For patients who need closer attention, our critical care provides focused monitoring and nursing at home. Both follow the treating doctor’s advice, and we talk through the patient’s condition with you first to make sure care at home is suitable and properly planned.',
    links: [
      { label: 'Palliative Care', href: '/services/palliative-care' },
      { label: 'Critical Care', href: '/services/critical-care' },
    ],
  },
  {
    category: 'home-nursing',
    q: 'Can vaccinations be given at home?',
    a: 'Yes. We can arrange for vaccinations to be given at home, as prescribed by your doctor. Please share the prescription and vaccination record when you get in touch so we can plan the visit.',
    links: [{ label: 'Vaccination', href: '/services/vaccination' }],
  },

  // ---- Elderly care ----
  {
    category: 'elderly-care',
    q: 'What kind of help can an elderly parent get at home?',
    a: 'Depending on what your parent needs, a trained caregiver can help with bathing, dressing and personal care, meals, walking and moving around the home, and reminders for medicines, meals and appointments, along with company and conversation through the day.',
    links: [{ label: 'Elder Care', href: '/services/elder-care' }],
  },
  {
    category: 'elderly-care',
    q: 'Do you care for people living with dementia or Alzheimer’s?',
    a: 'Yes. Our dementia and Alzheimer’s care focuses on a calm, steady routine in familiar surroundings, help with personal care, meals and medicines, and supervision to reduce the risk of falls and wandering. As needs change over time, we work with the family to adjust the support.',
    links: [
      { label: 'Dementia Care', href: '/services/dementia-care' },
      { label: 'Alzheimer’s Care', href: '/services/alzheimers-care' },
    ],
  },
  {
    category: 'elderly-care',
    q: 'We don’t live with our parent. Will we know how they are doing?',
    a: 'Yes. Regular updates for the family are part of our elder care, so you know how your parent is doing even when you cannot be there yourself.',
  },

  // ---- Booking & scheduling ----
  {
    category: 'booking',
    q: 'How do I arrange care?',
    a: 'Getting started is simple:',
    // The same steps as "How it works", so the two never disagree.
    points: process.steps.map((s) => s.text),
    links: [{ label: 'Make an enquiry', href: '/contact' }],
  },
  {
    category: 'booking',
    q: 'How quickly can care start?',
    a: 'Care can usually begin within 24–48 hours after the initial enquiry, depending on the patient’s needs, caregiver availability and location. For urgent requirements, we do our best to arrange support as quickly as possible after assessing the situation.',
  },
  {
    category: 'booking',
    q: 'Can I arrange care for a fixed period?',
    a: 'Yes. Our home nursing staff give care to elderly persons and patients who need either continued or fixed-period assistance, so care can last for as long as you need it, or for a set period such as while someone recovers.',
  },
  {
    category: 'booking',
    q: 'What details should I have ready when I get in touch?',
    a: 'It helps to have the following to hand, but don’t worry if you don’t have everything yet:',
    points: [
      'The patient’s age and health condition, and the support they need',
      'Where care is needed (your area in Bangalore)',
      'When you would like care to start, and for how long',
      'Any preference for male or female staff',
      'The doctor’s prescription or hospital discharge summary, if there is one',
    ],
  },
  {
    category: 'booking',
    q: 'Can I book a service online?',
    a: 'Yes. On the contact page, choose “Book a service”, pick the service and your preferred start date, and leave your phone number. We will call you back to confirm the details. For anything urgent, calling or sending a WhatsApp message is the quickest way to reach us.',
    links: [{ label: 'Book a service', href: '/contact' }],
  },

  // ---- Pricing ----
  {
    category: 'pricing',
    q: 'How are charges determined?',
    a: 'Our charges depend on the type of nursing care required, duration of service and level of assistance needed. Because every family’s needs are different, the best way to get a figure is to tell us about the situation.',
  },
  {
    category: 'pricing',
    q: 'Will I know the cost before care begins?',
    a: 'Yes. Our team discusses the care plan with you and provides a clear pricing estimate before services begin.',
  },
  {
    category: 'pricing',
    q: 'Do you offer daily, shift-based or monthly arrangements?',
    a: 'Yes. We offer flexible arrangements based on daily, shift-based or monthly requirements. Tell us what you need and we will suggest an arrangement that fits.',
    links: [contactLink],
  },

  // ---- Patient & family support ----
  {
    category: 'family-support',
    q: 'What happens if our caregiver has to leave unexpectedly?',
    a: 'If a caregiver has to step away unexpectedly, we work to arrange a timely replacement, so your loved one’s care continues.',
  },
  {
    category: 'family-support',
    q: 'What if my loved one’s needs change?',
    a: 'Tell us. Needs often change, for example as someone recovers or as a condition progresses. Our team is reachable 24/7, and we will work with you to adjust the support.',
  },
  {
    category: 'family-support',
    q: 'Can someone help us understand a diagnosis or care plan?',
    a: 'Yes. Our doctor’s counselling gives you time with a doctor to ask questions and understand the condition, the care plan and what to expect next. Get in touch to discuss what you need and how the counselling can be arranged.',
    links: [{ label: 'Doctor’s Counselling', href: '/services/doctors-counselling' }],
  },
  {
    category: 'family-support',
    q: 'Can you help us arrange medical equipment for home?',
    a: 'Yes. Tell us about your loved one’s needs and we will help you work out what equipment is required and arrange it for your home.',
    links: [{ label: 'Medical Equipment', href: '/services/medical-equipment' }],
  },
  {
    category: 'family-support',
    q: 'Do you support new mothers and babies?',
    a: 'Yes. Our mother and baby care supports the mother’s rest and recovery and helps with the baby’s daily care in the first weeks at home. It can be arranged for the period you need, by day or for longer hours.',
    links: [{ label: 'Mother & Baby Care', href: '/services/mother-and-baby-care' }],
  },
];

export const faqsIn = (categoryId: string) => faqs.filter((f) => f.category === categoryId);

/** Questions shown on /career. From the owner's Nursing Aid brief (Oct 2026). */
export const careerFaqs: Faq[] = [
  {
    q: 'Can nursing students apply?',
    a: 'Yes. Along with candidates who have passed 10th or 12th, or hold an ANM, GNM or B.Sc. Nursing qualification, nursing students can also apply for the Nursing Aid role.',
  },
  {
    q: 'Can I study Nursing while working with Aayush?',
    a: 'Yes. Interested candidates can also study Nursing while working.',
  },
  {
    q: 'Which languages do I need to speak?',
    a: 'English or Hindi is compulsory. You need to be able to speak at least one of them.',
  },
  {
    q: 'Is the role open to both men and women?',
    a: 'Yes. We are looking for both young men and women aged 18 and above to work as Nursing Aids in Bangalore.',
  },
  {
    q: 'How do I apply?',
    a: 'Send us a WhatsApp message, call us, or email us with your name, age, qualification, the languages you speak and your area in Bangalore. Our team will get back to you.',
  },
];
