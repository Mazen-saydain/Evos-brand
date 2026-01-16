
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X, LayoutDashboard, User, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { useApp } from '../App';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useApp();

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-20">
          {/* Hamburger Menu Trigger */}
          <div className="flex">
            <button onClick={() => setIsMenuOpen(true)} className="p-1.5 hover:bg-gray-50 rounded-full transition-colors">
              <Menu size={20} className="md:w-6 md:h-6" />
            </button>
          </div>

          {/* Center - Logo */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 text-2xl md:text-3xl font-extrabold tracking-tighter">
            ΞVOS
          </Link>

          {/* Right - Icons */}
          <div className="flex items-center space-x-1 md:space-x-4">
            <Link to="/contact" className="p-1.5 hover:bg-gray-50 rounded-full transition-colors">
              <User size={18} className="md:w-5 md:h-5" />
            </Link>
            <Link to="/admin" className="p-1.5 hover:bg-gray-50 rounded-full relative transition-colors">
              <LayoutDashboard size={18} className="md:w-5 md:h-5" />
            </Link>
            <Link to="/checkout" className="p-1.5 hover:bg-gray-50 rounded-full relative transition-colors">
              <ShoppingBag size={18} className="md:w-5 md:h-5" />
              {cart.length > 0 && (
                <span className="absolute top-1 right-1 bg-black text-white text-[8px] md:text-[10px] w-3.5 h-3.5 md:w-4 md:h-4 rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Unified Sidebar */}
      <div className={`fixed inset-0 z-[100] transition-transform duration-700 cubic-bezier(0.77, 0, 0.175, 1) ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
        <div className="relative w-4/5 max-w-md h-full bg-white p-6 md:p-12 flex flex-col shadow-2xl">
          <button onClick={() => setIsMenuOpen(false)} className="self-end p-2 mb-8 md:mb-12 hover:rotate-90 transition-transform duration-300">
            <X size={28} className="md:w-8 md:h-8" />
          </button>
          
          <div className="flex flex-col space-y-6 md:space-y-8 text-xl md:text-4xl font-black tracking-tighter uppercase">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="hover:pl-4 transition-all duration-300">Home</Link>
            <div className="pt-2 md:pt-4 space-y-3 md:space-y-4">
              <p className="text-[9px] md:text-[10px] tracking-[0.3em] font-black text-gray-400 mb-1 md:mb-2 uppercase">Collections</p>
              <Link to="/collections/ALL" onClick={() => setIsMenuOpen(false)} className="block hover:pl-4 transition-all duration-300">Shop All</Link>
              <Link to="/collections/HOODIES" onClick={() => setIsMenuOpen(false)} className="block hover:pl-4 transition-all duration-300">Hoodies</Link>
              <Link to="/collections/SWEATPANTS" onClick={() => setIsMenuOpen(false)} className="block hover:pl-4 transition-all duration-300">Sweatpants</Link>
              <Link to="/collections/CREWNECKS" onClick={() => setIsMenuOpen(false)} className="block hover:pl-4 transition-all duration-300">Crewnecks</Link>
            </div>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="hover:pl-4 transition-all duration-300">Contact</Link>
          </div>

          <div className="mt-auto border-t border-gray-100 pt-6">
            <p className="text-[9px] md:text-[10px] font-black text-gray-400 mb-4 md:mb-6 tracking-[0.3em] uppercase text-center md:text-left">Connect with the culture</p>
            <div className="flex justify-center md:justify-start space-x-6 md:space-x-8">
              <Instagram size={20} className="md:w-6 md:h-6 hover:scale-125 transition-transform cursor-pointer" />
              <Facebook size={20} className="md:w-6 md:h-6 hover:scale-125 transition-transform cursor-pointer" />
              <MessageCircle size={20} className="md:w-6 md:h-6 hover:scale-125 transition-transform cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
