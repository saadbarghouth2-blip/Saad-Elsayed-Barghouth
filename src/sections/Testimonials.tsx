import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Mail,
  Quote,
  Sparkles,
  Star,
} from "lucide-react";

import { shouldReduceEffects } from "@/lib/perf";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type TestimonialCategory = "Freelance" | "Government" | "Private";

type Testimonial = {
  quote: string;
  author: string;
  role: string;
  rating: 4 | 5;
  category: TestimonialCategory;
  highlight?: string;
};

const testimonialFilters = ["All", "Freelance", "Government", "Private"] as const;
type TestimonialFilter = (typeof testimonialFilters)[number];

const CATEGORY_STYLE: Record<
  TestimonialCategory,
  { badge: string; accent: string; ring: string }
> = {
  Freelance: {
    badge: "bg-slate-50/10 border-slate-50/15 text-slate-200",
    accent: "from-slate-50/12 via-transparent to-transparent",
    ring: "hover:border-slate-200/25",
  },
  Government: {
    badge: "bg-teal/15 border-teal/30 text-teal",
    accent: "from-teal/18 via-transparent to-transparent",
    ring: "hover:border-teal/35",
  },
  Private: {
    badge: "bg-cyan-300/10 border-cyan-300/25 text-cyan-100",
    accent: "from-cyan-200/14 via-transparent to-transparent",
    ring: "hover:border-cyan-200/25",
  },
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Saad's expertise in ArcGIS Enterprise transformed our utility network management. His automation scripts saved us hundreds of hours and significantly improved data quality. The dashboards he built are now essential tools for our operations team.",
    author: "Project Manager",
    role: "NUCA - New Obour City",
    rating: 5,
    category: "Government",
    highlight: "Automation and dashboards that scaled across teams",
  },
  {
    quote:
      "Working with Saad on the land use development project was exceptional. His attention to detail, technical knowledge, and ability to deliver training to our engineering team made the project a complete success.",
    author: "Engineering Director",
    role: "Ministry of Transport",
    rating: 5,
    category: "Government",
    highlight: "Training, standards, and on-time delivery",
  },

  {
    quote:
      "We had messy layers from multiple sources. Saad cleaned the schema, enforced validation rules, and delivered a dataset we could publish with confidence. Reviews became faster and more consistent.",
    author: "Operations Lead",
    role: "Freelance - Asset Inventory & QA/QC",
    rating: 5,
    category: "Freelance",
    highlight: "QA/QC gates that reduced rework immediately",
  },
  {
    quote:
      "Saad built a web GIS prototype that was intuitive for non-technical users. He kept the design clean, made the data understandable, and delivered clear documentation for handover.",
    author: "Product Owner",
    role: "Freelance - Web GIS Prototype",
    rating: 5,
    category: "Freelance",
    highlight: "Stakeholder-ready UI and clear handover",
  },
  {
    quote:
      "Progress reporting used to take days. Saad set up a simple workflow with maps and dashboards that made updates quick and easy. Management finally had a reliable single view.",
    author: "Construction PM",
    role: "Freelance - Progress Dashboard",
    rating: 5,
    category: "Freelance",
    highlight: "Dashboards that made reporting effortless",
  },
  {
    quote:
      "The suitability study was delivered with clear criteria, transparent scoring, and maps that executives could interpret quickly. The workflow was reproducible and easy to refine.",
    author: "Planning Lead",
    role: "Private Sector - Suitability Analysis",
    rating: 5,
    category: "Private",
    highlight: "Clear criteria and defensible outputs",
  },
  {
    quote:
      "Saad didn't just deliver files; he delivered adoption. The training and documentation were practical, and the team could maintain the workflow independently after handover.",
    author: "GIS Coordinator",
    role: "Private Sector - Training & Handover",
    rating: 5,
    category: "Private",
    highlight: "Training that enabled independence",
  },
  {
    quote:
      "We needed monthly change insight with strong quality checks. Saad automated the process and delivered a report format that made anomalies easy to review and approve.",
    author: "Environmental Consultant",
    role: "Freelance - Change Monitoring",
    rating: 5,
    category: "Freelance",
    highlight: "Repeatable monitoring with clear reporting",
  },
  {
    quote:
      "Our zoning package had conflicting layers and unclear boundaries. Saad restructured everything, documented assumptions, and delivered maps we could confidently submit to stakeholders.",
    author: "Urban Planning Consultant",
    role: "Freelance - Zoning & Land Use Package",
    rating: 5,
    category: "Freelance",
    highlight: "Clean structure and submission-ready outputs",
  },
  {
    quote:
      "Before working with Saad, updates were scattered across files and emails. He built a practical monitoring dashboard with clear status logic, and our weekly reporting became much easier.",
    author: "Program Manager",
    role: "Freelance - NGO Monitoring Dashboard",
    rating: 5,
    category: "Freelance",
    highlight: "Unified dashboard that simplified weekly reporting",
  },
  {
    quote:
      "Saad designed a maintenance workflow that connected field updates with office review. Data quality improved immediately, and handover to our internal team was smooth.",
    author: "Operations Supervisor",
    role: "Freelance - Asset Maintenance Workflow",
    rating: 5,
    category: "Freelance",
    highlight: "Field-to-office workflow with reliable handover",
  },
  {
    quote:
      "We needed a fast GIS MVP for a startup demo. Saad delivered a responsive web map experience that looked polished, worked on mobile, and clearly communicated our value to investors.",
    author: "Startup Founder",
    role: "Freelance - GIS MVP",
    rating: 5,
    category: "Freelance",
    highlight: "Mobile-ready MVP delivered under tight timelines",
  },
  {
    quote:
      "Monthly executive reporting was manual and error-prone. Saad automated the extraction and map summary process, so our PMO now publishes consistent updates with less effort.",
    author: "PMO Coordinator",
    role: "Freelance - Reporting Automation",
    rating: 5,
    category: "Freelance",
    highlight: "Automation that reduced reporting effort",
  },
  {
    quote:
      "Saad implemented validation logic for our field survey forms and built a clear review queue. We saw fewer rejected submissions and faster approval cycles in the first month.",
    author: "Field Coordinator",
    role: "Freelance - Survey QA System",
    rating: 5,
    category: "Freelance",
    highlight: "Validation-first setup that cut rejection rates",
  },
  {
    quote:
      "Our client portal needed better map clarity and faster load times. Saad optimized layers, improved interaction patterns, and delivered a cleaner experience our clients actually used.",
    author: "Client Success Lead",
    role: "Freelance - Client Map Portal",
    rating: 5,
    category: "Freelance",
    highlight: "Faster, cleaner portal with stronger adoption",
  },
  {
    quote:
      "Route planning decisions were inconsistent across teams. Saad built a repeatable network-analysis workflow with transparent criteria, which made review and approval much more objective.",
    author: "Infrastructure Consultant",
    role: "Freelance - Route Optimization Analysis",
    rating: 5,
    category: "Freelance",
    highlight: "Transparent analysis with consistent decisions",
  },
  {
    quote:
      "Publishing services with proper structure and access control was critical for us. Saad delivered stable services and a clean data model that improved performance and reliability.",
    author: "IT Manager",
    role: "Private Sector - Geo Services",
    rating: 5,
    category: "Private",
    highlight: "Stable publishing and reliable services",
  },
  {
    quote:
      "Field data capture became consistent after Saad defined the forms, validation logic, and a clean review process. We reduced errors and sped up approvals.",
    author: "Survey Supervisor",
    role: "Freelance - Field Data Capture",
    rating: 5,
    category: "Freelance",
    highlight: "Cleaner capture with fewer errors",
  },
  {
    quote:
      "Saad's frontend development transformed how our team interacts with data. The React dashboard is responsive, performant, and the TypeScript code is clean and maintainable. We couldn't be happier with the result.",
    author: "Product Manager",
    role: "Private Sector - Analytics Dashboard",
    rating: 5,
    category: "Private",
    highlight: "Modern frontend that simplified data access",
  },
  {
    quote:
      "Saad delivered maps and analysis that were easy to present to stakeholders. The outputs were clear, the assumptions were documented, and updates were handled quickly.",
    author: "Project Consultant",
    role: "Freelance - Stakeholder Reporting",
    rating: 5,
    category: "Freelance",
    highlight: "Clear communication and fast iterations",
  },
];

function styleFor(category: TestimonialCategory) {
  return CATEGORY_STYLE[category];
}

export default function Testimonials() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const carouselWrapRef = useRef<HTMLDivElement>(null);

  const [activeFilter, setActiveFilter] = useState<TestimonialFilter>("All");

  const visibleTestimonials = useMemo(() => {
    if (activeFilter === "All") return testimonials;
    return testimonials.filter((t) => t.category === activeFilter);
  }, [activeFilter]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: visibleTestimonials.length > 3,
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [snapCount, setSnapCount] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const sync = () => {
      setSnapCount(emblaApi.scrollSnapList().length);
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    // Schedule the first sync to avoid cascading renders in the effect body.
    const t = window.setTimeout(sync, 0);

    emblaApi.on("select", sync);
    emblaApi.on("reInit", sync);

    return () => {
      window.clearTimeout(t);
      emblaApi.off("select", sync);
      emblaApi.off("reInit", sync);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
    emblaApi.scrollTo(0);
  }, [emblaApi, activeFilter]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const progress = snapCount > 1 ? selectedIndex / (snapCount - 1) : 0;

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const carouselWrap = carouselWrapRef.current;
    if (!section || !heading || !carouselWrap) return;

    if (shouldReduceEffects()) return;

    const ctx = gsap.context(() => {
      const headingItems = heading.querySelectorAll("[data-anim]");
      gsap.fromTo(
        headingItems,
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: heading,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        carouselWrap,
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: carouselWrap,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="testimonials" className="relative w-full py-16 sm:py-24 bg-navy z-[70]">
      <div className="absolute inset-0 grid-overlay z-[1]" />
      <div className="absolute inset-0 vignette z-[2]" />
      <div className="absolute inset-0 noise-overlay z-[3]" />

      <div className="relative z-[4] site-gutter">
        {/* Heading */}
        <div
          ref={headingRef}
          className="relative mb-8 sm:mb-12 overflow-hidden rounded-lg border border-slate-700/40 bg-slate-900/25 sm:bg-slate-900/20"
        >
          <div className="testimonials-aurora" />
          <div className="absolute inset-0 grid-overlay opacity-20" />
          <div className="relative z-[1] p-5 sm:p-10">
            <span
              data-anim
              className="font-mono text-xs sm:text-sm text-teal tracking-[0.15em] uppercase mb-3 sm:mb-4 block"
            >
              Testimonials
            </span>
            <h2
              data-anim
              className="font-display font-bold leading-[0.98] mb-4 sm:mb-5 max-w-4xl"
            >
              <span className="block text-[clamp(30px,8vw,54px)] sm:text-display-2 text-slate-50">
                What clients say.
              </span>
              <span className="mt-2 inline-flex items-center rounded-lg border border-teal/35 bg-teal/10 px-3 py-1 font-mono text-[11px] sm:text-xs tracking-[0.12em] uppercase text-teal">
                Results that hold up
              </span>
            </h2>
            <p
              data-anim
              className="text-sm sm:text-lg text-slate-300 sm:text-slate-200 leading-relaxed max-w-4xl"
            >
              Selected feedback from government entities, private companies, and freelance deliveries.
              The common theme is consistency: clean data structure, solid QA/QC, and outputs that stakeholders
              can understand quickly.
            </p>

            <div data-anim className="mt-6 sm:mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate("/projects")}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-5 py-2.5 sm:py-3 bg-teal hover:bg-teal-dark text-navy font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5 touch-target"
              >
                <Sparkles className="w-4 h-4" />
                Browse Work
              </button>
              <a
                href="mailto:saadbarghouth11@gmail.com"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-5 py-2.5 sm:py-3 bg-slate-900/40 border border-slate-700/60 text-slate-200 hover:text-teal hover:border-teal/40 rounded-lg transition-all duration-300 hover:-translate-y-0.5 touch-target"
              >
                <Mail className="w-4 h-4" />
                Request references
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 sm:mb-7 rounded-lg border border-slate-700/50 bg-slate-900/20 p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-xs text-slate-400 uppercase tracking-[0.14em]">
              Category
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-slate-500 sm:hidden">
              Active: <span className="text-teal">{activeFilter}</span>
            </p>
          </div>

          <div className="mt-2.5 sm:mt-3 flex items-center gap-2 overflow-x-auto overflow-y-hidden whitespace-nowrap pb-1 -mb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {testimonialFilters.map((f) => {
              const isActive = activeFilter === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setActiveFilter(f)}
                  className={cn(
                    "shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border font-mono text-[11px] sm:text-xs tracking-[0.14em] uppercase transition-colors duration-300",
                    isActive
                      ? "bg-teal/12 border-teal/35 text-teal"
                      : "bg-slate-900/25 border-slate-700/55 text-slate-300 hover:text-slate-50 hover:border-teal/25 hover:bg-slate-800/35"
                  )}
                >
                  {f}
                </button>
              );
            })}
          </div>

          <p className="sm:hidden mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
            Swipe left/right for all categories.
          </p>
        </div>

        {/* Carousel */}
        <div
          ref={carouselWrapRef}
          className="rounded-lg border border-slate-700/45 bg-slate-900/20 overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 sm:p-5 border-b border-slate-800/60">
            <div className="min-w-0">
              <p className="font-mono text-xs text-slate-400 uppercase tracking-wide">
                Client feedback
              </p>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                Swipe on mobile or use arrows on desktop.
              </p>
            </div>

            <div className="flex w-full sm:w-auto items-center justify-end gap-2">
              <button
                type="button"
                onClick={scrollPrev}
                className="w-10 h-10 rounded-lg border border-slate-700/60 text-slate-200 hover:text-teal hover:border-teal/40 transition-colors flex items-center justify-center"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                className="w-10 h-10 rounded-lg border border-slate-700/60 text-slate-200 hover:text-teal hover:border-teal/40 transition-colors flex items-center justify-center"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex -ml-3 sm:-ml-5 p-3 sm:p-5">
              {visibleTestimonials.map((t, index) => {
                const st = styleFor(t.category);
                return (
                  <div
                    key={`${t.author}-${t.role}-${index}`}
                    className="pl-3 sm:pl-5 flex-[0_0_92%] sm:flex-[0_0_78%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
                  >
                    <article
                      className={cn(
                        "h-full relative overflow-hidden rounded-lg border border-slate-700/35 bg-slate-900/15 p-4 sm:p-8 shadow-xl transition-colors",
                        st.ring
                      )}
                    >
                      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-80", st.accent)} />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/25 to-transparent" />

                      <div className="relative z-[1]">
                        <div className="flex items-start justify-between gap-3">
                          <span
                            className={cn(
                              "inline-flex items-center px-2 py-1 rounded-lg border font-mono text-[10px] sm:text-[11px] tracking-[0.14em] uppercase",
                              st.badge
                            )}
                          >
                            {t.category}
                          </span>
                          <Quote className="w-6 h-6 sm:w-7 sm:h-7 text-teal/35" />
                        </div>

                        <div className="mt-3 sm:mt-4 flex gap-1">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-teal fill-teal" />
                          ))}
                        </div>

                        <p className="mt-4 sm:mt-5 text-xs sm:text-sm text-slate-200 leading-relaxed">
                          "{t.quote}"
                        </p>

                        {t.highlight ? (
                          <div className="mt-4 sm:mt-5 rounded-lg border border-teal/20 bg-teal/10 p-3 sm:p-4">
                            <p className="font-mono text-[10px] sm:text-[11px] text-teal uppercase tracking-[0.14em]">
                              Highlight
                            </p>
                            <p className="mt-2 text-xs sm:text-sm text-slate-100 leading-relaxed">
                              {t.highlight}
                            </p>
                          </div>
                        ) : null}

                        <div className="mt-5 sm:mt-6 flex items-center gap-3">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-900/35 border border-slate-700/55 rounded-full flex items-center justify-center">
                            <span className="font-display font-semibold text-teal">
                              {t.author.charAt(0)}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-mono text-xs sm:text-sm text-slate-200 truncate">
                              {t.author}
                            </p>
                            <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                              {t.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="px-3 sm:px-5 pb-4 sm:pb-5">
            <div className="h-1.5 rounded-lg bg-slate-900/35 border border-slate-800/60 overflow-hidden">
              <div
                className="h-full w-full origin-left bg-gradient-to-r from-teal via-teal-light to-slate-50/60"
                style={{ transform: `scaleX(${Math.max(0, Math.min(1, progress))})` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
