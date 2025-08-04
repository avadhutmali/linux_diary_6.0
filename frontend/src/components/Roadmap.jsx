import React, { useEffect, useRef, useState } from "react";
import img1 from "../assets/Roadmaps/3.svg";
import img2 from "../assets/Roadmaps/4.svg";
import img3 from "../assets/Roadmaps/5.svg";
import img4 from "../assets/Roadmaps/6.svg";
import img5 from "../assets/Roadmaps/7.svg";
import img6 from "../assets/Roadmaps/8.svg";
import img7 from "../assets/Roadmaps/9.svg";
import img8 from "../assets/Roadmaps/10.svg";

const timelineData = [
  {
    id: "one",
    frontTitle: "Session 1:\nBorn to Boot",
    description: `New to Linux or Open Source? Don’t worry—we’re starting from scratch! This session covers the basics of open-source software, OS vs Kernel, system calls and Linux distributions. Perfect for beginners looking to build a solid foundation.`,
    imagePrimary: img1,
    imageSecondary: img5,
  },
  {
    id: "two",
    frontTitle: "Session 2:\nCommand Quest",
    description: `Dive deeper into the Linux system with a hands-on session covering essential commands, the booting process, and process management. Learn how Linux starts, the role of BIOS/UEFI, explore powerful text editors, and master concepts like forking, zombies and pipelining—equipping you with practical skills to navigate Linux like a pro.`,
    imagePrimary: img2,
    imageSecondary: img6,
  },
  {
    id: "three",
    frontTitle: "Session 3:\nFile Forge",
    description: `This session offers a clear dive into Linux’s file systems, directory structure, and user management. You'll learn about different file system types, how Linux organizes its directories, manages multiple users-groups and controls access through file permissions—essential skills for any aspiring Linux user.`,
    imagePrimary: img3,
    imageSecondary: img7,
  },
  {
    id: "four",
    frontTitle: "Session 4:\nNet Navigators",
    description: `Dive into a power-packed session on Linux networking starting from core concepts like network components and protocols to essential commands, Nmap, SSH, and UFW. A live demo ties it all together, making it ideal for building both foundational and hands-on skills.`,
    imagePrimary: img4,
    imageSecondary: img8,
  }
];

export default function Roadmap() {
  const [visible, setVisible] = useState(new Set());
  const [flipped, setFlipped] = useState(new Set());
  const [imageFlipped, setImageFlipped] = useState(new Set());
  const refs = useRef({});

  useEffect(() => {
    const observers = timelineData.map(item => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(prev => new Set(prev).add(item.id));
            obs.unobserve(entry.target);
          }
        }, { threshold: 0.2 }
      );
      const el = refs.current[item.id];
      if (el) obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const handleCardClick = (itemId) => {
    setFlipped(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleImageClick = (itemId) => {
    setImageFlipped(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-white mb-12">ROADMAP</h2>
        <div className="relative max-w-4xl mx-auto">
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 rounded-full"></div>

          {timelineData.map((item, idx) => {
            const isVisible = visible.has(item.id);
            const isEven = idx % 2 === 0;
            const isCardFlipped = flipped.has(item.id);
            const isImageFlipped = imageFlipped.has(item.id);

            return (
              <div
                key={item.id}
                ref={el => (refs.current[item.id] = el)}
                className={
                  `group flex flex-col lg:flex-row items-center mb-16 transform transition-all duration-700 ease-out ` +
                  (isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')
                }
                style={{ transitionDelay: `${idx * 200}ms` }}
              >
                {/* Card */}
                <div
                  className={
                    `relative w-full lg:w-1/2 perspective ` +
                    (isEven ? 'lg:order-1 lg:pl-8' : 'lg:pr-8')
                  }
                >
                  <div
                    className={`relative w-full h-56 bg-white/10 border border-white/20 rounded-2xl transition-transform duration-600 transform-style-preserve-3d cursor-pointer ${
                      isCardFlipped ? 'rotate-y-180' : ''
                    } hover:rotate-y-180`}
                    onClick={() => handleCardClick(item.id)}
                  >
                    {/* Front */}
                    <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-6">
                      <h3 className="text-2xl font-extrabold text-white whitespace-pre-line text-center">
                        {item.frontTitle}
                      </h3>
                    </div>
                    {/* Back */}
                    <div className="absolute w-full h-full backface-hidden rotate-y-180 overflow-auto p-6">
                      <p className="text-white text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Penguin Image */}
                <div
                  className={
                    `w-full lg:w-1/2 flex justify-center mt-6 lg:mt-0 ` +
                    (isEven ? 'lg:order-0' : '')
                  }
                >
                  <div 
                    className={`w-50 h-50 bg-transparent rounded-lg overflow-hidden transition-all duration-500 cursor-pointer ${
                      isImageFlipped ? 'scale-110' : ''
                    } group-hover:scale-110`}
                    onClick={() => handleImageClick(item.id)}
                  >
                    <img
                      src={item.imagePrimary}
                      alt={item.frontTitle}
                      className={`w-full h-full object-contain transition-opacity duration-300 ${
                        isImageFlipped ? 'hidden' : 'block'
                      } group-hover:hidden`}
                    />
                    <img
                      src={item.imageSecondary}
                      alt={`${item.frontTitle} details`}
                      className={`w-full h-full object-contain transition-opacity duration-300 ${
                        isImageFlipped ? 'block' : 'hidden'
                      } hidden group-hover:block`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <style>{`
        .perspective {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        
        /* Ensure hover effects work on desktop while click works on mobile */
        @media (hover: hover) and (pointer: fine) {
          .group:hover .hover\\:rotate-y-180 {
            transform: rotateY(180deg);
          }
          .group:hover .hover\\:scale-110 {
            transform: scale(1.1);
          }
        }
      `}</style>
    </section>
  );
}