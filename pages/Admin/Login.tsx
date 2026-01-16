import React, { useState } from 'react';
import { ShieldAlert, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../App';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setIsLoggedIn, firebaseEnabled } = useApp();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (firebaseEnabled) {
      try {
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, email, password);

        localStorage.setItem('evos_admin_session', 'active');
        setIsLoggedIn(true);
      } catch (err: any) {
        console.error(err);
        setError(err.message.toUpperCase());
        setLoading(false);
      }
    } else {
      setTimeout(() => {
        if (email.toLowerCase() === 'admin@evos.com' && password === 'evos2024') {
          localStorage.setItem('evos_admin_session', 'active');
          setIsLoggedIn(true);
        } else {
          setError('INVALID CREDENTIALS. LINK FIREBASE FOR REAL CLOUD AUTH.');
          setLoading(false);
        }
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full p-8 md:p-12 border border-black/5 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-black/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-black/5 rounded-full blur-3xl"></div>

        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black text-white mb-6 transform hover:rotate-12 transition-transform">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-2">Owner Panel</h1>
          <p className="text-gray-400 text-[10px] font-black tracking-[0.3em] uppercase">Authorized Access Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div className="space-y-4">
            <div className="relative group">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" />
              <input 
                required 
                type="email"
                placeholder="EMAIL@EVOSBRAND.COM" 
                className="w-full bg-gray-50 border-none pl-12 pr-4 py-4 text-[10px] font-black tracking-widest outline-none focus:ring-1 focus:ring-black transition-all" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            
            <div className="relative group">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" />
              <input 
                required 
                type={showPassword ? 'text' : 'password'}
                placeholder="PASSWORD" 
                className="w-full bg-gray-50 border-none pl-12 pr-12 py-4 text-[10px] font-black tracking-widest outline-none focus:ring-1 focus:ring-black transition-all" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <p className="text-[8px] font-black text-red-600 bg-red-50 p-2 text-center tracking-widest leading-relaxed">{error}</p>}

          <button 
            disabled={loading}
            className="w-full bg-black text-white py-5 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-gray-800 transition-all flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-150"></div>
              </div>
            ) : 'Secure Sign In'}
          </button>
        </form>
        
        <p className="mt-8 text-center text-[8px] font-black text-gray-300 uppercase tracking-widest leading-relaxed">
          ΞVOS Cloud Sync Engine v4.0.0
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
