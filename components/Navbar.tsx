
import React, { useState } from 'react';

interface NavbarProps {
  onSearch: (query: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onNavigate: (page: string) => void;
  user: any | null;
  onLogout: () => void;
  lang: 'ar' | 'en';
  onToggleLang: () => void;
  t: any;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onSearch, 
  cartCount, 
  onOpenCart, 
  onNavigate, 
  user, 
  onLogout,
  lang,
  onToggleLang,
  t
}) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <nav className="glass-card sticky top-0 z-50 mx-4 md:mx-8 my-4 rounded-[2.5rem] px-6 md:px-12 py-4 border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-10">
          <h1 
            onClick={() => onNavigate('home')}
            className="text-3xl font-black text-white cursor-pointer tracking-tighter hover:scale-105 transition-transform"
          >
            {lang === 'ar' ? 'ميدو' : 'MIDO'}
            <span className="text-emerald-400">.</span>
          </h1>
          <div className="hidden md:flex gap-8 items-center">
            <button 
              onClick={() => onNavigate('home')} 
              className="text-white/70 hover:text-white font-black text-sm transition-all"
            >
              {t.home}
            </button>
            {user?.role === 'admin' && (
              <button 
                onClick={() => onNavigate('admin')} 
                className="bg-orange-500/20 text-orange-200 px-5 py-2 rounded-xl font-black text-sm border border-orange-500/20 hover:bg-orange-500/40 transition-all flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                {t.admin}
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex-1 w-full max-w-md relative">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className={`w-full glass-input py-3 rounded-full font-bold focus:ring-2 focus:ring-white/20 px-12`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-3 text-white/40`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>

        <div className="flex items-center gap-5">
          <button 
            onClick={onToggleLang}
            className="glass-button px-4 py-2 rounded-xl text-[10px] font-black text-white"
          >
            {t.langToggle}
          </button>

          {user ? (
            <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/5 backdrop-blur-md">
               <button 
                onClick={() => onNavigate('profile')}
                className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-xl transition-all"
               >
                  <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff&bold=true`} className="w-8 h-8 rounded-lg object-cover ring-2 ring-white/10" alt="user" />
                  <span className="text-[11px] font-black text-white">{user.name.split(' ')[0]}</span>
               </button>
               <button onClick={onLogout} className="p-2 text-white/30 hover:text-red-400 transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
               </button>
            </div>
          ) : (
            <button onClick={() => onNavigate('login')} className="glass-button bg-emerald-500/20 text-white px-8 py-3 rounded-2xl text-xs font-black border-emerald-500/20 hover:bg-emerald-500/40">{t.login}</button>
          )}
          
          <button onClick={onOpenCart} className="relative glass-button p-3 text-white rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full font-black ring-2 ring-white shadow-lg">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
