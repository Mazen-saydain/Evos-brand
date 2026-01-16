
export type Category = 'ALL' | 'HOODIES' | 'SWEATPANTS' | 'CREWNECKS';

export interface ProductSize {
  label: string;
  isAvailable: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  images: string[];
  sizes: ProductSize[]; // Changed from string[] to ProductSize[]
  colors: string[];
  description: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  isSoldOut?: boolean;
  discount?: number;
  stock: number;
}

export interface CartItem extends Product {
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: CartItem[];
  total: number;
  paymentMethod: 'COD' | 'VodafoneCash' | 'InstaPay';
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  createdAt: string;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}
