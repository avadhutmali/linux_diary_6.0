import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import heroImage from '../assets/linuxdiary-hero.avif';
import SplitTexts from '../blocks/TextAnimations/SplitText/SplitText';


const HeroSection = () => {
  const heroRef = useRef(null);
  
  // Floating animation values
  const floatingY = useMotionValue(0);
  const floatingX = useMotionValue(0);

  // Counter animation
  const count = useMotionValue(0);


  useEffect(() => {
    const counterAnimation = animate(count, 100, { duration: 3 });
    
    const floatYAnimation = animate(floatingY, [0, -30, 0], {
      duration: 6,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    });
    
    const floatXAnimation = animate(floatingX, [0, 5, 0], {
      duration: 8,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    });
    
    return () => {
      counterAnimation.stop();
      floatYAnimation.stop();
      floatXAnimation.stop();
    };
  }, []);

  // Snowflake component
  

  return (
    <section 
      ref={heroRef}
      className="relative h-fit lg:h-screen w-screen overflow-hidden flex flex-col items-center "
    >
      

      {/* Snowflakes */}
      {/* {Array.from({ length: 80 }).map((_, i) => (
        <Snowflake key={i} />
      ))} */}
 <div className='flex item-center gap-4 '>
          <SplitTexts
          text="LinuxDiary 6.0"
          className="header lg:text-7xl  pb-4 text-5xl font-extrabold text-white mb-2"
           />

         
      </div>
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
       
        <motion.div
          style={{ 
            y: floatingY,
            x: floatingX
          }}
          transition={{ type: 'spring', damping: 10 }}
          className="mb-8"
        >
          <img 
            src={heroImage} 
            alt="LinuxDiary 6.0 Penguin Mascot" 
            className="max-w-lg lg:max-w-5xl drop-shadow-[0_25px_25px_rgba(0,60,120,0.3)]"
          />
        </motion.div>

       
      </div>
    </section>
  );
};

export default HeroSection;