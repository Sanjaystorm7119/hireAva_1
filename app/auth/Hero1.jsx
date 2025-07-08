"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import "./Hero1.css";

// Debounce hook
function useDebouncedCallback(callback, delay) {
  const timeoutRef = useRef();

  const debouncedFn = useCallback(
    (...args) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current); // Cleanup on unmount
  }, []);

  return debouncedFn;
}

// Component helpers (Button, Card, Badge, Icons)
const Button = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
  };
  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
  };
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
  >
    {children}
  </div>
);
const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default:
      "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary:
      "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
  };
  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}
    >
      {children}
    </div>
  );
};

// Icons
const CodeIcon = ({ className = "" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m16 18 6-6-6-6M8 6l-6 6 6 6"
    />
  </svg>
);
const ArrowsIcon = ({ className = "" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
    />
  </svg>
);
const TrendingUpIcon = ({ className = "" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m3 13 4-4L12 14l5-5m0 0h-5m5 0v5"
    />
  </svg>
);
const UsersIcon = ({ className = "" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7Z"
    />
  </svg>
);
const BarChart3Icon = ({ className = "" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 3v18h18M7 16l4-4 4 4 6-6"
    />
  </svg>
);
const RocketIcon = ({ className = "" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09ZM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z"
    />
  </svg>
);
const XIcon = ({ className = "" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const categories = [
  {
    id: "engineering",
    name: "Engineering",
    icon: CodeIcon,
    color: "bg-blue-500",
    position: { top: "20%", left: "15%" },
    info: {
      title: "Software Engineering",
      description:
        "Build the future with cutting-edge technology. Join innovative teams working on scalable solutions.",
      jobs: "12,450+ jobs",
      avgSalary: "$120k - $180k",
      skills: ["React", "Python", "Node.js", "AWS", "TypeScript"],
    },
  },
  {
    id: "design",
    name: "Design",
    icon: ArrowsIcon,
    color: "bg-purple-500",
    position: { top: "35%", right: "25%" },
    info: {
      title: "Product Design",
      description:
        "Shape user experiences that millions will love. Create beautiful, intuitive interfaces.",
      jobs: "3,200+ jobs",
      avgSalary: "$90k - $140k",
      skills: [
        "Figma",
        "Sketch",
        "Prototyping",
        "User Research",
        "Design Systems",
      ],
    },
  },
  {
    id: "marketing",
    name: "Marketing",
    icon: TrendingUpIcon,
    color: "bg-green-500",
    position: { top: "15%", right: "15%" },
    info: {
      title: "Growth Marketing",
      description:
        "Drive growth and scale businesses. Work with data-driven strategies and creative campaigns.",
      jobs: "5,800+ jobs",
      avgSalary: "$80k - $130k",
      skills: [
        "SEO",
        "Analytics",
        "Content Marketing",
        "Paid Ads",
        "Growth Hacking",
      ],
    },
  },
  {
    id: "sales",
    name: "Sales",
    icon: UsersIcon,
    color: "bg-orange-500",
    position: { bottom: "10%", left: "20%" },
    info: {
      title: "Sales & Business Development",
      description:
        "Build relationships and drive revenue. Join high-growth companies expanding their market reach.",
      jobs: "7,600+ jobs",
      avgSalary: "$70k - $150k",
      skills: [
        "CRM",
        "Lead Generation",
        "Negotiation",
        "Account Management",
        "Pipeline Management",
      ],
    },
  },
  {
    id: "data",
    name: "Data Science",
    icon: BarChart3Icon,
    color: "bg-cyan-500",
    position: { bottom: "10%", right: "25%" },
    info: {
      title: "Data Science & Analytics",
      description:
        "Turn data into insights. Work with machine learning, AI, and advanced analytics.",
      jobs: "4,300+ jobs",
      avgSalary: "$110k - $170k",
      skills: ["Python", "SQL", "Machine Learning", "Tableau", "Statistics"],
    },
  },
  {
    id: "product",
    name: "Product",
    icon: RocketIcon,
    color: "bg-pink-500",
    position: { top: "40%", left: "7%" },
    info: {
      title: "Product Management",
      description:
        "Lead product strategy and execution. Bridge the gap between business and technology.",
      jobs: "2,900+ jobs",
      avgSalary: "$130k - $190k",
      skills: [
        "Strategy",
        "Analytics",
        "User Research",
        "Roadmapping",
        "Agile",
      ],
    },
  },
];

export default function AvaLanding() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [backgroundTheme, setBackgroundTheme] = useState("default");

  useEffect(() => {
    // Set initial window size and add event listeners
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Set initial size
    updateWindowSize();

    // Add event listeners
    window.addEventListener("resize", updateWindowSize);
    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateWindowSize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const debouncedSetHoveredCategory = useDebouncedCallback((id) => {
    setHoveredCategory(id);
  }, 100);

  const getParallaxOffset = (categoryPosition, intensity = 0.05) => {
    // Use windowSize state instead of directly accessing window
    const centerX = windowSize.width / 2;
    const centerY = windowSize.height / 2;
    const deltaX = (mousePosition.x - centerX) * intensity;
    const deltaY = (mousePosition.y - centerY) * intensity;
    return { x: -deltaX, y: -deltaY };
  };

  const selectedCategoryData = categories.find(
    (cat) => cat.id === selectedCategory
  );

  // Background theme mapping
  const getBackgroundStyle = (theme) => {
    const themes = {
      default: {
        background: "linear-gradient(135deg, #f8fafc 0%, #60a5fa 100%)",
      },
      engineering: {
        background: "linear-gradient(135deg, #eff6ff 0%, #3b82f6 100%)",
      },
      design: {
        background: "linear-gradient(135deg, #faf5ff 0%, #a855f7 100%)",
      },
      marketing: {
        background: "linear-gradient(135deg, #f0fdf4 0%, #22c55e 100%)",
      },
      sales: {
        background: "linear-gradient(135deg, #fff7ed 0%, #f97316 100%)",
      },
      data: {
        background: "linear-gradient(135deg, #ecfeff 0%, #06b6d4 100%)",
      },
      product: {
        background: "linear-gradient(135deg, #fdf2f8 0%, #ec4899 100%)",
      },
    };
    return themes[theme] || themes.default;
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setBackgroundTheme(categoryId);
  };

  return (
    <div
      style={{
        ...getBackgroundStyle(backgroundTheme),
        transition: "background 0.7s ease-in-out",
      }}
    >
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 pointer-events-none">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Find your next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              opportunity
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with innovative startups and established companies. Discover
            roles that match your skills and ambitions.
          </p>
        </div>

        <div className="hidden md:block">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isHovered = hoveredCategory === category.id;
            const isOtherHovered =
              hoveredCategory && hoveredCategory !== category.id;
            const intensity = 0.03 + index * 0.01;
            const parallaxOffset = getParallaxOffset(
              category.position,
              intensity
            );
            const magneticOffset = isHovered
              ? { x: parallaxOffset.x * 2, y: parallaxOffset.y * 2 }
              : parallaxOffset;

            return (
              <div
                key={category.id}
                className="absolute cursor-pointer select-none z-20 transition-transform duration-75 ease-out"
                style={{
                  ...category.position,
                  transform: `translate(${magneticOffset.x}px, ${magneticOffset.y}px)`,
                }}
                onMouseEnter={() => debouncedSetHoveredCategory(category.id)}
                onMouseLeave={() => debouncedSetHoveredCategory(null)}
                onClick={() => handleCategoryClick(category.id)}
              >
                {/* icon */}
                <div
                  className={`
                ${
                  category.color
                } text-white rounded-full shadow-lg transform transition-all duration-300 ease-out relative overflow-hidden
                ${
                  isHovered
                    ? "scale-125 shadow-2xl ring-4 ring-white/50 z-30"
                    : isOtherHovered
                    ? "scale-90 opacity-40 blur-sm"
                    : "hover:scale-110 hover:shadow-xl"
                }
                ${
                  isHovered ? "animate-pulse" : "animate-float"
                } w-16 h-16 flex items-center justify-center
              `}
                >
                  <Icon
                    className={`w-7 h-7 transition-all duration-300 ${
                      isHovered ? "scale-110" : ""
                    }`}
                  />
                  {isHovered && (
                    <div className="absolute inset-0 rounded-full bg-white/20 animate-ping pointer-events-none"></div>
                  )}
                  <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
                </div>

                <div
                  className={`text-center mt-3 transition-all duration-300 pointer-events-none ${
                    isHovered
                      ? "transform -translate-y-1"
                      : isOtherHovered
                      ? "opacity-40"
                      : ""
                  }`}
                >
                  <span
                    className={`block text-sm font-medium text-gray-700 transition-all duration-300 ${
                      isHovered ? "text-gray-900 font-semibold text-base" : ""
                    }`}
                  >
                    {category.name}
                  </span>
                  <span
                    className={`block text-xs text-gray-500 mt-1 transition-all duration-300 ${
                      isHovered
                        ? "text-gray-600 font-medium"
                        : isOtherHovered
                        ? "opacity-0"
                        : ""
                    }`}
                  >
                    {category.info.jobs}
                  </span>
                </div>

                {isHovered && (
                  <>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-50 animate-fade-in pointer-events-none">
                      Click to explore {category.name} opportunities
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                    <div
                      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 ${category.color} opacity-30 blur-xl rounded-full -z-10 pointer-events-none`}
                    ></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/30 rounded-full animate-pulse-ring pointer-events-none"></div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal */}
        {selectedCategory && selectedCategoryData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-lg w-full bg-white ">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`${selectedCategoryData.color} text-white p-2 rounded-lg`}
                    >
                      <selectedCategoryData.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold">
                      {selectedCategoryData.info.title}
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(null);
                      setBackgroundTheme("default");
                    }}
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-gray-600 mb-4">
                  {selectedCategoryData.info.description}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Available Jobs</p>
                    <p className="font-semibold text-green-600">
                      {selectedCategoryData.info.jobs}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Salary Range</p>
                    <p className="font-semibold">
                      {selectedCategoryData.info.avgSalary}
                    </p>
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-2">Top Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategoryData.info.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </section>
      {/* mobile view */}
      <div className="grid grid-cols-2 gap-4 px-4 py-4 md:hidden ">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <div
              key={category.id}
              className="flex flex-row items-center gap-2 bg-white rounded-lg shadow-md p-4 text-wrap"
            >
              <div className={`${category.color} text-white p-3 rounded-full`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{category.info.title}</h3>
                <p className="text-sm text-gray-500">{category.info.jobs}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
