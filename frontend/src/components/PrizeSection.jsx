import React from "react";
import Folder from "./Folder";
import swags from "../assets/prizes/img1.png";
import merchandise from "../assets/prizes/img2.png";
import cashPrize from "../assets/prizes/img3.png";

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
    <PrizeCard key="3" image={cashPrize} title="" description="" />,
    <PrizeCard key="2" image={merchandise} title="" description="" />,
    <PrizeCard key="1" image={swags} title="" description="" />,
  ];

  return (
    <div className="h-[600px] flex items-center justify-center">
      <Folder size={2} color="#5227FF" items={cards} />
    </div>
  );
}
