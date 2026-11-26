import { useState, useEffect } from 'react';
import ChatWidget from '../components/ChatWidget';
import toast from 'react-hot-toast';

export default function Katalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');

  const categories = ['Semua', 'Makanan Berat', 'Camilan', 'Minuman', 'Dessert'];

  useEffect(() => {
    // Ambil produk dari JSON statis
    fetch('/products.json')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'Semua' || (p.category && p.category.toLowerCase() === category.toLowerCase());
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-white w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg">🍜</div>
            <h1 className="text-xl font-extrabold text-dark tracking-tight">Kuliner UMKM</h1>
          </div>
        </div>
      </nav>

      <div className="bg-gradient-to-br from-primary to-orange-400 text-white py-16 px-6 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="bg-white/20 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-4 inline-block backdrop-blur-sm">
            Masakan Rumahan Asli
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            Lapar? Pesan Sekarang!
          </h2>
          <p className="text-lg md:text-xl opacity-90 mb-8 font-medium">
            Aneka makanan lezat dan minuman segar, dibuat fresh setiap hari langsung dari dapur kami.
          </p>
          
          <div className="bg-white p-2 rounded-2xl shadow-2xl flex items-center max-w-xl mx-auto">
            <span className="pl-4 text-gray-400">🔍</span>
            <input 
              type="text" 
              placeholder="Mau makan apa hari ini?" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 text-gray-800 bg-transparent focus:outline-none text-sm font-medium"
            />
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full p-6 -mt-8 relative z-20">
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
                category === cat 
                  ? 'bg-dark text-white shadow-md' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'
              }`}
            >
              {cat === 'Makanan Berat' && '🍛 '}
              {cat === 'Camilan' && '🍟 '}
              {cat === 'Minuman' && '🥤 '}
              {cat === 'Dessert' && '🍰 '}
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500 font-medium animate-pulse">Menyiapkan menu lezat...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <span className="text-6xl mb-4 block">🍽️</span>
            <h3 className="text-xl font-bold text-dark">Menu Tidak Ditemukan</h3>
            <p className="text-gray-500 mt-2">Coba cari dengan kata kunci lain.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map(p => (
              <div key={p.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 group flex flex-col overflow-hidden">
                <div className="relative overflow-hidden aspect-square">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-orange-50 flex items-center justify-center text-6xl">🍲</div>
                  )}
                  
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-bold text-primary shadow-sm">
                    Sisa {p.stock}
                  </div>
                </div>
                
                <div className="p-4 flex-1 flex flex-col">
                  <span className="text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">{p.category || 'Kuliner'}</span>
                  <h4 className="font-bold text-dark text-base leading-tight mb-1 line-clamp-2">{p.name}</h4>
                  <p className="text-xs text-gray-500 mb-4 line-clamp-2 flex-1">{p.description}</p>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-lg font-extrabold text-dark">
                        Rp {p.price.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <button 
                      onClick={() => toast('Pemesanan via WhatsApp akan segera hadir!', { icon: '🛒' })}
                      className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-primaryHover transition-colors shadow-lg shadow-primary/30"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-100 py-10 mt-10">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p className="font-extrabold text-dark text-lg mb-2">Kuliner UMKM 🍜</p>
          <p>&copy; {new Date().getFullYear()} - Dibuat dengan cinta untuk pelanggan setia.</p>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}