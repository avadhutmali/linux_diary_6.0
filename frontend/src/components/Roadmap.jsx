import React, { useEffect, useRef, useState } from "react";
import img1 from "../assets/RoadMap1.png";
import img2 from "../assets/RoadMap1.png";
import img3 from "../assets/RoadMap1.png";
import img4 from "../assets/RoadMap1.png";

const timelineData = [
  {
    id: "one",
    title: "Phase 1: Foundation",
    description: "ng up devee core infrastructur foundation. Setting up development environment and initial project structure",
    image: img1,
    // date: "Q1 2024"
  },
  {
    id: "two", 
    title: "Phase 2: Growth",
    description: "Expanding features and growing the user base. Implementing core functionality and user management systems.",
    image: img2,
    // date: "Q2 2024"
  },
  {
    id: "three",
    title: "Phase 3: Innovation", 
    description: "Introducing advanced features and integrations. Adding cutting-edge technologies and third-party services.",
    image: img3,
    // date: "Q3 2024"
  },
  {
    id: "four",
    title: "Phase 4: Scale",
    description: "Scaling to new heights and reaching milestones. Optimizing performance and preparing for large-scale deployment.",
    image: img4,
    // date: "Q4 2024"
  }
];

const Roadmap = () => {
  const [visible, setVisible] = useState(new Set());
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [hoveredCard, setHoveredCard] = useState(null);
  const refs = useRef({});

  useEffect(() => {
    const observers = timelineData.map((item) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible((prev) => new Set(prev).add(item.id));
            obs.unobserve(entry.target);
          }
        },
        { threshold: 0.2 }
      );
      const el = refs.current[item.id];
      if (el) obs.observe(el);
      return obs;
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const toggleCard = (itemId) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleMouseEnter = (itemId) => {
    setHoveredCard(itemId);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
  };

  const isCardExpanded = (itemId) => {
    // For desktop: show on hover, for mobile: show on click
    if (window.innerWidth >= 1024) { // lg breakpoint
      return hoveredCard === itemId;
    } else {
      return expandedCards.has(itemId);
    }
  };

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-white mb-4 tracking-wider drop-shadow-[0_4px_8px_rgba(0,150,255,0.3)]">
            ROADMAP
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-white to-blue-200 mx-auto rounded-full shadow-lg"></div>
        </div>

        {/* Timeline Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Central Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 rounded-full shadow-lg"></div>
          
          {timelineData.map((item, index) => {
            const isEven = index % 2 === 0;
            const isVisible = visible.has(item.id);
            const isExpanded = isCardExpanded(item.id);

            return (
              <div
                key={item.id}
                ref={(el) => (refs.current[item.id] = el)}
                className={`
                  relative mb-16 flex items-center
                  transition-all duration-1000 ease-out
                  ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
                `}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Timeline Card */}
                <div className={`flex-1 ${isEven ? 'pr-4 lg:pr-8 text-right' : 'pl-4 lg:pl-8 text-left'}`}>
                  <div 
                    className={`
                      bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20
                      hover:bg-white/15 transition-all duration-300 lg:cursor-pointer cursor-pointer
                      shadow-xl hover:shadow-2xl max-w-sm lg:max-w-md mx-auto
                      ${isEven ? 'mr-4 lg:mr-8' : 'ml-4 lg:ml-8'}
                    `}
                    onClick={() => toggleCard(item.id)}
                    onMouseEnter={() => handleMouseEnter(item.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="flex items-start gap-3 lg:gap-4">
                      {!isEven && (
                        <div className="flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-16 h-16 lg:w-20 lg:h-20 rounded-lg object-cover shadow-lg"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="mb-3">
                          <h3 className="text-lg lg:text-xl font-bold text-white">{item.title}</h3>
                        </div>
                        {isExpanded && (
                          <p className="text-white leading-relaxed mt-3 animate-fadeIn text-sm lg:text-base">
                            {item.description}
                          </p>
                        )}
                        {!isExpanded && (
                          <p className="text-white text-sm italic">
                            {window.innerWidth >= 1024 ? 'Hover to learn more...' : 'Click to learn more...'}
                          </p>
                        )}
                      </div>
                      
                      {isEven && (
                        <div className="flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-16 h-16 lg:w-20 lg:h-20 rounded-lg object-cover shadow-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
