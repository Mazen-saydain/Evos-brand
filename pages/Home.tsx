
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../App';
import ProductCard from '../components/ProductCard';
import { ArrowRight } from 'lucide-react';
import { Category } from '../types';

const Home: React.FC = () => {
  const { products } = useApp();
  const [currentBanner, setCurrentBanner] = useState(0);
  const revealRefs = useRef<(HTMLDivElement | null)[]>([]);

  const banners = [
    {
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=2000',
      title: 'ΞVOS ORIGINS',
      subtitle: 'THE GENESIS DROP'
    },
    {
      image: 'https://images.unsplash.com/photo-1550991152-71370ed45761?auto=format&fit=crop&q=80&w=2000',
      title: 'EVOS CULTURE',
      subtitle: 'URBAN LUXURY'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 5000);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    revealRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      clearInterval(timer);
      observer.disconnect();
    };
  }, [banners.length]);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  // Helper to get products for specific sections - ensuring at least 4 if available
  const getProductsForSection = (list: typeof products, filterFn: (p: any) => boolean) => {
    return list.filter(filterFn).slice(0, 4);
  };

  const newArrivals = getProductsForSection(products, p => !!p.isNew);
  const bestSellers = getProductsForSection(products, p => !!p.isBestSeller);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[80vh] md:h-[90vh] overflow-hidden">
        {banners.map((banner, idx) => (
          <div 
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentBanner ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="absolute inset-0 bg-black/30 z-10" />
            <img src={banner.image} alt={banner.title} className="w-full h-full object-cover scale-105" />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-4">
              <span className="text-[10px] md:text-xs font-black tracking-[0.4em] md:tracking-[0.5em] mb-3 md:mb-4 animate-fadeIn uppercase">{banner.subtitle}</span>
              <h1 className="text-4xl md:text-9xl font-black tracking-tighter mb-6 md:mb-8 animate-slideUp">{banner.title}</h1>
              <Link 
                to="/collections/ALL" 
                className="bg-white text-black px-8 md:px-10 py-3 md:py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300 shadow-xl"
              >
                Shop Now
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* New Arrivals */}
      <section className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div ref={addToRefs} className="reveal flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-1 md:mb-2">New Arrivals</h2>
            <p className="text-gray-400 text-[10px] md:text-sm tracking-wide uppercase font-bold">Latest curated silhouettes</p>
          </div>
          <Link to="/collections/ALL" className="text-[10px] font-bold uppercase tracking-widest flex items-center group">
            View All <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
          {newArrivals.map((product, idx) => (
            <div key={product.id} ref={addToRefs} className="reveal" style={{ transitionDelay: `${idx * 150}ms` }}>
              <ProductCard product={product} />
            </div>
          ))}
          {/* Fallback if less than 4 products are marked as new - fill from general products */}
          {newArrivals.length < 4 && products.filter(p => !p.isNew).slice(0, 4 - newArrivals.length).map((product, idx) => (
            <div key={product.id} ref={addToRefs} className="reveal" style={{ transitionDelay: `${(newArrivals.length + idx) * 150}ms` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Visual Break */}
      <section ref={addToRefs} className="reveal h-[40vh] md:h-[60vh] bg-black relative flex items-center justify-center overflow-hidden my-6 md:my-12">
        <img 
          src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale"
          alt="Banner"
        />
        <div className="relative z-10 text-center text-white px-4">
          <h2 className="text-2xl md:text-6xl font-black tracking-tighter mb-4 md:mb-6 uppercase">Uncompromising Quality</h2>
          <p className="max-w-md md:max-w-xl mx-auto text-[11px] md:text-sm text-gray-300 mb-6 md:mb-8 font-bold uppercase tracking-widest leading-loose">
            Every piece is engineered for the ultimate street silhouette. Sourced from premium textiles.
          </p>
          <Link to="/collections/ALL" className="inline-block border-2 border-white px-6 md:px-8 py-2 md:py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
            Our Story
          </Link>
        </div>
      </section>

      {/* Best Sellers / Trending */}
      <section className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div ref={addToRefs} className="reveal flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-1 md:mb-2">Trending Now</h2>
            <p className="text-gray-400 text-[10px] md:text-sm tracking-wide uppercase font-bold">Community most wanted</p>
          </div>
          <Link to="/collections/ALL" className="text-[10px] font-bold uppercase tracking-widest flex items-center group">
            View All <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
          {bestSellers.map((product, idx) => (
            <div key={product.id} ref={addToRefs} className="reveal" style={{ transitionDelay: `${idx * 150}ms` }}>
              <ProductCard product={product} />
            </div>
          ))}
          {/* Fill if less than 4 */}
          {bestSellers.length < 4 && products.filter(p => !p.isBestSeller && !newArrivals.some(n => n.id === p.id)).slice(0, 4 - bestSellers.length).map((product, idx) => (
            <div key={product.id} ref={addToRefs} className="reveal" style={{ transitionDelay: `${(bestSellers.length + idx) * 150}ms` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
