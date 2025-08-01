import React, { useEffect, useRef, useState } from "react";
import img1 from "../assets/Roadmaps/6.png";
import img2 from "../assets/Roadmaps/7.png";
import img3 from "../assets/Roadmaps/8.png";
import img4 from "../assets/Roadmaps/9.png";
import img5 from "../assets/Roadmaps/10.png";
import img6 from "../assets/Roadmaps/11.png";
import img7 from "../assets/Roadmaps/12.png";
import img8 from "../assets/Roadmaps/13.png";

const timelineData = [
  {
    id: "one",
    frontTitle: "Session 1:\nBorn to Boot",
    description: `- Open Source Software: Introduction, Applications, Advantages
- OS & Kernel: Introduction, Kernel vs OS, System Calls
- Linux: History, Distributions, Families, Desktop Environments`,
    imagePrimary: img1,
    imageSecondary: img5,
  },
  {
    id: "two",
    frontTitle: "Session 2:\nCommand Quest",
    description: `- Basic & Advanced Commands
- Booting Process: Devices, Bootloader, Sequence, BIOS vs UEFI
- Text Editors: Types & Examples
- Process Management: Lifecycle, PID, Zombie, Fork/Exec
- Pipelining in Linux`,
    imagePrimary: img2,
    imageSecondary: img6,
  },
  {
    id: "three",
    frontTitle: "Session 3:\nFileOps / File Vault / File Riot",
    description: `- File Systems: ext4, XFS, ZFS, BtrFS
- Directory Structure: Full Hierarchy
- User & Group Management: Types, Permissions
- File Permissions: Need & Management`,
    imagePrimary: img3,
    imageSecondary: img7,
  },
  {
    id: "four",
    frontTitle: "Session 4:\nNet Nexus",
    description: `- Networking Basics: Components, IP & Ports, TCP vs UDP
- Networking Commands & Tools
- SSH & UFW: Introduction, Integration
- NMAP: Intro`,
    imagePrimary: img4,
    imageSecondary: img8,
  }
];

export default function Roadmap() {
  const [visible, setVisible] = useState(new Set());
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

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-white mb-12">ROADMAP</h2>
        <div className="relative max-w-4xl mx-auto">
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 rounded-full"></div>

          {timelineData.map((item, idx) => {
            const isVisible = visible.has(item.id);
            const isEven = idx % 2 === 0;

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
                    className="relative w-full h-56 bg-white/10 border border-white/20 rounded-2xl transition-transform duration-600 transform-style-preserve-3d group-hover:rotate-y-180"
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
                  <div className="w-40 h-40 bg-transparent rounded-lg overflow-hidden transition-all duration-500 group-hover:scale-110">
                    <img
                      src={item.imagePrimary}
                      alt={item.frontTitle}
                      className="w-full h-full object-contain group-hover:hidden"
                    />
                    <img
                      src={item.imageSecondary}
                      alt={`${item.frontTitle} details`}
                      className="w-full h-full object-contain hidden group-hover:block"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <style jsx global>{`
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
        @media (hover: none) {
          .group-hover\:rotate-y-180 {
            transform: rotateY(0deg);
          }
          .group-hover\:hidden {
            display: block;
          }
          .group-hover\:block {
            display: none;
          }
          .group-hover\:scale-110 {
            transform: scale(1);
          }
        }
      `}</style>
    </section>
  );
}