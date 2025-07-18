import React, { useState } from 'react';
import { Gift, Award, DollarSign } from 'lucide-react';

const prizes = [
  {
    id: 'swags',
    title: 'Swags & Goodies',
    description: 'Exclusive PenguinX merchandise and tech accessories',
    icon: <Gift className="w-8 h-8" />,
    items: ['Custom Linux T-Shirts', 'Penguin Stickers', 'Tech Accessories', 'USB Drives']
  },
  {
    id: 'merchandise',
    title: 'Premium Merchandise',
    description: 'High-quality branded items for top performers',
    icon: <Award className="w-8 h-8" />,
    items: ['Hoodies & Jackets', 'Water Bottles', 'Laptop Bags', 'Wireless Headphones']
  },
  {
    id: 'cash',
    title: 'Cash Prizes',
    description: 'Monetary rewards for competition winners',
    icon: <DollarSign className="w-8 h-8" />,
    items: ['1st Place: $500', '2nd Place: $300', '3rd Place: $200', 'Participation: $50']
  }
];

const WinSection = () => {
  const [hoveredPrize, setHoveredPrize] = useState(null);

  return (
    <section className="py-20 b relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="treasure-sparkles"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent mb-4">
            Participate & Win
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the treasures waiting for you in our frozen prize vault
          </p>
        </div>

        {/* Floating Treasure Chest */}
        <div className="relative max-w-6xl mx-auto">
          {/* Main Iceberg with Treasure Chest */}
          <div className="flex justify-center mb-12">
            <div className="treasure-iceberg relative">
              <div className="w-48 h-32 bg-gradient-to-b from-cyan-100 to-blue-200 rounded-t-full shadow-2xl border-4 border-cyan-200 relative">
                {/* Treasure Chest */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <div className="treasure-chest w-16 h-12 bg-gradient-to-b from-yellow-600 to-yellow-800 rounded-lg border-2 border-yellow-700 relative shadow-lg">
                    <div className="absolute top-1 left-1 right-1 h-2 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-300 text-xs">💎</div>
                  </div>
                </div>

                {/* Ice sparkles */}
                <div className="absolute top-4 left-6 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                <div className="absolute top-8 right-8 w-1 h-1 bg-blue-400 rounded-full animate-ping delay-1000"></div>
                <div className="absolute bottom-4 left-1/2 w-1 h-1 bg-cyan-300 rounded-full animate-ping delay-500"></div>
              </div>
              <div className="w-56 h-16 bg-gradient-to-b from-blue-200 to-cyan-300 rounded-b-full shadow-inner -mt-2 opacity-80"></div>
            </div>
          </div>

          {/* Prize Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {prizes.map((prize, index) => (
              <div
                key={prize.id}
                className="prize-card-container"
                onMouseEnter={() => setHoveredPrize(prize.id)}
                onMouseLeave={() => setHoveredPrize(null)}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="group relative">
                  {/* Ice Cube Card */}
                  <div className={`ice-cube-card relative p-6 bg-gradient-to-br from-white/80 to-cyan-100/60 backdrop-blur-sm rounded-3xl border-2 border-cyan-200/50 shadow-xl transition-all duration-500 ${hoveredPrize === prize.id ? 'transform scale-105 shadow-2xl' : ''}`}>

                    {/* Melting Ice Effect */}
                    {hoveredPrize === prize.id && (
                      <div className="absolute inset-0 melting-ice-overlay rounded-3xl overflow-hidden">
                        <div className="melting-animation"></div>
                      </div>
                    )}

                    {/* Card Content */}
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        {prize.icon}
                      </div>

                      <h3 className="text-2xl font-bold text-gray-800 mb-3">{prize.title}</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">{prize.description}</p>

                      {/* Prize Items */}
                      <ul className="space-y-3">
                        {prize.items.map((item, idx) => (
                          <li
                            key={idx}
                            className={`flex items-center text-sm text-gray-700 transition-all duration-300 ${hoveredPrize === prize.id ? 'transform translate-x-2' : ''}`}
                            style={{ transitionDelay: `${idx * 100}ms` }}
                          >
                            <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Hover Glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-300/30 to-blue-400/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <div className="inline-block p-6 bg-gradient-to-r from-cyan-100/80 to-blue-100/80 backdrop-blur-sm rounded-2xl border border-cyan-200/50 shadow-lg">
              <p className="text-lg font-semibold text-gray-800 mb-2">Ready to claim your prizes?</p>
              <p className="text-gray-600">Join the competition and show your Linux prowess!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WinSection;
