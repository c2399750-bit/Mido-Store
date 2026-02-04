
import React, { useState, useRef } from 'react';
import { User, Order } from '../types';

interface ProfileProps {
  user: User;
  orders: Order[];
  t: any;
  lang: 'ar' | 'en';
  onNavigate: (page: string) => void;
  onUpdateUser: (updatedUser: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, orders, t, lang, onNavigate, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'settings'>('orders');
  const [editData, setEditData] = useState({ name: user.name, email: user.email });
  const [newAddress, setNewAddress] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const userOrders = orders.filter(o => o.email === user.email);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ ...user, name: editData.name, email: editData.email });
    alert(lang === 'ar' ? 'تم تحديث الملف الشخصي' : 'Profile updated');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert(lang === 'ar' ? 'حجم الصورة كبير جداً (الأقصى 2 ميجا)' : 'Image size is too large (Max 2MB)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateUser({ ...user, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAvatar = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف صورة الملف الشخصي؟' : 'Are you sure you want to delete profile photo?')) {
      onUpdateUser({ ...user, avatar: undefined });
    }
  };

  const handleAddAddress = () => {
    if (!newAddress.trim()) return;
    const currentAddresses = user.addresses || [];
    onUpdateUser({ ...user, addresses: [...currentAddresses, newAddress] });
    setNewAddress('');
  };

  const removeAddress = (index: number) => {
    const currentAddresses = user.addresses || [];
    onUpdateUser({ ...user, addresses: currentAddresses.filter((_, i) => i !== index) });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Profile Header Card */}
      <div className="bg-white rounded-[3rem] p-10 md:p-12 shadow-2xl border border-gray-50 flex flex-col md:flex-row items-center gap-10">
        <div className="relative group">
          <div className="w-40 h-40 rounded-[2.5rem] shadow-2xl shadow-emerald-100 border-8 border-emerald-50 overflow-hidden relative">
            <img 
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff&size=200&bold=true`} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              alt={user.name}
            />
            
            {/* Camera & Delete Overlay */}
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-white hover:text-emerald-400 flex flex-col items-center gap-1 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span className="text-[10px] font-black uppercase tracking-wider">{t.changeAvatar}</span>
              </button>

              {user.avatar && (
                <button 
                  onClick={handleDeleteAvatar}
                  className="text-white hover:text-red-400 flex flex-col items-center gap-1 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  <span className="text-[10px] font-black uppercase tracking-wider">{t.deleteAvatar}</span>
                </button>
              )}
            </div>

            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-3 rounded-2xl shadow-lg ring-4 ring-white z-10">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
        </div>
        <div className="flex-1 text-center md:text-right space-y-4">
          <div className="space-y-1">
             <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">{user.role}</span>
             <h2 className="text-4xl font-black text-gray-800 tracking-tight">{user.name}</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 justify-center md:justify-start items-center">
            <div className="flex items-center gap-2 text-gray-400 font-bold text-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              {user.email}
            </div>
            <div className="flex items-center gap-2 text-gray-400 font-bold text-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {t.memberSince}: {new Date(user.joinedDate).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex bg-gray-100 p-2 rounded-[2rem] gap-2 mx-auto w-fit">
        <button 
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-3 px-10 py-4 rounded-[1.5rem] font-black transition-all ${activeTab === 'orders' ? 'bg-white text-emerald-600 shadow-xl' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          {t.orderHistory}
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-3 px-10 py-4 rounded-[1.5rem] font-black transition-all ${activeTab === 'settings' ? 'bg-white text-emerald-600 shadow-xl' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          {t.settings}
        </button>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-500">
        {activeTab === 'orders' ? (
          <div className="space-y-6">
            {userOrders.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-gray-100">
                <div className="w-20 h-20 bg-gray-50 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 text-gray-200">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                </div>
                <p className="text-xl font-black text-gray-300 mb-8">{t.noOrdersYet}</p>
                <button 
                  onClick={() => onNavigate('home')}
                  className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-emerald-50 hover:bg-emerald-700 transition-all"
                >
                  {t.startShopping}
                </button>
              </div>
            ) : (
              userOrders.map(order => (
                <div key={order.id} className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-50 hover:border-emerald-500 transition-all group overflow-hidden relative">
                  <div className="flex flex-col md:flex-row justify-between gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.orderId}</span>
                         <span className="bg-gray-100 px-3 py-1 rounded-lg text-xs font-black">#{order.id.slice(-6).toUpperCase()}</span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-gray-50 pr-4 pl-2 py-2 rounded-xl border border-gray-100">
                            <img src={item.image} className="w-8 h-8 rounded-lg object-cover shadow-sm" alt="" />
                            <span className="text-[11px] font-black text-gray-700">
                              {lang === 'ar' ? item.nameAr : item.nameEn} <span className="text-emerald-500">×{item.quantity}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex md:flex-col justify-between items-end gap-4 border-t md:border-t-0 md:border-r md:pr-10 pt-6 md:pt-0 border-gray-50">
                      <div className="text-right">
                         <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">{t.orderStatus}</p>
                         <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${
                            order.status === 'delivered' ? 'bg-emerald-100 text-emerald-600' :
                            order.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                         }`}>
                            {t.statusLabels[order.status]}
                         </span>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">{t.total}</p>
                         <span className="text-2xl font-black text-emerald-600">{order.total} <span className="text-xs font-bold">{t.egp}</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-10">
            {/* Personal Info Form */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-gray-50">
              <h3 className="text-xl font-black text-gray-800 mb-8 flex items-center gap-3">
                 <div className="w-2 h-6 bg-emerald-500 rounded-full" />
                 {t.personalInfo}
              </h3>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">{t.fullName}</label>
                  <input 
                    type="text" 
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">{t.email}</label>
                  <input 
                    type="email" 
                    value={editData.email}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold"
                  />
                </div>
                <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black hover:bg-black transition-all shadow-xl shadow-gray-200">
                  {t.saveChanges}
                </button>
              </form>
            </div>

            {/* Address Management */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-gray-50">
              <h3 className="text-xl font-black text-gray-800 mb-8 flex items-center gap-3">
                 <div className="w-2 h-6 bg-emerald-500 rounded-full" />
                 {t.savedAddresses}
              </h3>
              <div className="space-y-4 mb-8">
                {user.addresses?.map((addr, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group">
                    <div className="flex items-center gap-3 overflow-hidden">
                       <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                       <span className="text-sm font-bold text-gray-600 line-clamp-1">{addr}</span>
                    </div>
                    <button onClick={() => removeAddress(idx)} className="p-2 text-gray-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                 <input 
                  type="text" 
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder={t.addressPlaceholder}
                  className="flex-1 bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-sm"
                 />
                 <button 
                  onClick={handleAddAddress}
                  className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 active:scale-90 transition-all"
                 >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                 </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
