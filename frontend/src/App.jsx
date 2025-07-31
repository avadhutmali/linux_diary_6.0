import React, { useState, useEffect } from "react";
import HeroSection from "./components/HeroSection";
import RoadmapSection from "./components/RoadmapSection";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Roadmap from "./components/Roadmap";
import TechnologiesSection from "./components/TechnologiesSection";
import PrizeSection from "./components/PrizeSection";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ImageGallary from "./components/ImageGallary";
import Register from "./components/Registration";
import Snowfall from "react-snowfall";

const App = () => {
  const [showContent, setshowContent] = useState(false);

  useGSAP(() => {
    const timeline1 = gsap.timeline();

    timeline1
      .to(".vi-mask-group", {
        rotate: 10,
        duration: 2,
        ease: "Power4.easeInOut",
        transformOrigin: "50% 50%",
      })
      .to(".vi-mask-group", {
        scale: 10,
        duration: 2,
        delay: -1.8,
        ease: "Expo.easeInOut",
        transformOrigin: "50% 50%",
        opacity: 0,
        onUpdate: function () {
          if (this.progress() >= 0.9) {
            document.querySelector(".svg")?.remove();
            setshowContent(true);
            this.kill();
          }
        },
      });
  });

  useEffect(() => {
    if (!showContent) return;

    const main = document.querySelector(".main");

    const handleMouseMove = (e) => {
      const xMove = (e.clientX / window.innerWidth - 0.5) * 40;
      gsap.to(".main .text", {
        x: `${xMove * 0.4}%`,
      });

    };

    main?.addEventListener("mousemove", handleMouseMove);

    return () => {
      main?.removeEventListener("mousemove", handleMouseMove);
    };
  }, [showContent]);

  return (
    <>
      <div className="svg flex items-center justify-center fixed top-0 left-0 z-[100] w-full h-screen overflow-hidden bg-transparent ">
        <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <mask id="viMask">
              <rect width="100%" height="100%" fill="black" />
              <g className="vi-mask-group">
                <text
                  x="50%"
                  y="50%"
                  fontSize="180"
                  textAnchor="middle"
                  fill="white"
                  dominantBaseline="middle"
                  fontFamily="Arial Black"
                >
                  WLUG
                </text>
              </g>
            </mask>
          </defs>
          <image
            href=""
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            mask="url(#viMask)"
          />
        </svg>
      </div>
      {showContent && (
        <div className="main min-h-screen">
          <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-1">
              <Snowfall snowflakeCount={150} />
            </div>
          <Navbar />
          <HeroSection />
          {/* <RoadmapSection/> */}
          <Roadmap />
          <TechnologiesSection />
          <PrizeSection />
          <ImageGallary/>
          <Register/>
          <Footer />
        </div>
      )}
    </>
  );
};

export default App;
