export type UserRole = 'student_reporter' | 'editor' | 'school_admin' | 'super_admin' | 'public_reader';

export interface School {
  id: string;
  name: string;
  county: string;
  category: 'National' | 'Extra-County' | 'County';
  genderType: 'Boys' | 'Girls' | 'Co-Educational';
  logo: string;
  isVerified: boolean;
  principalName: string;
  principalQuote: string;
  certifiedPathways: ('STEM' | 'Social Sciences' | 'Arts & Sports Science')[];
  specialCombinationList: string[];
}

export interface Comment {
  id: string;
  authorName: string;
  authorRole: string;
  text: string;
  date: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  schoolId?: string; // If empty, it's a Ministry of Education national announcement
  schoolName: string; // e.g., "Ministry of Education" or "Alliance High School"
  schoolCategory?: string; // e.g., "National"
  authorName: string;
  authorRole: string;
  date: string;
  category: 'pathway' | 'sports' | 'academics' | 'scholarships' | 'clubs' | 'events' | 'general';
  isVerified: boolean;
  image?: string;
  likes: number;
  views: number;
  reactions: {
    applause: number;
    insightful: number;
    congratulations: number;
    cheers: number;
  };
  comments: Comment[];
  tags: string[];
}

export interface CBCPathway {
  id: 'STEM' | 'Social Sciences' | 'Arts & Sports Science';
  name: string;
  description: string;
  coreSubjects: string[];
  trackSpecializations: string[];
  careerProspects: string[];
  selectionCriteria: string;
  ministryQuote: string;
}

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  value: string;
  deadline: string;
  requirements: string[];
  link: string;
  category: 'Secondary' | 'University Transition' | 'STEM Specific';
}
