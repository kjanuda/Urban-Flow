'use client';

import Image from 'next/image';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import headerImage from '../../../public/p1.jpg';
import headerImage1 from '../../../public/p2.jpg';
import headerImage2 from '../../../public/p3.jpg';
import Benefits from './Benifits/page';
import Definition from './Definition/page';

export default function Page() {
  const [activeSection, setActiveSection] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const headerImages = useMemo(() => [headerImage, headerImage1,headerImage2], []);

  // Memoized navigation items
  const navItems = useMemo(() => [
    { id: 'benefits', label: 'Benefits', number: '01' },
    { id: 'definition', label: 'Definition', number: '02' },
    { id: 'solutions', label: 'Solutions', number: '03' },
    { id: 'implementations', label: 'Implementations', number: '04' },
    { id: 'challenges', label: 'Challenges', number: '05' },
  ], []);

  // Auto-play image transition with zoom-out animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % headerImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [headerImages.length]);

  // Check mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Intersection Observer for section tracking
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: isMobile ? '-10% 0px -70% 0px' : '-20% 0px -60% 0px',
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      if (isScrolling.current) return;

      let visibleSection = '';
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleSection = entry.target.id;
        }
      });

      if (visibleSection) {
        setActiveSection(visibleSection);
      }

      if (window.scrollY < 50) {
        setActiveSection('');
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, options);

    navItems.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [navItems, isMobile]);

  const scrollToSection = useCallback((sectionId: string) => {
    if (isScrolling.current) return;

    isScrolling.current = true;
    setActiveSection(sectionId);

    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = isMobile ? 60 : 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = Math.max(0, elementPosition - headerOffset);
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false;
      }, 800);
    }
  }, [isMobile]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent, sectionId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scrollToSection(sectionId);
    }
  }, [scrollToSection]);

  const navigationButtons = useMemo(() => 
    navItems.map((item) => (
      <button
        key={item.id}
        onClick={() => scrollToSection(item.id)}
        onKeyDown={(e) => handleKeyPress(e, item.id)}
        className={`group flex items-center gap-1 sm:gap-2 transition-all duration-200 pb-1 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1 sm:focus:ring-offset-2 rounded px-1 min-w-0 ${
          activeSection === item.id
            ? 'text-orange-400 scale-105'
            : 'text-white hover:text-orange-300 hover:scale-105'
        }`}
        aria-label={`Navigate to ${item.label}`}
        aria-current={activeSection === item.id ? 'true' : 'false'}
      >
        <span className={`font-semibold text-xs sm:text-sm transition-colors duration-200 whitespace-nowrap ${
          activeSection === item.id ? 'text-orange-400' : 'text-orange-500'
        }`}>
          {item.number}.
        </span>
        <span className={`font-semibold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap ${
          activeSection === item.id
            ? 'border-b-2 border-orange-400'
            : 'border-b-2 border-transparent group-hover:border-orange-300'
        }`}>
          {item.label}
        </span>
      </button>
    )), [navItems, activeSection, scrollToSection, handleKeyPress]
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[580px] overflow-hidden">
        <div className="absolute inset-0">
          {headerImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={image}
                alt={`Smart Cities Skyline ${index + 1}`}
                fill
                className={`object-cover brightness-55 ${
                  index === currentImageIndex ? 'animate-zoomOut' : ''
                }`}
                priority={index === 0}
                quality={85}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                placeholder="blur"
              />
            </div>
          ))}
        </div>
        
        <div className="absolute inset-0 bg-black/40 md:bg-black/50" />
        
        <div className="relative z-10 w-full h-full flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-12 pt-16 sm:pt-20 md:pt-12">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <p className="text-white text-xs sm:text-sm md:text-base font-medium tracking-wide whitespace-nowrap">
                Solutions for smart cities
              </p>
              <div className="w-8 sm:w-10 md:w-12 h-0.5 bg-orange-500 flex-shrink-0" />
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 max-w-3xl leading-snug sm:leading-tight">
              How to shape the future of cities?
            </h1>
            
            <p className="text-white text-xs sm:text-sm md:text-base max-w-2xl leading-relaxed mb-6 sm:mb-8">
              How can we shape the future of smart and efficient cities? By 2050, nearly 70% of the global population will live in urban areas. As many cities struggle to handle rapid growth and public issues, innovative civic management systems are essential to make them more livable and sustainable.
            </p>
            
            <nav className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 lg:gap-6 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
              {navigationButtons}
            </nav>
          </div>
        </div>
      </section>

      {/* Benefits Section - NO wrapper div, NO padding, NO margin */}
      

      {/* Definition Section */}
      
    </div>
  );
}

const styles = `
  @keyframes zoomOut {
    0% {
      transform: scale(1.15);
    }
    100% {
      transform: scale(1);
    }
  }

  .animate-zoomOut {
    animation: zoomOut 6s ease-out forwards;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

if (typeof document !== 'undefined' && !document.getElementById('hero-animations')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'hero-animations';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}