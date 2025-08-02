import React from "react";
import Folder from "./Folder";
import swags from "../assets/prizes/swags.webp";
import merchandise from "../assets/prizes/merchandise.png";
import cashPrize from "../assets/prizes/cashPrize.webp";

const PrizeCard = ({ image, title, description }) => (
  <div className="flex flex-col items-center justify-end p-2 text-xs text-center">
    <img src={image} alt={title} className="w-full h-[80%] object-cover mb-2" />
    <div>
      <h3 className="font-bold text-[10px]">{title}</h3>
      <p className="text-[9px]">{description}</p>
    </div>
  </div>
);

export default function PrizeSection() {
  const cards = [
    <PrizeCard key="3" image={cashPrize} title="3rd Prize" description="₹2000 + Certificate" />,
    <PrizeCard key="2" image={merchandise} title="2nd Prize" description="₹3000 + Swag" />,
    <PrizeCard key="1" image={swags} title="1st Prize" description="₹5000 + Goodies" />,
  ];

  return (
    <div className="h-[600px] flex items-center justify-center">
      <Folder size={2} color="#5227FF" items={cards} />
    </div>
  );
}
