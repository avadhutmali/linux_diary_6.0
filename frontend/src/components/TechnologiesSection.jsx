import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import discordImg from '../assets/technologies/discord.webp';
import figmaImg from '../assets/technologies/figma.webp';
import framerImg from '../assets/technologies/framer.webp';
import notionImg from '../assets/technologies/notion.webp';
import photoshopImg from '../assets/technologies/photoshop.webp';
import protopieImg from '../assets/technologies/protopie.webp';
import raindropImg from '../assets/technologies/raindrop.webp';
import slackImg from '../assets/technologies/slack.webp';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const technologies = [
  { name: 'React', img: discordImg, description: 'Frontend framework', color: '#61DAFB' },
  { name: 'Node.js', img: figmaImg, description: 'Backend runtime', color: '#339933' },
  { name: 'Docker', img: framerImg, description: 'Containerization', color: '#2496ED' },
  { name: 'MongoDB', img: notionImg, description: 'Database', color: '#47A248' },
  { name: 'Python', img: photoshopImg, description: 'Programming language', color: '#3776AB' },
  { name: 'Git', img: protopieImg, description: 'Version control', color: '#F05032' },
  { name: 'AWS', img: raindropImg, description: 'Cloud platform', color: '#FF9900' },
  { name: 'Linux', img: slackImg, description: 'Operating system', color: '#FCC624' }
];

const TechnologiesSection = () => {
  const [cannonballInFlight, setCannonballInFlight] = useState(null);
  const [landedTechs, setLandedTechs] = useState([]);
  const [cannonRecoil, setCannonRecoil] = useState(false);
  const [screenSize, setScreenSize] = useState('large');
  const [showLandingExplosion, setShowLandingExplosion] = useState(false);
  const [animationTriggered, setAnimationTriggered] = useState(true);
  const [islandDestroyed, setIslandDestroyed] = useState(false);
  
  const shipRef = useRef(null);
  const islandRef = useRef(null);
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const animationRef = useRef(null);
  const [rotationAngle, setRotationAngle] = useState(0);

  // Detect screen size and handle resize for all devices
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setScreenSize('large');
      } else if (width >= 768) {
        setScreenSize('medium');
      } else {
        setScreenSize('small');
      }
    };
    
    const handleResize = () => {
      checkScreenSize();
    };
    
    checkScreenSize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // GSAP ScrollTrigger setup
  useEffect(() => {
    const section = sectionRef.current;
    
    if (!section || animationTriggered) return;

    const scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top 70%",
      end: "bottom 30%",
      onEnter: () => {
        if (!animationTriggered) {
          setAnimationTriggered(true);
          setTimeout(() => {
            fireCannon();
          }, 500); // Small delay for better UX
        }
      }
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [animationTriggered]);

  // Handle cannonball flight animation with smooth updates
  useEffect(() => {
    if (!cannonballInFlight) return;

    const interval = setInterval(() => {
      setCannonballInFlight(prev => {
        if (!prev) return null;
        
        const now = Date.now();
        const flightDuration = 3000;
        const progress = (now - prev.startTime) / flightDuration;
        
        if (progress >= 1) {
          // Cannonball has landed - show all technologies
          setLandedTechs(technologies);
          setShowLandingExplosion(true);
          setIslandDestroyed(true); 
          setTimeout(() => setShowLandingExplosion(false), 800);
          return null; // Remove cannonball
        }
        
        // Return updated cannonball with current progress
        return {
          ...prev,
          currentProgress: progress
        };
      });
    }, 16); // 60fps for smooth animation

    return () => clearInterval(interval);
  }, [cannonballInFlight]);

  // Animation for revolving tech icons
  useEffect(() => {
    const animate = () => {
      setRotationAngle(prev => (prev + 0.5) % 360);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    if (landedTechs.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [landedTechs.length]);

  // Get dynamic positions of ship cannon and island center
  const getDynamicPositions = () => {
    if (!shipRef.current || !islandRef.current || !containerRef.current) {
      return null;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const shipRect = shipRef.current.getBoundingClientRect();
    const islandRect = islandRef.current.getBoundingClientRect();

    // Calculate cannon position (right side of ship, middle height)
    const cannonX = shipRect.right - containerRect.left;
    const cannonY = shipRect.top + (shipRect.height / 2) - containerRect.top - (screenSize === 'large' ? 100 : 30);

    // Calculate island landing position (center of island)
    const landingX = islandRect.left + (islandRect.width / 2) - containerRect.left;
    const landingY = islandRect.top + (islandRect.height / 2) - containerRect.top;

    return {
      startX: cannonX,
      startY: cannonY,
      endX: landingX,
      endY: landingY
    };
  };

  const fireCannon = () => {
    if (animationTriggered && !cannonballInFlight && landedTechs.length === 0) {
      const positions = getDynamicPositions();
      
      if (!positions) {
        console.warn('Could not calculate positions for cannonball trajectory');
        return;
      }

      setCannonRecoil(true);

      const newCannonball = {
        id: Date.now(),
        startTime: Date.now(),
        // Store dynamic trajectory positions
        startX: positions.startX,
        startY: positions.startY,
        endX: positions.endX,
        endY: positions.endY
      };
      setCannonballInFlight(newCannonball);

      setTimeout(() => {
        setCannonRecoil(false);
      }, 800);
    }
  };

  const resetDemo = () => {
    setLandedTechs([]);
    setCannonballInFlight(null);
    setShowLandingExplosion(false);
    setAnimationTriggered(false);
    setIslandDestroyed(false);
    
    // Refresh ScrollTrigger
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  };

  // Calculate trajectory with dynamic positions - completely smooth arc
  const getCannonballPosition = (progress, ball) => {
    if (!ball) return { x: 0, y: 0 };

    const { startX, startY, endX, endY } = ball;
    
    // Linear interpolation for X position
    const currentX = startX + (endX - startX) * progress;
    
    // Create a single smooth parabolic arc with proper height
    const distance = Math.abs(endX - startX);
    const arcHeight = Math.min(distance * 0.25, screenSize === 'large' ? 150 : screenSize === 'medium' ? 100 : 60);
    
    // Enhanced parabolic equation for smooth trajectory
    const verticalOffset = -arcHeight * Math.sin(progress * Math.PI);
    const currentY = startY + (endY - startY) * progress + verticalOffset;
    
    return { x: currentX, y: currentY };
  };

  // Calculate positions for revolving tech icons - responsive for all devices
  const getTechPosition = (index, total) => {
    let radius;
    if (screenSize === 'large') {
      radius = 260;
    } else if (screenSize === 'medium') {
      radius = 150;
    } else {
      radius = 100;
    }
    
    const angle = (index * (360 / total) + rotationAngle) * (Math.PI / 180);
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    };
  };

  // Get dynamic explosion position for landing
  const getLandingExplosionPosition = () => {
    if (!islandRef.current || !containerRef.current) {
      return { left: '50%', top: '50%' };
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const islandRect = islandRef.current.getBoundingClientRect();

    const explosionX = islandRect.left + (islandRect.width / 2) - containerRect.left;
    const explosionY = islandRect.top + (islandRect.height / 2) - containerRect.top;

    return {
      left: `${explosionX}px`,
      top: `${explosionY}px`
    };
  };

  const handleButtonClick = () => {
  if (cannonballInFlight) return;

  if (landedTechs.length > 0) {
    const formEl = document.getElementById('register');
    formEl?.scrollIntoView({ behavior: 'smooth' });
  } else {
    fireCannon();
  }
};


  return (
    <section 
      ref={sectionRef}
      className="py-12 md:py-20 relative  overflow-hidden min-h-[500px] md:min-h-screen"
    >
      {/* Ocean Background */}
      <div className="absolute inset-0">
        <div className="enhanced-ocean-waves"></div>
        <div className="enhanced-ocean-surface"></div>
        <div className="ocean-foam"></div>
      </div>

      {/* Floating Clouds */}
      <div className="absolute flex w-full px-0 lg:px-36 justify-between inset-0 my-10 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <img
            key={i}
            src="/images/clouds.png"
            alt="Cloud"
            className={` ${screenSize === 'large' ? 'animate-bounce-md' : 'animate-bounce-sm'} rotate-2`}
            style={{
              width: screenSize === 'large' ? `${220 + i * 10}px` : `${120 + i * 6}px`,
              height: screenSize === 'large' ? `${120 + i * 5}px` : `${60 + i * 3}px`,
              top: screenSize === 'large' ? `8%` : `5%`,
              transform: `translateY(${i * 2}px)`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: screenSize === 'large' ? `${6 + i * 0.5}s` : `${4 + i * 0.3}s`,
              opacity: 0.9
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-0 relative z-10">

        {/* Main Scene Container */}
        <div ref={containerRef} className="relative w-full h-[300px] md:h-[500px] mx-auto">
          
          {/* Pirate Ship */}

          {!islandDestroyed ? (
          <div 
            ref={shipRef}
            className="absolute left-4 md:left-0 bottom-16"
          >
            <div className={`relative ${cannonRecoil ? 'animate-recoil' : 'animate-wave'}`}>
              <img 
                src="/images/tux-gun2.png" 
                alt="Pirate Ship"
                className="w-[25vw] md:w-[20vw] lg:w-[20vw] h-auto drop-shadow-2xl transition-all duration-300"
              />
            </div>
          </div>
        ) : (
          <div className="absolute left-4 md:left-32 bottom-0 md:bottom-24 w-[25vmax] md:w-[30vmax] lg:w-[35vmax]">
            <div className="text-white  p-4 rounded-xl backdrop-blur-sm animate-fadeIn">
              <h2 className="text-3xl md:text-5xl font-bold mb-2">Wargames</h2>
              <p className="text-sm md:text-xl">
                Dive into our thrilling Wargames competition! Tackle challenging puzzles, 
                showcase your skills and compete with the best. Are you ready to be the champion?
              </p>
            </div>
          </div>
        )}

          {/* Flying Cannonball with smooth animation */}
          {cannonballInFlight && (() => {
            const now = Date.now();
            const progress = Math.min((now - cannonballInFlight.startTime) / 3000, 1);
            const position = getCannonballPosition(progress, cannonballInFlight);
            const rotation = progress * 360;
            const scale = 1.2 - progress * 0.4;
            
            return (
              <div
                key={cannonballInFlight.id}
                className="absolute pointer-events-none z-20"
                style={{
                  left: `${position.x}px`,
                  top: `${position.y}px`,
                  transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
                  transition: 'none'
                }}
              >
                <div className="relative">
                  <img 
                    src="/images/cannonball.avif" 
                    alt="Cannonball"
                    className="w-8 h-8 md:w-16 md:h-16 drop-shadow-2xl"
                  />
                  
                  {/* Enhanced sparkling trail */}
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-ping opacity-80"
                      style={{
                        left: `${-8 - i * 4}px`,
                        top: `${4 + Math.sin(i) * 3}px`,
                        animationDelay: `${i * 100}ms`,
                        animationDuration: '0.8s'
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Treasure Island */}
          <div 
            ref={islandRef}
            className="absolute -right-10 md:right-0 bottom-16"
          >
            <div className="relative">
            
              
              {landedTechs.length <= 0 && (
                <img 
                  src="/images/igloo.png" 
                  alt="Treasure Island"
                  className="w-[30vmax] md:w-[25vmax] lg:w-[40vmax] h-auto drop-shadow-2xl"
                />
              )}
              {landedTechs.length > 0 && (
                <img 
                  src="/images/igloo2.png" 
                  alt="Treasure Island with Technologies"
                  className="w-[30vmax] md:w-[25vmax] lg:w-[40vmax] h-auto drop-shadow-2xl"
                />
              )}

              {/* Revolving Tech Icons */}


              
             {landedTechs.length > 0 && (
  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
    {landedTechs.map((tech, index) => {
      const position = getTechPosition(index, landedTechs.length);
      
      return (
        <div
          key={tech.name}
          className="absolute flex items-center justify-center"
          style={{
            transform: `translate(${position.x-10}px, ${position.y-10}px)`,
            transition: 'transform 1.55s ease-out',
            // Add animation delay for each item
            animationDelay: `${index * 0.2}s`,
            // Set initial opacity to 0 and animate to 1
            opacity: 0,
            animation: 'fadeIn 2.5s forwards'
          }}
        >
          <div 
            className="w-8 h-8 md:w-16 md:h-16 bg-gradient-to-br from-white to-gray-400 rounded-xl border-2 border-white flex items-center justify-center text-sm md:text-lg shadow-lg"
            style={{ 
              backgroundColor: tech.color + '20',
              // Add delay for each tech icon
              animationDelay: `${index * 0.2 + 2}s`,
              animation: 'zoomIn 0.5s forwards'
            }}
          >
            <img
              src={tech.img}
              alt={tech.name}
              className="w-6 h-6 md:w-10 md:h-10 object-contain"
              title={tech.name}
            />
          </div>
        </div>
      );
    })}
  </div>
)}



            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="text-center mt-8 md:mt-16">
          <div className="inline-block p-4 md:p-6 ">
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 mb-3 md:mb-4">
              <button
              onClick={handleButtonClick}
              disabled={cannonballInFlight}
              style={{backgroundColor: '#DEC67A'}}
              className={`px-4 md:px-6 py-2 md:py-3 font-bold text-sm md:text-base hover:scale-105 cursor-pointer rounded-lg md:rounded-xl shadow-md transition-all duration-200 border-2 border-white`}
            >
              {cannonballInFlight
                ? 'Firing...'
                : landedTechs.length > 0
                ? 'Register Now!'
                : 'Fire Cannon!'}
              </button>

              
              {/* <button
                onClick={resetDemo}
                className="px-4 md:px-6 py-2 md:py-3 bg-[#AED9E0] hover:bg-[#9ccdd5] cursor-pointer text-black font-bold text-sm md:text-base rounded-lg md:rounded-xl shadow-md hover:scale-105 transition-transform duration-200 border-2 border-cyan-600"
              >
                Reset Mission
              </button> */}
            </div>
           
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologiesSection;