import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ComponentType, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  AppWindow,
  BarChart3,
  Blocks,
  Briefcase,
  Globe,
  GraduationCap,
  LayoutDashboard,
  MapPin,
  Building2,
  Satellite,
  Waves,
  Route,
} from 'lucide-react';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { shouldReduceEffects } from '@/lib/perf';
import { publicPath } from '@/lib/public-path';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

const projectCategories = ['All', 'Ministry of Transport', 'NUCA', 'Frontend', 'ArcGIS Online', 'Other'];

type Project = {
  id: number;
  title: string;
  client: string;
  category: string;
  description: string;
  details: string[];
  technologies: string[];
  icon: ComponentType<{ className?: string }>;
  featured: boolean;
  image?: string;
};

type ProjectSort = 'recent' | 'title' | 'category';

const projectImageById: Record<number, string> = {
  29: publicPath('images/projects/29-widgets.svg'),
  30: publicPath('images/projects/30-incident-dashboard.svg'),
  31: publicPath('images/projects/31-field-collector.svg'),
  32: publicPath('images/projects/32-community-portal.svg'),
  33: publicPath('images/projects/33-permits-portal.svg'),
};

const categoryAccent: Record<string, string> = {
  'Ministry of Transport': 'from-teal/18 via-transparent to-transparent',
  'NUCA': 'from-cyan-400/14 via-transparent to-transparent',
  'Frontend': 'from-amber-400/14 via-transparent to-transparent',
  'ArcGIS Online': 'from-cyan-300/14 via-transparent to-transparent',
  'Other': 'from-slate-50/10 via-transparent to-transparent',
};

function accentFor(category: string) {
  return categoryAccent[category] ?? categoryAccent['Other'];
}

type CategoryMeta = {
  chipClass: string;
  lineClass: string;
  panelClass: string;
};

const categoryMeta: Record<string, CategoryMeta> = {
  'Ministry of Transport': {
    chipClass: 'bg-teal/12 border-teal/25 text-teal',
    lineClass: 'from-teal/70 via-cyan-400/55 to-transparent',
    panelClass: 'from-teal/25 via-cyan-400/10 to-transparent',
  },
  'NUCA': {
    chipClass: 'bg-sky-400/12 border-sky-400/25 text-sky-300',
    lineClass: 'from-sky-300/70 via-cyan-300/55 to-transparent',
    panelClass: 'from-sky-300/25 via-cyan-300/10 to-transparent',
  },
  'Frontend': {
    chipClass: 'bg-amber-400/12 border-amber-400/25 text-amber-300',
    lineClass: 'from-amber-300/70 via-orange-300/55 to-transparent',
    panelClass: 'from-amber-300/25 via-orange-300/10 to-transparent',
  },
  'ArcGIS Online': {
    chipClass: 'bg-cyan-300/12 border-cyan-300/25 text-cyan-200',
    lineClass: 'from-cyan-300/70 via-blue-300/55 to-transparent',
    panelClass: 'from-cyan-300/25 via-blue-300/10 to-transparent',
  },
  'Other': {
    chipClass: 'bg-slate-300/10 border-slate-500/30 text-slate-300',
    lineClass: 'from-slate-300/65 via-slate-500/45 to-transparent',
    panelClass: 'from-slate-300/20 via-slate-500/10 to-transparent',
  },
};

function metaForCategory(category: string): CategoryMeta {
  return categoryMeta[category] ?? categoryMeta['Other'];
}

const baseProjects: Project[] = [
  // Ministry of Transport Projects
  {
    id: 1,
    title: 'Land Use Development - El-Dabaa Axis',
    client: 'Ministry of Transport',
    category: 'Ministry of Transport',
    description: 'Designed and implemented a comprehensive GIS data model tailored to project requirements. Built spatial relationships and applied topology rules to validate field data.',
    details: [
      'Developed and deployed multiple Web GIS apps (Dashboards, StoryMaps, Survey123, Hub)',
      'Delivered specialized GIS training for ministry engineers in the New Administrative Capital',
      'Created Web AppBuilder, Experience Builder, and Instant Apps for stakeholder engagement',
      'Implemented Field Maps for mobile data collection'
    ],
    technologies: ['ArcGIS Pro', 'ArcGIS Online', 'Survey123', 'Dashboard', 'StoryMaps'],
    icon: MapPin,
    featured: true,
  },
  {
    id: 2,
    title: 'Land Use Development - Kalabsha Axis',
    client: 'Ministry of Transport',
    category: 'Ministry of Transport',
    description: 'Produced project-specific GIS data model and relational schema for land use analysis around Kalabsha Axis.',
    details: [
      'Applied ArcGIS Topology and Attribute Rules to correct field data',
      'Created interactive dashboards and StoryMaps for stakeholders',
      'Developed automated QA/QC workflows'
    ],
    technologies: ['ArcGIS Pro', 'Topology', 'Attribute Rules', 'Dashboard'],
    icon: MapPin,
    featured: false,
  },
  {
    id: 3,
    title: 'Dahshour Southern Junction Land Use',
    client: 'Ministry of Transport',
    category: 'Ministry of Transport',
    description: 'Built GIS data model and enforced topology rules for long-term development monitoring.',
    details: [
      'Developed dashboards and StoryMaps for development monitoring',
      'Trained survey teams on data capture standards',
      'Implemented field validation routines'
    ],
    technologies: ['ArcGIS Pro', 'StoryMaps', 'Field Maps'],
    icon: MapPin,
    featured: false,
  },
  {
    id: 4,
    title: 'Cairo/Suez Road Land Use Development',
    client: 'Ministry of Transport',
    category: 'Ministry of Transport',
    description: 'Implemented ArcGIS Topology and Attribute Rules for comprehensive QA/QC processes.',
    details: [
      'Published StoryMaps and field apps to support survey teams',
      'Developed dashboards for management monitoring',
      'Created automated reporting workflows'
    ],
    technologies: ['ArcGIS Pro', 'Topology', 'Survey123', 'Dashboard'],
    icon: Route,
    featured: false,
  },
  {
    id: 5,
    title: 'Regional Ring Road Land Use Development',
    client: 'Ministry of Transport',
    category: 'Ministry of Transport',
    description: 'Built modular GIS database to track land-use changes along the Regional Ring Road.',
    details: [
      'Developed interactive dashboards to monitor spatial impacts',
      'Provided analysis reports to project planners',
      'Implemented change detection workflows'
    ],
    technologies: ['ArcGIS Pro', 'Dashboard', 'Change Detection'],
    icon: Route,
    featured: false,
  },
  {
    id: 6,
    title: 'Land Use Development - Qous Axis',
    client: 'Ministry of Transport',
    category: 'Ministry of Transport',
    description: 'Developed GIS workflows for land use comparison before and after construction.',
    details: [
      'Integrated field survey data with validation routines',
      'Published map viewers and StoryMaps to illustrate findings',
      'Created automated geoprocessing tasks using ModelBuilder'
    ],
    technologies: ['ArcGIS Pro', 'ModelBuilder', 'StoryMaps'],
    icon: MapPin,
    featured: false,
  },
  {
    id: 7,
    title: 'Qena/Luxor Road Land Use Development',
    client: 'Ministry of Transport',
    category: 'Ministry of Transport',
    description: 'Analyzed pre- and post-upgrade land use through comprehensive GIS models.',
    details: [
      'Automated geoprocessing tasks using ModelBuilder',
      'Created dashboards and maps for reporting',
      'Implemented spatial analysis for impact assessment'
    ],
    technologies: ['ArcGIS Pro', 'ModelBuilder', 'Dashboard'],
    icon: Route,
    featured: false,
  },
  
  // NUCA Projects
  {
    id: 8,
    title: 'Utility Networks - New Obour City',
    client: 'New Urban Communities Authority (NUCA)',
    category: 'NUCA',
    description: 'Contributed to developing an integrated GIS geodatabase model for all utility networks across 23 sectors.',
    details: [
      'Applied ArcGIS Topology and Attribute Rules for network integrity and QA/QC validation',
      'Developed Python scripts to automate data processing, schema validation, and progress reporting',
      'Supported the integration of radar (GPR) and GPS data into ArcGIS Pro',
      'Created web GIS dashboards and mobile monitoring apps'
    ],
    technologies: ['ArcGIS Pro', 'Python', 'ArcPy', 'GPR', 'GPS', 'Topology'],
    icon: Waves,
    featured: true,
  },
  {
    id: 9,
    title: 'Utility Networks - 15th of May City',
    client: 'New Urban Communities Authority (NUCA)',
    category: 'NUCA',
    description: 'Contributed to building and managing the GIS data model for 37 sectors covering multiple utilities.',
    details: [
      'Applied ArcGIS Topology and Attribute Rules to ensure spatial integrity and connectivity',
      'Developed Python geoprocessing scripts for batch QA/QC and automated reports',
      'Supported consolidation of Electricity, Water, Sewage, Irrigation, and Gas networks',
      'Developed web GIS dashboards and analytical tools'
    ],
    technologies: ['ArcGIS Pro', 'Python', 'Enterprise GIS', 'Topology'],
    icon: Waves,
    featured: false,
  },
  {
    id: 10,
    title: 'Utility Networks - New Suez City',
    client: 'New Urban Communities Authority (NUCA)',
    category: 'NUCA',
    description: 'Contributed to designing the GIS data schema and spatial integration for 4 city sectors.',
    details: [
      'Applied ArcGIS Attribute Rules and Python-based QA/QC tools',
      'Processed GPR and GNSS data to refine spatial accuracy',
      'Developed web GIS dashboards and mobile apps for real-time monitoring'
    ],
    technologies: ['ArcGIS Pro', 'Python', 'GPR', 'GNSS'],
    icon: Waves,
    featured: false,
  },
  {
    id: 11,
    title: 'Utility Networks - New Salhia City',
    client: 'New Urban Communities Authority (NUCA)',
    category: 'NUCA',
    description: 'Contributed to structuring the geospatial database covering 9 sectors and multiple utility networks.',
    details: [
      'Applied ArcGIS Topology and Attribute Rules for NUCA standards compliance',
      'Developed Python scripts for automation and performance tracking',
      'Created customized web GIS dashboards for monitoring'
    ],
    technologies: ['ArcGIS Pro', 'Python', 'ArcGIS Online'],
    icon: Waves,
    featured: false,
  },
  
  // Frontend Projects
  {
    id: 12,
    title: 'Real-time Data Dashboard',
    client: 'Analytics Platform',
    category: 'Frontend',
    description: 'Built a high-performance dashboard for monitoring live metrics with interactive charts and alerts.',
    details: [
      'Implemented WebSocket integration for real-time data updates',
      'Created responsive charts with D3.js and Recharts',
      'Added customizable alerts and notification system',
      'Optimized rendering with React hooks and memoization'
    ],
    technologies: ['React', 'TypeScript', 'D3.js', 'WebSocket', 'Tailwind CSS'],
    icon: LayoutDashboard,
    featured: true,
  },
  {
    id: 13,
    title: 'Project Management Portal',
    client: 'Tech Startup',
    category: 'Frontend',
    description: 'Developed a collaborative project management web application with drag-and-drop functionality.',
    details: [
      'Implemented Kanban board with drag-and-drop interactions using React Beautiful DnD',
      'Built real-time task updates and notification system',
      'Created responsive UI with accessibility compliance (WCAG 2.1)',
      'Integrated with REST APIs for seamless data flow'
    ],
    technologies: ['React', 'TypeScript', 'Redux', 'Material-UI', 'Drag-and-Drop'],
    icon: AppWindow,
    featured: true,
  },
  {
    id: 14,
    title: 'E-Learning Platform',
    client: 'EdTech Startup',
    category: 'Frontend',
    description: 'Interactive e-learning platform with video courses, quizzes, and progress tracking.',
    details: [
      'Built video player with adaptive streaming and quality selection',
      'Created interactive quiz system with instant feedback',
      'Implemented progress tracking and certificate generation',
      'Mobile-first responsive design for all devices'
    ],
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vimeo API'],
    icon: GraduationCap,
    featured: true,
  },
  {
    id: 15,
    title: 'SaaS Admin Portal',
    client: 'SaaS Company',
    category: 'Frontend',
    description: 'Comprehensive admin dashboard for user management, billing, and system configuration.',
    details: [
      'Multi-level navigation with permission-based access control',
      'Data tables with sorting, filtering, pagination, and bulk actions',
      'Role-based UI rendering and feature flags',
      'Integration with billing and analytics APIs'
    ],
    technologies: ['React', 'TypeScript', 'Ant Design', 'Redux Toolkit', 'recharts'],
    icon: AppWindow,
    featured: true,
  },
  {
    id: 16,
    title: 'Interactive Data Visualization',
    client: 'Research Institute',
    category: 'Frontend',
    description: 'Custom visualization suite for exploring complex datasets with multiple perspectives.',
    details: [
      'Built filterable interactive charts with React and D3.js',
      'Created brush controls for time-series exploration',
      'Implemented export features (SVG, PNG, CSV)',
      'Optimized for large datasets with WebWorkers'
    ],
    technologies: ['React', 'D3.js', 'Canvas', 'WebWorkers', 'Plotly'],
    icon: BarChart3,
    featured: false,
  },
  
  // Other / ArcGIS Online Projects
  {
    id: 17,
    title: 'Tuwaik Reserve Control & Monitoring',
    client: 'Marafi Company',
    category: 'Other',
    description: 'Developed Web GIS apps and spatial models for resource management.',
    details: [
      'Integrated real-time monitoring dashboards',
      'Created decision-support analysis workflows',
      'Developed suitability analysis for site planning'
    ],
    technologies: ['ArcGIS Online', 'Dashboards', 'Spatial Modeling'],
    icon: Briefcase,
    featured: false,
  },
  {
    id: 18,
    title: 'Marina Site Selection Study - Oman',
    client: 'Marafi Company',
    category: 'Other',
    description: 'Conducted multi-criteria suitability analysis for marina development.',
    details: [
      'Built QA/QC apps for field validation',
      'Proposed infrastructure network extensions',
      'Created decision analysis models'
    ],
    technologies: ['ArcGIS Online', 'Survey123', 'Spatial Analysis'],
    icon: Briefcase,
    featured: false,
  },
  {
    id: 19,
    title: 'Salalah Commercial Port Dashboard',
    client: 'Medar Company',
    category: 'Other',
    description: 'Real-time monitoring dashboards for port operations and construction tracking.',
    details: [
      'Spatial-statistical analyses of port activities',
      'GIS-based management reporting',
      'Real-time data integration'
    ],
    technologies: ['ArcGIS Dashboard', 'Real-time Data', 'Analytics'],
    icon: Building2,
    featured: false,
  },
  {
    id: 20,
    title: '3D Masterplan - Golden Beach Village',
    client: 'Golden Beach Village (Ras Sedr)',
    category: 'Other',
    description: 'Built 3D site models and terrain visualizations for resort development.',
    details: [
      'Analyzed topographic changes impacting development',
      'Delivered 3D planning maps for stakeholders',
      'Created interactive 3D visualizations'
    ],
    technologies: ['ArcGIS Pro', '3D Analyst', 'Terrain Modeling'],
    icon: Building2,
    featured: false,
  },
  {
    id: 29,
    title: 'Componentized Map Widgets',
    client: 'UI Toolkit',
    category: 'Frontend',
    description: 'Reusable React widgets for map interactions, filters, and analytics panels.',
    details: [
      'Storybook docs and automated visual tests',
      'Small, framework-agnostic primitives for map UIs',
      'Accessible keyboard-first UX for widget controls'
    ],
    technologies: ['React', 'TypeScript', 'ArcGIS API for JavaScript', 'Storybook'],
    icon: Blocks,
    featured: false,
  },

  // ArcGIS Online / App examples (invented)
  {
    id: 30,
    title: 'ArcGIS Online - Incident Response Dashboard',
    client: 'Emergency Services',
    category: 'ArcGIS Online',
    description: 'Real-time incident dashboard built with ArcGIS Online Dashboards and Instant Apps for first responders.',
    details: [
      'Real-time feature feeds with webhook-driven updates',
      'Role-based filtering and incident triage workflows',
      'Embedded Experience Builder widgets for operator control'
    ],
    technologies: ['ArcGIS Online', 'Dashboards', 'Experience Builder', 'ArcGIS API for JavaScript'],
    icon: Satellite,
    featured: true,
  },
  {
    id: 31,
    title: 'ArcGIS Online - Field Collector Suite',
    client: 'Public Works',
    category: 'ArcGIS Online',
    description: 'Mobile-first collection suite using Survey123, Field Maps and ArcGIS Instant Apps for survey workflows.',
    details: [
      'Offline Survey123 forms with attachments and validation',
      'Field Maps configuration for high-accuracy collection',
      'Automated dashboard reports and scheduled exports'
    ],
    technologies: ['ArcGIS Online', 'Survey123', 'Field Maps', 'ArcGIS Instant Apps'],
    icon: MapPin,
    featured: false,
  },
  {
    id: 32,
    title: 'ArcGIS Hub - Community Reporting Portal',
    client: 'City Council',
    category: 'ArcGIS Online',
    description: 'Public-facing Hub site and experience for civic reporting, data downloads and community engagement.',
    details: [
      'Custom Experience Builder pages and widgets',
      'Automations for routing and triage of incoming reports',
      'Open data feeds and scheduled exports for transparency'
    ],
    technologies: ['ArcGIS Hub', 'Experience Builder', 'ArcGIS Online', 'Automations'],
    icon: Globe,
    featured: false,
  },
  {
    id: 33,
    title: 'Experience Builder - Public Permits Portal',
    client: 'Planning Dept',
    category: 'ArcGIS Online',
    description: 'Public permits portal built in Experience Builder with custom widgets and permit status tracking.',
    details: [
      'Secure forms and file uploads',
      'Permit workflow integration with backend via webhooks',
      'Map-driven permit search and printable permit summaries'
    ],
    technologies: ['Experience Builder', 'ArcGIS Online', 'ArcGIS API for JavaScript'],
    icon: LayoutDashboard,
    featured: false,
  },
];

const allProjects = baseProjects.map((p) => ({
  ...p,
  image: p.image ?? projectImageById[p.id],
}));

const featuredCardSpotlightStyle: CSSProperties = {
  background:
    'radial-gradient(320px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(46, 196, 182, 0.22) 0%, rgba(46, 196, 182, 0) 62%)',
  opacity: 'var(--spot-opacity, 0)',
};

const compactCardSpotlightStyle: CSSProperties = {
  background:
    'radial-gradient(260px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(46, 196, 182, 0.18) 0%, rgba(46, 196, 182, 0) 62%)',
  opacity: 'var(--spot-opacity, 0)',
};

export default function Projects() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const filterWrapRef = useRef<HTMLDivElement>(null);
  const filterPillRef = useRef<HTMLDivElement>(null);
  const filterBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const featuredRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);
  const [activeShowcaseId, setActiveShowcaseId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<ProjectSort>('recent');

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  }, []);

  const reduceEffects = useMemo(() => shouldReduceEffects(), []);
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const categoryCounts = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const c of projectCategories) acc[c] = 0;
    for (const p of allProjects) acc[p.category] = (acc[p.category] ?? 0) + 1;
    acc['All'] = allProjects.length;
    return acc;
  }, []);

  const filteredProjects = useMemo(() => {
    const inCategory =
      activeFilter === 'All'
        ? allProjects
        : allProjects.filter((project) => project.category === activeFilter);

    const bySearch = normalizedSearch
      ? inCategory.filter((project) => {
          const searchable = [
            project.title,
            project.client,
            project.category,
            project.description,
            ...project.technologies,
            ...project.details,
          ]
            .join(' ')
            .toLowerCase();
          return searchable.includes(normalizedSearch);
        })
      : inCategory;

    const sorted = [...bySearch];
    if (sortBy === 'title') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'category') {
      sorted.sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title));
    } else {
      sorted.sort((a, b) => b.id - a.id);
    }

    return sorted;
  }, [activeFilter, normalizedSearch, sortBy]);

  const visibleFeatured = filteredProjects.filter((project) => project.featured);
  const visibleProjects = filteredProjects.filter((project) => !project.featured);
  const visibleProjectSequence = useMemo(
    () => [...visibleFeatured, ...visibleProjects],
    [visibleFeatured, visibleProjects]
  );
  const visibleProjectIds = useMemo(
    () => [...visibleFeatured, ...visibleProjects].map((project) => project.id),
    [visibleFeatured, visibleProjects]
  );
  const activeShowcaseProject = useMemo(
    () =>
      visibleProjectSequence.find((project) => project.id === activeShowcaseId) ??
      visibleProjectSequence[0] ??
      null,
    [activeShowcaseId, visibleProjectSequence]
  );
  const activeShowcaseIndex = activeShowcaseProject
    ? visibleProjectSequence.findIndex((project) => project.id === activeShowcaseProject.id)
    : -1;
  const activeProject = activeProjectId ? allProjects.find((p) => p.id === activeProjectId) : null;
  const activeCategoryMeta = activeProject ? metaForCategory(activeProject.category) : categoryMeta['Other'];
  const activeProjectIndex = activeProjectId == null ? -1 : visibleProjectIds.indexOf(activeProjectId);
  const canGoPrevProject = activeProjectIndex > 0;
  const canGoNextProject = activeProjectIndex >= 0 && activeProjectIndex < visibleProjectIds.length - 1;
  const selectedCategoryCount = activeFilter === 'All' ? allProjects.length : categoryCounts[activeFilter] ?? 0;
  const totalVisibleCount = visibleProjectIds.length;
  const hasActiveRefinement = activeFilter !== 'All' || normalizedSearch.length > 0 || sortBy !== 'recent';

  const goToPrevProject = () => {
    if (!canGoPrevProject) return;
    const prevId = visibleProjectIds[activeProjectIndex - 1];
    if (prevId != null) setActiveProjectId(prevId);
  };

  const goToNextProject = () => {
    if (!canGoNextProject) return;
    const nextId = visibleProjectIds[activeProjectIndex + 1];
    if (nextId != null) setActiveProjectId(nextId);
  };

  const goToPrevShowcase = () => {
    if (visibleProjectSequence.length === 0) return;
    if (activeShowcaseIndex <= 0) {
      setActiveShowcaseId(visibleProjectSequence[visibleProjectSequence.length - 1].id);
      return;
    }
    setActiveShowcaseId(visibleProjectSequence[activeShowcaseIndex - 1].id);
  };

  const goToNextShowcase = () => {
    if (visibleProjectSequence.length === 0) return;
    if (activeShowcaseIndex < 0 || activeShowcaseIndex >= visibleProjectSequence.length - 1) {
      setActiveShowcaseId(visibleProjectSequence[0].id);
      return;
    }
    setActiveShowcaseId(visibleProjectSequence[activeShowcaseIndex + 1].id);
  };

  const handleCardPointerMove = (event: MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion || reduceEffects) return;
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    card.style.setProperty('--spot-x', `${x}px`);
    card.style.setProperty('--spot-y', `${y}px`);
    card.style.setProperty('--spot-opacity', '1');
  };

  const handleCardPointerLeave = (event: MouseEvent<HTMLElement>) => {
    const card = event.currentTarget;
    card.style.setProperty('--spot-opacity', '0');
  };

  useEffect(() => {
    if (visibleProjectSequence.length === 0) {
      setActiveShowcaseId(null);
      return;
    }
    if (activeShowcaseId == null || !visibleProjectSequence.some((p) => p.id === activeShowcaseId)) {
      setActiveShowcaseId(visibleProjectSequence[0].id);
    }
  }, [activeShowcaseId, visibleProjectSequence]);

  useEffect(() => {
    if (activeProjectId == null) return;
    if (visibleProjectIds.length === 0) {
      setActiveProjectId(null);
      return;
    }
    if (!visibleProjectIds.includes(activeProjectId)) {
      setActiveProjectId(visibleProjectIds[0]);
    }
  }, [activeProjectId, visibleProjectIds]);

  useEffect(() => {
    if (activeProjectId == null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && canGoPrevProject) {
        event.preventDefault();
        const prevId = visibleProjectIds[activeProjectIndex - 1];
        if (prevId != null) setActiveProjectId(prevId);
      }
      if (event.key === 'ArrowRight' && canGoNextProject) {
        event.preventDefault();
        const nextId = visibleProjectIds[activeProjectIndex + 1];
        if (nextId != null) setActiveProjectId(nextId);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeProjectId, activeProjectIndex, canGoNextProject, canGoPrevProject, visibleProjectIds]);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const filter = filterRef.current;

    if (!section || !heading || !filter) return;

    if (prefersReducedMotion || reduceEffects) return;

    const ctx = gsap.context(() => {
      const headingItems = heading.querySelectorAll('[data-anim]');
      gsap.fromTo(
        headingItems,
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.06,
          scrollTrigger: {
            trigger: heading,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Filter animation
      gsap.fromTo(
        filter,
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: filter,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );

    }, section);

    return () => ctx.revert();
  }, [prefersReducedMotion, reduceEffects]);

  useEffect(() => {
    const section = sectionRef.current;
    const featured = featuredRef.current;
    if (!section || !featured) return;
    if (prefersReducedMotion || reduceEffects) return;

    const ctx = gsap.context(() => {
      const strips = Array.from(featured.querySelectorAll<HTMLElement>('.project-strip'));
      if (strips.length === 0) return;

      gsap.fromTo(
        strips,
        { y: 18, opacity: 0, x: -10 },
        {
          y: 0,
          opacity: 1,
          x: 0,
          duration: 0.55,
          ease: 'power2.out',
          stagger: 0.04,
          clearProps: 'transform,opacity',
        }
      );
    }, section);

    return () => ctx.revert();
  }, [activeFilter, normalizedSearch, sortBy, prefersReducedMotion, reduceEffects]);

  useEffect(() => {
    const section = sectionRef.current;
    const projects = projectsRef.current;
    if (!section || !projects) return;
    if (prefersReducedMotion || reduceEffects) return;

    const ctx = gsap.context(() => {
      const cards = Array.from(projects.querySelectorAll<HTMLElement>('.project-stage-panel'));
      gsap.fromTo(
        cards,
        { y: 22, opacity: 0, scale: 0.985 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
        }
      );
    }, section);
    return () => ctx.revert();
  }, [activeFilter, normalizedSearch, sortBy, prefersReducedMotion, reduceEffects]);

  const setFilterBtnRef =
    (key: string) =>
    (el: HTMLButtonElement | null) => {
      filterBtnRefs.current[key] = el;
    };

  const moveFilterPillTo = (key: string, immediate = false) => {
    const container = filterWrapRef.current;
    const pill = filterPillRef.current;
    if (!container || !pill) return;

    const target = filterBtnRefs.current[key];
    if (!target) {
      pill.style.opacity = '0';
      return;
    }

    const c = container.getBoundingClientRect();
    const t = target.getBoundingClientRect();
    const x = Math.round(t.left - c.left);
    const y = Math.round(t.top - c.top);
    const w = Math.round(t.width);
    const h = Math.round(t.height);

    pill.style.opacity = '1';

    if (immediate || prefersReducedMotion) {
      const prev = pill.style.transitionDuration;
      pill.style.transitionDuration = '0ms';
      pill.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      pill.style.width = `${w}px`;
      pill.style.height = `${h}px`;
      pill.getBoundingClientRect();
      pill.style.transitionDuration = prev;
      return;
    }

    pill.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    pill.style.width = `${w}px`;
    pill.style.height = `${h}px`;
  };

  useLayoutEffect(() => {
    moveFilterPillTo(activeFilter, true);
  }, [activeFilter]);

  useEffect(() => {
    const onResize = () => moveFilterPillTo(activeFilter, true);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [activeFilter]);

  const resetRefinements = () => {
    setActiveFilter('All');
    setSearchTerm('');
    setSortBy('recent');
  };

  const renderProjectStrip = (project: Project, index: number) => {
    const categoryMetaItem = metaForCategory(project.category);
    const isActive = activeShowcaseProject?.id === project.id;

    return (
      <button
        key={project.id}
        type="button"
        onClick={() => setActiveShowcaseId(project.id)}
        onDoubleClick={() => setActiveProjectId(project.id)}
        onMouseEnter={() => setActiveShowcaseId(project.id)}
        onFocus={() => setActiveShowcaseId(project.id)}
        onMouseMove={handleCardPointerMove}
        onMouseLeave={handleCardPointerLeave}
        className={cn(
          'project-strip group relative w-full overflow-hidden rounded-xl border px-4 py-4 text-left transition-all duration-300',
          isActive
            ? 'border-teal/45 bg-slate-900/75 shadow-[0_18px_46px_rgba(0,0,0,0.32)] translate-x-1'
            : 'border-slate-700/40 bg-slate-900/38 hover:border-slate-600/70 hover:bg-slate-900/55'
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] transition-opacity duration-300 ease-out"
          style={compactCardSpotlightStyle}
        />
        <div className={cn('absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b', categoryMetaItem.lineClass)} />
        <div className="relative z-[2]">
          <div className="flex items-center justify-between gap-2 mb-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">
              {String(index + 1).padStart(2, '0')} · {project.category}
            </p>
            {project.featured ? (
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] rounded-md border border-teal/35 bg-teal/10 text-teal px-2 py-0.5">
                featured
              </span>
            ) : null}
          </div>
          <h4 className="font-display font-semibold text-lg text-slate-50 mb-1.5 line-clamp-2">
            {project.title}
          </h4>
          <p className="text-sm text-slate-300 line-clamp-2 mb-3">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 3).map((tech, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-[11px] rounded-md border border-slate-700/60 bg-slate-900/55 text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </button>
    );
  };

  return (
    <section ref={sectionRef} id="projects" className="relative bg-navy z-40 py-24">
      {/* Grid Overlay */}
      <div className="absolute inset-0 grid-overlay z-[1]" />
      
      {/* Vignette */}
      <div className="absolute inset-0 vignette z-[2]" />
      
      {/* Noise Overlay */}
      <div className="absolute inset-0 noise-overlay z-[3]" />

      <div className="relative z-[4] site-gutter">
        {/* Heading */}
        <div
          ref={headingRef}
          className="relative mb-14 overflow-hidden rounded-lg border border-slate-700/40 bg-slate-900/20"
        >
           <div className="projects-aurora" />
           <div className="absolute inset-0 grid-overlay opacity-20" />
           <div className="relative z-[1] p-6 sm:p-10">
            <div className="grid grid-cols-1 gap-10 items-start">
              <div>
                <span
                  data-anim
                  className="font-mono text-sm text-teal tracking-[0.15em] uppercase mb-4 block"
                >
                  Work
                </span>

                <h2
                  data-anim
                  className="font-display font-bold text-display-2 text-slate-50 mb-4"
                >
                  Projects that ship. Data you can trust.
                </h2>

                <p data-anim className="text-lg text-slate-200 leading-relaxed max-w-3xl">
                  A selection of GIS and frontend delivery across government, utilities, and product work:
                  enterprise geodatabases, utility networks, field data capture, web mapping, and dashboards.
                  Each project emphasizes clarity, QA/QC, and performance.
                </p>

                <div data-anim className="mt-6 flex flex-wrap gap-2">
                  {['Web Apps', 'Dashboards', 'Web Mapping', 'Design Systems', 'Automation', 'QA/QC'].map((tag) => {
                    const isActiveTag = normalizedSearch === tag.toLowerCase();
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setSearchTerm(tag)}
                        className={cn(
                          'px-3 py-1 border text-xs rounded-lg transition-colors',
                          isActiveTag
                            ? 'bg-teal/15 border-teal/35 text-teal'
                            : 'bg-slate-900/35 border-slate-700/50 text-slate-300 hover:text-slate-100 hover:border-slate-600/70'
                        )}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>

                <div data-anim className="mt-7 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('projects-featured');
                      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-teal hover:bg-teal-dark text-navy font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Browse Interactive Lane
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/gallery')}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900/40 border border-slate-700/60 text-slate-200 hover:text-teal hover:border-teal/40 rounded-lg transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Related Visuals
                  </button>
                  <a
                    href="mailto:saadbarghouth11@gmail.com"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-teal/10 border border-teal/30 text-teal hover:bg-teal/15 hover:border-teal/50 rounded-lg transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Discuss a project
                  </a>
                </div>

                <p data-anim className="mt-6 font-mono text-xs text-slate-500 max-w-3xl">
                  Double-click any project to open full details.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div
          ref={filterRef}
          id="projects-controls"
          className="mb-10 rounded-lg border border-slate-700/50 bg-slate-900/20 p-4 sm:p-5"
        >
          <div className="flex flex-wrap items-center gap-3">
            <div className="font-mono text-xs text-slate-400 uppercase tracking-[0.14em]">Filter</div>

            <div
              ref={filterWrapRef}
              className="relative flex flex-wrap items-center gap-2"
              onMouseLeave={() => moveFilterPillTo(activeFilter)}
            >
              <div
                ref={filterPillRef}
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0 rounded-lg border border-teal/25 bg-teal/10 opacity-0 transition-[transform,width,height,opacity] duration-300 ease-out"
                style={{ width: 0, height: 0, transform: 'translate3d(0px, 0px, 0)' }}
              />

              {projectCategories.map((category) => {
                const isActive = activeFilter === category;
                const count = categoryCounts[category] ?? 0;
                return (
                  <button
                    key={category}
                    ref={setFilterBtnRef(category)}
                    onMouseEnter={() => moveFilterPillTo(category)}
                    onFocus={() => moveFilterPillTo(category)}
                    onBlur={() => moveFilterPillTo(activeFilter)}
                    onClick={() => setActiveFilter(category)}
                    className={cn(
                      'relative z-[1] inline-flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm border border-transparent transition-colors duration-300',
                      isActive ? 'text-teal' : 'text-slate-300 hover:text-slate-50'
                    )}
                  >
                    <span>{category}</span>
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-lg border text-xs',
                        isActive
                          ? 'bg-teal/15 border-teal/25 text-teal'
                          : 'bg-slate-900/35 border-slate-700/50 text-slate-400'
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 border-t border-slate-700/40 pt-4 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_240px_auto] gap-3">
            <div className="relative">
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by title, client, category, or technology..."
                className="w-full px-3 pr-10 h-11 rounded-lg bg-slate-900/45 border border-slate-700/55 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-teal/50 focus:ring-2 focus:ring-teal/20"
              />
              {searchTerm ? (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800/70 transition-colors"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em]">Clear</span>
                </button>
              ) : null}
            </div>

            <div className="flex items-center h-11 rounded-lg bg-slate-900/45 border border-slate-700/55 px-3">
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as ProjectSort)}
                className="w-full bg-transparent text-sm text-slate-200 focus:outline-none"
              >
                <option value="recent" className="bg-slate-900 text-slate-200">Sort: Newest first</option>
                <option value="title" className="bg-slate-900 text-slate-200">Sort: Title A-Z</option>
                <option value="category" className="bg-slate-900 text-slate-200">Sort: Category</option>
              </select>
            </div>

            <button
              type="button"
              onClick={resetRefinements}
              disabled={!hasActiveRefinement}
              className={cn(
                'h-11 px-4 rounded-lg border font-mono text-xs uppercase tracking-[0.1em] transition-colors',
                hasActiveRefinement
                  ? 'border-teal/35 text-teal bg-teal/10 hover:bg-teal/15 hover:border-teal/50'
                  : 'border-slate-700/55 text-slate-500 bg-slate-900/30 cursor-not-allowed'
              )}
            >
              Reset
            </button>
          </div>

          <p className="mt-3 font-mono text-xs text-slate-500">
            Showing {totalVisibleCount} result{totalVisibleCount === 1 ? '' : 's'}
            {normalizedSearch ? ` for "${searchTerm.trim()}"` : ''}
            {activeFilter !== 'All' ? ` in ${activeFilter}` : ' across all categories'}.
          </p>
        </div>

        <div className="mb-4">
          <h3 className="font-display font-semibold text-display-3 text-slate-100 mb-2">
            A Different Interactive Projects Experience
          </h3>
          <p className="text-sm text-slate-400 max-w-3xl">
            Pick any project from the lane on the left to instantly change the stage. Double-click any item to open full details.
          </p>
        </div>

        {visibleProjectSequence.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] gap-5 mb-8">
            <div
              ref={featuredRef}
              id="projects-featured"
              className="rounded-2xl border border-slate-700/50 bg-slate-900/25 overflow-hidden"
            >
              <div className="px-4 sm:px-5 py-4 border-b border-slate-700/45 bg-slate-900/45">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-teal">Project Lane</p>
                  <p className="font-mono text-xs text-slate-500">
                    {totalVisibleCount} items available
                  </p>
                </div>
              </div>
              <div className="max-h-[720px] overflow-y-auto p-3 sm:p-4 space-y-2" data-testid="projects-grid">
                {visibleProjectSequence.map((project, index) => renderProjectStrip(project, index))}
              </div>
            </div>

            <div ref={projectsRef} className="project-stage-anim lg:sticky lg:top-24 h-fit">
              {activeShowcaseProject ? (
                <div className="project-stage-panel relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/30">
                  <div
                    aria-hidden="true"
                    className={cn(
                      'absolute inset-0 bg-gradient-to-br opacity-65',
                      metaForCategory(activeShowcaseProject.category).panelClass
                    )}
                    style={featuredCardSpotlightStyle}
                  />
                  <div className="relative z-[1] p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="min-w-0">
                        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-teal mb-1.5">
                          {activeShowcaseProject.category}
                        </p>
                        <h4 className="font-display font-bold text-2xl text-slate-50 leading-tight">
                          {activeShowcaseProject.title}
                        </h4>
                        <p className="font-mono text-xs text-slate-500 mt-2 truncate">
                          {activeShowcaseProject.client}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-xs text-slate-500">index</p>
                        <p className="font-display text-slate-200 text-lg">
                          {Math.max(activeShowcaseIndex + 1, 1)}/{visibleProjectSequence.length}
                        </p>
                      </div>
                    </div>

                    <div className="h-1 rounded-full bg-slate-800/75 overflow-hidden mb-5">
                      <div
                        className="h-full bg-gradient-to-r from-teal to-cyan-300 transition-all duration-500"
                        style={{
                          width: `${Math.max(
                            6,
                            ((Math.max(activeShowcaseIndex, 0) + 1) / Math.max(visibleProjectSequence.length, 1)) * 100
                          )}%`,
                        }}
                      />
                    </div>

                    <div className="relative rounded-xl border border-slate-700/50 overflow-hidden h-56 sm:h-64 mb-5 bg-slate-900/40">
                      {activeShowcaseProject.image ? (
                        <>
                          <img
                            src={activeShowcaseProject.image}
                            alt={`${activeShowcaseProject.title} preview`}
                            className="absolute inset-0 h-full w-full object-cover object-center"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />
                        </>
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/70 via-slate-900/65 to-navy flex items-center justify-center">
                          <p className="font-display text-4xl sm:text-5xl text-slate-200/20 tracking-tight text-center px-5">
                            {activeShowcaseProject.category}
                          </p>
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3 rounded-lg border border-slate-600/45 bg-navy/65 px-3 py-1.5 backdrop-blur-sm">
                        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-300">
                          interactive spotlight
                        </p>
                      </div>
                    </div>

                    <p className="text-slate-300 leading-relaxed mb-5">
                      {activeShowcaseProject.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                      <div className="rounded-xl border border-slate-700/45 bg-slate-900/35 p-3">
                        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-slate-500 mb-2">
                          key moves
                        </p>
                        <ul className="space-y-2">
                          {activeShowcaseProject.details.slice(0, 3).map((detail, i) => (
                            <li key={i} className="text-xs text-slate-300 leading-relaxed">
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-xl border border-slate-700/45 bg-slate-900/35 p-3">
                        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-slate-500 mb-2">
                          stack
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {activeShowcaseProject.technologies.map((tech, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 text-[11px] rounded-md border border-slate-700/65 bg-slate-900/55 text-slate-200"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={goToPrevShowcase}
                        className="px-4 py-2 rounded-lg border border-slate-700/55 bg-slate-900/45 text-slate-200 hover:text-teal hover:border-teal/40 transition-colors"
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={goToNextShowcase}
                        className="px-4 py-2 rounded-lg border border-slate-700/55 bg-slate-900/45 text-slate-200 hover:text-teal hover:border-teal/40 transition-colors"
                      >
                        Next
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveProjectId(activeShowcaseProject.id)}
                        className="px-4 py-2 rounded-lg border border-teal/35 bg-teal/10 text-teal hover:bg-teal/15 hover:border-teal/50 transition-colors"
                      >
                        Open Full Details
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-slate-700/50 bg-slate-900/20 p-6 mb-8">
            <p className="text-sm text-slate-300 leading-relaxed">
              No projects match your current search or filters.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={resetRefinements}
                className="px-4 py-2 bg-teal/10 border border-teal/30 text-teal hover:bg-teal/15 hover:border-teal/50 rounded-lg transition-all duration-300"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Project Count */}
        <div className="mt-12 text-center">
          <p className="font-mono text-sm text-slate-500">
            Showing {totalVisibleCount} of {selectedCategoryCount} in scope ({allProjects.length} total projects)
          </p>
        </div>
      </div>

      {/* Project Details Modal */}
      <Dialog
        open={activeProjectId != null}
        onOpenChange={(open) => {
          if (!open) setActiveProjectId(null);
        }}
      >
        <DialogContent className="bg-navy border border-slate-700/60 text-slate-100 sm:max-w-4xl">
          <DialogTitle className="sr-only">
            {activeProject ? activeProject.title : 'Project details'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {activeProject ? `${activeProject.client} - ${activeProject.category}` : 'Project details dialog'}
          </DialogDescription>
          {activeProject ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Visual */}
              <div className="lg:col-span-5">
                <div className={cn(
                  'relative rounded-lg overflow-hidden border border-slate-700/40 bg-gradient-to-br h-64 lg:h-full',
                  'from-slate-800 via-slate-900 to-navy',
                  accentFor(activeProject.category)
                )}>
                  {activeProject.image ? (
                    <>
                      <img
                        src={activeProject.image}
                        alt={`${activeProject.title} preview`}
                        className="absolute inset-0 h-full w-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/35 to-navy/10" />
                      <div className="absolute right-4 top-4 rounded-lg border border-slate-500/50 bg-navy/60 px-2.5 py-1.5 backdrop-blur-sm">
                        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-teal/90">
                          Preview
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 opacity-30">
                        <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="font-display text-4xl text-slate-200/20 tracking-tight px-6 text-center">
                          {activeProject.category}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-7">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span
                      className={cn(
                        'inline-flex rounded-lg border px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.12em] mb-2',
                        activeCategoryMeta.chipClass
                      )}
                    >
                      {activeProject.category}
                    </span>
                    <p className="font-mono text-xs text-slate-500 tracking-[0.1em] uppercase mb-2">
                      {activeProject.client}
                    </p>
                    <h3 className="font-display font-semibold text-2xl text-slate-50">
                      {activeProject.title}
                    </h3>
                  </div>
                  <div className="hidden sm:flex items-center gap-2">
                    <button
                      type="button"
                      onClick={goToPrevProject}
                      disabled={!canGoPrevProject}
                      aria-label="Previous project"
                      className={cn(
                        'inline-flex items-center justify-center w-9 h-9 rounded-lg border transition-colors',
                        canGoPrevProject
                          ? 'border-slate-700/55 text-slate-300 hover:text-teal hover:border-teal/40'
                          : 'border-slate-800 text-slate-600 cursor-not-allowed'
                      )}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={goToNextProject}
                      disabled={!canGoNextProject}
                      aria-label="Next project"
                      className={cn(
                        'inline-flex items-center justify-center w-9 h-9 rounded-lg border transition-colors',
                        canGoNextProject
                          ? 'border-slate-700/55 text-slate-300 hover:text-teal hover:border-teal/40'
                          : 'border-slate-800 text-slate-600 cursor-not-allowed'
                      )}
                    >
                      Next
                    </button>
                  </div>
                </div>
                {activeProjectIndex >= 0 ? (
                  <p className="font-mono text-[11px] text-slate-500 mb-4">
                    Project {activeProjectIndex + 1} of {visibleProjectIds.length} in current results
                  </p>
                ) : null}
                <p className="text-slate-300 leading-relaxed mb-5">
                  {activeProject.description}
                </p>

                {activeProject.details?.length ? (
                  <div className="mb-6">
                    <p className="font-mono text-xs text-slate-400 uppercase tracking-wide mb-3">
                      Key Contributions
                    </p>
                    <ul className="space-y-2">
                      {activeProject.details.map((d, i) => (
                        <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-teal/70 rounded-full mt-2 flex-shrink-0" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div>
                  <p className="font-mono text-xs text-slate-400 uppercase tracking-wide mb-3">
                    Tools & Technologies
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.technologies.map((t, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-slate-800/40 border border-slate-700/40 text-slate-200 text-xs font-mono rounded-lg"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href="mailto:saadbarghouth11@gmail.com"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-teal hover:bg-teal-dark text-navy font-semibold rounded-lg transition-colors"
                  >
                    Discuss a similar project
                  </a>
                  <button
                    type="button"
                    onClick={goToPrevProject}
                    disabled={!canGoPrevProject}
                    className={cn(
                      'sm:hidden inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
                      canGoPrevProject
                        ? 'bg-slate-900/40 border-slate-700/60 text-slate-200 hover:text-teal hover:border-teal/40'
                        : 'bg-slate-900/30 border-slate-800 text-slate-600 cursor-not-allowed'
                    )}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={goToNextProject}
                    disabled={!canGoNextProject}
                    className={cn(
                      'sm:hidden inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
                      canGoNextProject
                        ? 'bg-slate-900/40 border-slate-700/60 text-slate-200 hover:text-teal hover:border-teal/40'
                        : 'bg-slate-900/30 border-slate-800 text-slate-600 cursor-not-allowed'
                    )}
                  >
                    Next
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveProjectId(null)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/40 border border-slate-700/60 text-slate-200 hover:text-teal hover:border-teal/40 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}


