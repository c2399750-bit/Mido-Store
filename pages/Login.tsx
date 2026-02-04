
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  t: any;
}

const Login: React.FC<LoginProps> = ({ onLogin, t }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [formData, setFormData] = useState({
    name: '',
    emailOrUsername: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'login') {
      if (formData.emailOrUsername === 'mido admin' && formData.password === 'admin123') {
        onLogin({
          id: 'admin-1',
          name: 'ميدو الأدمن',
          email: 'admin@mido.com',
          role: 'admin',
          status: 'active',
          joinedDate: new Date().toISOString()
        });
      } else if (formData.emailOrUsername && formData.password) {
        onLogin({
          id: 'u' + Math.random().toString(36).substr(2, 5),
          name: formData.emailOrUsername.split('@')[0],
          email: formData.emailOrUsername,
          role: 'customer',
          status: 'active',
          joinedDate: new Date().toISOString()
        });
      } else {
        setError(t.loginError);
      }
    } else {
      if (!formData.name || !formData.emailOrUsername || !formData.password) {
        setError(t.signupError);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError(t.passwordMismatch);
        return;
      }
      onLogin({
        id: 'u' + Math.random().toString(36).substr(2, 5),
        name: formData.name,
        email: formData.emailOrUsername,
        role: 'customer',
        status: 'active',
        joinedDate: new Date().toISOString()
      });
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-lg rounded-[3.5rem] p-10 md:p-14 relative overflow-hidden animate-in fade-in zoom-in-95 duration-700">
        {/* لمعة زجاجية علوية */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
        
        <div className="flex bg-white/5 p-1.5 rounded-[2rem] mb-12 border border-white/10 backdrop-blur-md">
          <button 
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-4 rounded-[1.6rem] font-black text-sm transition-all duration-500 ${activeTab === 'login' ? 'bg-white/20 text-white shadow-xl' : 'text-white/40 hover:text-white'}`}
          >
            {t.loginTab}
          </button>
          <button 
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-4 rounded-[1.6rem] font-black text-sm transition-all duration-500 ${activeTab === 'signup' ? 'bg-white/20 text-white shadow-xl' : 'text-white/40 hover:text-white'}`}
          >
            {t.signupTab}
          </button>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-white mb-3 tracking-tighter">
            {activeTab === 'login' ? t.loginTab : t.signupTab}
          </h2>
          <p className="text-white/50 text-sm font-bold">
            {activeTab === 'login' ? t.welcomeBack : t.joinStore}
          </p>
        </div>
        
        {error && (
          <div className="mb-8 p-4 bg-red-500/20 text-red-100 rounded-2xl text-xs font-bold border border-red-500/30 animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {activeTab === 'signup' && (
            <div className="animate-in slide-in-from-top-2">
              <label className="block text-[10px] font-black text-white/40 mb-2 uppercase tracking-widest px-2">{t.fullName}</label>
              <input 
                name="name"
                type="text" 
                className="w-full glass-input p-5 rounded-2xl font-bold"
                placeholder="الأسم بالكامل"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-white/40 mb-2 uppercase tracking-widest px-2">{t.emailOrUsername}</label>
            <input 
              name="emailOrUsername"
              type="text" 
              className="w-full glass-input p-5 rounded-2xl font-bold"
              placeholder="البريد أو اسم المستخدم"
              value={formData.emailOrUsername}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-white/40 mb-2 uppercase tracking-widest px-2">{t.password}</label>
            <input 
              name="password"
              type="password" 
              className="w-full glass-input p-5 rounded-2xl font-bold"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          {activeTab === 'signup' && (
            <div className="animate-in slide-in-from-top-2">
              <label className="block text-[10px] font-black text-white/40 mb-2 uppercase tracking-widest px-2">{t.confirmPassword}</label>
              <input 
                name="confirmPassword"
                type="password" 
                className="w-full glass-input p-5 rounded-2xl font-bold"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
          )}

          <button type="submit" className="w-full glass-button py-6 rounded-[2rem] font-black text-xl mt-8">
            {activeTab === 'login' ? t.loginBtn : t.signupBtn}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
