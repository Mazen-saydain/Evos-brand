
import { Product } from './types';

export const CATEGORIES = ['ALL', 'HOODIES', 'SWEATPANTS', 'CREWNECKS'];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'EVOS OVERSIZED HOODIE - WHITE EDITION',
    price: 1250,
    category: 'HOODIES',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Black'],
    description: 'Premium heavyweight cotton oversized hoodie. Signature Evos fit.',
    isNew: true,
    stock: 25
  },
  {
    id: '2',
    name: 'SIGNATURE SWEATPANTS - BLACK',
    price: 950,
    category: 'SWEATPANTS',
    images: [
      'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1506629082923-e9ad3f24666c?auto=format&fit=crop&q=80&w=800'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: ['Black'],
    description: 'Tapered luxury sweatpants with reinforced stitching.',
    isBestSeller: true,
    stock: 15
  }
];

export const CONTACT_INFO = {
  email: 'connect@evosbrand.com',
  whatsapp: '+201009191449',
  whatsappLink: 'https://wa.me/201009191449',
  instagram: 'https://www.instagram.com/evos_brand?igsh=NmE3OWZ1YmdwcGs3&utm_source=qr',
  tiktok: 'https://www.tiktok.com/@evos_brand?_r=1&_t=ZS-936OAoufcnc',
  facebook: 'https://www.facebook.com/share/1E1iCKWLLf/?mibextid=wwXIfr'
};
