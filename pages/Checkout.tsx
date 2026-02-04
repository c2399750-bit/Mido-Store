
import React, { useState } from 'react';
import { CartItem, ShippingZone } from '../types';

interface CheckoutProps {
  cart: CartItem[];
  shippingZones: ShippingZone[];
  onPlaceOrder: (details: any) => void;
  onBack: () => void;
  t: any;
}

const Checkout: React.FC<CheckoutProps> = ({ cart, shippingZones, onPlaceOrder, onBack, t }) => {
  const lang = t.langToggle === 'English' ? 'ar' : 'en';
  const [isSuccess, setIsSuccess] = useState(false);
  const [details, setDetails] = useState({ 
    name: '', 
    phone: '', 
    altPhone: '', 
    governorate: '', 
    city: '', 
    street: '', 
    landmark: '',
    paymentMethod: 'cod'
  });

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const selectedZone = shippingZones.find(z => z.name === details.governorate);
  const shippingCost = selectedZone ? selectedZone.price : 0;
  const total = subtotal + shippingCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.name || !details.phone || !details.governorate || !details.city || !details.street) {
      return;
    }
    onPlaceOrder({ ...details, total });
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 bg-white/10 backdrop-blur-3xl rounded-[4rem] shadow-2xl border border-white/20 px-10 animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-400">
           <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-4xl font-black text-white mb-6">{t.orderSuccess}</h2>
        <p className="text-white/60 font-bold text-lg mb-12 leading-relaxed">{t.orderPreparing}</p>
        <button 
          onClick={onBack} 
          className="glass-button bg-white !text-black px-12 py-5 rounded-[2rem] font-black shadow-xl hover:bg-white/90 transition-all text-xl"
        >
          {t.backToStore}
        </button>
      </div>
    );
  }

  const isFormValid = details.name.split(' ').length >= 3 && details.phone.length >= 10 && details.governorate && details.city && details.street;

  return (
    <div className="grid lg:grid-cols-3 gap-10 items-start animate-in fade-in duration-700">
      <div className="lg:col-span-2 glass-card rounded-[4rem] p-10 md:p-16 border-white/10">
        <h2 className="text-3xl font-black mb-12 text-white flex items-center gap-4">
          <span className="w-2 h-10 bg-emerald-500 rounded-full" />
          {t.shippingDetails}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black text-white/40 uppercase mb-3 px-1">{t.fullName}</label>
              <input type="text" required placeholder="الأسم بالكامل" className="w-full glass-input p-5 rounded-2xl font-bold" value={details.name} onChange={(e) => setDetails({...details, name: e.target.value})} />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-black text-white/40 uppercase mb-3 px-1">{t.phone}</label>
                <input type="tel" required placeholder="01xxxxxxxxx" className="w-full glass-input p-5 rounded-2xl font-bold" value={details.phone} onChange={(e) => setDetails({...details, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-black text-white/40 uppercase mb-3 px-1">{t.governorate}</label>
                <select required className="w-full glass-input p-5 rounded-2xl font-bold appearance-none" value={details.governorate} onChange={(e) => setDetails({...details, governorate: e.target.value})}>
                  <option value="" className="bg-slate-900">-- اختر المحافظة --</option>
                  {shippingZones.map(zone => <option key={zone.id} value={zone.name} className="bg-slate-900">{zone.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-white/40 uppercase mb-3 px-1">{t.city}</label>
              <input type="text" required className="w-full glass-input p-5 rounded-2xl font-bold" value={details.city} onChange={(e) => setDetails({...details, city: e.target.value})} />
            </div>
          </div>

          <div className="pt-8 border-t border-white/10">
            <h3 className="text-xl font-black mb-6 text-white">{t.paymentMethod}</h3>
            <div className="grid gap-4">
              {['cod', 'vodafone', 'orange'].map((method) => (
                <label key={method} className={`flex items-center justify-between p-6 border-2 rounded-2xl cursor-pointer transition-all ${details.paymentMethod === method ? 'border-white/40 bg-white/10' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}>
                  <div className="flex items-center gap-4">
                    <input type="radio" name="payment" className="hidden" checked={details.paymentMethod === method} onChange={() => setDetails({...details, paymentMethod: method})} />
                    <div className={`w-6 h-6 rounded-full border-4 flex items-center justify-center ${details.paymentMethod === method ? 'border-white bg-transparent' : 'border-white/20'}`}>
                      {details.paymentMethod === method && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span className="font-black text-white">
                      {method === 'cod' ? t.cod : method === 'vodafone' ? t.vodafoneCash : t.orangeCash}
                    </span>
                  </div>
                </label>
              ))}

              {(details.paymentMethod === 'vodafone' || details.paymentMethod === 'orange') && (
                <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border-2 border-emerald-500/50 animate-in slide-in-from-top-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                    <span className="font-black text-sm text-white">{t.walletTransferMsg}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      <div className="glass-card rounded-[3rem] p-10 border-white/10 text-white sticky top-32">
        <h2 className="text-2xl font-black mb-10 border-b border-white/10 pb-6">{t.orderSummary}</h2>
        <div className="space-y-4 mb-10">
          <div className="flex justify-between text-white/40 font-bold uppercase text-xs tracking-widest">
            <span>{t.subtotal}</span>
            <span className="text-white">{subtotal} {t.egp}</span>
          </div>
          <div className="flex justify-between text-white/40 font-bold uppercase text-xs tracking-widest">
            <span>{t.shipping}</span>
            <span className="text-emerald-400">{shippingCost} {t.egp}</span>
          </div>
          <div className="flex justify-between text-4xl font-black pt-6 border-t border-white/10 mt-6">
            <span>{t.total}</span>
            <span className="text-emerald-400">{total} <span className="text-xs">{t.egp}</span></span>
          </div>
        </div>
        <button onClick={handleSubmit} disabled={!isFormValid} className="w-full glass-button bg-white !text-black py-6 rounded-2xl font-black text-xl disabled:opacity-20 transition-all">
          {t.confirmOrder}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
