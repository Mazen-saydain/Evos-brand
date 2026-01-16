
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { Check, ChevronLeft, ChevronRight, ShoppingBag, Ban, Maximize2, X } from 'lucide-react';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart } = useApp();
  const product = products.find(p => p.id === id);

  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('Default');
  const [isAdding, setIsAdding] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found.</div>;
  }

  const handleAddToCart = () => {
    if (product.isSoldOut) return;
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    setIsAdding(true);
    addToCart(product, selectedSize, selectedColor);
    setTimeout(() => {
      setIsAdding(false);
      navigate('/checkout');
    }, 800);
  };

  const finalPrice = product.discount 
    ? (product.price * (1 - product.discount / 100)).toFixed(0) 
    : product.price;

  // نظام المقاسات الثابت (S, M, L, XL)
  const standardLabels = ['S', 'M', 'L', 'XL'];
  const allPossibleSizes = standardLabels.map(label => {
    const existing = product.sizes?.find(s => s.label === label);
    return {
      label,
      isAvailable: existing ? existing.isAvailable : false
    };
  });

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto animate-fadeIn font-inter">
      {/* Lightbox / Zoom Modal */}
      {isZoomed && (
        <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center animate-fadeIn">
          <button 
            onClick={() => setIsZoomed(false)} 
            className="absolute top-8 right-8 p-4 bg-black text-white rounded-full z-[110] hover:scale-110 transition-transform shadow-2xl"
          >
            <X size={24} />
          </button>
          <div className="w-full h-full overflow-auto flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setIsZoomed(false)}>
            <img 
              src={product.images[activeImg]} 
              className="max-w-none w-full md:w-[120%] lg:w-[100%] h-auto transition-transform hover:scale-110 duration-700 cursor-zoom-in" 
              alt="Detailed View"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Gallery */}
        <div className="space-y-4">
          <div 
            className="relative aspect-[3/4] overflow-hidden bg-gray-50 group cursor-zoom-in shadow-sm"
            onClick={() => setIsZoomed(true)}
          >
            <img 
              src={product.images[activeImg]} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              alt={product.name}
            />
            <div className="absolute bottom-6 right-6 p-3 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 size={18} />
            </div>

            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
              {product.isSoldOut && (
                 <div className="bg-red-600 text-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl border border-red-500">
                   Sold Out
                 </div>
              )}
              {!product.isSoldOut && product.discount && product.discount > 0 && (
                 <div className="bg-red-600 text-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl border border-red-500">
                   {product.discount}% OFF
                 </div>
              )}
            </div>
          </div>
          <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-2">
            {product.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImg(idx)}
                className={`w-20 aspect-[3/4] flex-shrink-0 overflow-hidden border-2 transition-all duration-300 ${activeImg === idx ? 'border-black scale-105' : 'border-transparent opacity-40 grayscale hover:opacity-80'}`}
              >
                <img src={img} className="w-full h-full object-cover" alt="thumb" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col animate-slideUp">
          <div className="mb-8">
            <p className="text-[10px] font-black tracking-[0.4em] text-gray-400 uppercase mb-4">ΞVOS CATALOGUE / {product.category}</p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-6 leading-none">{product.name}</h1>
            <div className="flex items-center space-x-4">
              <p className={`text-3xl font-black tracking-tighter ${product.discount ? 'text-red-600' : ''}`}>{finalPrice} EGP</p>
              {product.discount && <p className="text-xl text-gray-300 line-through font-light tracking-tighter">{product.price} EGP</p>}
            </div>
          </div>

          <div className="mb-10 space-y-8">
            <div>
              <div className="flex justify-between items-center mb-5">
                <p className="text-[10px] font-black uppercase tracking-widest">Select Silhouette Fit</p>
                <button className="text-[9px] text-gray-400 font-bold uppercase underline underline-offset-4 tracking-widest">Size Chart</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {allPossibleSizes.map((size) => {
                  const isSelectable = size.isAvailable && !product.isSoldOut;
                  const isSelected = selectedSize === size.label;
                  
                  return (
                    <button
                      key={size.label}
                      disabled={!isSelectable}
                      onClick={() => setSelectedSize(size.label)}
                      className={`min-w-[75px] h-16 flex items-center justify-center text-[12px] font-black border transition-all relative
                        ${!isSelectable ? 'size-crossed bg-gray-50/50 text-gray-300 cursor-not-allowed' : 'cursor-pointer hover:border-black'} 
                        ${isSelected ? 'bg-black text-white border-black shadow-2xl scale-105 z-10' : 'bg-white text-black border-gray-100'}`}
                    >
                      {size.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <button 
            onClick={handleAddToCart}
            disabled={isAdding || product.isSoldOut}
            className={`w-full h-20 uppercase font-black tracking-[0.3em] flex items-center justify-center space-x-3 transition-all transform ${product.isSoldOut ? 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none' : 'bg-black text-white hover:bg-gray-900 active:scale-95 shadow-2xl'}`}
          >
            {product.isSoldOut ? (
              <>
                <Ban size={20} />
                <span>Piece Archived</span>
              </>
            ) : isAdding ? (
              <span className="flex items-center"><Check size={20} className="mr-2" /> Vaulted</span>
            ) : (
              <>
                <ShoppingBag size={20} />
                <span>Acquire Piece</span>
              </>
            )}
          </button>

          <div className="mt-16 space-y-12 border-t pt-12">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6">The Narrative</h4>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">{product.description}</p>
            </div>
            
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6">Material Specs</h4>
              <ul className="text-[11px] text-gray-400 font-bold uppercase tracking-widest space-y-4">
                <li className="flex items-center"><div className="w-2 h-2 bg-black mr-4" /> 100% Premium Egyptian Heavy Cotton</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-black mr-4" /> Oversized Urban Engineered Fit</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-black mr-4" /> Reinforced Anti-Stretch Collar</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
