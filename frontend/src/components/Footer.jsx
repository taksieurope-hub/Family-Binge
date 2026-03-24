import React from 'react';
import { Tv, Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    'Quick Links': [
      { label: 'Home', href: '#' },
      { label: 'Live TV', href: '#' },
      { label: 'Movies', href: '#' },
      { label: 'Series', href: '#' },
      { label: 'Pricing', href: '#' },
    ],
    'Support': [
      { label: 'FAQ', href: '#' },
      { label: 'Contact Us', href: '#' },
      { label: 'Installation Guide', href: '#' },
      { label: 'Become a Reseller', href: '#' },
    ],
    'Legal': [
      { label: 'Terms of Service', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Refund Policy', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-2 rounded-lg">
                <Tv className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Waka<span className="text-purple-500">TV</span></span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              The ultimate streaming experience. 220+ live channels, 60,000+ movies & series. Available on all your favorite devices.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a href="#" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5 text-green-500" />
                <span>WhatsApp Support</span>
              </a>
              <a href="mailto:support@wakatv.com" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5 text-purple-400" />
                <span>support@wakatv.com</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 hover:bg-purple-600 rounded-full flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              Copyright © {new Date().getFullYear()} | All rights reserved
            </p>
            <div className="flex items-center gap-4">
              <span className="text-gray-500 text-sm">Available on:</span>
              <div className="flex gap-2">
                {['Android', 'TV', 'Stick'].map((platform) => (
                  <span
                    key={platform}
                    className="px-3 py-1 bg-white/5 rounded text-gray-400 text-xs"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
