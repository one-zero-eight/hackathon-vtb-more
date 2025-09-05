export interface Vacancy {
  id: number;
  title: string;
  description: string;
  experience: number; // years
  city: string;
  money: number; // salary in thousands
  hardSkills: string[];
  softSkills: string[];
  openTime: string; // ISO date string
  closingTime: string; // ISO date string
  type: 'Full-Time' | 'Part-Time';
}

export const mockVacancies: Vacancy[] = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    description:
      'We are looking for an experienced Frontend Developer to join our team and help build modern, responsive web applications using React, TypeScript, and modern CSS frameworks. You will work closely with designers and backend developers to create seamless user experiences.',
    experience: 3,
    city: 'Moscow',
    money: 180,
    hardSkills: [
      'React',
      'TypeScript',
      'JavaScript',
      'HTML5',
      'CSS3',
      'Redux',
      'Webpack',
      'Git',
    ],
    softSkills: [
      'Team Collaboration',
      'Problem Solving',
      'Communication',
      'Time Management',
      'Attention to Detail',
    ],
    openTime: '2024-01-15T00:00:00.000Z',
    closingTime: '2024-03-15T23:59:59.000Z',
    type: 'Full-Time',
  },
  {
    id: 2,
    title: 'Python Backend Engineer',
    description:
      "Join our backend team to develop scalable microservices and APIs using Python, FastAPI, and PostgreSQL. You'll be responsible for designing database schemas, implementing business logic, and ensuring high performance and reliability of our services.",
    experience: 2,
    city: 'Saint Petersburg',
    money: 150,
    hardSkills: [
      'Python',
      'FastAPI',
      'PostgreSQL',
      'Docker',
      'Redis',
      'SQLAlchemy',
      'Alembic',
      'Pytest',
    ],
    softSkills: [
      'Analytical Thinking',
      'Code Review',
      'Documentation',
      'Mentoring',
      'Agile Methodologies',
    ],
    openTime: '2024-01-20T00:00:00.000Z',
    closingTime: '2024-03-20T23:59:59.000Z',
    type: 'Part-Time',
  },
  {
    id: 3,
    title: 'DevOps Engineer',
    description:
      'We need a DevOps engineer to manage our cloud infrastructure, implement CI/CD pipelines, and ensure our applications run smoothly in production. Experience with AWS, Kubernetes, and monitoring tools is essential.',
    experience: 4,
    city: 'Novosibirsk',
    money: 200,
    hardSkills: [
      'AWS',
      'Kubernetes',
      'Docker',
      'Terraform',
      'Jenkins',
      'Prometheus',
      'Grafana',
      'Linux',
    ],
    softSkills: [
      'System Architecture',
      'Incident Response',
      'Automation Mindset',
      'Security Awareness',
      'Cross-team Collaboration',
    ],
    openTime: '2024-01-10T00:00:00.000Z',
    closingTime: '2024-02-28T23:59:59.000Z',
    type: 'Full-Time',
  },
  {
    id: 4,
    title: 'Data Scientist',
    description:
      "Join our data science team to develop machine learning models, perform statistical analysis, and create data-driven insights. You'll work with large datasets and help drive business decisions through predictive analytics.",
    experience: 3,
    city: 'Kazan',
    money: 170,
    hardSkills: [
      'Python',
      'Pandas',
      'NumPy',
      'Scikit-learn',
      'TensorFlow',
      'SQL',
      'Jupyter',
      'Matplotlib',
    ],
    softSkills: [
      'Statistical Analysis',
      'Business Acumen',
      'Data Storytelling',
      'Research Skills',
      'Critical Thinking',
    ],
    openTime: '2024-01-25T00:00:00.000Z',
    closingTime: '2024-04-10T23:59:59.000Z',
    type: 'Full-Time',
  },
  {
    id: 5,
    title: 'Mobile App Developer (React Native)',
    description:
      "We're looking for a mobile developer to build cross-platform applications using React Native. You'll work on both iOS and Android platforms, ensuring high performance and excellent user experience across devices.",
    experience: 2,
    city: 'Yekaterinburg',
    money: 140,
    hardSkills: [
      'React Native',
      'JavaScript',
      'TypeScript',
      'Redux',
      'Firebase',
      'Git',
      'Xcode',
      'Android Studio',
    ],
    softSkills: [
      'User Experience Design',
      'Mobile-first Thinking',
      'Performance Optimization',
      'Testing',
      'App Store Guidelines',
    ],
    openTime: '2024-02-01T00:00:00.000Z',
    closingTime: '2024-03-30T23:59:59.000Z',
    type: 'Part-Time',
  },
  {
    id: 6,
    title: 'UI/UX Designer',
    description:
      "Create beautiful and intuitive user interfaces for our web and mobile applications. You'll work closely with product managers and developers to design user-centered solutions that enhance user experience and drive engagement.",
    experience: 3,
    city: 'Nizhny Novgorod',
    money: 130,
    hardSkills: [
      'Figma',
      'Adobe Creative Suite',
      'Sketch',
      'InVision',
      'Prototyping',
      'Design Systems',
      'HTML/CSS',
      'User Research',
    ],
    softSkills: [
      'User Empathy',
      'Creative Problem Solving',
      'Design Thinking',
      'Presentation Skills',
      'Feedback Integration',
    ],
    openTime: '2024-01-30T00:00:00.000Z',
    closingTime: '2024-04-15T23:59:59.000Z',
    type: 'Part-Time',
  },
  {
    id: 7,
    title: 'Full Stack Developer',
    description:
      "Join our team as a full-stack developer to build end-to-end web applications. You'll work on both frontend and backend, using modern technologies to create robust and scalable solutions for our clients.",
    experience: 4,
    city: 'Rostov-on-Don',
    money: 190,
    hardSkills: [
      'JavaScript',
      'React',
      'Node.js',
      'Express',
      'MongoDB',
      'PostgreSQL',
      'Docker',
      'AWS',
    ],
    softSkills: [
      'Full-stack Architecture',
      'System Design',
      'Code Review',
      'Technical Leadership',
      'Project Management',
    ],
    openTime: '2024-02-05T00:00:00.000Z',
    closingTime: '2024-04-05T23:59:59.000Z',
    type: 'Full-Time',
  },
  {
    id: 8,
    title: 'QA Automation Engineer',
    description:
      "Develop and maintain automated test suites for our web and mobile applications. You'll work with development teams to ensure high quality standards and implement testing best practices across our products.",
    experience: 2,
    city: 'Samara',
    money: 120,
    hardSkills: [
      'Selenium',
      'Cypress',
      'Jest',
      'Postman',
      'Appium',
      'Python',
      'JavaScript',
      'Git',
    ],
    softSkills: [
      'Quality Assurance',
      'Test Planning',
      'Bug Reporting',
      'Process Improvement',
      'Attention to Detail',
    ],
    openTime: '2024-02-10T00:00:00.000Z',
    closingTime: '2024-04-20T23:59:59.000Z',
    type: 'Full-Time',
  },
  {
    id: 9,
    title: 'Product Manager',
    description:
      "Lead product development initiatives from conception to launch. You'll work with cross-functional teams to define product strategy, prioritize features, and ensure successful delivery of products that meet user needs and business goals.",
    experience: 5,
    city: 'Ufa',
    money: 220,
    hardSkills: [
      'Product Strategy',
      'User Research',
      'Data Analysis',
      'A/B Testing',
      'Roadmap Planning',
      'Agile Methodologies',
      'Jira',
      'Analytics Tools',
    ],
    softSkills: [
      'Leadership',
      'Stakeholder Management',
      'Strategic Thinking',
      'Communication',
      'Decision Making',
    ],
    openTime: '2024-01-15T00:00:00.000Z',
    closingTime: '2024-03-25T23:59:59.000Z',
    type: 'Part-Time',
  },
  {
    id: 10,
    title: 'Cybersecurity Specialist',
    description:
      "Protect our systems and data from security threats by implementing security measures, conducting vulnerability assessments, and developing security policies. You'll work to ensure compliance with security standards and best practices.",
    experience: 4,
    city: 'Krasnodar',
    money: 180,
    hardSkills: [
      'Network Security',
      'Penetration Testing',
      'SIEM Tools',
      'Firewall Configuration',
      'Cryptography',
      'Linux Security',
      'Wireshark',
      'Metasploit',
    ],
    softSkills: [
      'Security Awareness',
      'Risk Assessment',
      'Incident Response',
      'Compliance Knowledge',
      'Continuous Learning',
    ],
    openTime: '2024-02-15T00:00:00.000Z',
    closingTime: '2024-04-30T23:59:59.000Z',
    type: 'Full-Time',
  },
];

export interface Application {
  id: number;
  vacancyId: number;
  vacancyTitle: string;
  company: string;
  city: string;
  salary: number;
  appliedDate: string;
  status: 'pre_interview' | 'waiting_for_interview' | 'waiting_for_result';
  statusText: string;
}

export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  applications: Application[];
}

export const mockUserProfile: UserProfile = {
  id: 1,
  fullName: 'Иван Петров',
  email: 'ivan.petrov@example.com',
  applications: [
    {
      id: 1,
      vacancyId: 1,
      vacancyTitle: 'Senior Frontend Developer',
      company: 'TechCorp',
      city: 'Moscow',
      salary: 180,
      appliedDate: '2024-01-20T00:00:00.000Z',
      status: 'pre_interview',
      statusText: 'Предварительная проверка',
    },
    {
      id: 2,
      vacancyId: 3,
      vacancyTitle: 'DevOps Engineer',
      company: 'CloudTech',
      city: 'Novosibirsk',
      salary: 200,
      appliedDate: '2024-01-15T00:00:00.000Z',
      status: 'waiting_for_interview',
      statusText: 'Ожидаем интервью',
    },
    {
      id: 3,
      vacancyId: 5,
      vacancyTitle: 'Mobile App Developer (React Native)',
      company: 'MobileSoft',
      city: 'Yekaterinburg',
      salary: 140,
      appliedDate: '2024-01-25T00:00:00.000Z',
      status: 'waiting_for_result',
      statusText: 'Ожидаем результат',
    },
    {
      id: 4,
      vacancyId: 7,
      vacancyTitle: 'Full Stack Developer',
      company: 'WebSolutions',
      city: 'Rostov-on-Don',
      salary: 190,
      appliedDate: '2024-02-01T00:00:00.000Z',
      status: 'pre_interview',
      statusText: 'Предварительная проверка',
    },
  ],
};

export interface HRVacancy {
  id: number;
  title: string;
  description: string;
  experience: number; // years
  city: string;
  money: number; // salary in thousands
  hardSkills: string[];
  softSkills: string[];
  openTime: string; // ISO date string
  closingTime: string; // ISO date string
  type: 'Full-Time' | 'Part-Time';
  status: 'active' | 'draft' | 'closed' | 'archived';
  statusText: string;
  applicationsCount: number;
  viewsCount: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  createdBy: string;
}

export const mockHRVacancies: HRVacancy[] = [
  {
    id: 101,
    title: 'Senior Frontend Developer',
    description:
      'We are looking for an experienced Frontend Developer to join our team and help build modern, responsive web applications using React, TypeScript, and modern CSS frameworks.',
    experience: 3,
    city: 'Moscow',
    money: 180,
    hardSkills: [
      'React',
      'TypeScript',
      'JavaScript',
      'HTML5',
      'CSS3',
      'Redux',
      'Webpack',
      'Git',
    ],
    softSkills: [
      'Team Collaboration',
      'Problem Solving',
      'Communication',
      'Time Management',
      'Attention to Detail',
    ],
    openTime: '2024-01-15T00:00:00.000Z',
    closingTime: '2024-03-15T23:59:59.000Z',
    type: 'Full-Time',
    status: 'active',
    statusText: 'Активна',
    applicationsCount: 24,
    viewsCount: 156,
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-20T00:00:00.000Z',
    createdBy: 'Иван Петров',
  },
  {
    id: 102,
    title: 'Python Backend Engineer',
    description:
      'Join our backend team to develop scalable microservices and APIs using Python, FastAPI, and PostgreSQL.',
    experience: 2,
    city: 'Saint Petersburg',
    money: 150,
    hardSkills: [
      'Python',
      'FastAPI',
      'PostgreSQL',
      'Docker',
      'Redis',
      'SQLAlchemy',
      'Alembic',
      'Pytest',
    ],
    softSkills: [
      'Analytical Thinking',
      'Code Review',
      'Documentation',
      'Mentoring',
      'Agile Methodologies',
    ],
    openTime: '2024-01-20T00:00:00.000Z',
    closingTime: '2024-03-20T23:59:59.000Z',
    type: 'Part-Time',
    status: 'active',
    statusText: 'Активна',
    applicationsCount: 18,
    viewsCount: 89,
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-18T00:00:00.000Z',
    createdBy: 'Мария Сидорова',
  },
  {
    id: 103,
    title: 'DevOps Engineer',
    description:
      'We need a DevOps engineer to manage our cloud infrastructure, implement CI/CD pipelines, and ensure our applications run smoothly in production.',
    experience: 4,
    city: 'Novosibirsk',
    money: 200,
    hardSkills: [
      'AWS',
      'Kubernetes',
      'Docker',
      'Terraform',
      'Jenkins',
      'Prometheus',
      'Grafana',
      'Linux',
    ],
    softSkills: [
      'System Architecture',
      'Incident Response',
      'Automation Mindset',
      'Security Awareness',
      'Cross-team Collaboration',
    ],
    openTime: '2024-01-10T00:00:00.000Z',
    closingTime: '2024-02-28T23:59:59.000Z',
    type: 'Full-Time',
    status: 'draft',
    statusText: 'Черновик',
    applicationsCount: 0,
    viewsCount: 0,
    createdAt: '2024-01-05T00:00:00.000Z',
    updatedAt: '2024-01-05T00:00:00.000Z',
    createdBy: 'Алексей Козлов',
  },
  {
    id: 104,
    title: 'Data Scientist',
    description:
      'Join our data science team to develop machine learning models, perform statistical analysis, and create data-driven insights.',
    experience: 3,
    city: 'Kazan',
    money: 170,
    hardSkills: [
      'Python',
      'Pandas',
      'NumPy',
      'Scikit-learn',
      'TensorFlow',
      'SQL',
      'Jupyter',
      'Matplotlib',
    ],
    softSkills: [
      'Statistical Analysis',
      'Business Acumen',
      'Data Storytelling',
      'Research Skills',
      'Critical Thinking',
    ],
    openTime: '2024-01-25T00:00:00.000Z',
    closingTime: '2024-04-10T23:59:59.000Z',
    type: 'Full-Time',
    status: 'closed',
    statusText: 'Закрыта',
    applicationsCount: 31,
    viewsCount: 203,
    createdAt: '2024-01-20T00:00:00.000Z',
    updatedAt: '2024-01-25T00:00:00.000Z',
    createdBy: 'Елена Волкова',
  },
  {
    id: 105,
    title: 'Mobile App Developer (React Native)',
    description:
      "We're looking for a mobile developer to build cross-platform applications using React Native.",
    experience: 2,
    city: 'Yekaterinburg',
    money: 140,
    hardSkills: [
      'React Native',
      'JavaScript',
      'TypeScript',
      'Redux',
      'Firebase',
      'Git',
      'Xcode',
      'Android Studio',
    ],
    softSkills: [
      'User Experience Design',
      'Mobile-first Thinking',
      'Performance Optimization',
      'Testing',
      'App Store Guidelines',
    ],
    openTime: '2024-02-01T00:00:00.000Z',
    closingTime: '2024-03-30T23:59:59.000Z',
    type: 'Part-Time',
    status: 'archived',
    statusText: 'Архив',
    applicationsCount: 15,
    viewsCount: 67,
    createdAt: '2024-01-25T00:00:00.000Z',
    updatedAt: '2024-01-30T00:00:00.000Z',
    createdBy: 'Дмитрий Соколов',
  },
];

export const availableSkills = [
  { id: 'react', name: 'React', category: 'Frontend' },
  { id: 'typescript', name: 'TypeScript', category: 'Frontend' },
  { id: 'javascript', name: 'JavaScript', category: 'Frontend' },
  { id: 'html', name: 'HTML5', category: 'Frontend' },
  { id: 'css', name: 'CSS3', category: 'Frontend' },
  { id: 'vue', name: 'Vue.js', category: 'Frontend' },
  { id: 'angular', name: 'Angular', category: 'Frontend' },
  { id: 'python', name: 'Python', category: 'Backend' },
  { id: 'java', name: 'Java', category: 'Backend' },
  { id: 'csharp', name: 'C#', category: 'Backend' },
  { id: 'php', name: 'PHP', category: 'Backend' },
  { id: 'nodejs', name: 'Node.js', category: 'Backend' },
  { id: 'postgresql', name: 'PostgreSQL', category: 'Database' },
  { id: 'mysql', name: 'MySQL', category: 'Database' },
  { id: 'mongodb', name: 'MongoDB', category: 'Database' },
  { id: 'redis', name: 'Redis', category: 'Database' },
  { id: 'docker', name: 'Docker', category: 'DevOps' },
  { id: 'kubernetes', name: 'Kubernetes', category: 'DevOps' },
  { id: 'aws', name: 'AWS', category: 'Cloud' },
  { id: 'azure', name: 'Azure', category: 'Cloud' },
  { id: 'git', name: 'Git', category: 'Tools' },
  { id: 'jenkins', name: 'Jenkins', category: 'DevOps' },
  { id: 'leadership', name: 'Leadership', category: 'Soft Skills' },
  { id: 'communication', name: 'Communication', category: 'Soft Skills' },
  { id: 'teamwork', name: 'Teamwork', category: 'Soft Skills' },
  { id: 'problemsolving', name: 'Problem Solving', category: 'Soft Skills' },
  { id: 'timemanagement', name: 'Time Management', category: 'Soft Skills' },
];
