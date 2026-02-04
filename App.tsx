
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';
import { Product, CartItem, Order, User, ShippingZone, Review } from './types';
import { INITIAL_PRODUCTS } from './constants';
import { translations } from './translations';

// Pages
import HomePage from './pages/Home';
import ProductPage from './pages/ProductDetail';
import AdminDashboard from './pages/Admin/Dashboard';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';

const INITIAL_SHIPPING: ShippingZone[] = [
  { id: '1', name: 'القاهرة والجيزة', price: 50, deliveryTime: '24-48 ساعة', status: 'active' },
  { id: '2', name: 'الإسكندرية والساحل', price: 70, deliveryTime: '2-3 أيام', status: 'active' },
  { id: '3', name: 'الصعيد ومدن القناة', price: 90, deliveryTime: '4-6 أيام', status: 'active' }
];

const INITIAL_CATEGORIES = ['men', 'women', 'kids', 'accessories'];

const App: React.FC = () => {
  const [lang, setLang] = useState<'ar' | 'en'>(() => {
    return (localStorage.getItem('lang') as 'ar' | 'en') || 'ar';
  });

  const t = translations[lang];

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [shippingZones, setShippingZones] = useState<ShippingZone[]>(() => {
    const saved = localStorage.getItem('shippingZones');
    return saved ? JSON.parse(saved) : INITIAL_SHIPPING;
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Persistence
  useEffect(() => localStorage.setItem('products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('categories', JSON.stringify(categories)), [categories]);
  useEffect(() => localStorage.setItem('cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('orders', JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem('user', JSON.stringify(user)), [user]);
  useEffect(() => localStorage.setItem('shippingZones', JSON.stringify(shippingZones)), [shippingZones]);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => 
        i.id === item.id && 
        i.selectedColor === item.selectedColor && 
        i.selectedSize === item.selectedSize
      );
      if (existing) {
        return prev.map(i => 
          (i.id === item.id && i.selectedColor === item.selectedColor && i.selectedSize === item.selectedSize)
            ? { ...i, quantity: i.quantity + 1 } 
            : i
        );
      }
      return [...prev, item];
    });
  };

  const handlePlaceOrder = (orderDetails: any) => {
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      customerName: orderDetails.name,
      email: user?.email || '',
      address: `${orderDetails.governorate}, ${orderDetails.city}, ${orderDetails.street}`,
      total: orderDetails.total,
      status: 'pending',
      date: new Date().toISOString(),
      items: [...cart]
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
  };

  const filteredProducts = products.filter(p => 
    p.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderContent = () => {
    if (currentPage === 'admin' && user?.role === 'admin') {
      return (
        <AdminDashboard 
          products={products}
          orders={orders}
          shippingZones={shippingZones}
          categories={categories}
          onUpdateProducts={setProducts}
          onUpdateOrders={setOrders}
          onUpdateShippingZones={setShippingZones}
          onUpdateCategories={setCategories}
          onBack={() => setCurrentPage('home')}
        />
      );
    }

    switch (currentPage) {
      case 'home':
        return <HomePage products={filteredProducts} categories={categories} onProductClick={(id) => { setSelectedProductId(id); setCurrentPage('product'); }} onAddToCart={(p) => addToCart({...p, quantity: 1})} t={t} lang={lang} />;
      case 'product':
        return selectedProductId ? (
          <ProductPage 
            product={products.find(p => p.id === selectedProductId)!}
            allProducts={products}
            onProductClick={(id) => setSelectedProductId(id)}
            onAddToCart={addToCart}
            onBack={() => setCurrentPage('home')}
            onAddReview={(pid, rev) => setProducts(prev => prev.map(p => p.id === pid ? { ...p, reviews: [rev, ...(p.reviews || [])] } : p))}
            user={user}
            t={t}
            lang={lang}
          />
        ) : null;
      case 'login':
        return <Login onLogin={(u) => { setUser(u); setCurrentPage(cart.length > 0 ? 'checkout' : 'home'); }} t={t} />;
      case 'profile':
        return user ? <Profile user={user} orders={orders} t={t} lang={lang} onNavigate={setCurrentPage} onUpdateUser={setUser} /> : null;
      case 'checkout':
        return <Checkout cart={cart} shippingZones={shippingZones} onPlaceOrder={handlePlaceOrder} onBack={() => setCurrentPage('home')} t={t} />;
      default:
        return <HomePage products={filteredProducts} categories={categories} onProductClick={(id) => { setSelectedProductId(id); setCurrentPage('product'); }} onAddToCart={(p) => addToCart({...p, quantity: 1})} t={t} lang={lang} />;
    }
  };

  const isStoreView = currentPage !== 'admin';

  return (
    <div className={`min-h-screen text-white ${lang === 'ar' ? 'font-tajawal' : 'font-sans'}`}>
      {isStoreView && (
        <>
          <Navbar 
            onSearch={setSearchQuery} 
            cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
            onOpenCart={() => setIsCartOpen(true)}
            onNavigate={setCurrentPage}
            user={user}
            onLogout={() => { setUser(null); setCurrentPage('home'); }}
            lang={lang}
            onToggleLang={() => setLang(l => l === 'ar' ? 'en' : 'ar')}
            t={t}
          />
          <CartSidebar 
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            items={cart}
            onRemove={(id) => setCart(prev => prev.filter(i => i.id !== id))}
            onUpdateQty={(id, delta) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i))}
            onCheckout={() => { setIsCartOpen(false); setCurrentPage(user ? 'checkout' : 'login'); }}
            t={t}
          />
        </>
      )}

      <main className={isStoreView ? "max-w-7xl mx-auto py-8 px-4" : "w-full"}>
        {renderContent()}
      </main>

      {isStoreView && (
        <footer className="mt-12 py-12 text-center text-white/50 font-bold backdrop-blur-md bg-black/10 border-t border-white/5">
          <p>{lang === 'ar' ? '© 2024 متجر ميدو. جميع الحقوق محفوظة.' : '© 2024 Mido Store. All rights reserved.'}</p>
        </footer>
      )}
    </div>
  );
};

export default App;
