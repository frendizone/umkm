import { useState, useEffect } from 'react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ 
    sender: 'bot', 
    text: 'Halo Kak! Selamat datang di Kuliner UMKM 🍽️. Ada yang bisa saya bantu?' 
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [faqs, setFaqs] = useState([]);

  // Load FAQ dari file JSON publik
  useEffect(() => {
    fetch('/faqs.json')
      .then(res => res.json())
      .then(data => setFaqs(data))
      .catch(err => console.error("Gagal memuat FAQ", err));
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    // Simulasi loading sebentar
    setTimeout(() => {
      const lowerMsg = userMsg.toLowerCase();
      let bestMatch = null;
      let highestScore = 0;

      // Pencarian kata kunci sederhana
      faqs.forEach(faq => {
        const lowerFaq = faq.question.toLowerCase();
        let score = 0;
        lowerMsg.split(' ').forEach(word => {
          if (word.length > 2 && lowerFaq.includes(word)) score++;
        });

        if (score > highestScore) {
          highestScore = score;
          bestMatch = faq;
        }
      });

      if (bestMatch && highestScore > 0) {
        setMessages(prev => [...prev, { sender: 'bot', text: bestMatch.answer }]);
      } else {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Mohon maaf Kak, saya belum tahu jawabannya. Silakan hubungi admin via WhatsApp ya 🙏' }]);
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="bg-white w-80 sm:w-[360px] rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-4 flex flex-col" style={{ height: '500px' }}>
          <div className="bg-primary text-white p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl backdrop-blur-sm">🧑‍🍳</div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">Pelayan Virtual</h3>
                <p className="text-[10px] opacity-90 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Siap melayani
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white bg-white/10 w-8 h-8 rounded-full flex items-center justify-center">✕</button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-[#F8F9FA] flex flex-col gap-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex-shrink-0 flex items-center justify-center mr-2 shadow-sm">🧑‍🍳</div>
                )}
                <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex-shrink-0 flex items-center justify-center mr-2 shadow-sm">🧑‍🍳</div>
                <div className="bg-white border border-gray-100 p-3.5 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
                  <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
            <input 
              type="text" 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Ketik pertanyaan Kak..." 
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
            />
            <button 
              type="submit" 
              disabled={loading} 
              className="bg-primary text-white w-11 h-11 rounded-full flex items-center justify-center hover:bg-primaryHover transition-colors disabled:opacity-50 shadow-lg shadow-primary/30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="bg-primary text-white w-16 h-16 rounded-full shadow-2xl shadow-primary/40 hover:bg-primaryHover flex items-center justify-center ml-auto transition-transform hover:scale-105 active:scale-95"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </div>
  );
}