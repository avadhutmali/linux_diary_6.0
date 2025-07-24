import React from "react";
import InfiniteMenu from "./InfiniteMenu";
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



const items = [
  {
    image: Img1,
    link: "https://google.com/",
    title: "Item 1",
    description: "This is pretty cool, right?",
  },
  {
    image: Img2,
    link: "https://google.com/",
    title: "Item 2",
    description: "This is pretty cool, right?",
  },
  {
    image: Img3,
    link: "https://google.com/",
    title: "Item 3",
    description: "This is pretty cool, right?",
  },
  {
    image: Img4,
    link: "https://google.com/",
    title: "Item 4",
    description: "This is pretty cool, right?",
  },
    {
    image: Img5,
    link: "https://google.com/",
    title: "Item 4",
    description: "This is pretty cool, right?",
  },
  {
    image: Img6,
    link: "https://google.com/",
    title: "Item 4",
    description: "This is pretty cool, right?",
  },  
  {
    image: Img7,
    link: "https://google.com/",
    title: "Item 4",
    description: "This is pretty cool, right?",
  },
    {
    image: Img8,
    link: "https://google.com/",
    title: "Item 4",
    description: "This is pretty cool, right?",
  },
    {
    image: Img9,
    link: "https://google.com/",
    title: "Item 4",
    description: "This is pretty cool, right?",
  },

];

const ImageGallary = () => {
  return (
    <div style={{ height: "80vh", position: "relative" }}>
      <InfiniteMenu items={items} />
    </div>
  );
};

export default ImageGallary;
