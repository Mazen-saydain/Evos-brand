
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    setRotate({ x: rotateX, y: rotateY });
  };

  const resetRotate = () => {
    setRotate({ x: 0, y: 0 });
  };

  const salePrice = product.discount 
    ? (product.price * (1 - product.discount / 100)).toFixed(0) 
    : null;

  return (
    <div 
      className={`group relative perspective-1000`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        resetRotate();
      }}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div 
          className="relative aspect-[3/4] overflow-hidden bg-gray-50 transition-transform duration-200 ease-out preserve-3d"
          style={{
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          }}
        >
          {/* Main Image - Natural Colors */}
          <img 
            src={product.images[0]} 
            alt={product.name}
            className={`w-full h-full object-cover transition-opacity duration-700 ${isHovered && product.images[1] ? 'opacity-0' : 'opacity-100'}`}
          />
          {/* Hover Image */}
          {product.images[1] && (
            <img 
              src={product.images[1]} 
              alt={`${product.name} alt`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            />
          )}

          {/* Badges Container - Red Rectangles */}
          <div className="absolute top-2 right-2 md:top-4 md:right-4 z-20 flex flex-col gap-2 items-end">
            {/* Sold Out Badge */}
            {product.isSoldOut && (
              <div className="bg-red-600 text-white px-2 py-1 md:px-3 md:py-1.5 text-[7px] md:text-[9px] font-black uppercase tracking-[0.2em] shadow-xl border border-red-500">
                Sold Out
              </div>
            )}
            
            {/* Sale Badge */}
            {!product.isSoldOut && product.discount && product.discount > 0 && (
              <div className="bg-red-600 text-white px-2 py-1 md:px-3 md:py-1.5 text-[7px] md:text-[9px] font-black uppercase tracking-[0.2em] shadow-xl border border-red-500">
                {product.discount}% OFF
              </div>
            )}
          </div>
          
          {product.isNew && (
            <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-white text-black text-[7px] md:text-[9px] font-black px-2 md:px-3 py-1 uppercase tracking-widest shadow-sm z-10">
              New Drop
            </div>
          )}

          {/* Quick Actions Desktop */}
          {!product.isSoldOut && (
            <div className="absolute bottom-0 left-0 right-0 p-4 transition-transform duration-300 translate-y-full md:group-hover:translate-y-0 hidden md:block z-30">
              <button className="w-full bg-black text-white text-[10px] font-black py-4 uppercase tracking-[0.2em] hover:bg-gray-900 transition-colors shadow-2xl">
                Explore Piece
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-col items-center text-center px-1">
          <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.15em] mb-1.5 group-hover:underline underline-offset-4 line-clamp-1">{product.name}</h3>
          <div className="flex items-center space-x-3">
            {salePrice ? (
              <>
                <p className="text-[11px] md:text-sm font-black text-red-600 tracking-tighter">{salePrice} EGP</p>
                <p className="text-[9px] md:text-xs text-gray-300 line-through tracking-tighter font-light">{product.price} EGP</p>
              </>
            ) : (
              <p className="text-[11px] md:text-sm font-medium tracking-tighter">{product.price} EGP</p>
            )}
          </div>
        </div>
      </Link>
      
      {/* Mobile-only Quick Add */}
      {!product.isSoldOut && (
        <div className="md:hidden absolute bottom-4 right-4 z-30">
          <button className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg border border-gray-100 active:scale-90 transition-transform">
            <ShoppingBag size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
