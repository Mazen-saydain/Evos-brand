import React, { useState } from 'react';
import { MessageSquare, Mail, MapPin, Instagram, Facebook } from 'lucide-react';
import { CONTACT_INFO } from '../constants';
import { db } from './firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSend = async () => {
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);
    setSuccess('');

    try {
      await addDoc(collection(db, 'contact_messages'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setSuccess('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      setSuccess('Failed to send message. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
        {/* Left: Contact Info */}
        <div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6 leading-none">
            Connect <br /> With ΞVOS
          </h1>
          <p className="text-gray-500 text-sm md:text-base leading-loose mb-12 max-w-lg font-medium">
            Whether you have a question about our collections, need help with an order, or just want to join the culture, we are here for you.
          </p>

          <div className="space-y-6 md:space-y-8">
            <a href={CONTACT_INFO.whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center group">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-[#25D366] text-white flex items-center justify-center mr-6 group-hover:scale-110 transition-transform">
                <MessageSquare size={24} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">WhatsApp Support</p>
                <p className="font-bold uppercase tracking-tight text-sm md:text-base">{CONTACT_INFO.whatsapp}</p>
              </div>
            </a>

            <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center group">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-50 flex items-center justify-center mr-6 group-hover:bg-black group-hover:text-white transition-colors">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Email Connect</p>
                <p className="font-bold uppercase tracking-tight text-sm md:text-base">{CONTACT_INFO.email}</p>
              </div>
            </a>

            <div className="flex items-center">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-50 flex items-center justify-center mr-6">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Studio HQ</p>
                <p className="font-bold uppercase tracking-tight text-sm md:text-base">Cairo, Egypt</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Direct Message Form */}
        <div className="bg-gray-50 p-8 md:p-16">
          <h3 className="text-xl md:text-2xl font-black tracking-tighter uppercase mb-8">Direct Message</h3>

          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <div className="space-y-4">
              <input
                placeholder="FULL NAME"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white p-4 text-[11px] font-bold border-none outline-none focus:ring-1 focus:ring-black"
              />
              <input
                placeholder="EMAIL"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white p-4 text-[11px] font-bold border-none outline-none focus:ring-1 focus:ring-black"
              />
              <textarea
                placeholder="HOW CAN WE HELP?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-white p-4 text-[11px] font-bold border-none outline-none focus:ring-1 focus:ring-black min-h-[150px]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 font-black uppercase tracking-widest text-[10px] hover:bg-gray-800 transition-colors"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>

            {success && <p className="text-green-600 text-xs mt-2 font-bold">{success}</p>}
          </form>

          <div className="mt-12 flex space-x-6 justify-center md:justify-start">
            <a href={CONTACT_INFO.instagram} target="_blank" rel="noopener noreferrer" className="p-3 bg-white text-[#E4405F] rounded-full hover:scale-125 transition-transform shadow-sm">
              <Instagram size={20} />
            </a>
            <a href={CONTACT_INFO.facebook} target="_blank" rel="noopener noreferrer" className="p-3 bg-white text-[#1877F2] rounded-full hover:scale-125 transition-transform shadow-sm">
              <Facebook size={20} />
            </a>
            <a href={CONTACT_INFO.tiktok} target="_blank" rel="noopener noreferrer" className="p-3 bg-white text-black rounded-full hover:scale-125 transition-transform shadow-sm">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.33-.85.51-1.44 1.43-1.58 2.41-.14.99.19 2.07.9 2.81.91.95 2.35 1.28 3.56.77 1.2-.56 1.91-1.76 1.92-3.07.01-4.52 0-9.03.01-13.54z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
