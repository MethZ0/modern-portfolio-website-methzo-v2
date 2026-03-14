import type { Project } from '@/types';

export const projects: Project[] = [
  // ── UI/UX Design Projects ──
  {
    id: 'd1',
    title: 'Flavor — Food Delivery Redesign',
    category: 'ui-ux',
    year: '2025',
    slug: 'flavor-food-delivery',
    accentColor: 'hsl(15 85% 55%)',
    coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    description: 'A complete UI/UX redesign of a food delivery app focusing on simplifying the ordering flow, reducing cognitive load, and creating a warm, appetizing visual language. User testing showed a 40% improvement in task completion rate.',
    techStack: 'Figma, Protopie, User Testing',
    location: 'SLIIT - UX Course',
    images: [
      { id: 'd1-1', src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', alt: 'App home screen', aspectRatio: 'landscape' },
      { id: 'd1-2', src: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', alt: 'Menu browsing flow', aspectRatio: 'portrait' },
      { id: 'd1-3', src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', alt: 'Checkout experience', aspectRatio: 'landscape' },
    ]
  },
  {
    id: 'd2',
    title: 'Mindful — Meditation App',
    category: 'ui-ux',
    year: '2025',
    slug: 'mindful-meditation-app',
    accentColor: 'hsl(250 60% 60%)',
    coverImage: 'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    description: 'A calming meditation and mindfulness app design featuring fluid animations, soft gradients, and an intuitive session builder. Designed with accessibility-first principles including high contrast modes and screen reader optimization.',
    techStack: 'Figma, Adobe After Effects, Lottie',
    location: 'Personal Project',
    images: [
      { id: 'd2-1', src: 'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', alt: 'Meditation home', aspectRatio: 'portrait' },
      { id: 'd2-2', src: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', alt: 'Session builder', aspectRatio: 'landscape' },
      { id: 'd2-3', src: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', alt: 'Progress tracking', aspectRatio: 'landscape' },
    ]
  },
  {
    id: 'd3',
    title: 'Finova — Banking Dashboard',
    category: 'ui-ux',
    year: '2024',
    slug: 'finova-banking-dashboard',
    accentColor: 'hsl(160 55% 45%)',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    description: 'A modern fintech dashboard redesign with data visualization, transaction insights, and budget planning tools. Focused on making complex financial data digestible through clear information hierarchy and thoughtful micro-interactions.',
    techStack: 'Figma, D3.js Prototypes, Principle',
    location: 'SLIIT - Design Module',
    images: [
      { id: 'd3-1', src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', alt: 'Dashboard overview', aspectRatio: 'landscape' },
      { id: 'd3-2', src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', alt: 'Analytics view', aspectRatio: 'landscape' },
      { id: 'd3-3', src: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', alt: 'Mobile responsive', aspectRatio: 'portrait' },
    ]
  },
  {
    id: 'd4',
    title: 'Wanderlust — Travel Platform',
    category: 'design',
    year: '2024',
    slug: 'wanderlust-travel-platform',
    accentColor: 'hsl(200 70% 50%)',
    coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    description: 'A visual-first travel planning platform with immersive destination pages, collaborative trip boards, and an interactive itinerary builder. Emphasis on storytelling through photography and editorial-style layouts.',
    techStack: 'Figma, Framer, Unsplash API',
    location: 'Personal Project',
    images: [
      { id: 'd4-1', src: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', alt: 'Landing page', aspectRatio: 'landscape' },
      { id: 'd4-2', src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', alt: 'Destination page', aspectRatio: 'landscape' },
      { id: 'd4-3', src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', alt: 'Itinerary builder', aspectRatio: 'portrait' },
    ]
  },

  // ── Development Projects ──
  {
    id: '1',
    title: 'E-Commerce Platform',
    category: 'fullstack',
    year: '2025',
    slug: 'ecommerce-platform',
    coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'A full-stack e-commerce platform built with React, Node.js, and MongoDB. Features include user authentication, product management, shopping cart, payment integration, and an admin dashboard.',
    techStack: 'React, Node.js, Express, MongoDB, Stripe',
    location: 'SLIIT - Group Project',
    images: [
      { id: '1-1', src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', alt: 'E-commerce dashboard', aspectRatio: 'landscape' },
      { id: '1-2', src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', alt: 'Product management interface', aspectRatio: 'landscape' },
      { id: '1-3', src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', alt: 'Analytics dashboard', aspectRatio: 'landscape' },
      { id: '1-4', src: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', alt: 'Mobile responsive view', aspectRatio: 'portrait' },
    ]
  },
  {
    id: '2',
    title: 'Task Management App',
    category: 'web-app',
    year: '2025',
    slug: 'task-management-app',
    coverImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'A modern task management application with drag-and-drop functionality, real-time collaboration features, and project organization tools. Built with React and Firebase.',
    techStack: 'React, TypeScript, Firebase, Tailwind CSS',
    location: 'Personal Project',
    images: [
      { id: '2-1', src: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', alt: 'Task board view', aspectRatio: 'landscape' },
      { id: '2-2', src: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', alt: 'Task details', aspectRatio: 'portrait' },
      { id: '2-3', src: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', alt: 'Project overview', aspectRatio: 'landscape' },
      { id: '2-4', src: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', alt: 'Calendar view', aspectRatio: 'square' },
    ]
  },
  {
    id: '3',
    title: 'Weather Forecast App',
    category: 'mobile-app',
    year: '2024',
    slug: 'weather-forecast-app',
    coverImage: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'A cross-platform mobile weather application with beautiful UI, location-based forecasts, severe weather alerts, and interactive radar maps.',
    techStack: 'React Native, OpenWeather API, Expo',
    location: 'Personal Project',
    images: [
      { id: '3-1', src: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', alt: 'Weather dashboard', aspectRatio: 'portrait' },
      { id: '3-2', src: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', alt: 'Forecast details', aspectRatio: 'landscape' },
      { id: '3-3', src: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', alt: 'Radar map', aspectRatio: 'square' },
      { id: '3-4', src: 'https://images.unsplash.com/photo-1530908295418-a12e326966ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', alt: 'Location search', aspectRatio: 'portrait' },
    ]
  },
  {
    id: '4',
    title: 'REST API Service',
    category: 'api',
    year: '2024',
    slug: 'rest-api-service',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'A scalable RESTful API service for a student management system with JWT authentication, role-based access control, and comprehensive documentation using Swagger.',
    techStack: 'Node.js, Express, PostgreSQL, JWT, Swagger',
    location: 'SLIIT - Course Project',
    images: [
      { id: '4-1', src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', alt: 'API code', aspectRatio: 'landscape' },
      { id: '4-2', src: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', alt: 'Swagger documentation', aspectRatio: 'landscape' },
      { id: '4-3', src: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', alt: 'Database schema', aspectRatio: 'square' },
      { id: '4-4', src: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', alt: 'Testing results', aspectRatio: 'landscape' },
    ]
  },
  {
    id: '5',
    title: 'Portfolio Website',
    category: 'web-app',
    year: '2024',
    slug: 'portfolio-website',
    coverImage: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'A responsive personal portfolio website showcasing projects, skills, and experience. Built with React, Tailwind CSS, and Framer Motion for smooth animations.',
    techStack: 'React, TypeScript, Tailwind CSS, Framer Motion',
    location: 'Personal Project',
    images: [
      { id: '5-1', src: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', alt: 'Portfolio homepage', aspectRatio: 'landscape' },
      { id: '5-2', src: 'https://images.unsplash.com/photo-1547658719-da2b51169166?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', alt: 'Projects section', aspectRatio: 'landscape' },
      { id: '5-3', src: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', alt: 'About section', aspectRatio: 'portrait' },
      { id: '5-4', src: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', alt: 'Contact form', aspectRatio: 'landscape' },
    ]
  },
  {
    id: '6',
    title: 'Chat Application',
    category: 'fullstack',
    year: '2024',
    slug: 'chat-application',
    coverImage: 'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'A real-time chat application with private messaging, group chats, file sharing, and online status indicators. Uses WebSockets for instant communication.',
    techStack: 'React, Socket.io, Node.js, MongoDB',
    location: 'SLIIT - Group Project',
    images: [
      { id: '6-1', src: 'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', alt: 'Chat interface', aspectRatio: 'landscape' },
      { id: '6-2', src: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', alt: 'Group chat', aspectRatio: 'landscape' },
      { id: '6-3', src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', alt: 'User profiles', aspectRatio: 'portrait' },
      { id: '6-4', src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', alt: 'Settings panel', aspectRatio: 'landscape' },
    ]
  },
];

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find(project => project.slug === slug);
};

export const getProjectsByCategory = (category: string): Project[] => {
  if (category === 'all') return projects;
  return projects.filter(project => project.category === category);
};

export const getFeaturedProjects = (): Project[] => {
  return projects.slice(0, 4);
};

export const getAdjacentProjects = (currentSlug: string): { prev: Project | null; next: Project | null } => {
  const currentIndex = projects.findIndex(p => p.slug === currentSlug);
  return {
    prev: currentIndex > 0 ? projects[currentIndex - 1] : null,
    next: currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null
  };
};
