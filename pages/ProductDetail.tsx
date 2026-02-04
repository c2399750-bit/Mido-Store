
import React, { useState } from 'react';
import { Product, Review, User, CartItem } from '../types';

interface ProductDetailProps {
  product: Product;
  allProducts: Product[];
  onProductClick: (id: string) => void;
  onAddToCart: (p: CartItem) => void;
  onBack: () => void;
  onAddReview: (productId: string, review: Review) => void;
  user: User | null;
  t: any;
  lang: 'ar' | 'en';
}

const ProductPage: React.FC<ProductDetailProps> = ({ 
  product, 
  allProducts, 
  onProductClick, 
  onAddToCart, 
  onBack, 
  onAddReview,
  user,
  t, 
  lang 
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [error, setError] = useState<string>('');

  const name = lang === 'ar' ? product.nameAr : product.nameEn;
  const desc = lang === 'ar' ? product.descriptionAr : product.descriptionEn;
  const specs = lang === 'ar' ? product.specsAr : product.specsEn;

  const colors = product.availableColors || [];
  const sizes = product.availableSizes || [];

  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const reviews = product.reviews || [];
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
    : 0;

  const handleAddToCart = () => {
    if (colors.length > 0 && !selectedColor) {
      setError(t.mustSelectOptions);
      return;
    }
    if (sizes.length > 0 && !selectedSize) {
      setError(t.mustSelectOptions);
      return;
    }
    setError('');
    const cartItem: CartItem = {
      ...product,
      quantity: 1,
      selectedColor,
      selectedSize
    };
    onAddToCart(cartItem);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      userName: user.name,
      userEmail: user.email,
      rating,
      comment,
      date: new Date().toISOString()
    };
    onAddReview(product.id, newReview);
    setComment('');
    setRating(5);
  };

  return (
    <div className="space-y-16 animate-in slide-in-from-bottom-10 duration-700">
      {/* Product Main Section */}
      <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border border-gray-50">
        <button 
          onClick={onBack} 
          className="flex items-center gap-3 text-emerald-600 mb-12 font-black group"
        >
          <div className={`p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-all ${lang === 'en' ? 'rotate-180' : ''}`}>
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
          </div>
          {t.backToStore}
        </button>

        <div className="grid lg:grid-cols-2 gap-16 items-start text-slate-800">
          <div className="space-y-6">
            <div className="rounded-[2.5rem] overflow-hidden border-8 border-gray-50 shadow-lg bg-gray-50">
              <img src={product.image} alt={name} className="w-full aspect-square object-cover" />
            </div>
            
            {avgRating > 0 && (
              <div className="flex items-center gap-3 bg-orange-50 w-fit px-6 py-3 rounded-2xl border border-orange-100">
                <div className="flex text-orange-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-5 h-5 ${i < Math.round(avgRating) ? 'fill-current' : 'text-orange-200'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                </div>
                <span className="font-black text-orange-600">{avgRating.toFixed(1)}</span>
                <span className="text-orange-300 text-xs font-bold">({reviews.length})</span>
              </div>
            )}
          </div>

          <div className="py-4 space-y-8">
            <div>
              <span className="text-emerald-600 font-black bg-emerald-50 px-6 py-2 rounded-xl text-xs uppercase tracking-widest">
                {t.cats[product.category]}
              </span>
              <h1 className="text-4xl md:text-5xl font-black mt-6 mb-4 text-gray-800 leading-tight tracking-tight">{name}</h1>
              <div className="flex items-baseline gap-2">
                <p className="text-5xl font-black text-emerald-600">{product.price}</p>
                <p className="text-gray-400 font-bold text-lg">{t.egp}</p>
              </div>
            </div>

            {/* Color Selection */}
            {colors.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">{t.selectColor}</h3>
                <div className="flex flex-wrap gap-4">
                  {colors.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => { setSelectedColor(color); setError(''); }}
                      className={`px-6 py-3 rounded-2xl font-bold transition-all border-2 ${selectedColor === color ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' : 'bg-gray-50 text-gray-600 border-gray-100 hover:border-emerald-300'}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">{t.selectSize}</h3>
                <div className="flex flex-wrap gap-4">
                  {sizes.map((size, i) => (
                    <button
                      key={i}
                      onClick={() => { setSelectedSize(size); setError(''); }}
                      className={`min-w-[60px] h-[60px] flex items-center justify-center rounded-2xl font-black text-lg transition-all border-2 ${selectedSize === size ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' : 'bg-gray-50 text-gray-600 border-gray-100 hover:border-emerald-300'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && <p className="text-red-500 font-bold text-sm animate-pulse">{error}</p>}

            <button 
              onClick={handleAddToCart}
              className="w-full py-6 bg-emerald-600 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-4"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              {t.addToCart}
            </button>

            <div className="bg-gray-50 p-8 rounded-[2rem]">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">{t.description}</h3>
              <p className="text-gray-600 leading-relaxed font-medium text-lg">{desc}</p>
            </div>

            <div>
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">{t.specs}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {specs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-200" />
                    <span className="text-gray-700 font-bold">{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-3xl font-black text-gray-800 px-4 flex items-center gap-4">
            <span className="w-1.5 h-10 bg-orange-400 rounded-full" />
            {t.reviews}
          </h2>

          <div className="space-y-6">
            {reviews.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] p-16 text-center border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-bold">{t.noReviews}</p>
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-md transition-all text-slate-800">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <img src={`https://ui-avatars.com/api/?name=${rev.userName}&background=fde68a&color=92400e&bold=true`} className="w-12 h-12 rounded-xl shadow-sm" alt="" />
                      <div>
                        <h4 className="font-black text-gray-800">{rev.userName}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(rev.date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</p>
                      </div>
                    </div>
                    <div className="flex text-orange-400 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-orange-200'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 font-medium leading-relaxed bg-gray-50 p-6 rounded-2xl border border-gray-100">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Review Form */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-gray-50 h-fit sticky top-32 text-slate-800">
          <h3 className="text-2xl font-black text-gray-800 mb-8">{t.addReview}</h3>
          
          {user ? (
            <form onSubmit={handleReviewSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-1">{t.rating}</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${rating >= num ? 'bg-orange-400 text-white shadow-lg shadow-orange-100' : 'bg-gray-100 text-gray-300'}`}
                    >
                      <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3-.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-1">{t.comment}</label>
                <textarea 
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-100 p-5 rounded-2xl focus:bg-white focus:border-orange-400 outline-none transition-all font-bold h-32 resize-none"
                  placeholder="..."
                />
              </div>
              <button type="submit" className="w-full bg-orange-400 text-white py-5 rounded-[1.5rem] font-black shadow-xl shadow-orange-50 hover:bg-orange-500 transition-all active:scale-95">
                {t.submitReview}
              </button>
            </form>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
              <p className="text-gray-400 font-bold mb-6">{t.mustLoginReview}</p>
              <button 
                onClick={() => onBack()}
                className="bg-gray-900 text-white px-8 py-3 rounded-xl font-black text-sm"
              >
                {t.login}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-10">
          <h2 className="text-3xl font-black text-gray-800 px-4 flex items-center gap-4">
            <span className="w-1.5 h-10 bg-emerald-600 rounded-full" />
            {t.relatedProducts}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map(p => (
              <div key={p.id} className="bg-white rounded-[2rem] overflow-hidden border border-gray-50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group">
                <div className="relative h-64 cursor-pointer overflow-hidden" onClick={() => onProductClick(p.id)}>
                  <img 
                    src={p.image} 
                    alt={lang === 'ar' ? p.nameAr : p.nameEn} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                  />
                </div>
                <div className="p-6 text-slate-800">
                  <h3 className="font-black text-lg mb-1 text-gray-800 line-clamp-1">
                    {lang === 'ar' ? p.nameAr : p.nameEn}
                  </h3>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-black text-emerald-600">
                      {p.price} <span className="text-[10px] font-bold">{t.egp}</span>
                    </span>
                    <button 
                      onClick={() => onProductClick(p.id)}
                      className="bg-emerald-50 text-emerald-600 p-3 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-90"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
