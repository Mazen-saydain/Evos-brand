import React, { useState, useRef } from 'react';
import { useApp } from '../../App';
import { Plus, Trash2, LogOut, X, UploadCloud, FolderOpen, CheckCircle2, Edit3, Percent, Ban, CheckCircle, Save } from 'lucide-react';
import { Category, Product, ProductSize } from '../../types';
import { getFirestore, setDoc, doc, deleteDoc } from 'firebase/firestore';

const AdminDashboard: React.FC = () => {
  const { products, setProducts, orders, setIsLoggedIn, mediaLibrary, setMediaLibrary, firebaseEnabled } = useApp();
  const [activeTab, setActiveTab] = useState<'PRODUCTS' | 'ORDERS' | 'STATS' | 'MEDIA'>('STATS');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaTabFileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    category: 'HOODIES' as Category,
    description: '',
    discount: 0,
    isSoldOut: false,
    sizes: [
      { label: 'S', isAvailable: true },
      { label: 'M', isAvailable: true },
      { label: 'L', isAvailable: true },
      { label: 'XL', isAvailable: true }
    ] as ProductSize[]
  });

  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const handleLogout = () => {
    localStorage.removeItem('evos_admin_session');
    setIsLoggedIn(false);
  };

  const syncToCloud = async (type: 'products' | 'media' | 'orders', id: string, data: any) => {
    if (firebaseEnabled) {
      const db = getFirestore();
      await setDoc(doc(db, type, id), data);
    }
  };

  const deleteFromCloud = async (type: 'products' | 'media' | 'orders', id: string) => {
    if (firebaseEnabled) {
      const db = getFirestore();
      await deleteDoc(doc(db, type, id));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, target: 'FORM' | 'LIBRARY') => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        if (target === 'FORM') {
          setSelectedImages(prev => [...prev, base64]);
        }
        const mediaId = Math.random().toString(36).substr(2, 9);
        setMediaLibrary(prev => [base64, ...prev]);
        await syncToCloud('media', mediaId, { url: base64, id: mediaId });
        localStorage.setItem('evos_media', JSON.stringify([base64, ...mediaLibrary]));
      };
      reader.readAsDataURL(file);
    });
  };

  const toggleImageSelection = (img: string) => {
    setSelectedImages(prev => 
      prev.includes(img) ? prev.filter(i => i !== img) : [...prev, img]
    );
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSizeToggle = (label: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.map(s => s.label === label ? { ...s, isAvailable: !s.isAvailable } : s)
    }));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      id: editingProduct ? editingProduct.id : Math.random().toString(36).substr(2, 9),
      name: formData.name,
      price: formData.price,
      category: formData.category,
      description: formData.description,
      images: selectedImages.length > 0 ? selectedImages : ['https://picsum.photos/800/1200'],
      discount: formData.discount > 0 ? formData.discount : undefined,
      isSoldOut: formData.isSoldOut,
      sizes: formData.sizes,
      colors: ['Default'],
      stock: formData.isSoldOut ? 0 : 50,
      isNew: !editingProduct
    };

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    } else {
      setProducts(prev => [product, ...prev]);
    }

    await syncToCloud('products', product.id, product);
    localStorage.setItem('evos_products', JSON.stringify([product, ...products.filter(p => p.id !== product.id)]));

    setShowAddForm(false);
    setEditingProduct(null);
    setFormData({ name: '', price: 0, category: 'HOODIES', description: '', discount: 0, isSoldOut: false, sizes:[{label:'S', isAvailable:true},{label:'M',isAvailable:true},{label:'L',isAvailable:true},{label:'XL',isAvailable:true}] });
    setSelectedImages([]);
  };

  const toggleSoldOut = async (product: Product) => {
    const updated = { ...product, isSoldOut: !product.isSoldOut };
    setProducts(prev => prev.map(p => p.id === product.id ? updated : p));
    await syncToCloud('products', product.id, updated);
    localStorage.setItem('evos_products', JSON.stringify(products.map(p => p.id === updated.id ? updated : p)));
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      discount: product.discount || 0,
      isSoldOut: !!product.isSoldOut,
      sizes: product.sizes || [{label:'S', isAvailable:true},{label:'M',isAvailable:true},{label:'L',isAvailable:true},{label:'XL',isAvailable:true}]
    });
    setSelectedImages(product.images);
    setShowAddForm(true);
  };

  const deleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product from cloud?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
      await deleteFromCloud('products', id);
      localStorage.setItem('evos_products', JSON.stringify(products.filter(p => p.id !== id)));
    }
  };

  const deleteFromLibrary = async (imgUrl: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      setMediaLibrary(prev => prev.filter(img => img !== imgUrl));
      localStorage.setItem('evos_media', JSON.stringify(mediaLibrary.filter(img => img !== imgUrl)));
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50 pb-20">
      <div className="bg-black text-white py-4 px-4 md:px-8 flex justify-between items-center sticky top-16 md:top-20 z-40">
        <div className="flex items-center space-x-2">
          <h2 className="text-sm md:text-xl font-black tracking-tighter uppercase">ΞVOS Control</h2>
          <div className={`w-2 h-2 rounded-full ${firebaseEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>
        <div className="flex space-x-3 md:space-x-8 text-[9px] md:text-[10px] font-bold tracking-widest uppercase overflow-x-auto no-scrollbar whitespace-nowrap">
           <button onClick={() => setActiveTab('STATS')} className={`hover:text-gray-400 ${activeTab === 'STATS' ? 'text-white underline underline-offset-8' : 'text-gray-500'}`}>Stats</button>
           <button onClick={() => setActiveTab('PRODUCTS')} className={`hover:text-gray-400 ${activeTab === 'PRODUCTS' ? 'text-white underline underline-offset-8' : 'text-gray-500'}`}>Inventory</button>
           <button onClick={() => setActiveTab('MEDIA')} className={`hover:text-gray-400 ${activeTab === 'MEDIA' ? 'text-white underline underline-offset-8' : 'text-gray-500'}`}>Media Library</button>
           <button onClick={() => setActiveTab('ORDERS')} className={`hover:text-gray-400 ${activeTab === 'ORDERS' ? 'text-white underline underline-offset-8' : 'text-gray-500'}`}>Orders</button>
           <button onClick={handleLogout} className="text-red-400 flex items-center"><LogOut size={12} className="mr-1" /> Logout</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {activeTab === 'STATS' && (
          <div className="space-y-8 md:space-y-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
               <div className="bg-white p-4 md:p-8 shadow-sm">
                  <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 md:mb-4">Revenue</p>
                  <p className="text-lg md:text-3xl font-black">{orders.reduce((s,o) => s+o.total, 0)} EGP</p>
               </div>
               <div className="bg-white p-4 md:p-8 shadow-sm">
                  <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 md:mb-4">Orders</p>
                  <p className="text-lg md:text-3xl font-black">{orders.length}</p>
               </div>
               <div className="bg-white p-4 md:p-8 shadow-sm">
                  <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 md:mb-4">Inventory</p>
                  <p className="text-lg md:text-3xl font-black">{products.length}</p>
               </div>
               <div className="bg-white p-4 md:p-8 shadow-sm">
                  <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 md:mb-4">Media</p>
                  <p className="text-lg md:text-3xl font-black">{mediaLibrary.length}</p>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'PRODUCTS' && (
          <div className="space-y-8">
            <div className="flex justify-between items-end">
               <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">Inventory</h2>
               <button onClick={() => { setEditingProduct(null); setFormData({name:'', price:0, category:'HOODIES', description:'', discount:0, isSoldOut:false, sizes:[{label:'S', isAvailable:true}, {label:'M', isAvailable:true}, {label:'L', isAvailable:true}, {label:'XL', isAvailable:true}]}); setSelectedImages([]); setShowAddForm(true); }} className="bg-black text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest flex items-center">
                 <Plus size={14} className="mr-2" /> Launch Drop
               </button>
            </div>

            {showAddForm && (
              <div className="bg-white p-6 md:p-10 shadow-2xl border-l-8 border-black animate-slideUp">
                <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="md:col-span-2 flex justify-between items-center border-b pb-4">
                     <h3 className="text-[10px] font-black uppercase tracking-widest">{editingProduct ? 'Edit Piece' : 'Product Configuration'}</h3>
                     <button type="button" onClick={() => { setShowAddForm(false); setEditingProduct(null); }} className="text-red-500 text-[8px] font-black uppercase">Cancel</button>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Name</label>
                    <input required className="w-full bg-gray-50 p-3 text-[11px] outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value.toUpperCase()})} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Price (EGP)</label>
                    <input required type="number" className="w-full bg-gray-50 p-3 text-[11px] outline-none" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Discount Percentage (%)</label>
                    <div className="relative">
                      <Percent size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="number" min="0" max="100" className="w-full bg-gray-50 p-3 pr-10 text-[11px] outline-none" value={formData.discount} onChange={e => setFormData({...formData, discount: Number(e.target.value)})} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Sizes Availability</label>
                    <div className="flex flex-wrap gap-2">
                      {formData.sizes.map(size => (
                        <button
                          key={size.label}
                          type="button"
                          onClick={() => handleSizeToggle(size.label)}
                          className={`px-4 py-2 text-[10px] font-black border transition-colors ${size.isAvailable ? 'bg-black text-white border-black' : 'bg-gray-50 text-gray-300 border-gray-100 line-through'}`}
                        >
                          {size.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <label className="flex items-center space-x-3 cursor-pointer p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                      <input type="checkbox" checked={formData.isSoldOut} onChange={e => setFormData({...formData, isSoldOut: e.target.checked})} className="accent-black w-4 h-4" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Mark as Sold Out</span>
                    </label>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Product Media</label>
                      <button type="button" onClick={() => setShowMediaPicker(!showMediaPicker)} className="text-[9px] font-black text-blue-600 uppercase flex items-center">
                        <FolderOpen size={12} className="mr-1" /> Choose from Library
                      </button>
                    </div>
                    
                    {showMediaPicker && (
                      <div className="bg-gray-50 p-4 border border-gray-200 grid grid-cols-4 md:grid-cols-8 gap-2 mb-4 max-h-48 overflow-y-auto no-scrollbar">
                        {mediaLibrary.map((img, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => toggleImageSelection(img)}
                            className={`relative aspect-[3/4] cursor-pointer overflow-hidden border-2 transition-all ${selectedImages.includes(img) ? 'border-black' : 'border-transparent'}`}
                          >
                            <img src={img} className="w-full h-full object-cover" />
                            {selectedImages.includes(img) && (
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <CheckCircle2 size={16} className="text-white" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                      {selectedImages.map((img, idx) => (
                        <div key={idx} className="relative aspect-[3/4] bg-gray-100 group">
                          <img src={img} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeSelectedImage(idx)} className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={10} /></button>
                        </div>
                      ))}
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="aspect-[3/4] border border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-black hover:text-black">
                        <UploadCloud size={20} />
                      </button>
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*" onChange={(e) => handleFileChange(e, 'FORM')} />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Description</label>
                    <textarea required className="w-full bg-gray-50 p-3 text-[11px] outline-none h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                  </div>

                  <button type="submit" className="bg-black text-white py-4 font-black uppercase tracking-widest text-xs md:col-span-2 hover:bg-gray-800 flex items-center justify-center">
                    <Save size={16} className="mr-2" /> {editingProduct ? 'Save Changes' : 'Launch Piece'}
                  </button>
                </form>
              </div>
            )}

            <div className="bg-white shadow-sm overflow-x-auto no-scrollbar">
               <table className="w-full text-left min-w-[700px]">
                 <thead className="bg-black text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                   <tr>
                     <th className="p-4 md:p-6">Item</th>
                     <th className="p-4 md:p-6">Price / Sale</th>
                     <th className="p-4 md:p-6">Status</th>
                     <th className="p-4 md:p-6">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {products.map(p => (
                     <tr key={p.id} className={`text-[10px] md:text-xs ${p.isSoldOut ? 'bg-gray-50/50' : ''}`}>
                       <td className="p-4 md:p-6 flex items-center">
                         <img src={p.images[0]} className="w-10 h-14 object-cover mr-4" />
                         <div>
                            <span className="font-black uppercase block">{p.name}</span>
                            <span className="text-[8px] text-gray-400 uppercase tracking-widest">{p.category}</span>
                         </div>
                       </td>
                       <td className="p-4 md:p-6">
                         <div className="font-bold">{p.price} EGP</div>
                         {p.discount && <div className="text-red-600 font-black">-{p.discount}% OFF</div>}
                       </td>
                       <td className="p-4 md:p-6">
                          <button 
                            onClick={() => toggleSoldOut(p)}
                            className={`flex items-center space-x-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${p.isSoldOut ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}
                          >
                            {p.isSoldOut ? <Ban size={10} /> : <CheckCircle size={10} />}
                            <span>{p.isSoldOut ? 'Sold Out' : 'Available'}</span>
                          </button>
                       </td>
                       <td className="p-4 md:p-6">
                         <div className="flex items-center space-x-4">
                            <button onClick={() => startEdit(p)} className="text-gray-400 hover:text-black transition-colors">
                                <Edit3 size={16} />
                            </button>
                            <button onClick={() => deleteProduct(p.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <Trash2 size={16} />
                            </button>
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
          </div>
        )}

        {activeTab === 'MEDIA' && (
          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">Media Library</h2>
              <button onClick={() => mediaTabFileInputRef.current?.click()} className="bg-black text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest flex items-center">
                <UploadCloud size={14} className="mr-2" /> Add Real Images
              </button>
            </div>
            <input type="file" ref={mediaTabFileInputRef} className="hidden" multiple accept="image/*" onChange={(e) => handleFileChange(e, 'LIBRARY')} />
            
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
              {mediaLibrary.map((img, idx) => (
                <div key={idx} className="relative aspect-[3/4] group bg-gray-100 overflow-hidden">
                  <img src={img} className="w-full h-full object-cover" />
                  <button onClick={() => deleteFromLibrary(img)} className="absolute top-1 right-1 bg-white/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ORDERS' && (
           <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">Order History</h2>
              <div className="bg-white shadow-sm overflow-x-auto">
                 <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-black text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                       <tr>
                          <th className="p-4 md:p-6">Order ID</th>
                          <th className="p-4 md:p-6">Customer</th>
                          <th className="p-4 md:p-6">Amount</th>
                          <th className="p-4 md:p-6">Payment</th>
                          <th className="p-4 md:p-6">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                       {orders.map(o => (
                          <tr key={o.id} className="text-[10px] md:text-xs">
                             <td className="p-4 md:p-6 font-black">#{o.id}</td>
                             <td className="p-4 md:p-6">
                                <div className="font-bold">{o.customer.name}</div>
                                <div className="text-[8px] text-gray-400">{o.customer.phone}</div>
                             </td>
                             <td className="p-4 md:p-6 font-bold">{o.total} EGP</td>
                             <td className="p-4 md:p-6 font-bold uppercase tracking-widest text-[9px]">{o.paymentMethod}</td>
                             <td className="p-4 md:p-6">
                                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">{o.status}</span>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
