import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import heroImage from '../assets/linuxdiary-hero.avif';
import TrueFocus from '../blocks/TextAnimations/TrueFocus/TrueFocus';
import SplitText from '../blocks/TextAnimations/SplitText/SplitText';
import SplitTexts from '../blocks/TextAnimations/SplitText/SplitText';
import CountUp from '../blocks/TextAnimations/CountUp/CountUp';

const HeroSection = () => {
  const heroRef = useRef(null);
  
  // Floating animation values
  const floatingY = useMotionValue(0);
  const floatingX = useMotionValue(0);

  // Counter animation
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

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
          className="lg:text-8xl pb-4 text-5xl font-bold text-white mb-4"
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
            className="max-w-xl lg:max-w-5xl drop-shadow-[0_25px_25px_rgba(0,60,120,0.3)]"
          />
        </motion.div>

       
      </div>
    </section>
  );
};

export default HeroSection;