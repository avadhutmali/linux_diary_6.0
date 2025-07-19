import React, { useEffect, useRef, useState } from 'react';
import img1 from '../assets/RoadMap1.png';
import img2 from '../assets/RoadMap1.png';
import img3 from '../assets/RoadMap1.png';
import img4 from '../assets/RoadMap1.png';
import poleImage from '../assets/red-pole.png'

const images = [
  { id: 'one', src: img1, alt: 'Pirate Penguin 1' },
  { id: 'two', src: img2, alt: 'Pirate Penguin 2' },
  { id: 'three', src: img3, alt: 'Pirate Penguin 3' },
  { id: 'four', src: img4, alt: 'Pirate Penguin 4' },
];

const Roadmap = () => {
  const [visible, setVisible] = useState(new Set());
  const refs = useRef({});

  useEffect(() => {
    const observers = images.map((img) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible((prev) => new Set(prev).add(img.id));
            obs.unobserve(entry.target);
          }
        },
        { threshold: 0.2 }
      );
      const el = refs.current[img.id];
      if (el) obs.observe(el);
      return obs;
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section className="py-20 h-[150vh] lg:h-[180vh] relative overflow-hidden">
      {/* Ice-pillar spine */}
      {/* Pole Image as Roadmap Spine */}
<div className="absolute left-1/2 top-75 transform -translate-x-1/2 w-6 h-full z-0 overflow-hidden pointer-events-none">
  <div className="h-full w-full bg-[repeating-linear-gradient(45deg,red_0,red_10px,white_10px,white_20px)]" />
</div>





      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-700">ROADMAP</h2>
          <p className="text-blue-600 mt-2">
            
          </p>
        </div>

        <div className="relative max-w-xl mx-auto">
          {images.map((img, i) => {
            const sideClass = i % 2 === 0 ? 'right-1/2 mr-4' : 'left-1/2 ml-4';
            const offsetY = 80 + i * 280;
            const isVisible = visible.has(img.id);

            return (
              <div
                key={img.id}
                ref={(el) => (refs.current[img.id] = el)}
                className={`
                  absolute ${sideClass} w-1/2 transform
                  transition-all duration-[1000ms] 
                  ${isVisible ? 'opacity-100  translate-y-0' : 'opacity-0 translate-y-8'}
                `}
                style={{
                  top: offsetY,
                  transitionDelay: `${i * 300}ms`,
                }}
              >
                <div className="ice-block1 p-5 rounded-xl bg-transparent flex justify-center">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="scale-100"
                  />
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
