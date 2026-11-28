/**
 * Services. To add a service: append an object here. It automatically appears in the
 * navigation, services page, footer, enquiry form options, and gets its own page at
 * /services/<slug> (via src/pages/services/[slug].astro). Set `featured: true` to show it
 * in the home page "Our services" section.
 *
 * Sources: the service list is the owner's handwritten brief (Nov 2026,
 * docs/design-references/type_of_services_available_at_aayush_ref.jpeg). Home Nursing text is
 * carried over from the previous website. Every other summary/description/highlight was written
 * for the redesign and awaits the owner's review (tracked in docs/CONTENT-AUDIT.md).
 */
import type { CareSituation, Service, ServiceCategory } from '../lib/types';

/** Groups on /services, in display order. */
export const serviceCategories: ServiceCategory[] = [
  {
    id: 'nursing-and-medical-care',
    title: 'Nursing & medical care',
    blurb: 'Skilled support at home, from everyday nursing to closer monitoring for serious conditions.',
    icon: 'activity',
    tone: 'blue',
  },
  {
    id: 'personal-and-elder-care',
    title: 'Personal & elder care',
    blurb: 'Day-to-day help and companionship that keeps loved ones safe, comfortable and cared for.',
    icon: 'heart',
    tone: 'teal',
  },
  {
    id: 'specialised-long-term-care',
    title: 'Specialised long-term care',
    blurb: 'Patient, compassionate care for serious illness and for people living with memory loss.',
    icon: 'hand-heart',
    tone: 'plum',
  },
  {
    id: 'recovery-and-mobility',
    title: 'Recovery & mobility',
    blurb: 'Support to regain strength, move safely and set up the home for recovery.',
    icon: 'person-standing',
    tone: 'sun',
  },
];

const noPhoto = (alt: string) => ({ alt, ratio: '4 / 3', width: 1200, height: 900 });

export const services: Service[] = [
  {
    slug: 'home-nursing',
    title: 'Home Nursing',
    icon: 'home-plus',
    category: 'nursing-and-medical-care',
    featured: true,
    summary:
      'Trained, empathetic nursing staff who give the best possible care to elderly persons and patients, in the comfort of your own home.',
    description: [
      'We at Aayush are committed to making sure that you, and your loved ones who need support and care because of a health condition, are never left to feel helpless.',
      'Our staff are trained in nursing and other necessary skills, including soft skills. They give the best possible care to elderly persons and patients who need continued or fixed-period assistance, in the comfort of your own home.',
      'We have a range of male and female staff, from the freshly trained to those with many years of experience in hospitals and home nursing.',
    ],
    highlights: [
      'Care delivered at home, in a familiar and comfortable setting',
      'Continued or fixed-period assistance, based on your need',
      'Staff trained in nursing, other necessary skills and soft skills',
      'Male and female staff, from freshly trained to many years of hospital and home-nursing experience',
    ],
    image: {
      alt: 'A nurse in teal scrubs sharing a notebook with a smiling elderly woman on a sofa at home',
      src: 'home-nursing.webp',
      ratio: '4 / 3',
      width: 1200,
      height: 900,
    },
  },
  {
    slug: 'trained-attendants',
    title: 'Trained Attendants',
    icon: 'user-check',
    category: 'personal-and-elder-care',
    featured: true,
    summary: 'Dependable attendants who help with daily routines, personal care and mobility, so your loved one is never alone.',
    description: [
      'A trained attendant supports the everyday needs of an elderly person or patient at home: getting up and about, bathing and grooming, meals, and keeping the day on track.',
      'Attendants are trained in the practical and soft skills this work needs, and are matched to your family’s routine. Care can be arranged for a fixed period or on a continuing basis.',
    ],
    highlights: [
      'Help with bathing, grooming, dressing and toileting',
      'Support with meals, walking and moving around the home',
      'Company and a watchful eye through the day',
      'Male and female attendants',
    ],
    image: { alt: 'A caregiver pushing an elderly woman in a wheelchair', src: 'carefully-selected-staff.webp', ratio: '4 / 3', width: 1200, height: 900 },
  },
  {
    slug: 'elder-care',
    title: 'Elder Care',
    icon: 'heart',
    category: 'personal-and-elder-care',
    featured: true,
    summary: 'Respectful, patient care that helps elderly parents stay comfortable, safe and independent in their own home.',
    description: [
      'Growing older at home should feel safe and dignified. Our elder care brings a trained caregiver into the home to help with daily living, keep an eye on wellbeing and give families peace of mind.',
      'We take time to understand your parent’s routine, preferences and health needs, and keep the family informed as care continues.',
    ],
    highlights: [
      'Support with daily living, at your parent’s own pace',
      'Reminders for medicines, meals and appointments',
      'Companionship and conversation',
      'Regular updates for the family',
    ],
    image: { alt: 'A nurse chatting warmly with an elderly couple in their living room', src: 'responsive-communication.webp', ratio: '4 / 3', width: 1200, height: 900 },
  },
  {
    slug: 'palliative-care',
    title: 'Palliative Care',
    icon: 'hand-heart',
    category: 'specialised-long-term-care',
    featured: true,
    summary: 'Gentle, compassionate care focused on comfort and dignity for people living with a serious or life-limiting illness.',
    description: [
      'Palliative care puts comfort first. Our staff help manage day-to-day symptoms and personal care as advised by the treating doctor, so your loved one can be cared for at home, surrounded by family.',
      'We also support the family: helping with routines, answering questions and being there through difficult days.',
    ],
    highlights: [
      'Comfort-focused personal and nursing care',
      'Care that follows the treating doctor’s advice',
      'Emotional support for the patient and family',
      'Continued or fixed-period care',
    ],
    image: noPhoto('A caregiver holding the hand of a patient at home'),
  },
  {
    slug: 'dementia-care',
    title: 'Dementia Care',
    icon: 'brain',
    category: 'specialised-long-term-care',
    summary: 'Calm, consistent support that keeps people living with dementia safe, settled and engaged at home.',
    description: [
      'Dementia can make everyday life confusing, for the person and for the family. A calm, familiar caregiver and a steady routine at home can make a real difference.',
      'Our staff help with daily activities, keep the home safe, and use patience and gentle communication to reduce distress.',
    ],
    highlights: [
      'A steady daily routine in familiar surroundings',
      'Help with personal care, meals and medicines',
      'Supervision to reduce the risk of falls and wandering',
      'Patient, reassuring communication',
    ],
    image: noPhoto('A caregiver sitting with an elderly person living with dementia'),
  },
  {
    slug: 'alzheimers-care',
    title: 'Alzheimer’s Care',
    icon: 'history',
    category: 'specialised-long-term-care',
    summary: 'Compassionate care for each stage of Alzheimer’s, helping your loved one feel secure and cared for at home.',
    description: [
      'Alzheimer’s affects memory, mood and independence over time, and care needs change with it. We work with the family to adjust support as those needs change.',
      'Our caregivers bring patience, structure and companionship, helping with daily living while protecting your loved one’s dignity.',
    ],
    highlights: [
      'Care that adapts as needs change',
      'Structured routines and gentle reminders',
      'Help with personal care and daily activities',
      'Support and updates for the family',
    ],
    image: noPhoto('A caregiver looking through a photo album with an elderly woman'),
  },
  {
    slug: 'diabetes-care',
    title: 'Diabetes Care',
    icon: 'droplet',
    category: 'nursing-and-medical-care',
    summary: 'Help managing diabetes day to day: sugar checks, medicines on time and healthy routines, as advised by the doctor.',
    description: [
      'Living with diabetes means keeping many small things on track every day. Our staff help with routine sugar checks, medicines and meals, following the plan set by the treating doctor.',
      'Regular care at home helps spot changes early, so they can be shared with the family and the doctor.',
    ],
    highlights: [
      'Routine blood sugar checks and records',
      'Medicines and insulin as prescribed',
      'Reminders for meals, activity and foot care',
      'Updates for the family and doctor',
    ],
    image: noPhoto('A nurse checking an elderly man’s blood sugar at home'),
  },
  {
    slug: 'vaccination',
    title: 'Vaccination',
    icon: 'syringe',
    category: 'nursing-and-medical-care',
    summary: 'Vaccinations given at home, as prescribed, so elderly persons, patients and little ones avoid a trip out.',
    description: [
      'Travelling to a clinic can be hard for elderly persons, patients with limited mobility, or a new mother with a baby. We can arrange for vaccinations to be given at home, as prescribed by your doctor.',
      'Please share the prescription and vaccination record when you get in touch so we can plan the visit.',
    ],
    highlights: [
      'Vaccination at home, as prescribed by your doctor',
      'Suitable for elderly persons, patients and children',
      'Saves a trip to the clinic',
    ],
    image: noPhoto('A nurse preparing a vaccination at home'),
  },
  {
    slug: 'mother-and-baby-care',
    title: 'Mother & Baby Care',
    icon: 'baby',
    category: 'personal-and-elder-care',
    featured: true,
    summary: 'Caring support for new mothers and newborns in the first weeks at home, so the family can rest and bond.',
    description: [
      'The first weeks with a newborn are precious and tiring. Our caregivers support the mother’s recovery and help with the baby’s daily care, so the family gets time to rest.',
      'Care can be arranged for the period you need, by day or for longer hours.',
    ],
    highlights: [
      'Support for the mother’s rest and recovery',
      'Help with bathing, feeding routines and baby care',
      'An extra pair of trusted hands at home',
    ],
    image: noPhoto('A caregiver helping a new mother with her baby'),
  },
  {
    slug: 'critical-care',
    title: 'Critical Care',
    icon: 'heart-pulse',
    category: 'nursing-and-medical-care',
    featured: true,
    summary: 'Close monitoring and skilled nursing at home for patients with serious conditions, following the treating doctor’s plan.',
    description: [
      'Some patients need closer attention than routine nursing, for example after a hospital stay or during a serious illness. Our staff provide focused monitoring and nursing care at home, following the treating doctor’s instructions.',
      'We will talk through the patient’s condition with you first, to make sure care at home is suitable and properly planned.',
    ],
    highlights: [
      'Regular monitoring of vital signs',
      'Nursing care as advised by the treating doctor',
      'Prompt updates to the family and doctor',
      'Planning with the family before care begins',
    ],
    image: noPhoto('A nurse monitoring a patient resting at home'),
  },
  {
    slug: 'physiotherapy',
    title: 'Physiotherapy',
    icon: 'person-standing',
    category: 'recovery-and-mobility',
    featured: true,
    summary: 'Physiotherapy at home to rebuild strength, mobility and confidence after illness, surgery or a fall.',
    description: [
      'Recovering movement is easier at home, where exercises fit around daily life. Physiotherapy sessions at home help rebuild strength, balance and confidence after illness, surgery, a fall, or with age-related stiffness.',
      'Sessions focus on goals that matter day to day, such as walking safely, climbing stairs or getting in and out of bed.',
    ],
    highlights: [
      'Sessions in the comfort of home',
      'Exercises for strength, balance and mobility',
      'Support after surgery, illness or a fall',
    ],
    image: { alt: 'A caregiver helping an elderly man rise from a sofa using a walking frame', src: 'home-hero.webp', ratio: '4 / 3', width: 1200, height: 900 },
  },
  {
    slug: 'doctors-counselling',
    title: 'Doctor’s Counselling',
    icon: 'stethoscope',
    category: 'nursing-and-medical-care',
    summary: 'Guidance from a doctor to help you understand a condition, the care plan and the next steps.',
    description: [
      'When a loved one is unwell, families often have many questions. Doctor’s counselling gives you time with a doctor to understand the condition, the care plan and what to expect.',
      'Please get in touch to discuss what you need and how the counselling can be arranged.',
    ],
    highlights: [
      'Time to ask questions and understand the condition',
      'Guidance on the care plan and next steps',
      'Support for both the patient and the family',
    ],
    image: noPhoto('A doctor talking with a patient and family member at home'),
  },
  {
    slug: 'medical-equipment',
    title: 'Medical Equipment',
    icon: 'bed',
    category: 'recovery-and-mobility',
    summary: 'Help getting the right medical equipment in place, so care at home is safe and comfortable.',
    description: [
      'The right equipment can make care at home safer and easier, for the patient and for the people caring for them.',
      'Tell us about your loved one’s needs and we will help you work out what is required and arrange it.',
    ],
    highlights: [
      'Guidance on what equipment is needed',
      'Help arranging it for your home',
      'Safer, more comfortable care at home',
    ],
    image: noPhoto('A wheelchair and hospital bed set up in a bedroom'),
  },
];

/** "Not sure where to start?" on /services. Suggestions only; slugs must exist in `services`. */
export const careSituations: CareSituation[] = [
  { title: 'Coming home after a hospital stay', icon: 'home-plus', text: 'Nursing, recovery and the right equipment for the first weeks back home.', services: ['home-nursing', 'physiotherapy', 'medical-equipment'] },
  { title: 'A parent who needs help every day', icon: 'heart', text: 'A trusted pair of hands for routines, meals, mobility and company.', services: ['trained-attendants', 'elder-care'] },
  { title: 'A loved one living with memory loss', icon: 'brain', text: 'Calm, consistent care that keeps them safe and settled at home.', services: ['dementia-care', 'alzheimers-care'] },
  { title: 'A serious or life-limiting illness', icon: 'hand-heart', text: 'Comfort, closer monitoring and support for the whole family.', services: ['palliative-care', 'critical-care', 'home-nursing'] },
  { title: 'A new mother and baby', icon: 'baby', text: 'Rest and recovery for mum, and caring help with the newborn.', services: ['mother-and-baby-care', 'vaccination'] },
  { title: 'Managing a long-term condition', icon: 'droplet', text: 'Day-to-day support and clear guidance on the care plan.', services: ['diabetes-care', 'doctors-counselling', 'home-nursing'] },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const getCategory = (id: string) => serviceCategories.find((c) => c.id === id);
export const servicesIn = (categoryId: string) => services.filter((s) => s.category === categoryId);
export const featuredServices = services.filter((s) => s.featured);
/** Path to the enquiry form with this service pre-selected. */
export const enquireHref = (slug: string) => `/contact?service=${slug}`;
