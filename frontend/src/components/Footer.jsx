import React from "react";
import FooterImg from "/images/footer1.png";
import WlugImg from "../assets/wlug-logo-black.png";
import openSuse from "../assets/OpenSUSE.png"
import potoba from "../assets/potoba.png";
// import { navigation } from "../constants";
import {
    FaGithub,
    FaInstagram,
    FaLinkedin,
    FaXTwitter,
    FaDiscord,
} from "react-icons/fa6";


const Footer = () => {
    return (
        <div id="about" className="text-black py-2  z-100 w-full">
            <img src={FooterImg} className=" h-[22vh] relative z-100 sm:h-[22vh] md:h-[77vh] w-full"></img>
            <div className="flex flex-col  md:space-y-0 md:flex-row  md:justify-around p-6  items-center lg:px-12" style={{ backgroundColor: "#FDF8F7" }}>
                <div>
                    <p className="text-3xl font-extrabold text-gray-800 mb-2 text-center md:text-left">
                        Our Sponsors</p>
                    <div className="flex flex-col justify-center items-center md:flex-row md:space-x-3 space-y-3 md:space-y-0">
                        <img src={openSuse} className="h-20 mix-blend-multiply"></img>
                        <img src={potoba} className="h-20 mix-blend-multiply"></img>
                    </div>
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-extrabold text-gray-800 mb-2 text-center md:text-left">
                        Stay Tuned!
                    </h1>
                    <div className="flex space-x-2 justify-center md:justify-start">
                        <a
                            href="https://instagram.com/wcewlug?igshid=YmMyMTA2M2Y="
                            target="_blank"
                        >
                            <FaInstagram className="text-3xl text-gray-800 cursor-pointer hover:scale-110 hover:text-blue-400 transition-all" />
                        </a>
                        <a
                            href="https://www.linkedin.com/company/wlug-club/"
                            target="_blank"
                        >
                            <FaLinkedin className="text-3xl text-gray-800 cursor-pointer hover:scale-110 hover:text-blue-400 transition-all" />
                        </a>
                        <a
                            href="https://github.com/Walchand-Linux-Users-Group"
                            target="_blank"
                        >
                            <FaGithub className="text-3xl text-gray-800 cursor-pointer hover:scale-110 hover:text-blue-400 transition-all" />
                        </a>
                        <a
                            href="https://mobile.twitter.com/wcewlug"
                            target="_blank"
                        >
                            <FaXTwitter className="text-3xl text-gray-800 cursor-pointer hover:scale-110 hover:text-blue-400 transition-all" />
                        </a>
                        <a
                            href="https://discord.com/invite/3ce8hBZfc8"
                            target="_blank"
                        >
                            <FaDiscord className="text-3xl text-gray-800 cursor-pointer hover:scale-110 hover:text-blue-400 transition-all" />
                        </a>
                    </div>
                    <p className="text-[14px]">
                        © 2025 WCEWLUG, ALL RIGHTS RESERVED
                    </p>
                </div>
                <div className="space-y-2">
                    <a href="https://www.wcewlug.org/" target="_blank">
                        <img src={WlugImg} className="w-48 mx-auto"></img>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Footer;