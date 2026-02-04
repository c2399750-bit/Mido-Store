
import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    nameAr: 'قميص قطني أوفر سايز',
    nameEn: 'Oversized Cotton Shirt',
    price: 450,
    descriptionAr: 'قميص قطني مريح جداً بتصميم عصري يناسب الإطلالات الكاجوال اليومية.',
    descriptionEn: 'Ultra-comfortable cotton shirt with a modern design, perfect for casual daily looks.',
    category: 'men',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
    specsAr: ['قطن 100%', 'مريح للجلد', 'ألوان ثابتة'],
    specsEn: ['100% Cotton', 'Skin friendly', 'Color fastness'],
    stock: 25
  },
  {
    id: '2',
    nameAr: 'فستان صيفي منقوش',
    nameEn: 'Patterned Summer Dress',
    price: 850,
    descriptionAr: 'فستان صيفي أنيق بتصميم عصري وألوان زاهية، مثالي للخروجات والرحلات.',
    descriptionEn: 'Elegant summer dress with vibrant colors and modern cut, ideal for trips and outings.',
    category: 'women',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80',
    specsAr: ['خامة خفيفة', 'تصميم مريح', 'سهل الغسيل'],
    specsEn: ['Lightweight fabric', 'Comfortable fit', 'Easy to wash'],
    stock: 15
  },
  {
    id: '3',
    nameAr: 'بنطلون جينز كلاسيك',
    nameEn: 'Classic Blue Jeans',
    price: 600,
    descriptionAr: 'بنطلون جينز متين بتصميم كلاسيكي يناسب جميع الأوقات والمناسبات.',
    descriptionEn: 'Durable denim jeans with a classic design suitable for all occasions.',
    category: 'men',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80',
    specsAr: ['دينيم عالي الجودة', 'خياطة مزدوجة', 'مقاس مريح'],
    specsEn: ['High-quality denim', 'Double stitching', 'Relaxed fit'],
    stock: 30
  },
  {
    id: '4',
    nameAr: 'طقم أطفال قطعتين',
    nameEn: 'Kids Two-Piece Set',
    price: 550,
    descriptionAr: 'طقم أطفال مريح وعملي مكون من قطعتين، مثالي للعب والنشاط اليومي.',
    descriptionEn: 'Practical and comfortable two-piece set for kids, perfect for play and activities.',
    category: 'kids',
    image: 'https://images.unsplash.com/photo-1519702113330-8041a79857d4?auto=format&fit=crop&w=600&q=80',
    specsAr: ['آمن على البشرة', 'تصميم جذاب', 'متوفر بمقاسات مختلفة'],
    specsEn: ['Safe for skin', 'Attractive design', 'Available in various sizes'],
    stock: 12
  }
];

export const CATEGORIES = ['all', 'men', 'women', 'kids', 'accessories'];
