import { School, NewsArticle, CBCPathway, Scholarship } from '../types';

export const MOCK_SCHOOLS: School[] = [
  {
    id: 'alliance',
    name: 'Alliance High School',
    county: 'Kiambu',
    category: 'National',
    genderType: 'Boys',
    logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    isVerified: true,
    principalName: 'Mr. David Mwangi',
    principalQuote: 'Embracing the Competency-Based Curriculum to build the next generation of global innovators, ethical leaders, and critical thinkers.',
    certifiedPathways: ['STEM', 'Social Sciences', 'Arts & Sports Science'],
    specialCombinationList: [
      'STEM Opt 1 (Pure Sciences, Physics, Computers)',
      'Humanities Elite (History, Kiswahili, Literature in English)',
      'Sports Tech (Physical Education, Computers, Biology)'
    ]
  },
  {
    id: 'kenyahigh',
    name: 'Kenya High School',
    county: 'Nairobi',
    category: 'National',
    genderType: 'Girls',
    logo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    isVerified: true,
    principalName: 'Mrs. Flora Mulatya',
    principalQuote: 'Empowering young women to excel across all Grade 10 pathways, with customized tracks in Sports, Creative Arts, and Engineering.',
    certifiedPathways: ['STEM', 'Social Sciences', 'Arts & Sports Science'],
    specialCombinationList: [
      'STEM Opt 2 (Chemistry, Biology, Home Science, French)',
      'Fine Arts & Music (Performing Arts, Music, Visual Arts)',
      'Global Legal (Foreign Languages, Geography, Business)'
    ]
  },
  {
    id: 'mangu',
    name: "Mang'u High School",
    county: 'Kiambu',
    category: 'National',
    genderType: 'Boys',
    logo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    isVerified: true,
    principalName: 'Rev. Fr. Peter Gichuki',
    principalQuote: 'Maintaining our legacy in Aviation Technology and Engineering under the new CBC STEM pathway structure.',
    certifiedPathways: ['STEM', 'Social Sciences'],
    specialCombinationList: [
      'STEM Aviation Core (Physics, Aviation Tech, Mathematics, Chemistry)',
      'Agribusiness Science (Biology, Agriculture, Business Studies, Chemistry)'
    ]
  },
  {
    id: 'kapsabet',
    name: 'Kapsabet Boys High School',
    county: 'Nandi',
    category: 'National',
    genderType: 'Boys',
    logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    isVerified: true,
    principalName: 'Mr. Kipchumba Maiyo',
    principalQuote: 'Driven by stellar academic discipline, we lead from the front with fully equipped Grade 10 STEM pathway modules.',
    certifiedPathways: ['STEM', 'Social Sciences'],
    specialCombinationList: [
      'STEM Data Science (Mathematics, Computers, Physics, Chemistry)',
      'Eco-Agriculture (Biology, Agriculture, Business Studies)'
    ]
  },
  {
    id: 'maseno',
    name: 'Maseno School',
    county: 'Kisumu',
    category: 'National',
    genderType: 'Boys',
    logo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    isVerified: true,
    principalName: 'Dr. Charles Owuor',
    principalQuote: 'Combining the energy of the lakeside with top academic rigor. Maseno remains a champion in both Social Sciences and Sports Science.',
    certifiedPathways: ['STEM', 'Social Sciences', 'Arts & Sports Science'],
    specialCombinationList: [
      'Performing Arts Elite (Drama, Music, French, Literature)',
      'Sports Medicine Foundation (Biology, PE, Physics, Business)'
    ]
  },
  {
    id: 'lugulu',
    name: 'Lugulu Girls High School',
    county: 'Bungoma',
    category: 'Extra-County',
    genderType: 'Girls',
    logo: 'https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    isVerified: true,
    principalName: 'Sister Teresa Namalwa',
    principalQuote: 'Inspiring young girls in Bungoma County to claim their space in modern robotics, design, and literary arts.',
    certifiedPathways: ['STEM', 'Social Sciences'],
    specialCombinationList: [
      'STEM Bio-Tech (Biology, Agriculture, Computers, Chemistry)',
      'Linguistic Specialty (Kiswahili, Literature, German, History)'
    ]
  }
];

export const MOCK_PATHWAYS: CBCPathway[] = [
  {
    id: 'STEM',
    name: 'Science, Technology, Engineering, & Mathematics (STEM)',
    description: 'This pathway targets students aiming for professions in medical sciences, mechanical and software engineering, space research, statistics, coding, and environmental conservation.',
    coreSubjects: ['Mathematics (Advanced)', 'English / Kiswahili', 'Physics', 'Chemistry', 'Biology / General Science'],
    trackSpecializations: ['Pure Sciences Track', 'Applied Sciences Track (Agritech, Home Science, Aviation)', 'Technical and Computer Science Track'],
    careerProspects: ['Medical Specialists', 'Cybersecurity Engineers', 'Agriculturalists', 'Architecture Experts', 'Aviation Experts', 'Data Scientists'],
    selectionCriteria: 'Recommended for Grade 9 students who obtain over 65% in Integrated Science and Mathematics, showing strong computational and analytics interests.',
    ministryQuote: 'STEM is the baseline engine of Kenyas Vision 2030 industrialization pillars.'
  },
  {
    id: 'Social Sciences',
    name: 'Social Sciences & Humanities',
    description: 'A pathway designed for the future legal minds, policy developers, international relations specialists, languages experts, business leaders, and economists.',
    coreSubjects: ['English / Kiswahili / Sign Language', 'History & Citizenship', 'Geography', 'Mathematics (Foundation)'],
    trackSpecializations: ['Languages & Literature Track (French, German, Arabic)', 'Humanities Track (Religious Studies, History)', 'Business & Economics Track'],
    careerProspects: ['Judges & Lawyers', 'Foreign Service Diplomats', 'Journalism & Media Managers', 'Economists', 'Public Policy Analysts'],
    selectionCriteria: 'Geared towards students displaying outstanding communication skills, debate mastery, and a high appreciation for societal structure and literary arts.',
    ministryQuote: 'Our communities require empathetic leadership and powerful communicators to thrive.'
  },
  {
    id: 'Arts & Sports Science',
    name: 'Arts & Sports Science',
    description: 'Bringing Kenyan sporting and cultural talents to the global economic stage. It covers fine arts, music, athletics, sports mechanics, drama, and digital content creation.',
    coreSubjects: ['Physical Education & Sports Anatomy', 'Visual & Creative Arts', 'Performing Arts (Music/Drama)', 'Mathematics (Foundation)'],
    trackSpecializations: ['Performing Arts Track (Drama, Theatre, Film)', 'Visual Arts Track (Fine Art, Graphic Designing, Craft)', 'Sports Science & Athletics Track'],
    careerProspects: ['Professional Athletes & Coaches', 'Film Directors', 'Graphic Design Pioneers', 'Music Composers', 'Sports Physiotherapists'],
    selectionCriteria: 'Tailored for students who demonstrate high-performance talent under national co-curricular festivals, or with highly creative design and athletic capabilities.',
    ministryQuote: 'Kenyas talent economy is a goldmine waiting to be fully formalized through structured senior school pathways.'
  }
];

export const MOCK_SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'wings2fly',
    title: 'Equity Group "Wings to Fly" Scholarship Program',
    provider: 'Equity Group Foundation & MasterCard',
    value: 'Full Tuition, textbooks, school uniforms, transport, and leadership mentoring for 4 Years of Senior School',
    deadline: 'December 15, 2026',
    requirements: [
      'Must have sat the Grade 9 assessment of current year',
      'Proof of socio-economic vulnerability / child heads of households',
      'Must achieve a minimum score of standard performance index in sub-county level tests',
      'Verified recommendation form from the local Sub-County Director of Education'
    ],
    link: 'https://egf.equitygroupholdings.com/wings-to-fly',
    category: 'Secondary'
  },
  {
    id: 'elimu',
    title: 'Ministry of Education "Elimu" Scholarship Program',
    provider: 'Government of Kenya (State Dept of Basic Education)',
    value: 'Covers full boarding fees, school kits, and personal hygiene supplies',
    deadline: 'January 10, 2027',
    requirements: [
      'Orphaned or exceptionally vulnerable background',
      'Residing in targeted informal urban settlements or arid/semi-arid counties',
      'Successfully matched and admitted to a Public Senior School under any CBC Pathway'
    ],
    link: 'https://www.education.go.ke/elimu-scholarships',
    category: 'Secondary'
  },
  {
    id: 'kcb-stem',
    title: 'KCB Foundation Sports & STEM Pathway Grants',
    provider: 'KCB Bank Kenya Foundation',
    value: 'KES 120,000 annually representing school fees support, plus technical toolkits (laptops/sports gears)',
    deadline: 'December 28, 2026',
    requirements: [
      'Enrolled in either a STEM or an Arts & Sports Science certified Senior School pathway',
      'Demonstrated excellence in national or regional school sports championships or science congresses'
    ],
    link: 'https://kcbgroup.com/foundation',
    category: 'STEM Specific'
  }
];

export const MOCK_ARTICLES: NewsArticle[] = [
  {
    id: 'art-1',
    title: 'Ministry of Education Finalizes Grade 10 Pathway Assignment Framework',
    content: `The Principal Secretary of the State Department for Basic Education has released the final guidelines for Grade 10 placement across the country. 

Under the new Competency-Based Education (CBE) architecture, senior secondary schools will strictly admit students based on their junior school assessment reports, individual career interests, and school specific pathway certification.

The Ministry has affirmed that over 65% of National and Extra-County schools are now fully certified to host the STEM pathway. Special structures like aviation labs, robotic workspaces, and high-performance coding zones have been set up in partnership with industry leaders. Parents and Grade 9 candidates are advised to verify that their prospective senior schools offer their preferred pathway options during the selection window which opens in mid-September.`,
    summary: 'The State Department of Education releases Grade 10 placement guidelines focusing on junior school assessment reports and pathway capabilities.',
    schoolName: 'Ministry of Education (MoE)',
    schoolCategory: 'National Panel',
    authorName: 'Dr. Belio Kipsang',
    authorRole: 'Principal Secretary',
    date: '2026-05-24',
    category: 'pathway',
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    likes: 342,
    views: 1890,
    reactions: { applause: 89, insightful: 124, congratulations: 45, cheers: 22 },
    comments: [
      {
        id: 'comm-1-1',
        authorName: 'Evelyne Ominde',
        authorRole: 'Parent',
        text: 'This is a welcome development. It helps parents understand how candidates will be placed. We need clarity on fees for tech subjects.',
        date: '2026-05-25'
      },
      {
        id: 'comm-1-2',
        authorName: 'Gabriel Wandera',
        authorRole: 'Teacher',
        text: 'As teachers, we are guiding Grade 9 students through interest inventory tests. The pathways will truly revolutionize Kenya.',
        date: '2026-05-25'
      }
    ],
    tags: ['MoE Guidelines', 'Grade 10', 'CBE placement']
  },
  {
    id: 'art-2',
    title: 'Alliance High School Commissions Next-Gen Robotics Lab for the STEM Pathway',
    content: `Alliance High School has officially opened its doors to a multimillion modern STEM Innovation and Robotics Lab, fully funded through a partnership with the Kenya Science Congress and the European Union.

The lab is designed to accommodate the new Grade 10 STEM cohort, featuring high-speed servers, microcontrollers, state-of-the-art 3D printers, and dynamic modeling tables. 

Speaking during the launch, the Chief Guest, Principal Secretary of ICT and Digital Economy, commended the school for being at the forefront of digital readiness, highlighting its alignment with the modern CBC demands. Grade 10 students specializing in Applied Sciences and Tech will use this facility to develop automated agricultural systems, climate trackers, and smart-weeding micro-robots.`,
    summary: 'Alliance High School launches a state-of-the-art robotics laboratory to power Grade 10 STEM students working on agritech prototypes.',
    schoolId: 'alliance',
    schoolName: 'Alliance High School',
    schoolCategory: 'National',
    authorName: 'Principal\'s Office',
    authorRole: 'Chief Administrator',
    date: '2026-05-22',
    category: 'academics',
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    likes: 512,
    views: 2470,
    reactions: { applause: 210, insightful: 145, congratulations: 98, cheers: 41 },
    comments: [
      {
        id: 'comm-2-1',
        authorName: 'Steve Nthenge',
        authorRole: 'Alumnus',
        text: 'Proud of our Alma Mater! This is how we produce global movers. Back in our day, we only had basics, now the boys have automated robot platforms.',
        date: '2026-05-23'
      }
    ],
    tags: ['Robotics', 'Alliance High', 'STEM Pathway']
  },
  {
    id: 'art-3',
    title: 'Maseno School Crowned Regional KSSSA Sports Champions under Sports Science Track',
    content: `Maseno School rugby and basketball teams conquered the regional Nyanza KSSSA secondary school sports championships over the weekend, demonstrating an exceptional level of physical stamina and athletic superiority.

This success comes barely six months after Maseno School integrated Physical Education, Sports Anatomy, and Biomechanics as a core focus in their newly registered Arts & Sports Science pathway.

The Maseno Coach noted that sports are no longer treated just as a non-essential side event. "Under the new curriculum, our boys are studying physical therapy, movement logic, and game tactics as part of their assessment. The technical knowledge from sports lab class translates directly into the pitch, and that is why our rugby squad is unbeatable!" Maseno will represent Nyanza region in the National Kenya Secondary Schools Sports Association games.`,
    summary: 'Maseno School dominates Nyanza regional rugger and basketball tourneys, showcasing how sports science theory boosts field performance.',
    schoolId: 'maseno',
    schoolName: 'Maseno School',
    schoolCategory: 'National',
    authorName: 'Coach Benson Onyango',
    authorRole: 'Sports Science Director',
    date: '2026-05-20',
    category: 'sports',
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    likes: 289,
    views: 1420,
    reactions: { applause: 132, insightful: 20, congratulations: 87, cheers: 54 },
    comments: [
      {
        id: 'comm-3-1',
        authorName: 'Ken Lucheli',
        authorRole: 'Student',
        text: 'The rugby match was intense! Can’t wait for the Nationals. MASENO JUU!',
        date: '2026-05-21'
      }
    ],
    tags: ['KSSSA', 'Maseno Sports', 'Rugby Champions', 'Sports Science']
  },
  {
    id: 'art-4',
    title: 'Kenya High School Drama Society Wins Big at the Cultural Gala',
    content: `The Kenya High School Drama Society (The Belles) has taken the home county of Nairobi by storm, walking away with four major trophies at the annual Kenya Music and Drama Festival.

Their play titled "The Silent Echoes" addressed the anxieties and ambitions of the transition to senior school pathways, exploring how students navigate societal expectations to find their own authentic talents in Sports, Social Sciences, and STEM.

The director of the play expressed deep gratitude to the school board for establishing a specialized theater workspace under the Arts & Sports Science curriculum. Creative arts and public speech are highly valued skills under the new syllabus, unlocking huge pathways in the digital creative sector and national storytelling.`,
    summary: 'Kenya High School sweeps major categories with a powerful play, "The Silent Echoes," themed around students finding their CBC Career Pathways.',
    schoolId: 'kenyahigh',
    schoolName: 'Kenya High School',
    schoolCategory: 'National',
    authorName: 'Ms. Angela Kabuba',
    authorRole: 'Drama Club Patron',
    date: '2026-05-18',
    category: 'clubs',
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    likes: 411,
    views: 1980,
    reactions: { applause: 198, insightful: 67, congratulations: 104, cheers: 32 },
    comments: [
      {
        id: 'comm-4-1',
        authorName: 'Naserian Leteipa',
        authorRole: 'Parent',
        text: 'My daughter is part of this play! The confidence she has gained is magnificent. CBC is opening up creative careers.',
        date: '2026-05-19'
      }
    ],
    tags: ['Drama Festival', 'Kenya High', 'Creative Arts']
  },
  {
    id: 'art-5',
    title: "Mang'u High School's Aviation Program Expands Under Grade 10 Syllabus",
    content: `Mang'u High School remains the only secondary school in Kenya certified with a fully operational wind tunnel and a real decommissioned aircraft hangar for training students. 

With the coming of the new senior secondary system, Mang'u is restructuring its historic Aviation course to form part of the STEM: Aviation & Civil Mechanics track.

Grade 10 students admitted to this program will participate in actual aerodynamic calculations, remote control prototype modeling, and flight simulation modules. The principal stated: "Our alliance with Kenya Airways and the Kenya Civil Aviation Authority (KCAA) is stronger than ever. The boys are preparing directly for aerospace engineering degrees."`,
    summary: 'Mang\'u High pilots the Aviation & Civil Mechanics track for Grade 10, bringing wind tunnels and flight simulation into the formal STEM Syllabus.',
    schoolId: 'mangu',
    schoolName: "Mang'u High School",
    schoolCategory: 'National',
    authorName: 'Rev. Fr. Peter Gichuki',
    authorRole: 'Principal',
    date: '2026-05-15',
    category: 'pathway',
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    likes: 589,
    views: 3120,
    reactions: { applause: 290, insightful: 178, congratulations: 90, cheers: 31 },
    comments: [],
    tags: ['Aviation Tech', 'Mangu High', 'Aerospace STEM']
  }
];
