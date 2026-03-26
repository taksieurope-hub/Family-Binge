import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Mail } from 'lucide-react';

const Footer = () => {
  const cols = [
    ['FAQ', 'Investor Relations', 'Privacy', 'Speed Test'],
    ['Help Center', 'Jobs', 'Cookie Preferences', 'Legal Notices'],
    ['Account', 'Ways to Watch', 'Corporate Information', 'Only on familybinge'],
    ['Media Centre', 'Terms of Use', 'Contact Us'],
  ];

  return (
    <footer className="bg-[#141414] border-t border-white/10 px-4 md:px-12 py-12">
      <div className="max-w-5xl">
        <div className="flex gap-4 mb-6">
          {[
            { icon: Facebook, href: '#' },
            { icon: Instagram, href: '#' },
            { icon: Twitter, href: '#' },
            { icon: Youtube, href: '#' },
          ].map(({ icon: Icon, href }, i) => (
            <a key={i} href={href} className="text-[#757575] hover:text-white transition-colors">
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {cols.map((col, i) => (
            <ul key={i} className="space-y-3">
              {col.map(link => (
                <li key={link}>
                  <a href="#" className="text-[#757575] hover:text-[#bcbcbc] text-xs transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <a href="mailto:support@familybinge.tv" className="flex items-center gap-2 text-[#757575] hover:text-white text-xs transition-colors w-fit">
            <Mail className="w-4 h-4" /> support@familybinge.tv
          </a>
          <p className="text-[#757575] text-xs">© {new Date().getFullYear()} D'Ahl Enterprises. All rights reserved.</p>
          <p className="text-[#757575] text-xs">familybinge is not affiliated with Netflix, Inc.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
