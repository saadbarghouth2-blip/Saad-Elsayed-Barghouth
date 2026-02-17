import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ComponentType, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  AppWindow,
  BarChart3,
  Blocks,
  Briefcase,
  ChevronLeft,
  ChevronRight,
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

const projectCategories = ['All', 'Ministry of Transport', 'NUCA', 'Frontend', 'ArcGIS Online', 'Training', 'Other'];

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
  'Training': {
    chipClass: 'bg-emerald-300/12 border-emerald-300/25 text-emerald-200',
    lineClass: 'from-emerald-300/70 via-teal/55 to-transparent',
    panelClass: 'from-emerald-300/25 via-teal/12 to-transparent',
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

function projectMatchesSearch(project: Project, normalizedSearch: string): boolean {
  if (!normalizedSearch) return true;

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
  {
    id: 34,
    title: 'ArcGIS Online - Fleet Tracker',
    client: 'Logistics Co.',
    category: 'ArcGIS Online',
    description: 'Real-time fleet tracking and dispatch using hosted feature layers and dashboards.',
    details: [
      'Live vehicle tracking with webhook-driven updates',
      'Route optimization and ETA predictions',
      'Driver performance reports and history'
    ],
    technologies: ['ArcGIS Online', 'Hosted Feature Layers', 'Dashboards', 'ArcGIS API for JavaScript'],
    icon: Satellite,
    featured: false,
  },
  {
    id: 35,
    title: 'ArcGIS Online - Land Use Insights',
    client: 'Urban Planning',
    category: 'ArcGIS Online',
    description: 'Public-facing insights portal for land use statistics and downloadable data.',
    details: [
      'Interactive map-driven charts',
      'Automated open-data exports',
      'Scheduled reports and embeds'
    ],
    technologies: ['ArcGIS Online', 'ArcGIS Hub', 'Dashboards'],
    icon: Globe,
    featured: false,
  },
  {
    id: 36,
    title: 'ArcGIS Online - Asset Inspection Operations Hub',
    client: 'Municipal Operations',
    category: 'ArcGIS Online',
    description: 'Unified inspection hub for roads, lighting, and public assets with live QA/QC and daily status tracking.',
    details: [
      'Field Maps + Survey123 workflows with validation rules and attachment standards',
      'Dashboards for SLA monitoring, overdue tasks, and contractor productivity',
      'Automated weekly summary exports for engineering and management'
    ],
    technologies: ['ArcGIS Online', 'Field Maps', 'Survey123', 'Dashboards'],
    icon: MapPin,
    featured: true,
  },
  {
    id: 37,
    title: 'Experience Builder - Infrastructure Defect Reporter',
    client: 'City Maintenance Authority',
    category: 'ArcGIS Online',
    description: 'Public + internal defect reporting app for potholes, signage, and sidewalk damage with triage workflows.',
    details: [
      'Custom intake forms with category-specific required fields',
      'Priority-based routing logic for district teams and supervisors',
      'Live map view for open, assigned, and closed cases'
    ],
    technologies: ['Experience Builder', 'ArcGIS Online', 'Survey123', 'Hosted Feature Layers'],
    icon: LayoutDashboard,
    featured: false,
  },
  {
    id: 38,
    title: 'ArcGIS Online - Water Leak Response Control Room',
    client: 'Water Utility',
    category: 'ArcGIS Online',
    description: 'Operations control room for leak incidents, crew dispatch, and restoration timelines across service zones.',
    details: [
      'Near real-time incident feed with webhook integration',
      'Zone-based dispatch board with crew status and estimated closure',
      'Post-incident analytics for repeated hotspots and response efficiency'
    ],
    technologies: ['ArcGIS Online', 'Dashboards', 'ArcGIS API for JavaScript', 'Webhooks'],
    icon: Satellite,
    featured: true,
  },
  {
    id: 39,
    title: 'ArcGIS Hub - School Transport Safety Map',
    client: 'Education Department',
    category: 'ArcGIS Online',
    description: 'Safety and operations portal for school bus routes, pickup points, and incident reporting.',
    details: [
      'Public-safe route maps with geofenced stops and route updates',
      'Operations dashboard for delays, incidents, and route coverage',
      'Community forms for route feedback and service requests'
    ],
    technologies: ['ArcGIS Hub', 'ArcGIS Online', 'Dashboards', 'Survey123'],
    icon: Route,
    featured: false,
  },
  {
    id: 40,
    title: 'ArcGIS Online - Permit Review & Site Visit Suite',
    client: 'Urban Development Authority',
    category: 'ArcGIS Online',
    description: 'End-to-end permitting workspace from application intake to site visit scheduling and final review.',
    details: [
      'Permit application board with map-based parcel context',
      'Inspector itinerary maps and offline visit forms',
      'Executive dashboard for turnaround time and backlog control'
    ],
    technologies: ['ArcGIS Online', 'Experience Builder', 'Field Maps', 'Dashboards'],
    icon: Globe,
    featured: false,
  },
  {
    id: 41,
    title: 'Frontend - Multi-tenant SaaS Billing Portal',
    client: 'B2B SaaS Platform',
    category: 'Frontend',
    description: 'Self-service billing and subscription portal with usage breakdown, invoicing, and plan management.',
    details: [
      'Tenant-aware workspace with role-based access and scoped data views',
      'Usage analytics with searchable invoice history and export options',
      'Resilient API-state handling for retries, loading, and edge-case errors'
    ],
    technologies: ['React', 'TypeScript', 'TanStack Query', 'Tailwind CSS', 'Stripe API'],
    icon: AppWindow,
    featured: true,
  },
  {
    id: 42,
    title: 'Frontend - AI Support Agent Workspace',
    client: 'Customer Experience Team',
    category: 'Frontend',
    description: 'Agent console combining tickets, AI suggestions, and customer timeline in one responsive workflow.',
    details: [
      'Split-pane UI for conversation, context, and recommended actions',
      'Realtime updates for ticket status and collaboration notes',
      'Keyboard-first interaction model for faster handling under load'
    ],
    technologies: ['React', 'TypeScript', 'WebSocket', 'Redux Toolkit', 'Tailwind CSS'],
    icon: LayoutDashboard,
    featured: false,
  },
  {
    id: 43,
    title: 'Frontend - Healthcare Appointments Dashboard',
    client: 'Digital Health Provider',
    category: 'Frontend',
    description: 'Operational dashboard for appointment flow, referral tracking, and no-show reduction.',
    details: [
      'Timeline components for booking-to-visit lifecycle visibility',
      'Smart filters for specialty, clinic, doctor, and status',
      'Actionable alerts for overdue referrals and bottleneck clinics'
    ],
    technologies: ['React', 'TypeScript', 'Recharts', 'React Hook Form', 'Zod'],
    icon: BarChart3,
    featured: false,
  },
  {
    id: 44,
    title: 'Frontend - Ecommerce Performance Cockpit',
    client: 'Retail Group',
    category: 'Frontend',
    description: 'Commerce cockpit for revenue, conversion, campaign performance, and inventory health across channels.',
    details: [
      'Unified KPI board with drill-down by store, campaign, and product line',
      'Fast table virtualization for large product and order datasets',
      'Comparative time-window analytics for tactical decision making'
    ],
    technologies: ['React', 'TypeScript', 'Next.js', 'TanStack Table', 'Recharts'],
    icon: Blocks,
    featured: true,
  },
  {
    id: 45,
    title: 'Frontend - Field Service Dispatch App',
    client: 'Facility Services',
    category: 'Frontend',
    description: 'Dispatch and technician app for job assignment, route planning, and completion reporting.',
    details: [
      'Drag-and-drop dispatch board with technician availability insights',
      'Mobile-optimized task forms with media uploads and checklists',
      'Operational timeline for SLA tracking and escalation handling'
    ],
    technologies: ['React', 'TypeScript', 'PWA', 'Mapbox GL', 'React DnD'],
    icon: Briefcase,
    featured: false,
  },
  {
    id: 46,
    title: 'Transport Program Delivery - Corridor GIS Package',
    client: 'Transport Sector Program',
    category: 'Ministry of Transport',
    description: 'Completed end-to-end GIS delivery for a transport corridor package, from data structuring to final operational handover.',
    details: [
      'Built corridor geodatabase with clean schema, domains, and topology validation',
      'Prepared review maps and a status dashboard for weekly technical follow-up',
      'Delivered handover bundle: layer catalog, QA log, and maintenance workflow'
    ],
    technologies: ['ArcGIS Pro', 'ArcGIS Online', 'Topology', 'Dashboard'],
    icon: Route,
    featured: true,
  },
  {
    id: 47,
    title: 'Training Program - GIS Fundamentals for 20 Engineers',
    client: 'Transport Engineering Cohort',
    category: 'Training',
    description: 'A separate course delivered after project handover to align delivery standards and improve team readiness.',
    details: [
      'Trained 20 engineers through practical labs on coordinate systems, editing, and map design',
      'Used real production-style layers in exercises instead of generic demo datasets',
      'Closed with a practical assessment and readiness checklist for live assignments'
    ],
    technologies: ['GIS Fundamentals', 'ArcGIS Pro', 'Geodatabases', 'Cartography'],
    icon: GraduationCap,
    featured: true,
  },
  {
    id: 48,
    title: 'Online Course - QC & Automation (Iraq Cohort)',
    client: 'Online Professional Cohort - Iraq',
    category: 'Training',
    description: 'Focused online course for reducing QA rework through practical validation routines and automation-first workflow design.',
    details: [
      'Set up topology and attribute checks with clear issue categorization',
      'Introduced scripted checks for repeatable quality gates before publishing',
      'Built a lightweight QA pipeline that teams can run and maintain quickly'
    ],
    technologies: ['ArcGIS Pro', 'Data Reviewer', 'ModelBuilder', 'Python'],
    icon: GraduationCap,
    featured: false,
  },
  {
    id: 49,
    title: 'Workshop Series - ModelBuilder from Zero to Production',
    client: 'Online Professional Cohort - Iraq',
    category: 'Training',
    description: 'Hands-on workflow lab centered on building maintainable ModelBuilder pipelines for repetitive GIS operations.',
    details: [
      'Covered parameterized models, iterators, and conditional branching with real cases',
      'Converted manual geoprocessing chains into reusable batch-ready models',
      'Documented validation steps and fallback scenarios for stable execution'
    ],
    technologies: ['ModelBuilder', 'ArcGIS Pro', 'Geoprocessing', 'Batch Processing'],
    icon: Blocks,
    featured: false,
  },
  {
    id: 50,
    title: 'Applied Training - ArcGIS Online Apps (Saudi Cohort)',
    client: 'Applied GIS Cohort - Saudi Arabia',
    category: 'Training',
    description: 'Application-focused program for building map apps, dashboards, and story-driven outputs on ArcGIS Online.',
    details: [
      'Developed role-specific dashboards for technical and management audiences',
      'Built Experience Builder pages with practical filters and operational widgets',
      'Standardized publishing workflow for hosted layers and update cycles'
    ],
    technologies: ['ArcGIS Online', 'Dashboards', 'Experience Builder', 'StoryMaps'],
    icon: Globe,
    featured: false,
  },
  {
    id: 51,
    title: 'Masterclass - Spatial & Network Analysis (Saudi Cohort)',
    client: 'Applied GIS Cohort - Saudi Arabia',
    category: 'Training',
    description: 'Advanced analysis course combining route logic, service coverage, and spatial decision modeling.',
    details: [
      'Delivered route optimization and service-area labs with realistic constraints',
      'Applied proximity and suitability methods for location-based decisions',
      'Linked analysis outputs to operational maps for immediate team use'
    ],
    technologies: ['Network Analyst', 'Spatial Analysis', 'ArcGIS Pro', 'Service Areas'],
    icon: Route,
    featured: true,
  },
  {
    id: 52,
    title: 'Private Mentorship - GIS Delivery Accelerator',
    client: 'Private 1:1 Program',
    category: 'Training',
    description: 'Private coaching path for analysts moving from tool usage to complete project delivery ownership.',
    details: [
      'Built a personal roadmap across QA/QC, automation, and stakeholder reporting',
      'Reviewed real project files and improved structure, naming, and handover quality',
      'Set delivery templates for kickoff notes, change logs, and final summaries'
    ],
    technologies: ['Delivery Management', 'QA/QC', 'ArcGIS Pro', 'Python'],
    icon: GraduationCap,
    featured: false,
  },
  {
    id: 53,
    title: 'Private Delivery - Retail Site Selection Study',
    client: 'Private Commercial Client',
    category: 'Other',
    description: 'Delivered a fast-turn GIS suitability study for selecting new branch locations in high-opportunity zones.',
    details: [
      'Prepared weighted suitability model using accessibility and demand indicators',
      'Ranked candidate zones and generated short-list maps for decision meetings',
      'Delivered executive-ready summary with map exports and recommendation notes'
    ],
    technologies: ['ArcGIS Pro', 'Spatial Analysis', 'Suitability Modeling', 'StoryMaps'],
    icon: Briefcase,
    featured: true,
  },
  {
    id: 54,
    title: 'Private Delivery - Property Inventory Web Map',
    client: 'Private Real Estate Team',
    category: 'ArcGIS Online',
    description: 'Built an internal web GIS workspace for tracking assets, occupancy status, and field inspection updates.',
    details: [
      'Configured hosted layers with editing templates and data-entry controls',
      'Built management dashboard for occupancy, inspection backlog, and updates',
      'Provided handover guide to keep updates consistent across teams'
    ],
    technologies: ['ArcGIS Online', 'Hosted Feature Layers', 'Dashboards', 'Field Maps'],
    icon: LayoutDashboard,
    featured: false,
  },
  {
    id: 55,
    title: 'Private Delivery - Utility Asset QA/QC Sprint',
    client: 'Private Utilities Contractor',
    category: 'Other',
    description: 'Short delivery sprint focused on cleaning utility layers and stabilizing data quality before publication.',
    details: [
      'Resolved geometry and attribute inconsistencies using repeatable QA checks',
      'Applied topology rules to catch overlaps, gaps, and dangling features',
      'Delivered clean publication-ready dataset with quick validation checklist'
    ],
    technologies: ['ArcGIS Pro', 'Topology', 'Data Reviewer', 'Python'],
    icon: Waves,
    featured: false,
  },
  {
    id: 56,
    title: 'Delivery Sprint (5 Days) - Operations Dashboard Launch',
    client: 'Private Infrastructure Company',
    category: 'ArcGIS Online',
    description: 'A five-day delivery sprint from raw layers to a live operations dashboard used for daily follow-up.',
    details: [
      'Day 1-2: layer audit, schema cleanup, and field normalization',
      'Day 3: published web map with role-based views and filters',
      'Day 4-5: KPI dashboard build, QA pass, and handover runbook'
    ],
    technologies: ['ArcGIS Online', 'Dashboards', 'Hosted Feature Layers', 'QA/QC'],
    icon: LayoutDashboard,
    featured: true,
  },
  {
    id: 57,
    title: 'Delivery Sprint (5 Days) - Utility Basemap Stabilization',
    client: 'Private Engineering Company',
    category: 'Other',
    description: 'Rapid delivery engagement to clean and stabilize utility basemap data for publishing and weekly updates.',
    details: [
      'Resolved geometry conflicts and naming inconsistencies across layers',
      'Applied topology checks to remove overlaps, gaps, and dangling lines',
      'Delivered publish-ready package with a short validation checklist'
    ],
    technologies: ['ArcGIS Pro', 'Topology', 'Data Cleanup', 'Quality Control'],
    icon: Waves,
    featured: false,
  },
  {
    id: 58,
    title: 'Corporate Course - ArcGIS Online Essentials',
    client: 'Internal GIS Team',
    category: 'Training',
    description: 'Structured course focused on building and maintaining web maps, hosted layers, and dashboard views.',
    details: [
      'Explained data publishing flow and layer governance basics',
      'Hands-on labs for map styling, smart popups, and dashboard cards',
      'Final exercise: build a full mini solution from source data to report'
    ],
    technologies: ['ArcGIS Online', 'Dashboards', 'Web Maps', 'Hosted Layers'],
    icon: GraduationCap,
    featured: false,
  },
  {
    id: 59,
    title: 'Corporate Course - QA/QC for Delivery Teams',
    client: 'Internal GIS Team',
    category: 'Training',
    description: 'Practical training path for delivery teams to reduce rework and ship cleaner spatial datasets.',
    details: [
      'Covered validation gates before publishing and before handover',
      'Introduced repeatable QA templates for attributes and geometry',
      'Built team-ready workflow notes for daily and weekly checks'
    ],
    technologies: ['QA/QC', 'ArcGIS Pro', 'Data Reviewer', 'Delivery Standards'],
    icon: GraduationCap,
    featured: false,
  },
  {
    id: 60,
    title: 'Delivery Sprint (5 Days) - Site Selection Brief Pack',
    client: 'Private Retail Company',
    category: 'Other',
    description: 'Five-day GIS delivery for quick site ranking and decision-ready map outputs for management review.',
    details: [
      'Prepared weighted suitability factors and scoring model',
      'Generated ranked candidate zones with map-driven comparisons',
      'Delivered executive brief with recommendations and export-ready maps'
    ],
    technologies: ['Spatial Analysis', 'Suitability Modeling', 'ArcGIS Pro', 'StoryMaps'],
    icon: Briefcase,
    featured: true,
  },
  {
    id: 61,
    title: 'Private Course - Field Maps & Survey123 Bootcamp',
    client: 'Private Field Operations Team',
    category: 'Training',
    description: 'Hands-on course for field data capture standards, validation rules, and reporting cadence.',
    details: [
      'Configured Survey123 forms with required fields and constraints',
      'Set up Field Maps workflows for consistent mobile collection',
      'Connected captured data to simple monitoring dashboards'
    ],
    technologies: ['Survey123', 'Field Maps', 'ArcGIS Online', 'Reporting'],
    icon: MapPin,
    featured: false,
  },
  {
    id: 62,
    title: 'Delivery Sprint (5 Days) - Executive StoryMap Package',
    client: 'Private Stakeholder Team',
    category: 'ArcGIS Online',
    description: 'Short delivery cycle to assemble narrative maps, KPI visuals, and a polished StoryMap for executive communication.',
    details: [
      'Built visual storyline from delivery outputs and analysis snapshots',
      'Prepared dashboard-linked sections for progress and risk highlights',
      'Handed over editable template for future reporting cycles'
    ],
    technologies: ['StoryMaps', 'Dashboards', 'ArcGIS Online', 'Executive Reporting'],
    icon: Globe,
    featured: false,
  },
  {
    id: 63,
    title: 'Delivery Sprint (7 Days) - Asset Readiness Command Pack',
    client: 'Private Operations Company',
    category: 'Other',
    description: 'Seven-day GIS delivery sprint to prepare a clean asset baseline and a management-ready monitoring pack.',
    details: [
      'Day 1-2: source data audit, layer cleanup, and schema alignment',
      'Day 3-5: validation runs, issue resolution, and baseline map packaging',
      'Day 6-7: dashboard setup, delivery briefing, and handover checklist'
    ],
    technologies: ['ArcGIS Pro', 'QA/QC', 'Dashboards', 'Delivery Handover'],
    icon: Briefcase,
    featured: true,
  },
  {
    id: 64,
    title: 'Delivery Sprint (10 Days) - Permit Workflow Digitization',
    client: 'Private Planning Company',
    category: 'ArcGIS Online',
    description: 'Ten-day sprint to digitize permit operations from intake to review status tracking in one map-driven workflow.',
    details: [
      'Built permit intake structure with validation-ready fields and status logic',
      'Configured web maps and dashboards for reviewer queues and progress tracking',
      'Delivered a practical handover pack with publishing and update instructions'
    ],
    technologies: ['ArcGIS Online', 'Dashboards', 'Experience Builder', 'Workflow Design'],
    icon: Globe,
    featured: false,
  },
  {
    id: 65,
    title: 'Private Delivery - Network Maintenance Prioritization Model',
    client: 'Private Asset Management Team',
    category: 'Other',
    description: 'Delivered a GIS prioritization model to rank maintenance interventions based on risk, impact, and accessibility.',
    details: [
      'Modeled weighted maintenance scoring using condition, demand, and service impact factors',
      'Generated ranked intervention layers and decision-ready summary maps',
      'Provided repeatable model settings for periodic refresh and review cycles'
    ],
    technologies: ['Spatial Analysis', 'Network Analysis', 'ArcGIS Pro', 'Decision Support'],
    icon: Building2,
    featured: true,
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

  const searchScopedProjects = useMemo(() => {
    return allProjects.filter((project) => projectMatchesSearch(project, normalizedSearch));
  }, [normalizedSearch]);

  const filterCategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    counts.All = searchScopedProjects.length;

    for (const category of projectCategories) {
      if (category === 'All') continue;
      counts[category] = searchScopedProjects.filter((project) => project.category === category).length;
    }

    return counts;
  }, [searchScopedProjects]);

  const filteredProjects = useMemo(() => {
    const inCategory =
      activeFilter === 'All'
        ? searchScopedProjects
        : searchScopedProjects.filter((project) => project.category === activeFilter);

    const sorted = [...inCategory];
    if (sortBy === 'title') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'category') {
      sorted.sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title));
    } else {
      sorted.sort((a, b) => b.id - a.id);
    }

    return sorted;
  }, [activeFilter, searchScopedProjects, sortBy]);

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

  const scrollFilterTo = (key: string) => {
    const target = filterBtnRefs.current[key];
    if (!target) return;
    target.scrollIntoView({
      block: 'nearest',
      inline: 'center',
      behavior: prefersReducedMotion || reduceEffects ? 'auto' : 'smooth',
    });
  };

  const cycleFilter = (direction: -1 | 1) => {
    const index = projectCategories.indexOf(activeFilter as (typeof projectCategories)[number]);
    const safeIndex = index >= 0 ? index : 0;
    const total = projectCategories.length;

    for (let step = 0; step < total; step += 1) {
      const nextIndex = (safeIndex + direction * (step + 1) + total) % total;
      const nextCategory = projectCategories[nextIndex];
      const count = filterCategoryCounts[nextCategory] ?? 0;
      if (count > 0) {
        setActiveFilter(nextCategory);
        return;
      }
    }
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
    const x = Math.round(t.left - c.left + container.scrollLeft);
    const y = Math.round(t.top - c.top + container.scrollTop);
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
    scrollFilterTo(activeFilter);
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

  const renderProjectStrip = (project: Project) => {
    const categoryMetaItem = metaForCategory(project.category);
    const isActive = activeShowcaseProject?.id === project.id;
    const IconComponent = project.icon;

    return (
      <button
        key={project.id}
        type="button"
        onClick={() => setActiveShowcaseId(project.id)}
        onDoubleClick={() => setActiveProjectId(project.id)}
        className={cn(
          'group relative w-full text-left transition-all duration-300 overflow-hidden rounded-xl sm:rounded-2xl border p-3.5 sm:p-4 lg:p-5 flex flex-col h-full',
          isActive
            ? 'border-teal/45 bg-slate-900/75 shadow-[0_18px_46px_rgba(0,0,0,0.32)] ring-2 ring-teal/20'
            : 'border-slate-700/40 bg-slate-900/38 hover:border-slate-600/70 hover:bg-slate-900/55 hover:shadow-lg'
        )}
        onMouseMove={handleCardPointerMove}
        onMouseLeave={handleCardPointerLeave}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] transition-opacity duration-300 ease-out"
          style={compactCardSpotlightStyle}
        />
        <div className={cn('absolute left-0 top-0 w-full h-1 bg-gradient-to-r', categoryMetaItem.lineClass)} />
        <div className="relative z-[2] flex flex-col h-full">
          <div className="flex items-center gap-1.5 sm:gap-2.5 mb-3 sm:mb-4 flex-wrap">
            <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-teal flex-shrink-0" />
            <span className={cn('px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-semibold border', categoryMetaItem.chipClass)}>
              {project.category}
            </span>
            {project.featured && (
              <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.1em] rounded-md border border-teal/35 bg-teal/10 text-teal px-2 py-0.5">
                featured
              </span>
            )}
          </div>
          <h4 className="font-display font-semibold text-base sm:text-base text-slate-50 mb-1.5 sm:mb-2 line-clamp-2 leading-tight">
            {project.title}
          </h4>
          <p className="text-[11px] sm:text-xs text-slate-400 mb-1.5 sm:mb-2.5 font-mono">
            {project.client}
          </p>
          <p className="text-[13px] sm:text-sm text-slate-300 line-clamp-3 mb-2.5 sm:mb-4 flex-grow">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {project.technologies.slice(0, 2).map((tech, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-[11px] sm:text-[10px] rounded-md border border-slate-700/60 bg-slate-900/55 text-slate-300 whitespace-nowrap"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 2 && (
              <span className="px-2 py-0.5 text-[11px] sm:text-[10px] rounded-md border border-slate-700/50 bg-slate-900/40 text-slate-500 font-semibold">
                more
              </span>
            )}
          </div>
        </div>
      </button>
    );
  };

  return (
    <section ref={sectionRef} id="projects" className="relative bg-navy z-40 py-16 sm:py-24">
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
          className="relative mb-10 sm:mb-14 overflow-hidden rounded-lg border border-slate-700/45 bg-slate-900/25 sm:bg-slate-900/20"
        >
           <div className="projects-aurora" />
           <div className="absolute inset-0 grid-overlay opacity-20" />
           <div className="relative z-[1] p-5 sm:p-10">
            <div className="grid grid-cols-1 gap-10 items-start">
              <div>
                <span
                  data-anim
                  className="font-mono text-xs sm:text-sm text-teal tracking-[0.15em] uppercase mb-3 sm:mb-4 block"
                >
                  Work
                </span>

                <h2
                  data-anim
                  className="font-display font-bold leading-[0.98] mb-4 sm:mb-5 max-w-4xl"
                >
                  <span className="block text-[clamp(30px,8.4vw,56px)] sm:text-display-2 text-slate-50">
                    Projects that ship.
                  </span>
                  <span className="mt-2 inline-flex items-center rounded-lg border border-teal/35 bg-teal/10 px-3 py-1 font-mono text-[11px] sm:text-xs tracking-[0.12em] uppercase text-teal">
                    Data you can trust.
                  </span>
                </h2>

                <p data-anim className="text-sm sm:text-lg text-slate-300 sm:text-slate-200 leading-relaxed max-w-3xl">
                  A selection of GIS and frontend delivery across government, utilities, and product work:
                  enterprise geodatabases, utility networks, field data capture, web mapping, and dashboards.
                  Each project emphasizes clarity, QA/QC, performance, and team enablement through training tracks.
                </p>

                <div data-anim className="mt-5 sm:mt-6 flex flex-wrap gap-2">
                  {['Web Apps', 'Dashboards', 'Web Mapping', 'Design Systems', 'Automation', 'QA/QC', 'Training'].map((tag) => {
                    const isActiveTag = normalizedSearch === tag.toLowerCase();
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setSearchTerm(tag)}
                        className={cn(
                          'px-2.5 sm:px-3 py-1 border text-[11px] sm:text-xs rounded-lg transition-colors',
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

                <div data-anim className="mt-6 sm:mt-7 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('projects-featured');
                      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-5 py-2.5 sm:py-3 bg-teal hover:bg-teal-dark text-navy font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5 touch-target"
                  >
                    Browse Interactive Lane
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/gallery')}
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-5 py-2.5 sm:py-3 bg-slate-900/40 border border-slate-700/60 text-slate-200 hover:text-teal hover:border-teal/40 rounded-lg transition-all duration-300 hover:-translate-y-0.5 touch-target"
                  >
                    Related Visuals
                  </button>
                  <a
                    href="mailto:saadbarghouth11@gmail.com"
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-5 py-2.5 sm:py-3 bg-teal/10 border border-teal/30 text-teal hover:bg-teal/15 hover:border-teal/50 rounded-lg transition-all duration-300 hover:-translate-y-0.5 touch-target"
                  >
                    Discuss a project
                  </a>
                </div>

                <p data-anim className="mt-5 sm:mt-6 font-mono text-[11px] sm:text-xs text-slate-500 max-w-3xl">
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
          className="mb-8 sm:mb-10 rounded-lg border border-slate-700/50 bg-slate-900/20 p-3.5 sm:p-5"
        >
          <div className="flex items-center justify-between gap-2.5">
            <div className="font-mono text-xs text-slate-400 uppercase tracking-[0.14em]">Filter Navigation</div>
            <div className="sm:hidden flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => cycleFilter(-1)}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-700/60 bg-slate-900/30 text-slate-200 hover:text-teal hover:border-teal/40 transition-colors"
                aria-label="Previous filter"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => cycleFilter(1)}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-700/60 bg-slate-900/30 text-slate-200 hover:text-teal hover:border-teal/40 transition-colors"
                aria-label="Next filter"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="mt-1 sm:hidden font-mono text-[11px] tracking-[0.12em] uppercase text-slate-500">
            Active: <span className="text-teal">{activeFilter}</span>
          </p>

          <div className="mt-2.5 sm:mt-3">

            <div
              ref={filterWrapRef}
              className="relative w-full flex items-center gap-1.5 sm:gap-2 overflow-x-auto overflow-y-hidden whitespace-nowrap pb-1 -mb-1 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
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
                const categoryCount = filterCategoryCounts[category] ?? 0;
                const isDisabled = !isActive && categoryCount === 0;
                return (
                  <button
                    key={category}
                    ref={setFilterBtnRef(category)}
                    onMouseEnter={() => {
                      if (!isDisabled) moveFilterPillTo(category);
                    }}
                    onFocus={() => {
                      if (!isDisabled) moveFilterPillTo(category);
                    }}
                    onBlur={() => moveFilterPillTo(activeFilter)}
                    onClick={() => setActiveFilter(category)}
                    disabled={isDisabled}
                    className={cn(
                      'relative z-[1] snap-start shrink-0 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-mono text-xs sm:text-sm border border-transparent transition-colors duration-300',
                      isActive ? 'text-teal' : 'text-slate-300 hover:text-slate-50',
                      isDisabled ? 'opacity-45 cursor-not-allowed hover:text-slate-300' : ''
                    )}
                  >
                    <span>{category}</span>
                    <span className={cn(
                      'inline-flex items-center justify-center min-w-[1.2rem] h-5 px-1 rounded-md border text-[10px] font-semibold',
                      isActive
                        ? 'border-teal/35 bg-teal/12 text-teal'
                        : 'border-slate-700/60 bg-slate-900/55 text-slate-400'
                    )}>
                      {categoryCount}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="sm:hidden mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
              Swipe left/right for all sections.
            </p>
          </div>

          <div className="mt-4 border-t border-slate-700/40 pt-4 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_240px_auto] gap-2.5 sm:gap-3">
            <div className="relative">
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by title, client, category, or technology..."
                className="w-full px-3 pr-10 h-10 sm:h-11 rounded-lg bg-slate-900/45 border border-slate-700/55 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-teal/50 focus:ring-2 focus:ring-teal/20"
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

            <div className="flex items-center h-10 sm:h-11 rounded-lg bg-slate-900/45 border border-slate-700/55 px-3">
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
                'h-10 sm:h-11 px-4 rounded-lg border font-mono text-xs uppercase tracking-[0.1em] transition-colors',
                hasActiveRefinement
                  ? 'border-teal/35 text-teal bg-teal/10 hover:bg-teal/15 hover:border-teal/50'
                  : 'border-slate-700/55 text-slate-500 bg-slate-900/30 cursor-not-allowed'
              )}
            >
              Reset
            </button>
          </div>

        </div>

        <div id="projects-featured" className="mb-4 sm:mb-5">
          <h3 className="font-display font-semibold text-2xl sm:text-display-3 text-slate-100 mb-2">
            A Different Interactive Projects Experience
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
            Pick any project from the lane on the left to instantly change the stage. Double-click any item to open full details.
          </p>
        </div>

        {visibleProjectSequence.length ? (
          <div className="mb-7 sm:mb-8">
            <div className="mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4" data-testid="projects-grid">
                {visibleProjectSequence.map((project) => renderProjectStrip(project))}
              </div>
            </div>

            <div ref={projectsRef} className="project-stage-anim">
              {activeShowcaseProject && (
                <div className="project-stage-panel relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/30 mt-6 sm:mt-0 lg:sticky lg:top-24">
                  <div
                    aria-hidden="true"
                    className={cn(
                      'absolute inset-0 bg-gradient-to-br opacity-65',
                      metaForCategory(activeShowcaseProject.category).panelClass
                    )}
                    style={featuredCardSpotlightStyle}
                  />
                  <div className="relative z-[1] p-4 sm:p-5 lg:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-4">
                      <div className="min-w-0">
                        <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-teal mb-1">
                          {activeShowcaseProject.category}
                        </p>
                        <h4 className="font-display font-bold text-xl sm:text-2xl text-slate-50 leading-tight">
                          {activeShowcaseProject.title}
                        </h4>
                        <p className="font-mono text-[9px] sm:text-xs text-slate-500 mt-1 sm:mt-2 truncate">
                          {activeShowcaseProject.client}
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

                    <div className="rounded-xl border border-slate-700/50 bg-slate-900/35 p-4 mb-5">
                      <div className="min-w-0">
                        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-400">
                          {activeShowcaseProject.client}
                        </p>
                        <h5 className="font-display font-semibold text-lg text-slate-50">
                          {activeShowcaseProject.title}
                        </h5>
                        <p className="text-sm text-slate-300 mt-2 truncate">
                          {activeShowcaseProject.category}
                        </p>
                      </div>
                    </div>

                    <p className="text-slate-300 leading-relaxed mb-5">
                      {activeShowcaseProject.description}
                    </p>

                    <div className="grid grid-cols-1 gap-4 mb-5">
                      <div className="rounded-lg border border-slate-700/45 bg-slate-900/40 p-4">
                        <div className="mb-3">
                          <p className="font-mono text-xs uppercase tracking-[0.12em] text-slate-500">
                            Key Details
                          </p>
                        </div>
                        <ul className="space-y-2">
                          {activeShowcaseProject.details.map((detail, i) => (
                            <li key={i} className="text-sm text-slate-300 leading-relaxed flex items-start gap-2">
                              <span className="mt-1 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border border-teal/35 bg-teal/10 text-[10px] font-semibold leading-none text-teal">
                                ✓
                              </span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-lg border border-slate-700/45 bg-slate-900/40 p-4">
                        <div className="mb-3">
                          <p className="font-mono text-xs uppercase tracking-[0.12em] text-slate-500">
                            Tech Stack
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {activeShowcaseProject.technologies.map((tech, i) => (
                            <span
                              key={i}
                              className="px-3 py-1.5 text-xs font-semibold rounded-md border border-teal/30 bg-teal/10 text-teal"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 sm:gap-3 pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-slate-700/40">
                      <button
                        type="button"
                        onClick={goToPrevShowcase}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-slate-700/55 bg-slate-900/45 text-slate-200 hover:text-teal hover:border-teal/40 transition-colors font-semibold text-sm"
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={goToNextShowcase}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-slate-700/55 bg-slate-900/45 text-slate-200 hover:text-teal hover:border-teal/40 transition-colors font-semibold text-sm"
                      >
                        Next
                      </button>
                      <div className="hidden sm:flex-1" />
                      <button
                        type="button"
                        onClick={() => setActiveProjectId(activeShowcaseProject.id)}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-teal/35 bg-teal/10 text-teal hover:bg-teal/15 hover:border-teal/50 transition-colors font-semibold text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              )}
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

        {activeFilter === 'Training' ? (
          <div className="mt-4 rounded-lg border border-slate-700/50 bg-slate-900/20 p-5 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-4 items-start">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-emerald-200 mb-2">
                  Training Track
                </p>
                <h3 className="font-display font-semibold text-2xl text-slate-50">
                  Courses, workshops, and practical team upskilling.
                </h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed max-w-3xl">
                  Structured GIS enablement that combines two tracks: focused courses and short delivery sprints
                  (including 5-day execution packs) across QA/QC, automation, ArcGIS Online apps, and analysis workflows.
                </p>
                <p className="mt-3 text-sm text-slate-400">
                  Highlight: transport-sector work included a full project delivery sprint, then a separate course for
                  <span className="text-emerald-200 font-semibold"> 20 engineers</span>. Extended with online cohorts in Iraq, Saudi cohorts,
                  and private mentoring plus private delivery engagements.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {['GIS Fundamentals', 'QC & Automation', 'Network Analysis', 'ModelBuilder', 'Spatial Analysis', 'ArcGIS Online', '5-Day Delivery Sprint', 'Private Mentoring'].map((topic) => (
                  <span
                    key={topic}
                    className="px-3 py-1.5 rounded-lg border border-emerald-300/25 bg-emerald-300/10 text-emerald-100 text-xs font-mono"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveFilter('All');
                  setSearchTerm('');
                  setSortBy('recent');
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-emerald-300/35 bg-emerald-300/10 text-emerald-100 hover:bg-emerald-300/15 hover:border-emerald-300/55 transition-colors font-semibold"
              >
                Show All Projects
              </button>
              <span className="font-mono text-xs text-slate-500">
                Double-click any training card to open full curriculum details.
              </span>
            </div>
          </div>
        ) : null}

      </div>

      {/* Project Details Modal */}
      <Dialog
        open={activeProjectId != null}
        onOpenChange={(open) => {
          if (!open) setActiveProjectId(null);
        }}
      >
        <DialogContent className="bg-navy border border-slate-700/60 text-slate-100 sm:max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">
            {activeProject ? activeProject.title : 'Project details'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {activeProject ? `${activeProject.client} - ${activeProject.category}` : 'Project details dialog'}
          </DialogDescription>
          {activeProject ? (
            <div className="grid grid-cols-1 gap-6">
              {/* Content */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3 pr-12">
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
                      title="Previous project"
                      className={cn(
                        'inline-flex items-center justify-center w-9 h-9 rounded-lg border transition-colors',
                        canGoPrevProject
                          ? 'border-slate-700/55 text-slate-300 hover:text-teal hover:border-teal/40'
                          : 'border-slate-800 text-slate-600 cursor-not-allowed'
                      )}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={goToNextProject}
                      disabled={!canGoNextProject}
                      aria-label="Next project"
                      title="Next project"
                      className={cn(
                        'inline-flex items-center justify-center w-9 h-9 rounded-lg border transition-colors',
                        canGoNextProject
                          ? 'border-slate-700/55 text-slate-300 hover:text-teal hover:border-teal/40'
                          : 'border-slate-800 text-slate-600 cursor-not-allowed'
                      )}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
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
