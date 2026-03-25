import { useState, useRef } from 'react';
import { Gamepad2, X, Maximize2, Search, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestGameName, setRequestGameName] = useState('');
  const iframeContainerRef = useRef(null);

  const categories = ['All', ...new Set(gamesData.map(game => game.category))];

  const handleFullscreen = () => {
    if (iframeContainerRef.current) {
      if (iframeContainerRef.current.requestFullscreen) {
        iframeContainerRef.current.requestFullscreen();
      } else if (iframeContainerRef.current.webkitRequestFullscreen) {
        iframeContainerRef.current.webkitRequestFullscreen();
      } else if (iframeContainerRef.current.msRequestFullscreen) {
        iframeContainerRef.current.msRequestFullscreen();
      }
    }
  };

  const filteredGames = gamesData.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSendRequest = (e) => {
    e.preventDefault();
    const requestEmail = 'amay@bushfield.co.uk';
    const subject = encodeURIComponent(`Game Request: ${requestGameName}`);
    const body = encodeURIComponent(`I would like to request the following game:\n\nGame Name: ${requestGameName}\n\nSent from OBA Unblocked Games.`);
    
    // Outlook Web Compose URL
    const outlookUrl = `https://outlook.office.com/mail/deeplink/compose?to=${requestEmail}&subject=${subject}&body=${body}`;
    
    window.open(outlookUrl, '_blank');
    setIsRequestModalOpen(false);
    setRequestGameName('');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-purple-500 selection:text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.3)]">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">
              OBA UNBLOCKED<span className="text-purple-500">GAMES</span>
            </h1>
          </div>

          <div className="flex-1 max-w-md mx-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-purple-500 transition-colors" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium text-white/60">
            <button 
              onClick={() => setIsRequestModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-full transition-all cursor-pointer font-bold shadow-[0_0_15px_rgba(147,51,234,0.4)] flex items-center gap-2"
            >
              Request Game
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-12 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-purple-900/20 to-transparent opacity-50 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <h2 className="text-4xl sm:text-6xl font-black mb-4 tracking-tighter">
            PLAY WITHOUT <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">LIMITS</span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto text-lg">
            Access your favorite games anywhere. No blocks, no filters, just pure fun.
          </p>
        </motion.div>
      </header>

      {/* Games Grid */}
      <main className="max-w-7xl mx-auto px-4 pb-24">
        {/* Category Filters */}
        <div className="flex items-center gap-2 mb-12 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap cursor-pointer border ${
                selectedCategory === category
                  ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]'
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white hover:border-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              onClick={() => setSelectedGame(game)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 group-hover:border-purple-500/50 transition-all shadow-xl">
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-bold text-lg group-hover:text-purple-400 transition-colors">{game.title}</h3>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-purple-600 p-2 rounded-lg shadow-lg">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-24">
            <p className="text-white/40 text-xl">No games found matching your search.</p>
          </div>
        )}
      </main>

      {/* Game Modal */}
      <AnimatePresence>
        {isRequestModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-md bg-[#111] rounded-3xl p-8 border border-white/10 shadow-2xl relative"
            >
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                  <Send className="w-8 h-8 text-purple-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Request a Game</h2>
                <p className="text-white/40 text-sm">Tell us what you want to play next!</p>
              </div>

              <form onSubmit={handleSendRequest} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2 ml-1">
                    Game Name
                  </label>
                  <input
                    autoFocus
                    type="text"
                    required
                    placeholder="e.g. Minecraft, Slope, etc."
                    value={requestGameName}
                    onChange={(e) => setRequestGameName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] flex items-center justify-center gap-2 group"
                >
                  Send Request
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full h-full max-w-6xl bg-[#111] rounded-3xl overflow-hidden border border-white/10 flex flex-col shadow-2xl shadow-purple-500/10"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                    <Gamepad2 className="w-4 h-4" />
                  </div>
                  <h2 className="font-bold text-lg">{selectedGame.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedGame(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 bg-black relative" ref={iframeContainerRef}>
                <iframe
                  src={selectedGame.url}
                  className="w-full h-full border-none"
                  title={selectedGame.title}
                  allow="autoplay; fullscreen; keyboard-attach; accelerometer; gyroscope; gamepad; microphone; camera; midi; selection-copy; selection-paste"
                  allowFullScreen
                />
              </div>
              <div className="p-4 bg-white/5 flex items-center justify-between text-sm text-white/40">
                <p>Playing: {selectedGame.title}</p>
                <div className="flex gap-4">
                  <button className="hover:text-white transition-colors cursor-pointer">Report Issue</button>
                  <button 
                    onClick={handleFullscreen}
                    className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Maximize2 className="w-4 h-4" />
                    Full Screen
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <Gamepad2 className="w-5 h-5" />
            <span className="font-bold uppercase tracking-tight">OBA Unblocked Games</span>
          </div>
          <div className="flex gap-8 text-sm text-white/40">
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <button 
              onClick={() => setIsRequestModalOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Request a Game
            </button>
            <a href="#" className="hover:text-white transition-colors">Contact Us</a>
          </div>
          <p className="text-sm text-white/20">© 2026 Unblocked Games Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
