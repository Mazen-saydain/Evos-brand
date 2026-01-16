import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { INITIAL_PRODUCTS } from './constants';
import { Product, CartItem, Order, FirebaseConfig } from './types';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, setDoc, doc, deleteDoc } from 'firebase/firestore';

// Context for Store State
interface AppContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: string) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  mediaLibrary: string[];
  setMediaLibrary: React.Dispatch<React.SetStateAction<string[]>>;
  firebaseConfig: FirebaseConfig | null;
  setFirebaseConfig: (config: FirebaseConfig) => void;
  firebaseEnabled: boolean;
  auth: ReturnType<typeof getAuth> | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Collections from './pages/Collections';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminLogin from './pages/Admin/Login';

const App: React.FC = () => {
  const [firebaseConfig, setFirebaseConfigState] = useState<FirebaseConfig | null>(() => {
    const saved = localStorage.getItem('evos_firebase_config');
    return saved ? JSON.parse(saved) : null;
  });

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [mediaLibrary, setMediaLibrary] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firebaseEnabled, setFirebaseEnabled] = useState(false);
  const [auth, setAuth] = useState<ReturnType<typeof getAuth> | null>(null);

  // Initialize Firebase
  useEffect(() => {
    if (firebaseConfig && getApps().length === 0) {
      try {
        initializeApp(firebaseConfig);
        const authInstance = getAuth();
        setAuth(authInstance);
        setFirebaseEnabled(true);
        console.log('Firebase initialized successfully');
      } catch (err) {
        console.error('Firebase initialization failed:', err);
      }
    }
  }, [firebaseConfig]);

  // Sync with Firestore if enabled
  useEffect(() => {
    if (firebaseEnabled) {
      const db = getFirestore();
      
      // Sync Products
      const unsubscribeProducts = onSnapshot(collection(db, "products"), (snapshot) => {
        const productList = snapshot.docs.map(doc => doc.data() as Product);
        if (productList.length > 0) setProducts(productList);
      });

      // Sync Orders
      const unsubscribeOrders = onSnapshot(collection(db, "orders"), (snapshot) => {
        const orderList = snapshot.docs.map(doc => doc.data() as Order);
        setOrders(orderList);
      });

      // Sync Media
      const unsubscribeMedia = onSnapshot(collection(db, "media"), (snapshot) => {
        const mediaList = snapshot.docs.map(doc => doc.data().url as string);
        setMediaLibrary(mediaList);
      });

      return () => {
        unsubscribeProducts();
        unsubscribeOrders();
        unsubscribeMedia();
      };
    } else {
      // Fallback to LocalStorage
      const savedProducts = localStorage.getItem('evos_products');
      if (savedProducts) setProducts(JSON.parse(savedProducts));
      
      const savedOrders = localStorage.getItem('evos_orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedMedia = localStorage.getItem('evos_media');
      if (savedMedia) setMediaLibrary(JSON.parse(savedMedia));
    }
  }, [firebaseEnabled]);

  const setFirebaseConfig = (config: FirebaseConfig) => {
    localStorage.setItem('evos_firebase_config', JSON.stringify(config));
    setFirebaseConfigState(config);
    window.location.reload(); // Force reload to re-init app
  };

  const addToCart = (product: Product, size: string, color: string) => {
    setCart(prev => [...prev, { ...product, selectedSize: size, selectedColor: color, quantity: 1 }]);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setCart([]);

  const addOrder = async (order: Order) => {
    if (firebaseEnabled) {
      const db = getFirestore();
      await setDoc(doc(db, "orders", order.id), order);
    } else {
      setOrders(prev => [order, ...prev]);
    }
  };

  return (
    <AppContext.Provider value={{ 
      products, setProducts, 
      cart, addToCart, removeFromCart, clearCart,
      orders, addOrder,
      isLoggedIn, setIsLoggedIn,
      mediaLibrary, setMediaLibrary,
      firebaseConfig, setFirebaseConfig, firebaseEnabled,
      auth
    }}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/collections/:category" element={<Collections />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={isLoggedIn ? <AdminDashboard /> : <AdminLogin />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppContext.Provider>
  );
};

export default App;
