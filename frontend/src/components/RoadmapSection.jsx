import { motion } from 'framer-motion';
import cardTemplate from '../assets/card-template.png'; // Your PNG template

const RoadmapSection = () => {
  const milestones = [
    {
      title: "FOSS Kickoff",
      content: "Worried about being an absolute beginner in Linux? Don't fret! We've got you covered with a beginner-friendly session that serves as the perfect introduction to open-source and Linux. You'll gain a solid foundation and discover real-life applications of these technologies."
    },
    {
      title: "Route to Root",
      content: "With a strong foundation in place, we will dive into the world of open-source and Linux, empowering you with comprehensive knowledge of crucial commands, the booting process, text editors, process management and the seamless integration of pipelining techniques."
    },
    {
      title: "File Fortress",
      content: "Guess what? Everything in Linux is a file! Here we'll explore the file system in Linux. In this enlightening session, we will familiarise ourselves with file systems, groups, users and the diverse range of commands vital for their successful management."
    },
    {
      title: "Net-Wars",
      content: "Dive into the fascinating world of Networking in Linux! Unravel network interfaces, IP addresses, essential protocols and commands. But that's not all - we'll also explore the thrilling realm of network security with a live phishing session to wrap things up with a bang."
    }
  ];

  return (
    <section className="py-20 px-4">
      <h2 className="text-4xl font-bold text-center mb-16">
        Learning Pathway
      </h2>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {milestones.map((milestone, index) => (
          <motion.div
            key={index}
            className="relative w-full h-96"
            style={{ perspective: '1000px' }}
            whileHover="hover"
            initial="rest"
          >
            {/* Card container */}
            <motion.div
              className="relative w-full h-full"
              style={{ transformStyle: 'preserve-3d' }}
              variants={{
                rest: { rotateY: 0 },
                hover: { rotateY: 180 }
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              {/* Front side - PNG template with title */}
              <div 
                className="absolute w-full h-full"
                style={{ 
                  backfaceVisibility: 'hidden',
                  backgroundImage: `url(${cardTemplate})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <h3 className="text-xl md:text-2xl font-bold text-center text-white drop-shadow-lg">
                    {milestone.title}
                  </h3>
                </div>
              </div>

              {/* Back side - PNG template with content */}
              <div 
                className="absolute w-full h-full"
                style={{ 
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  backgroundImage: `url(${cardTemplate})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                {/* Content area with proper margins to stay within card template */}
                <div className="absolute inset-0 p-8 px-32 m-4 flex flex-col items-center justify-center">
                  <h3 className="text-lg font-extrabold mb-3 text-white drop-shadow-lg">
                    {milestone.title}
                  </h3>
                  <div className="max-h-64 overflow-y-auto pr-2">
                    <p className="text-white font-bold text-md leading-relaxed drop-shadow-md">
                      {milestone.content}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default RoadmapSection;