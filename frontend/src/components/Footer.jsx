import React from 'react';
import { Github, Twitter, Disc as Discord, Mail, Heart } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: <Github className="w-6 h-6" />, href: '#', label: 'GitHub' },
    { icon: <Twitter className="w-6 h-6" />, href: '#', label: 'Twitter' },
    { icon: <Discord className="w-6 h-6" />, href: '#', label: 'Discord' },
    { icon: <Mail className="w-6 h-6" />, href: '#', label: 'Email' }
  ];

  const sponsors = [
    'Linux Foundation',
    'Open Source Initiative',
    'Mozilla',
    'Red Hat',
    'Canonical'
  ];

  return (
    <footer className="relative  text-white overflow-hidden">
      {/* Subtle Snowflake Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="snowflakes"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 py-16">
        <div className="container mx-auto px-4">
          {/* Frosted Panel */}
          <div className="relative p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-lg mb-8">
            {/* Logo & Tagline */}
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold drop-shadow-lg">
                LinuxDiary 6.0
              </h3>
              <p className="text-gray-200 text-lg max-w-2xl mx-auto mt-2">
                Join the ultimate Linux fest—engage with talks, workshops, and live demos!
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center space-x-8 mb-12">
              {socialLinks.map((social, index) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="group relative"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="w-14 h-14 flex items-center justify-center bg-white/20 rounded-full border border-white/30 shadow-md hover:bg-white/30 transition duration-300">
                    {social.icon}
                  </div>
                </a>
              ))}
            </div>

            {/* Sponsors */}
            <div className="text-center mb-8">
              <h4 className="text-2xl font-semibold text-white/90 mb-6">
                Proudly Supported By
              </h4>
              <div className="flex flex-wrap justify-center items-center gap-6">
                {sponsors.map((s, i) => (
                  <span
                    key={s}
                    className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white/80 font-medium hover:bg-white/30 transition duration-300"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <a
                href="#register"
                className="inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-full shadow-lg hover:bg-white/90 transition duration-300"
              >
                Register Now
              </a>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="text-center py-6 border-t border-white/25">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-white/80 mb-4 md:mb-0">
                © 2024 LinuxDiary. Made with <Heart className="w-4 h-4 inline text-red-400" /> by WLUG.
              </p>
              <div className="flex space-x-6 text-sm text-white/80">
                <a href="#" className="hover:text-white transition">Privacy Policy</a>
                <a href="#" className="hover:text-white transition">Terms</a>
                <a href="#" className="hover:text-white transition">Code of Conduct</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;