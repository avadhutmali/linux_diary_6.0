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

  // Calculate trajectory - always horizontal
  const getCannonballPosition = (progress) => {
    const shipRect = shipRef.current?.getBoundingClientRect();
    const islandRect = islandRef.current?.getBoundingClientRect();
    
    // Position cannonball at the ship's cannon head (right edge with small offset)
    const startX = screenSize === 'large' ? 350 : 100; // Adjusted for small screens
    const startY = screenSize === 'large' ? 320 : 150;
    const endX = screenSize === 'large' ? window.innerWidth - 1000 : window.innerWidth - 150; // Adjusted for small screens
    const endY = screenSize === 'large' ? 350 : 180;
    
    const currentX = startX + (endX - startX) * progress;
    const arcHeight = screenSize === 'large' ? 200 : 80;
    const currentY = startY + (endY - startY) * progress - (4 * arcHeight * progress * (1 - progress));
    
    return { x: currentX, y: currentY };
  };

  return (
    <section className="py-12 md:py-20 relative overflow-hidden min-h-[500px] md:min-h-screen ">
      {/* Ocean Background */}
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
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 md:mb-6">
            ⚓ Pirate Tech Arsenal ⚓
          </h2>
          <p className="text-base md:text-xl text-cyan-200 max-w-3xl mx-auto">
            Watch our pirate penguins launch technologies across the digital seas!
          </p>
        </div>

        {/* Main Scene Container */}
        <div className="relative w-full h-[300px] md:h-[500px] max-w-7xl mx-auto">
          
          {/* Pirate Ship */}
          <div 
            ref={shipRef}
            className="absolute left-4 md:left-16 bottom-16"
          >
            <div className={`relative ${cannonRecoil ? 'animate-recoil' : 'animate-wave'}`}>
              <img 
                src="/images/ship.png" 
                alt="Pirate Ship"
                className="w-[120px] md:w-[200px] lg:w-[20vw] h-auto drop-shadow-2xl transition-all duration-300"
              />
              
              {/* Cannon Fire Effect */}
              {firingTech && (
                <div className="absolute right-0  md:right-0 top-2/3 transform -translate-y-1/2">
                  <img 
                    src="/images/explod-animation.gif" 
                    alt="Cannon Explosion"
                    className="w-16 h-16 md:w-24 md:h-24 object-contain z-20"
                  />
                </div>
              )}

              {/* Loading Penguin */}
              {/* <div className="absolute -top-8 right-2 md:right-8">
                <div className={`text-2xl md:text-4xl transition-all duration-500 ${isLoading ? 'animate-bounce scale-125' : ''}`}>
                  🐧
                </div>
                {currentTechIndex < technologies.length && (
                  <div className="absolute -top-6 md:-top-10 left-1/2 transform -translate-x-1/2 text-xl md:text-3xl animate-pulse">
                    {technologies[currentTechIndex].icon}
                  </div>
                )}
              </div> */}
            </div>
          </div>

          {/* Flying Cannonballs */}
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
                  <img 
                    src="/images/cannonball.png" 
                    alt="Cannonball"
                    className="w-8 h-8 md:w-12 md:h-12 drop-shadow-xl"
                  />
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping"
                      style={{
                        left: `${-4 - i * 2}px`,
                        top: `${3 + i}px`,
                        animationDelay: `${i * 200}ms`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Treasure Island */}
          <div 
            ref={islandRef}
            className="absolute right-4 md:right-16 bottom-16"
          >
            <div className="relative">
              <img 
                src="/images/island.png" 
                alt="Treasure Island"
                className="w-[120px] md:w-[200px] lg:w-[600px] h-auto drop-shadow-2xl"
              />

              {/* Landed Technologies */}
              <div className="absolute -top-16 md:-top-24 left-1/2 transform -translate-x-1/2 w-40 md:w-64">
                <div className="grid grid-cols-3 md:grid-cols-4 gap-1 md:gap-2">
                  {landedTechs.map((tech, index) => (
                    <div
                      key={tech.name}
                      className="relative animate-bounce"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <div className="w-6 h-6 md:w-10 md:h-10 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-lg border-2 border-yellow-400 flex items-center justify-center text-xs md:text-lg shadow-lg">
                        {tech.icon}
                      </div>
                      {/* <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[8px] md:text-xs font-bold text-white bg-black/70 px-1 rounded whitespace-nowrap">
                        {tech.name}
                      </div> */}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="text-center mt-8 md:mt-16">
          <div className="inline-block p-4 md:p-6 bg-gradient-to-r from-amber-700/90 to-amber-900/90 backdrop-blur-sm rounded-xl md:rounded-2xl border-2 border-amber-500 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 mb-3 md:mb-4">
              <button
                onClick={fireCannon}
                className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-red-500 to-red-700 text-white font-bold text-sm md:text-base rounded-lg md:rounded-xl shadow-md hover:scale-105 transition-transform duration-200 border-2 border-red-400"
              >
                🔥 Fire Cannon!
              </button>
              
              <button
                onClick={resetDemo}
                className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-cyan-500 to-cyan-700 text-white font-bold text-sm md:text-base rounded-lg md:rounded-xl shadow-md hover:scale-105 transition-transform duration-200 border-2 border-cyan-400"
              >
                🔄 Reset Fleet
              </button>
            </div>
            
            <div className="text-amber-100 text-sm md:text-base">
              <p className="font-bold mb-1 md:mb-2">⚓ Captain's Log ⚓</p>
              <p className="mb-1">
                Technologies Captured: <span className="text-yellow-300 font-bold">{landedTechs.length}/{technologies.length}</span>
              </p>
              <p>
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