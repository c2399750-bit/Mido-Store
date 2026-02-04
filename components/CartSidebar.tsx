
import React from 'react';
import { CartItem } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onCheckout: () => void;
  t: any;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onRemove, 
  onUpdateQty,
  onCheckout,
  t
}) => {
  const lang = t.langToggle === 'English' ? 'ar' : 'en';
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity" onClick={onClose} />
      <div className={`absolute inset-y-0 ${lang === 'ar' ? 'left-0' : 'right-0'} max-w-md w-full glass-card border-none shadow-none flex flex-col rounded-[3.5rem] m-4 overflow-hidden animate-in ${lang === 'ar' ? 'slide-in-from-left' : 'slide-in-from-right'} duration-700`}>
        {/* Header */}
        <div className="flex items-center justify-between px-10 py-10 border-b border-white/5 bg-white/5 backdrop-blur-xl">
          <h2 className="text-3xl font-black text-white">{t.cartTitle}</h2>
          <button onClick={onClose} className="p-4 glass-button rounded-2xl text-white/40 hover:text-red-400 transition-all">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-28 h-28 bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-white/20">
                <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </div>
              <p className="text-white/40 font-black text-2xl mb-4">{t.emptyCart}</p>
              <button onClick={onClose} className="text-emerald-400 font-black text-sm uppercase tracking-widest hover:text-white transition-colors">{t.startShopping}</button>
            </div>
          ) : (
            items.map((item, index) => (
              <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}-${index}`} className="flex gap-8 p-6 rounded-[2.5rem] hover:bg-white/5 transition-all border border-white/5 group relative overflow-hidden">
                <div className="relative w-28 h-28 flex-shrink-0">
                  <img src={item.image} alt={lang === 'ar' ? item.nameAr : item.nameEn} className="w-full h-full object-cover rounded-[1.8rem] shadow-2xl border border-white/10" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-black text-white text-lg mb-1 line-clamp-1 tracking-tight">{lang === 'ar' ? item.nameAr : item.nameEn}</h3>
                    
                    {/* عرض الخيارات المختارة */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.selectedColor && (
                        <span className="bg-white/10 px-3 py-1 rounded-lg text-[9px] font-black text-white/60 border border-white/5">
                          {t.selectColor}: {item.selectedColor}
                        </span>
                      )}
                      {item.selectedSize && (
                        <span className="bg-white/10 px-3 py-1 rounded-lg text-[9px] font-black text-white/60 border border-white/5">
                          {t.selectSize}: {item.selectedSize}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-emerald-400 font-black text-xl">{item.price} <span className="text-xs text-white/30">{t.egp}</span></p>
                  </div>
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center bg-white/5 rounded-2xl p-1.5 border border-white/10">
                      <button onClick={() => onUpdateQty(item.id, -1)} className="w-10 h-10 flex items-center justify-center font-black text-white hover:text-emerald-400 text-xl">-</button>
                      <span className="w-10 text-center font-black text-sm text-white">{item.quantity}</span>
                      <button onClick={() => onUpdateQty(item.id, 1)} className="w-10 h-10 flex items-center justify-center font-black text-white hover:text-emerald-400 text-xl">+</button>
                    </div>
                    <button onClick={() => onRemove(item.id)} className="p-3 glass-button rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-10 border-t border-white/5 bg-white/5 backdrop-blur-3xl rounded-t-[3.5rem]">
          <div className="flex justify-between items-center mb-10 px-4">
            <span className="text-white/40 font-black text-sm uppercase tracking-widest">{t.total}:</span>
            <span className="text-4xl font-black text-white">{total} <span className="text-sm text-white/30">{t.egp}</span></span>
          </div>
          <button 
            disabled={items.length === 0}
            onClick={onCheckout}
            className="w-full glass-button bg-white text-black py-6 rounded-[2rem] font-black text-xl hover:bg-white/90 transition-all shadow-2xl disabled:opacity-20"
          >
            {t.checkoutBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
