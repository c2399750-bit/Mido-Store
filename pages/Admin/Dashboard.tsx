
import React, { useState, useMemo, useEffect } from 'react';
import { Product, Order, User, ShippingZone } from '../../types';
import { generateProductDescription, suggestSpecs } from '../../services/geminiService';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  shippingZones: ShippingZone[];
  categories: string[];
  onUpdateProducts: (p: Product[]) => void;
  onUpdateOrders: (o: Order[]) => void;
  onUpdateShippingZones: (s: ShippingZone[]) => void;
  onUpdateCategories: (c: string[]) => void;
  onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  products, 
  orders, 
  shippingZones, 
  categories,
  onUpdateProducts, 
  onUpdateOrders,
  onUpdateShippingZones,
  onUpdateCategories,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'shipping' | 'orders'>('overview');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingZone, setEditingZone] = useState<Partial<ShippingZone> | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Statistics
  const stats = useMemo(() => {
    const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const lowStockItems = products.filter(p => (p.stock || 0) < 5).length;
    return { totalSales, pendingOrders, lowStockItems, totalProducts: products.length };
  }, [orders, products]);

  const handleSaveProduct = () => {
    if (!editingProduct?.nameAr) return;
    if (editingProduct.id) {
      onUpdateProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...editingProduct } as Product : p));
    } else {
      const newP: Product = { 
        id: Math.random().toString(36).substr(2, 9),
        nameAr: editingProduct.nameAr || '',
        nameEn: editingProduct.nameEn || editingProduct.nameAr || '',
        price: editingProduct.price || 0,
        descriptionAr: editingProduct.descriptionAr || '',
        descriptionEn: editingProduct.descriptionEn || editingProduct.descriptionAr || '',
        category: editingProduct.category || categories[0] || 'men',
        image: editingProduct.image || '',
        specsAr: editingProduct.specsAr || [],
        specsEn: editingProduct.specsEn || [],
        stock: editingProduct.stock || 0,
        availableColors: editingProduct.availableColors || [],
        availableSizes: editingProduct.availableSizes || []
      };
      onUpdateProducts([newP, ...products]);
    }
    setEditingProduct(null);
  };

  const handleAIDesc = async () => {
    if (!editingProduct?.nameAr || !editingProduct?.category) {
      alert("الرجاء إدخال اسم المنتج والقسم أولاً");
      return;
    }
    setLoadingAI(true);
    const desc = await generateProductDescription(editingProduct.nameAr, editingProduct.category);
    const specs = await suggestSpecs(editingProduct.nameAr);
    setEditingProduct({ 
      ...editingProduct, 
      descriptionAr: desc, 
      specsAr: specs.length > 0 ? specs : editingProduct.specsAr 
    });
    setLoadingAI(false);
  };

  const handleSaveZone = () => {
    if (!editingZone?.name || editingZone?.price === undefined) {
      alert('يرجى ملء البيانات الأساسية');
      return;
    }
    setLoadingAction(true);
    setTimeout(() => {
      if (editingZone.id) {
        onUpdateShippingZones(shippingZones.map(z => z.id === editingZone.id ? editingZone as ShippingZone : z));
      } else {
        const newZ = { ...editingZone, id: Math.random().toString(36).substr(2, 9), status: 'active' } as ShippingZone;
        onUpdateShippingZones([...shippingZones, newZ]);
      }
      setEditingZone(null);
      setLoadingAction(false);
    }, 500);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    if (categories.includes(newCategoryName.trim())) {
      alert('هذا القسم موجود بالفعل');
      return;
    }
    onUpdateCategories([...categories, newCategoryName.trim()]);
    setNewCategoryName('');
  };

  const handleDeleteCategory = (cat: string) => {
    const productsInCat = products.some(p => p.category === cat);
    if (productsInCat) {
      if (!window.confirm('هذا القسم يحتوي على منتجات مرتبطة به، هل أنت متأكد من الحذف؟ سيتم إلغاء ربط المنتجات بالقسم.')) return;
    } else if (!window.confirm('هل أنت متأكد من حذف هذا القسم؟')) return;
    
    onUpdateCategories(categories.filter(c => c !== cat));
  };

  const menuItems = [
    { id: 'overview', label: 'الإحصائيات', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { id: 'products', label: 'المنتجات', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { id: 'categories', label: 'إدارة الأقسام', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
    { id: 'shipping', label: 'إدارة الشحن', icon: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 011 1v2a1 1 0 01-1 1' },
    { id: 'orders', label: 'الطلبات', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-tajawal rtl">
      <aside className={`bg-white border-l shadow-xl transition-all duration-500 sticky top-0 h-screen flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 border-b flex justify-between items-center">
           <div className={`font-black text-emerald-600 text-xl ${!isSidebarOpen && 'hidden'}`}>ميدو ستور</div>
           <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-50 rounded-lg"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg></button>
        </div>
        <nav className="p-4 space-y-2 flex-1">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${activeTab === item.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} /></svg>
              {isSidebarOpen && <span className="font-bold">{item.label}</span>}
            </button>
          ))}
        </nav>
        <button onClick={onBack} className="m-4 p-4 text-red-500 hover:bg-red-50 rounded-xl flex items-center gap-4 transition-all">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 19l-7-7 7-7" /></svg>
          {isSidebarOpen && <span className="font-bold">خروج للمتجر</span>}
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto h-screen">
        <header className="mb-10 flex justify-between items-center">
          <h2 className="text-3xl font-black text-slate-800">{menuItems.find(m => m.id === activeTab)?.label}</h2>
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-full shadow-sm border px-6 font-bold text-slate-600">أهلاً، ميدو</div>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in fade-in">
             {[
               { l: 'إجمالي المبيعات', v: stats.totalSales, u: 'ج.م', c: 'text-emerald-600' },
               { l: 'طلبات معلقة', v: stats.pendingOrders, u: 'طلب', c: 'text-orange-500' },
               { l: 'نواقص المخزون', v: stats.lowStockItems, u: 'منتج', c: 'text-red-500' },
               { l: 'المنتجات الكلية', v: stats.totalProducts, u: 'صنف', c: 'text-blue-500' }
             ].map((s, i) => (
               <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                  <p className="text-slate-400 text-xs font-black mb-2">{s.l}</p>
                  <div className={`text-3xl font-black ${s.c}`}>{s.v} <span className="text-xs text-slate-300">{s.u}</span></div>
               </div>
             ))}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-8 animate-in fade-in">
            <div className="bg-white p-10 rounded-[2.5rem] border shadow-sm max-w-2xl mx-auto">
               <h3 className="text-2xl font-black text-slate-800 mb-8">إدارة الأقسام (Categories)</h3>
               <div className="flex gap-4 mb-10">
                 <input 
                  type="text" 
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="اسم القسم الجديد..."
                  className="flex-1 bg-slate-50 p-5 rounded-2xl border-2 border-slate-100 focus:border-emerald-600 outline-none font-bold text-slate-800"
                 />
                 <button 
                  onClick={handleAddCategory}
                  className="bg-emerald-600 text-white px-8 rounded-2xl font-black shadow-lg hover:bg-emerald-700 transition-all"
                 >
                   إضافة
                 </button>
               </div>

               <div className="space-y-4">
                 {categories.map(cat => (
                   <div key={cat} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-emerald-500 transition-all">
                      <span className="font-black text-lg text-slate-700 capitalize">{cat}</span>
                      <button 
                        onClick={() => handleDeleteCategory(cat)}
                        className="p-3 text-red-500 hover:bg-red-100 rounded-xl transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden animate-in fade-in">
            <div className="p-8 border-b flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-800">قائمة المنتجات</h3>
              <button 
                onClick={() => setEditingProduct({ nameAr: '', nameEn: '', price: 0, category: categories[0] || '', stock: 10, descriptionAr: '', descriptionEn: '', specsAr: [], specsEn: [], availableColors: [], availableSizes: [] })}
                className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg hover:bg-emerald-700 transition-all"
              >
                إضافة منتج
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-slate-50 text-slate-400 text-xs font-black uppercase">
                  <tr>
                    <th className="p-6">المنتج</th>
                    <th className="p-6">القسم</th>
                    <th className="p-6">السعر</th>
                    <th className="p-6">المخزون</th>
                    <th className="p-6">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-all">
                      <td className="p-6 flex items-center gap-4 text-slate-700">
                        <img src={p.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                        <span className="font-black">{p.nameAr}</span>
                      </td>
                      <td className="p-6"><span className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-bold capitalize text-slate-600">{p.category}</span></td>
                      <td className="p-6 font-black text-emerald-600">{p.price} ج.م</td>
                      <td className="p-6 font-bold text-slate-700">{p.stock}</td>
                      <td className="p-6">
                        <div className="flex gap-2">
                          <button onClick={() => setEditingProduct(p)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                          <button onClick={() => onUpdateProducts(products.filter(item => item.id !== p.id))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal for Product Editing with Dynamic Categories */}
        {editingProduct && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
             <div className="bg-white rounded-[3rem] p-10 max-w-4xl w-full shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto text-slate-800">
                <h3 className="text-2xl font-black text-slate-800 mb-8">{editingProduct.id ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h3>
                
                <div className="space-y-8">
                   {/* Row 1: Basic Info */}
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div>
                       <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">القسم</label>
                       <select className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none font-bold capitalize text-slate-800" value={editingProduct.category} onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}>
                          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                       </select>
                     </div>
                     <div>
                       <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">السعر</label>
                       <input type="number" className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none font-bold text-slate-800" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})} />
                     </div>
                     <div>
                       <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">المخزون</label>
                       <input type="number" className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none font-bold text-slate-800" value={editingProduct.stock} onChange={(e) => setEditingProduct({...editingProduct, stock: Number(e.target.value)})} />
                     </div>
                   </div>

                   {/* Row 2: Names */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">الاسم (عربي)</label>
                       <input type="text" className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none font-bold text-slate-800" value={editingProduct.nameAr} onChange={(e) => setEditingProduct({...editingProduct, nameAr: e.target.value})} />
                     </div>
                     <div>
                       <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Product Name (EN)</label>
                       <input type="text" className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none font-bold text-slate-800" value={editingProduct.nameEn} onChange={(e) => setEditingProduct({...editingProduct, nameEn: e.target.value})} />
                     </div>
                   </div>

                   {/* Row 3: Colors & Sizes */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">الألوان المتاحة (افصل بفاصلة)</label>
                       <input 
                         type="text" 
                         placeholder="أحمر, أزرق, أسود"
                         className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none font-bold text-slate-800" 
                         value={editingProduct.availableColors?.join(', ')} 
                         onChange={(e) => setEditingProduct({...editingProduct, availableColors: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})} 
                       />
                     </div>
                     <div>
                       <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">المقاسات المتاحة (افصل بفاصلة)</label>
                       <input 
                         type="text" 
                         placeholder="XL, L, M, S"
                         className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none font-bold text-slate-800" 
                         value={editingProduct.availableSizes?.join(', ')} 
                         onChange={(e) => setEditingProduct({...editingProduct, availableSizes: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})} 
                       />
                     </div>
                   </div>

                   {/* Row 4: Image Link */}
                   <div>
                     <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">رابط الصورة</label>
                     <input type="text" className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none font-bold text-slate-800" value={editingProduct.image} onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})} />
                   </div>

                   {/* Row 5: Descriptions */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <div className="flex justify-between mb-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الوصف (عربي)</label>
                          <button onClick={handleAIDesc} disabled={loadingAI} className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                             {loadingAI ? 'جاري التوليد...' : '✨ توليد ذكي'}
                          </button>
                       </div>
                       <textarea className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none font-bold h-32 resize-none text-slate-800" value={editingProduct.descriptionAr} onChange={(e) => setEditingProduct({...editingProduct, descriptionAr: e.target.value})} />
                     </div>
                     <div>
                       <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Description (EN)</label>
                       <textarea className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none font-bold h-32 resize-none text-left text-slate-800" dir="ltr" value={editingProduct.descriptionEn} onChange={(e) => setEditingProduct({...editingProduct, descriptionEn: e.target.value})} />
                     </div>
                   </div>

                   {/* Row 6: Specifications */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">المواصفات (عربي - افصل بفاصلة)</label>
                       <input 
                         type="text" 
                         className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none font-bold text-slate-800" 
                         value={editingProduct.specsAr?.join(', ')} 
                         onChange={(e) => setEditingProduct({...editingProduct, specsAr: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})} 
                       />
                     </div>
                     <div>
                       <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Specifications (EN - comma separated)</label>
                       <input 
                         type="text" 
                         className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none font-bold text-left text-slate-800" 
                         dir="ltr"
                         value={editingProduct.specsEn?.join(', ')} 
                         onChange={(e) => setEditingProduct({...editingProduct, specsEn: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})} 
                       />
                     </div>
                   </div>
                </div>

                <div className="mt-12 flex gap-4">
                   <button onClick={handleSaveProduct} className="flex-1 bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-emerald-700 transition-all">حفظ المنتج</button>
                   <button onClick={() => setEditingProduct(null)} className="px-10 py-5 bg-slate-100 text-slate-400 rounded-2xl font-black hover:bg-slate-200 transition-all">إلغاء</button>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'shipping' && (
           <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
             <div className="bg-white p-10 rounded-[2.5rem] border shadow-sm">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-black text-slate-800">إدارة الشحن</h3>
                  <button onClick={() => setEditingZone({ name: '', price: undefined, deliveryTime: '', status: 'active' })} className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg hover:bg-emerald-700 transition-all">إضافة منطقة</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {shippingZones.map(zone => (
                    <div key={zone.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-emerald-500 transition-all">
                       <h4 className="font-black text-xl mb-2 text-slate-800">{zone.name}</h4>
                       <div className="text-2xl font-black text-emerald-600 mb-4">{zone.price} ج.م</div>
                       <div className="flex gap-2 text-slate-700">
                         <button onClick={() => setEditingZone(zone)} className="text-blue-500 hover:bg-white p-2 rounded-lg font-bold">تعديل</button>
                         <button onClick={() => onUpdateShippingZones(shippingZones.filter(z => z.id !== zone.id))} className="text-red-500 hover:bg-white p-2 rounded-lg font-bold">حذف</button>
                       </div>
                    </div>
                  ))}
                </div>
             </div>
           </div>
        )}

        {activeTab === 'orders' && (
           <div className="space-y-6 animate-in fade-in">
             {orders.map(order => (
               <div key={order.id} className="bg-white p-6 rounded-[2rem] border shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 text-slate-700">
                  <div>
                    <h4 className="font-black text-lg">#{order.id.slice(-6).toUpperCase()} - {order.customerName}</h4>
                    <p className="text-slate-400 text-sm">{new Date(order.date).toLocaleDateString('ar-EG')}</p>
                  </div>
                  <div className="font-black text-emerald-600 text-xl">{order.total} ج.م</div>
                  <select 
                    value={order.status}
                    onChange={(e) => onUpdateOrders(orders.map(o => o.id === order.id ? {...o, status: e.target.value as any} : o))}
                    className={`px-4 py-2 rounded-xl text-xs font-black ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}
                  >
                    <option value="pending">معلق</option>
                    <option value="delivered">تم التوصيل</option>
                    <option value="cancelled">ملغي</option>
                  </select>
               </div>
             ))}
           </div>
        )}
      </main>

      {/* Shipping Zone Modal */}
      {editingZone && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-white rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl animate-in zoom-in-95 text-slate-800">
              <h3 className="text-2xl font-black text-slate-800 mb-8">إدارة منطقة الشحن</h3>
              <div className="space-y-6">
                <input type="text" className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none font-bold text-slate-800" placeholder="اسم المنطقة" value={editingZone.name} onChange={(e) => setEditingZone({...editingZone, name: e.target.value})} />
                <input type="number" className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none font-bold text-slate-800" placeholder="السعر" value={editingZone.price === undefined ? '' : editingZone.price} onChange={(e) => setEditingZone({...editingZone, price: e.target.value === '' ? undefined : Number(e.target.value)})} />
                <input type="text" className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none font-bold text-slate-800" placeholder="وقت التوصيل" value={editingZone.deliveryTime} onChange={(e) => setEditingZone({...editingZone, deliveryTime: e.target.value})} />
              </div>
              <div className="mt-8 flex gap-4">
                 <button onClick={handleSaveZone} className="flex-1 bg-emerald-600 text-white py-4 rounded-xl font-black">حفظ</button>
                 <button onClick={() => setEditingZone(null)} className="px-8 py-4 bg-slate-100 text-slate-400 rounded-xl font-black">إلغاء</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
