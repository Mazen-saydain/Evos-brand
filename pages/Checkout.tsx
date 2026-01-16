// Checkout.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { Trash2, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import { db } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const Checkout: React.FC = () => {
  const { cart, removeFromCart, clearCart, addOrder } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'COD' as 'COD' | 'VodafoneCash' | 'InstaPay'
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const shipping = 50;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
    const order = {
      id: orderId,
      customer: { ...formData },
      items: cart,
      total,
      paymentMethod: formData.paymentMethod,
      status: 'Pending' as const,
      createdAt: new Date().toISOString()
    };

    try {
      // حفظ الأوردر في Firestore
      await addDoc(collection(db, 'orders'), order);
      // لو عايز تحدد ID الأوردر نفسه:
      // await setDoc(doc(db, 'orders', orderId), order);

      // حفظ الأوردر محليًا في state
      addOrder(order);
      clearCart();
      setStep(3); // الانتقال لصفحة التأكيد
    } catch (err) {
      console.error('Firestore Error:', err);
      alert('Failed to submit order. Please try again.');
    }
  };

  if (step === 3) {
    return (
      <div className="min-h-screen pt-40 pb-20 flex flex-col items-center px-4">
        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-8">
          <ShieldCheck size={40} />
        </div>
        <h1 className="text-4xl font-black tracking-tighter uppercase mb-4">Order Confirmed</h1>
        <p className="text-gray-500 mb-10 text-center max-w-md">
          Thank you for choosing ΞVOS. Your order has been placed successfully and is being processed.
        </p>
        <button onClick={() => navigate('/')} className="bg-black text-white px-10 py-4 font-bold uppercase tracking-widest text-xs">
          Continue Shopping
        </button>
      </div>
    );
  }

  if (cart.length === 0 && step === 1) {
    return (
      <div className="min-h-screen pt-40 pb-20 flex flex-col items-center px-4">
        <h1 className="text-4xl font-black tracking-tighter uppercase mb-6">Your Cart is Empty</h1>
        <button onClick={() => navigate('/')} className="bg-black text-white px-10 py-4 font-bold uppercase tracking-widest text-xs">
          Explore Drops
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left: Cart & Form */}
        <div className="lg:col-span-7 space-y-12">
          {step === 1 ? (
            <div className="space-y-8">
              <h2 className="text-2xl font-black tracking-tighter uppercase border-b pb-4">Order Items ({cart.length})</h2>
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-6 items-start">
                  <div className="w-24 aspect-[3/4] bg-gray-50 flex-shrink-0">
                    <img src={item.images[0]} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xs font-black uppercase tracking-widest mb-1">{item.name}</h3>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Size: {item.selectedSize} / Color: {item.selectedColor}</p>
                    <p className="text-sm font-light">{item.price} EGP</p>
                  </div>
                  <button onClick={() => removeFromCart(idx)} className="text-gray-400 hover:text-black transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => setStep(2)}
                className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest text-xs"
              >
                Continue to Checkout
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex items-center space-x-4 mb-4">
                <button type="button" onClick={() => setStep(1)} className="text-xs font-bold uppercase tracking-widest hover:underline">← Back to Cart</button>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-xl font-black tracking-tighter uppercase">Delivery Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required placeholder="FULL NAME" className="p-4 bg-gray-50 text-xs border-none outline-none focus:ring-1 focus:ring-black" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  <input required type="email" placeholder="EMAIL ADDRESS" className="p-4 bg-gray-50 text-xs border-none outline-none focus:ring-1 focus:ring-black" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  <input required placeholder="PHONE NUMBER" className="p-4 bg-gray-50 text-xs border-none outline-none focus:ring-1 focus:ring-black md:col-span-2" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  <textarea required placeholder="SHIPPING ADDRESS" className="p-4 bg-gray-50 text-xs border-none outline-none focus:ring-1 focus:ring-black md:col-span-2 min-h-[100px]" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-black tracking-tighter uppercase">Payment Method</h3>
                <div className="space-y-2">
                  {[ 
                    { id: 'COD', label: 'Cash on Delivery (الدفع عند الاستلام)' },
                    { id: 'VodafoneCash', label: 'Vodafone Cash' },
                    { id: 'InstaPay', label: 'InstaPay' }
                  ].map(method => (
                    <label key={method.id} className={`flex items-center p-4 border cursor-pointer transition-colors ${formData.paymentMethod === method.id ? 'border-black bg-gray-50' : 'border-gray-100'}`}>
                      <input type="radio" name="payment" checked={formData.paymentMethod === method.id} onChange={() => setFormData({...formData, paymentMethod: method.id as any})} className="mr-4 accent-black" />
                      <span className="text-xs font-bold uppercase tracking-widest">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full bg-black text-white py-5 font-bold uppercase tracking-widest text-sm hover:bg-gray-900">
                Complete Purchase
              </button>
            </form>
          )}
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-5">
          <div className="bg-gray-50 p-8 sticky top-32">
            <h3 className="text-xl font-black tracking-tighter uppercase mb-8">Summary</h3>
            <div className="space-y-4 text-xs font-bold uppercase tracking-widest">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>{subtotal} EGP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span>{shipping} EGP</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-gray-200 text-sm">
                <span>Total</span>
                <span>{total} EGP</span>
              </div>
            </div>

            <div className="mt-12 space-y-4">
              <div className="flex items-center space-x-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                <Truck size={14} />
                <span>Fast Delivery (2-5 Business Days)</span>
              </div>
              <div className="flex items-center space-x-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                <CreditCard size={14} />
                <span>Secure Checkout Process</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
