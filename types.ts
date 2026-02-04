
export interface Review {
  id: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number;
  descriptionAr: string;
  descriptionEn: string;
  category: string; 
  image: string;
  specsAr: string[];
  specsEn: string[];
  stock: number;
  availableColors?: string[]; // الألوان المتاحة (كود اللون أو الاسم)
  availableSizes?: string[];  // المقاسات المتاحة
  reviews?: Review[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  address: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  items: CartItem[];
}

export type UserRole = 'admin' | 'manager' | 'staff' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'suspended';
  joinedDate: string;
  addresses?: string[];
  avatar?: string;
}

export interface ShippingZone {
  id: string;
  name: string;
  price: number;
  deliveryTime: string;
  status: 'active' | 'inactive';
}
