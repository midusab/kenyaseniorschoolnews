export type CBCCategoryValue = 'pathway' | 'sports' | 'academics' | 'scholarships' | 'clubs' | 'events' | 'general';

export interface Category {
  id: CBCCategoryValue;
  label: string;
  description: string;
}

export const APPROVED_CATEGORIES: Category[] = [
  {
    id: 'pathway',
    label: 'CBE Pathways',
    description: 'Updates regarding Grade 10 placement criteria, track combinations and core pathway definitions.'
  },
  {
    id: 'sports',
    label: 'Sports & Talents',
    description: 'Games, sports science research, physical therapy and national level KSSSA tournaments.'
  },
  {
    id: 'academics',
    label: 'Academics & Exams',
    description: 'Integrated assessments, testing frameworks, robotics labs and updated materials.'
  },
  {
    id: 'scholarships',
    label: 'Scholarships & Grants',
    description: 'Social-economic funding setups, EGF Wings to Fly, and Ministry level guidelines.'
  },
  {
    id: 'clubs',
    label: 'Clubs & Culture',
    description: 'Inter-school music contests, science congresses, drama clubs and local society meets.'
  },
  {
    id: 'events',
    label: 'Events & Galas',
    description: 'Announcements about parent galas, alumni networks, and county education events.'
  },
  {
    id: 'general',
    label: 'General Noticeboard',
    description: 'General bulletins and announcements containing administrative information.'
  }
];

export const isValidCategory = (categoryVal: string): boolean => {
  return APPROVED_CATEGORIES.some((c) => c.id === categoryVal);
};
