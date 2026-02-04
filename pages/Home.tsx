
import React, { useState } from 'react';
import { Product } from '../types';

interface HomeProps {
  products: Product[];
  categories: string[];
  onProductClick: (id: string) => void;
  onAddToCart: (p: Product) => void;
  t: any;
  lang: 'ar' | 'en';
}

const HomePage: React.FC<HomeProps> = ({ products, categories, onProductClick, onAddToCart, t, lang }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filtered = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const scrollToProducts = () => {
    const el = document.getElementById('products-grid');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  // Combining 'all' with dynamic categories
  const allCats = ['all', ...categories];

  return (
    <div className="animate-in fade-in duration-1000">
      <section className="mb-16 rounded-[4rem] overflow-hidden glass-card text-white relative h-80 md:h-[30rem] flex items-center px-8 md:px-20 border-white/10">
        <div className="z-10 max-w-2xl">
          <span className="bg-white/10 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 mb-6 inline-block">موسم 2025</span>
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none">{t.heroTitle}</h2>
          <p className="text-xl text-white/70 mb-10 font-medium leading-relaxed max-w-lg">{t.heroDesc}</p>
          <button 
            onClick={scrollToProducts}
            className="glass-button bg-white !text-black px-12 py-5 rounded-[2rem] font-black shadow-2xl text-lg hover:bg-white/90"
          >
            {t.discoverBtn}
          </button>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-0"></div>
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80" 
          className="absolute inset-0 w-full h-full object-cover opacity-80" 
          alt="Hero"
        />
      </section>

      <div className="mb-12 overflow-x-auto whitespace-nowrap pb-6 flex gap-4 no-scrollbar" id="products-grid">
        {allCats.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-10 py-4 rounded-[1.8rem] font-black transition-all duration-500 border-2 ${
              selectedCategory === cat 
                ? 'bg-white/20 text-white border-white/20 shadow-2xl backdrop-blur-xl' 
                : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20 hover:text-white'
            }`}
          >
            {t.cats[cat] || cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {filtered.map(product => (
          <div key={product.id} className="glass-card rounded-[3.5rem] overflow-hidden border-white/10 hover:border-white/30 hover:-translate-y-4 transition-all duration-700 group">
            <div className="relative h-80 cursor-pointer overflow-hidden" onClick={() => onProductClick(product.id)}>
              <img 
                src={product.image} 
                alt={lang === 'ar' ? product.nameAr : product.nameEn} 
                className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className={`absolute top-6 ${lang === 'ar' ? 'left-6' : 'right-6'} bg-white/10 backdrop-blur-xl px-5 py-2 rounded-2xl text-[9px] font-black uppercase text-white border border-white/20 shadow-2xl`}>
                {t.cats[product.category] || product.category}
              </div>
            </div>
            <div className="p-8">
              <h3 className="font-black text-2xl mb-2 text-white line-clamp-1 tracking-tight">
                {lang === 'ar' ? product.nameAr : product.nameEn}
              </h3>
              <p className="text-white/40 text-sm mb-8 line-clamp-2 font-medium leading-relaxed">
                {lang === 'ar' ? product.descriptionAr : product.descriptionEn}
              </p>
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-white">
                    {product.price} <span className="text-xs font-bold text-white/30">{t.egp}</span>
                  </span>
                </div>
                <button 
                  onClick={() => onAddToCart(product)}
                  className="w-full glass-button !bg-emerald-500/20 text-white py-5 rounded-[1.8rem] font-black text-sm border-emerald-500/20 hover:!bg-emerald-500/40 shadow-2xl flex items-center justify-center gap-3 group/btn"
                >
                  <svg className="w-5 h-5 transition-transform group-hover/btn:scale-125" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {t.addToCart}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
