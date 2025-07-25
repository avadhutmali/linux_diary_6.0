import { Gift, Award, DollarSign } from 'lucide-react';
import GlareHover from '../blocks/Animations/GlareHover/GlareHover';
import swags from '../assets/prizes/swags.webp'
import merchandise from '../assets/prizes/merchandise.png';
import cashPrize from '../assets/prizes/cashPrize.webp';

const prizes = [
  {
    img:swags,
    title: 'Swags',

  },
  {
    img:merchandise,
    title: 'Merchandise',
  },
  {
    img:cashPrize,
    title: 'Cash Prizes',
  }
];

const WinSection = () => {
  
  return (
   <>
   <h1 className="text-2xl font-bold text-center mb-8 text-white">Win Amazing Prizes!</h1>
   <div className="container w-1/2 lg:w-2/3 h-auto mx-auto p-8 flex flex-col lg:flex-row items-center gap-8">
     {prizes.map((prize, index) => (
      <GlareHover
      glareColor="#ffffff"
      background='#00CED1'
    glareOpacity={0.3}
    glareAngle={-30}
    glareSize={300}
    transitionDuration={800}
    playOnce={false}>
       <img src={prize.img} alt={prize.title} className="w-2/3 h-2/3 object-cover" />
      </GlareHover>
    ))}
   </div>
   </>
  );
};

export default WinSection;
