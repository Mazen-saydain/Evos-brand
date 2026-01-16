
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, MessageCircle, Send } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 md:pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 mb-16">
          <div className="col-span-1">
            <Link to="/" className="text-3xl md:text-4xl font-black tracking-tighter mb-4 md:mb-6 block">ΞVOS</Link>
            <p className="text-gray-400 text-[11px] md:text-sm leading-relaxed max-w-xs uppercase font-bold tracking-tight">
              Luxury streetwear redefined. Minimalist design. Premium quality. Future-focused.
            </p>
          </div>
          
          <div>
            <h4 className="font-black uppercase tracking-widest text-[10px] mb-6">Explore</h4>
            <ul className="space-y-3 md:space-y-4 text-xs font-bold uppercase tracking-tight">
              <li><Link to="/collections/ALL" className="hover:line-through transition-all">All Products</Link></li>
              <li><Link to="/collections/HOODIES" className="hover:line-through transition-all">Hoodies</Link></li>
              <li><Link to="/collections/SWEATPANTS" className="hover:line-through transition-all">Sweatpants</Link></li>
              <li><Link to="/contact" className="hover:line-through transition-all">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-[10px] mb-6">Support</h4>
            <ul className="space-y-3 md:space-y-4 text-xs font-bold uppercase tracking-tight">
              <li><a href="#" className="hover:line-through transition-all">Shipping & Returns</a></li>
              <li><a href="#" className="hover:line-through transition-all">Privacy Policy</a></li>
              <li><a href="#" className="hover:line-through transition-all">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-[10px] mb-6">Newsletter</h4>
            <p className="text-[10px] text-gray-400 mb-4 font-bold uppercase tracking-widest leading-relaxed">Join the inner circle for early access and limited drops.</p>
            <div className="flex bg-gray-50 p-1">
              <input 
                type="email" 
                placeholder="EMAIL@EXAMPLE.COM" 
                className="bg-transparent px-3 py-3 text-[10px] flex-grow outline-none font-bold"
              />
              <button className="bg-black text-white px-4 py-3 hover:bg-gray-800 transition-colors">
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-10 border-t border-gray-50 gap-6">
          <div className="flex space-x-6">
            <a href={CONTACT_INFO.instagram} target="_blank" rel="noopener noreferrer" className="hover:scale-125 transition-transform text-[#E4405F]">
              <Instagram size={22} />
            </a>
            <a href={CONTACT_INFO.facebook} target="_blank" rel="noopener noreferrer" className="hover:scale-125 transition-transform text-[#1877F2]">
              <Facebook size={22} />
            </a>
            <a href={CONTACT_INFO.tiktok} target="_blank" rel="noopener noreferrer" className="hover:scale-125 transition-transform text-black">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.33-.85.51-1.44 1.43-1.58 2.41-.14.99.19 2.07.9 2.81.91.95 2.35 1.28 3.56.77 1.2-.56 1.91-1.76 1.92-3.07.01-4.52 0-9.03.01-13.54z"/></svg>
            </a>
            <a href={CONTACT_INFO.whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:scale-125 transition-transform text-[#25D366]">
              <MessageCircle size={22} />
            </a>
          </div>
          <p className="text-[8px] md:text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">© 2024 ΞVOS CLOTHING CO. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
