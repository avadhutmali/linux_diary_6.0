import React, { useState, useEffect, useRef } from 'react';

const technologies = [
  { name: 'React', icon: '⚛️', description: 'Frontend framework', color: '#61DAFB' },
  { name: 'Node.js', icon: '🟢', description: 'Backend runtime', color: '#339933' },
  { name: 'Docker', icon: '🐳', description: 'Containerization', color: '#2496ED' },
  { name: 'MongoDB', icon: '🍃', description: 'Database', color: '#47A248' },
  { name: 'Python', icon: '🐍', description: 'Programming language', color: '#3776AB' },
  { name: 'Git', icon: '📚', description: 'Version control', color: '#F05032' },
  { name: 'AWS', icon: '☁️', description: 'Cloud platform', color: '#FF9900' },
  { name: 'Linux', icon: '🐧', description: 'Operating system', color: '#FCC624' }
];

const TechnologiesSection = () => {
  const [currentTechIndex, setCurrentTechIndex] = useState(0);
  const [firingTech, setFiringTech] = useState(null);
  const [cannonballsInFlight, setCannonballsInFlight] = useState([]);
  const [landedTechs, setLandedTechs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cannonRecoil, setCannonRecoil] = useState(false);
  const [screenSize, setScreenSize] = useState('large');
  
  const shipRef = useRef(null);
  const islandRef = useRef(null);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setScreenSize(window.innerWidth >= 768 ? 'large' : 'small');
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Auto-fire cannon every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fireCannon();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentTechIndex]);

  // Handle cannonball flight animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCannonballsInFlight(prev => {
        const now = Date.now();
        const flightDuration = 3000;
        const stillFlying = prev.filter(ball => now - ball.startTime < flightDuration);
        const justLanded = prev.filter(ball => now - ball.startTime >= flightDuration);
        
        justLanded.forEach(ball => {
          setLandedTechs(current => {
            if (!current.find(tech => tech.name === ball.tech.name)) {
              return [...current, ball.tech];
            }
            return current;
          });
        });

        return stillFlying;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const fireCannon = () => {
    const currentTech = technologies[currentTechIndex];
    setFiringTech(currentTech);
    setIsLoading(true);
    setCannonRecoil(true);

    const newCannonball = {
      id: Date.now(),
      tech: currentTech,
      startTime: Date.now()
    };
    setCannonballsInFlight(prev => [...prev, newCannonball]);

    setTimeout(() => {
      setFiringTech(null);
      setIsLoading(false);
      setCannonRecoil(false);
    }, 800);

    setCurrentTechIndex((prev) => (prev + 1) % technologies.length);
  };

  const resetDemo = () => {
    setLandedTechs([]);
    setCannonballsInFlight([]);
    setCurrentTechIndex(0);
  };

  // Calculate trajectory based on screen size
  const getCannonballPosition = (progress) => {
    if (screenSize === 'large') {
      // Large screen: horizontal trajectory (left to right)
      const startX = 280; // Ship cannon position
      const startY = 320;
      const endX = window.innerWidth - 1000; // Island position
      const endY = 350;
      
      const currentX = startX + (endX - startX) * progress;
      const arcHeight = 200;
      const currentY = startY + (endY - startY) * progress - (4 * arcHeight * progress * (1 - progress));
      
      return { x: currentX, y: currentY };
    } else {
      // Small screen: vertical trajectory (top to bottom)
      const startX = window.innerWidth / 2; // Center horizontally
      const startY = 200; // Ship position (top)
      const endX = window.innerWidth / 2; // Island center (bottom)
      const endY = 600; // Island position
      
      const currentX = startX + (endX - startX) * progress;
      const arcHeight = 100; // Smaller arc for vertical
      const currentY = startY + (endY - startY) * progress - (4 * arcHeight * progress * (1 - progress));
      
      return { x: currentX, y: currentY };
    }
  };

  return (
    <section className="py-20 relative overflow-hidden min-h-screen">
      {/* Enhanced Ocean Background */}
      <div className="absolute inset-0">
        <div className="enhanced-ocean-waves"></div>
        <div className="enhanced-ocean-surface"></div>
        <div className="ocean-foam"></div>
      </div>

      {/* Floating Clouds */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/20 rounded-full animate-float"
            style={{
              width: `${60 + i * 10}px`,
              height: `${30 + i * 5}px`,
              left: `${5 + i * 15}%`,
              top: `${5 + (i % 3) * 15}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${6 + i * 0.5}s`
            }}
          >
            <div className="absolute inset-3 bg-white/10 rounded-full"></div>
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 md:mb-6">
            ⚓ Pirate Tech Arsenal ⚓
          </h2>
          <p className="text-lg md:text-2xl text-cyan-200 max-w-4xl mx-auto">
            Watch our pirate penguins launch technologies across the digital seas!
          </p>
        </div>

        {/* Main Scene Container - Responsive Layout */}
        <div className={`relative w-full ${screenSize === 'large' ? 'h-[600px]' : 'h-[800px]'} max-w-7xl mx-auto`}>
          
          {/* Pirate Ship with PNG Image */}
          <div 
            ref={shipRef}
            className={`absolute ${
              screenSize === 'large' 
                ? 'left-8 md:left-16 bottom-16' 
                : 'left-1/2 transform -translate-x-1/2 top-8'
            }`}
          >
            <div className={`pirate-ship-container relative ${cannonRecoil ? 'animate-recoil' : 'animate-wave'}`}>
              {/* Ship PNG Image */}
              <img 
                src="/images/ship.png" 
                alt="Pirate Ship"
                className={`${
                  screenSize === 'large' ? 'w-[25vw] h-auto' : 'w-64 h-auto'
                } drop-shadow-2xl transition-all duration-300`}
                style={{
                  filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))'
                }}
              />
              
              {/* Cannon Fire Effect - Replaced with GIF */}
              {firingTech && (
                <div className={`absolute ${
                  screenSize === 'large' 
                    ? 'right-8 top-1/2 transform -translate-y-1/2' 
                    : 'bottom-8 left-1/2 transform -translate-x-1/2'
                }`}>
                  <img 
                    src="/images/explod-animation.gif" 
                    alt="Cannon Explosion"
                    className="w-24 h-24 object-contain z-20"
                    style={{
                      position: 'absolute',
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                </div>
              )}

              {/* Pirate Penguin Captain */}
              <div className={`absolute ${
                screenSize === 'large' 
                  ? '-top-16 left-1/3' 
                  : '-top-12 left-1/2 transform -translate-x-1/2'
              }`}>
                <div className="pirate-captain text-4xl md:text-6xl animate-bounce drop-shadow-2xl">
                  🏴‍☠️🐧
                </div>
                {isLoading && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs md:text-sm text-white bg-gray-800 px-3 py-2 rounded-lg whitespace-nowrap shadow-lg border border-gray-600">
                    Loading cannon...
                  </div>
                )}
              </div>

              {/* Loading Penguin with Current Tech */}
              <div className={`absolute ${
                screenSize === 'large' 
                  ? '-top-12 right-8' 
                  : '-top-8 right-4'
              }`}>
                <div className={`loading-penguin text-3xl md:text-4xl transition-all duration-500 drop-shadow-lg ${isLoading ? 'animate-bounce scale-125' : ''}`}>
                  🐧
                </div>
                {currentTechIndex < technologies.length && (
                  <div className="absolute -top-8 md:-top-12 left-1/2 transform -translate-x-1/2 text-2xl md:text-4xl animate-pulse drop-shadow-lg">
                    {technologies[currentTechIndex].icon}
                  </div>
                )}
              </div>

              {/* Ship Water Reflection */}
              <div className="absolute top-full left-0 w-full h-8 bg-gradient-to-b from-blue-400/30 to-transparent transform scale-y-[-1] opacity-50 blur-sm"></div>
            </div>
          </div>

          {/* Flying Cannonballs with PNG Images */}
          {cannonballsInFlight.map((ball) => {
            const progress = Math.min((Date.now() - ball.startTime) / 3000, 1);
            const position = getCannonballPosition(progress);
            const rotation = progress * 720;
            
            return (
              <div
                key={ball.id}
                className="absolute transition-none pointer-events-none z-20"
                style={{
                  left: `${position.x}px`,
                  top: `${position.y}px`,
                  transform: `scale(${1.2 - progress * 0.4}) rotate(${rotation}deg)`
                }}
              >
                <div className="relative">
                  {/* Cannonball PNG Image */}
                  <div className="relative w-12 h-12 md:w-16 md:h-16">
                    <img 
                      src="/images/cannonball.png" 
                      alt="Cannonball"
                      className="w-full h-full drop-shadow-xl"
                    />
                    {/* Tech Icon Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center text-lg md:text-2xl">
                      {ball.tech.icon}
                    </div>
                  </div>
                  
                  {/* Enhanced Smoke Trail */}
                  <div className={`absolute ${
                    screenSize === 'large' ? '-left-12' : '-top-12'
                  } top-1/2 transform -translate-y-1/2 w-16 md:w-20 h-3 md:h-4 bg-gradient-to-l from-gray-300/80 to-transparent rounded-full animate-pulse`}></div>
                  <div className={`absolute ${
                    screenSize === 'large' ? '-left-16 md:-left-20' : '-top-16 md:-top-20'
                  } top-1/2 transform -translate-y-1/2 w-12 md:w-16 h-2 md:h-3 bg-gradient-to-l from-gray-400/60 to-transparent rounded-full animate-pulse delay-100`}></div>
                  
                  {/* Sparks Effect */}
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping"
                      style={{
                        left: `${-8 - i * 4}px`,
                        top: `${6 + i * 2}px`,
                        animationDelay: `${i * 200}ms`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Treasure Island with PNG Image */}
          <div 
            ref={islandRef}
            className={`absolute ${
              screenSize === 'large' 
                ? 'right-8 md:right-16 bottom-16' 
                : 'left-1/2 transform -translate-x-1/2 bottom-8'
            }`}
          >
            <div className="treasure-island-container relative">
              {/* Island PNG Image */}
              <img 
                src="/images/island.png" 
                alt="Treasure Island"
                className={`${
                  screenSize === 'large' ? 'w-[25vw] h-auto' : 'w-56 h-auto'
                } drop-shadow-2xl transition-all duration-300`}
                style={{
                  filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.4))'
                }}
              />

              {/* Landed Technologies Display */}
              <div className={`absolute ${
                screenSize === 'large' 
                  ? '-top-32 left-1/2 transform -translate-x-1/2 w-64' 
                  : '-top-24 left-1/2 transform -translate-x-1/2 w-48'
              }`}>
                <div className={`grid ${
                  screenSize === 'large' ? 'grid-cols-4' : 'grid-cols-3'
                } gap-2 md:gap-3`}>
                  {landedTechs.map((tech, index) => (
                    <div
                      key={tech.name}
                      className="tech-treasure relative animate-bounce"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-xl border-2 md:border-4 border-yellow-400 flex items-center justify-center text-sm md:text-xl shadow-2xl">
                        {tech.icon}
                      </div>
                      
                      {/* Splash Effect */}
                      <div className="absolute -inset-2 md:-inset-3 bg-cyan-300/40 rounded-full animate-ping opacity-0 splash-effect"></div>
                      
                      {/* Tooltip */}
                      <div className="absolute -bottom-8 md:-bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none z-30">
                        <div className="bg-gray-900 text-white px-2 md:px-3 py-1 md:py-2 rounded-lg text-xs md:text-sm whitespace-nowrap shadow-xl border border-gray-700">
                          {tech.name}
                          <div className="absolute -top-1 md:-top-2 left-1/2 transform -translate-x-1/2 w-2 md:w-3 h-2 md:h-3 bg-gray-900 rotate-45 border-l border-t border-gray-700"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Island Penguin */}
              {/* <div className={`absolute ${
                screenSize === 'large' 
                  ? '-top-8 right-8' 
                  : '-top-6 right-6'
              }`}>
                <div className="island-penguin text-3xl md:text-4xl animate-bounce drop-shadow-lg">
                  🐧
                </div>
              </div> */}

              {/* Island Water Reflection */}
              <div className="absolute top-full left-0 w-full h-6 bg-gradient-to-b from-cyan-400/30 to-transparent transform scale-y-[-1] opacity-40 blur-sm"></div>
            </div>
          </div>

          {/* Water Splash Effects */}
          {landedTechs.length > 0 && (
            <div className={`absolute ${
              screenSize === 'large' 
                ? 'right-32 bottom-40' 
                : 'left-1/2 transform -translate-x-1/2 bottom-32'
            }`}>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-4 h-4 md:w-6 md:h-6 bg-cyan-300/70 rounded-full animate-ping shadow-lg"
                  style={{
                    left: `${i * 8}px`,
                    top: `${Math.sin(i) * 6}px`,
                    animationDelay: `${i * 300}ms`
                  }}
                ></div>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Control Panel */}
        <div className="text-center mt-12 md:mt-20">
          <div className="inline-block p-6 md:p-8 bg-gradient-to-r from-amber-700/90 to-amber-900/90 backdrop-blur-sm rounded-2xl md:rounded-3xl border-2 md:border-4 border-amber-500 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 mb-4 md:mb-6">
              <button
                onClick={fireCannon}
                className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-red-500 to-red-700 text-white font-bold text-base md:text-lg rounded-xl md:rounded-2xl shadow-xl hover:scale-110 transition-transform duration-200 border-2 md:border-4 border-red-400"
              >
                🔥 Fire Cannon!
              </button>
              
              <button
                onClick={resetDemo}
                className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-cyan-500 to-cyan-700 text-white font-bold text-base md:text-lg rounded-xl md:rounded-2xl shadow-xl hover:scale-110 transition-transform duration-200 border-2 md:border-4 border-cyan-400"
              >
                🔄 Reset Fleet
              </button>
            </div>
            
            <div className="text-amber-100">
              <p className="font-bold text-lg md:text-xl mb-2 md:mb-3">⚓ Captain's Log ⚓</p>
              <p className="text-base md:text-lg mb-1 md:mb-2">
                Technologies Captured: <span className="text-yellow-300 font-bold">{landedTechs.length}/{technologies.length}</span>
              </p>
              <p className="text-base md:text-lg">
                Next Ammunition: <span className="text-yellow-300 font-bold">{technologies[currentTechIndex]?.name || 'Reloading...'}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologiesSection;