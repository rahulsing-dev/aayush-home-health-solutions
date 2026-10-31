/**
 * FAQs. `verified: true` answers are built only from facts on the previous website.
 * `verified: false` answers are placeholders and are visibly flagged until replaced.
 */
export interface Faq {
  q: string;
  a: string;
  verified: boolean;
}

export const faqs: Faq[] = [
  {
    q: 'What service does Aayush Home Health Solutions offer?',
    a: 'We provide Home Nursing: trained staff who care for elderly persons and patients in the comfort of their own homes.',
    verified: true,
  },
  {
    q: 'Where is Aayush based?',
    a: 'Aayush is a Bangalore based agency, and our office is in Bangalore. The address is on the Contact page. Please get in touch to confirm availability of care in your area.',
    verified: true,
  },
  {
    q: 'Can I arrange care for a fixed period?',
    a: 'Yes. Our home nursing staff give care to elderly persons and patients who need either continued or fixed-period assistance.',
    verified: true,
  },
  {
    q: 'Who are the people who will care for my loved one?',
    a: 'Our staff are trained in nursing and other necessary skills including soft skills, and are background verified. We have male and female staff, from freshly trained to those with many years of experience in hospitals and home nursing.',
    verified: true,
  },
  {
    q: 'How can I get in touch, and when?',
    a: 'We are reachable 24/7 by phone and email, and you can also send an enquiry or book a service through the contact form. Details are on the Contact page.',
    verified: true,
  },
  {
    q: 'How quickly can care start?',
    a: 'Care can usually begin within 24–48 hours after the initial enquiry, depending on the patient’s needs, caregiver availability and location. For urgent requirements, we do our best to arrange support as quickly as possible after assessing the situation.',
    verified: true,
  },
  {
    q: 'How are charges determined?',
    a: 'Our charges depend on the type of nursing care required, duration of service and level of assistance needed. We offer flexible arrangements based on daily, shift-based or monthly requirements. Our team discusses the care plan and provides a clear pricing estimate before services begin.',
    verified: true,
  },
];
