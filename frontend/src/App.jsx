import React from 'react'
import HeroSection from './components/HeroSection'
import RoadmapSection from './components/RoadmapSection'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Roadmap from './components/Roadmap'
import TechnologiesSection from './components/TechnologiesSection'
import PrizeSection from './components/PrizeSection'

const App = () => {
  return (
    <div className="min-h-screen">
      <Navbar/>
      <HeroSection />
      {/* <RoadmapSection/> */}
      <Roadmap/>
      <TechnologiesSection/>
      <PrizeSection/>
      <Footer/>
    </div>
  )
}

export default App