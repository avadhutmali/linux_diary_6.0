import { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import Img1 from "../assets/diary/Img1.jpg";
import Img2 from "../assets/diary/Img2.jpg";
import Img3 from "../assets/diary/Img3.jpg";
import Img4 from "../assets/diary/Img4.jpg";
import Img5 from "../assets/diary/Img5.jpg";
import Img6 from "../assets/diary/Img6.jpg";
import Img7 from "../assets/diary/Img7.jpg";
import Img8 from "../assets/diary/Img8.jpg";
import Img9 from "../assets/diary/Img9.jpg";
import Img10 from "../assets/diary/Img10.jpg";
import Img11 from "../assets/diary/Img11.jpg";
import Img12 from "../assets/diary/Img12.jpg";

  import RollingGallery from '../blocks/Components/RollingGallery/RollingGallery'

// const fadeIn = keyframes`
//   from { opacity: 0.6; }
//   to { opacity: 1; }
// `;

// const SliderContainer = styled.div`
//   width: 100%;
//   max-width: 800px;
//   height: 450px;
//   margin: 0 auto;
//   position: relative;
//   overflow: hidden;
//   border-radius: 12px;
//   box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
// `;

// const SliderTrack = styled.div`
//   display: flex;
//   height: 100%;
//   transition: transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1);
// `;

// const Slide = styled.div`
//   min-width: 100%;
//   height: 100%;
//   position: relative;
// `;

// const SlideImage = styled.img`
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
//   animation: ${fadeIn} 0.8s ease-in-out;
// `;

// const DotsContainer = styled.div`
//   position: absolute;
//   bottom: 20px;
//   left: 0;
//   right: 0;
//   display: flex;
//   justify-content: center;
//   gap: 10px;
// `;

// const Dot = styled.div`
//   width: 10px;
//   height: 10px;
//   border-radius: 50%;
//   background: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.5)'};
//   cursor: pointer;
//   transition: all 0.3s ease;
//   box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

//   &:hover {
//     transform: scale(1.2);
//   }
// `;

const InfiniteImageSlider = () => {
  // Predefined image paths (can be replaced with your own)
 const images = [
        Img1,
        Img2,
        Img3,
        Img4,
        Img5,
  
    ];

  // const [currentIndex, setCurrentIndex] = useState(0);
  // const sliderRef = useRef(null);
  // const intervalRef = useRef(null);

  // // Clone first and last images for seamless transition
  // const extendedImages = [images[images.length - 1], ...images, images[0]];

  // const startSlider = () => {
  //   intervalRef.current = setInterval(() => {
  //     setCurrentIndex(prev => {
  //       const newIndex = prev + 1;
  //       if (newIndex === extendedImages.length - 1) {
  //         setTimeout(() => {
  //           sliderRef.current.style.transition = 'none';
  //           setCurrentIndex(1);
  //           // Force reflow
  //           void sliderRef.current.offsetWidth;
  //           sliderRef.current.style.transition = 'transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)';
  //         }, 800);
  //       }
  //       return newIndex;
  //     });
  //   }, 11000);
  // };

  // useEffect(() => {
  //   startSlider();
  //   return () => clearInterval(intervalRef.current);
  // }, []);

  // useEffect(() => {
  //   if (sliderRef.current) {
  //     sliderRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
  //   }
  // }, [currentIndex]);

  // const goToSlide = (index) => {
  //   clearInterval(intervalRef.current);
  //   setCurrentIndex(index + 1); // +1 because of the cloned first item
  //   startSlider();
  // };

  // // Calculate the real slide index (ignoring cloned items)
  // const realIndex = currentIndex === 0 
  //   ? images.length - 1 
  //   : currentIndex === extendedImages.length - 1 
  //     ? 0 
  //     : currentIndex - 1;

  return (
    <>
    <h1 className='text-center text-5xl text-white my-2'>LinuxDiary 5.0</h1>
    {/* <SliderContainer>
      <SliderTrack ref={sliderRef}>
        {extendedImages.map((image, index) => (
          <Slide key={index}>
            <SlideImage src={image} alt={`Slide ${index}`} />
          </Slide>
        ))}
      </SliderTrack>

      <DotsContainer>
        {images.map((_, index) => (
          <Dot 
            key={index} 
            active={index === realIndex}
            onClick={() => goToSlide(index)}
          />
        ))}
      </DotsContainer>
    </SliderContainer> */}


  
<RollingGallery autoplay={true} pauseOnHover={true} />

    </>
  );
};

export default InfiniteImageSlider;