
import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../App';
import ProductCard from '../components/ProductCard';
import { CATEGORIES } from '../constants';

const Collections: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const { products } = useApp();

  const filteredProducts = useMemo(() => {
    if (!category || category === 'ALL') return products;
    return products.filter(p => p.category === category);
  }, [category, products]);

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto">
      <header className="mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="max-w-xl">
            <p className="text-[10px] font-black tracking-[0.4em] text-gray-400 uppercase mb-4">ΞVOS COLLECTIONS</p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">{category?.replace('-', ' ')}</h1>
          </div>
          <div className="flex flex-wrap gap-2 text-[8px] font-black tracking-[0.2em] uppercase">
            {CATEGORIES.map(cat => (
              <Link 
                key={cat}
                to={`/collections/${cat}`}
                className={`px-4 py-2 border transition-all duration-300 ${category === cat ? 'bg-black text-white border-black' : 'hover:border-black border-gray-200 text-gray-400 hover:text-black'}`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
        <div className="h-[1px] bg-gray-100 w-full" />
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 gap-y-12">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
        {filteredProducts.length === 0 && (
          <div className="col-span-full py-40 flex flex-col items-center justify-center text-center">
            <p className="text-gray-300 text-xl font-black tracking-widest uppercase mb-6 italic">NO PIECES FOUND</p>
            <Link to="/collections/ALL" className="text-xs font-bold uppercase tracking-widest underline underline-offset-8 decoration-1">Return to Archive</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;
