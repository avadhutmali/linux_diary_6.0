import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import chestClosed  from '../assets/Chest/chest_closed.svg';
import chestOpen   from '../assets/Chest/chest_open.svg';

import swags       from '../assets/prizes/swags.webp';
import merchandise from '../assets/prizes/merchandise.png';
import cashPrize   from '../assets/prizes/cashPrize.webp';

const PrizeCard = ({ image, title, description }) => (
  <div className="flex flex-col items-center justify-end p-3 text-xs text-center bg-white shadow-lg rounded-lg w-[120px] h-[140px]">
    <img src={image} alt={title} className="w-full h-[70%] object-cover mb-2 rounded" />
    <h3 className="font-bold text-[12px]">{title}</h3>
    <p className="text-[10px]">{description}</p>
  </div>
);

// desktop positions (unchanged)
const positionsDesktop = [
  { x: -380, y: -200, rotate: 0 },
  { x:  -60, y: -200, rotate: 0 },
  { x:  260, y: -200, rotate: 0 },
];

// mobile positions (tighter fan)
const positionsMobile = [
  { x: -170, y: -140, rotate: 0 },
  { x:   -35,  y: -200, rotate:  0 },
  { x:  100, y: -140, rotate:  0 },
];

export default function TreasureBox() {
  const [isOpen, setIsOpen]     = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // detect mobile once
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const scaleFactor = isMobile ? 1 : 1.5;
  const positions   = isMobile ? positionsMobile : positionsDesktop;

  // prize data
  const cards = [
    { id:1, image: swags,       title:'', desc:''    },
    { id:2, image: merchandise, title:'', desc:''       },
    { id:3, image: cashPrize,   title:'', desc:''},
  ];

  return (
    <>
    <h2 className="text-4xl font-bold text-center text-white">PRIZES</h2>
    <div className="relative flex flex-col items-center justify-center h-[600px]">
      {/* CHEST (no animation, just swap) */}
      <img
        src={isOpen ? chestOpen : chestClosed}
        alt="Treasure Chest"
        onClick={() => setIsOpen(o => !o)}
        className="cursor-pointer w-[200px] md:w-[300px]"
      />

      {/* PRIZE CARDS */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              visible: { transition: { delayChildren: 0.2, staggerChildren: 0.1 } },
              hidden:  { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
            }}
            className="absolute top-1/2 md:left-1/2 left-[44vw] w-0 h-0"
          >
            {cards.map((c, i) => (
              <motion.div
                key={c.id}
                custom={i}
                variants={{
                  hidden: {
                    x:       0,
                    y:       0,
                    scale:   0.6 * scaleFactor,
                    opacity: 0,
                    transition: { duration: 0.4 }
                  },
                  visible: idx => ({
                    x:        positions[idx].x,
                    y:        positions[idx].y,
                    rotate:   positions[idx].rotate,
                    scale:    scaleFactor,
                    opacity:  1,
                    transition: { type: 'spring', stiffness: 200, damping: 20 }
                  })
                }}
                className="absolute"
                style={{ width: 120, height: 160 }}
              >
                <PrizeCard
                  image={c.image}
                  title={c.title}
                  description={c.desc}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}
