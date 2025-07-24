import { motion } from "framer-motion";
import logo from "../assets/wlug-logo.png"; // Replace with your logo path

const Navbar = () => {
  return (
 
      <div className="w-screen p-8 mx-auto flex items-center justify-center lg:justify-start">
        {/* Logo only */}
        <a href="/" className="focus:outline-none">
          <img 
            src={logo} 
            alt="LinuxDiary Logo" 
            className="h-12 w-24 scale-150 " 
          />
        </a>
      </div>
    
  );
};

export default Navbar;