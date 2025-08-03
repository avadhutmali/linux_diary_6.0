// src/App.jsx

import React, { useState, useEffect } from "react";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Roadmap from "./components/Roadmap";
import TechnologiesSection from "./components/TechnologiesSection";
// import PrizeSection from "./components/PrizeSection";
import TreasureBox from "./components/Treasurebox";
import ImageGallary from "./components/ImageGallary";
import Register from "./components/Registration";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Snowfall from "react-snowfall";

const App = () => {
  const [showContent, setShowContent] = useState(false);

  // initial mask animation
  useGSAP(() => {
    const timeline = gsap.timeline({
      onComplete: () => {
        document.querySelector(".svg")?.remove();
        setShowContent(true);
      },
    });

    timeline
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
      });
  });

  // parallax on main text
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
      {/* FULL-SCREEN MASK */}
      <div
        className="svg pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-black"
      >
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
            href="https://gta-ecru.vercel.app/bg.png"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            mask="url(#viMask)"
          />
        </svg>
      </div>

      {/* MAIN CONTENT */}
      {showContent && (
        <div className="main min-h-screen relative z-0">
          {/* Snow behind everything */}
          <div className="fixed inset-0 pointer-events-none z-0">
            <Snowfall snowflakeCount={150} />
          </div>

          <Navbar />
          <HeroSection />
          <Roadmap />
          <TechnologiesSection />
          {/* <PrizeSection /> */}
          <TreasureBox />
          <ImageGallary />
          <Register />
          <Footer />
        </div>
      )}
    </>
  );
};

export default App;
