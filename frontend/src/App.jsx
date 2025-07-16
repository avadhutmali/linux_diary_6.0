import React from 'react'
import HeroSection from './components/HeroSection'
import RoadmapSection from './components/RoadmapSection'
import Navbar from './components/Navbar'

const App = () => {
  return (
    <div className="min-h-screen">
      <Navbar/>
      <HeroSection />
      <RoadmapSection/>
    </div>
  )
}

export default App