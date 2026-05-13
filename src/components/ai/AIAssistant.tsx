import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles, ChevronDown } from 'lucide-react';
import { getGeneralAdvice, ChatMessage } from '../../lib/aiService';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hello! I can help you buy or sell Agri Estates. Ask about land categories, site visit, legal checks, posting a property, or buyer requirements." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    
    setIsTyping(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const response = getGeneralAdvice(userMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white rounded-[32px] shadow-2xl border border-black/5 w-[400px] max-w-[calc(100vw-2rem)] overflow-hidden mb-6 flex flex-col h-[600px]"
          >
            {/* Header */}
            <div className="bg-primary p-6 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-secondary rounded-2xl flex items-center justify-center">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold">IGO Investment AI</h4>
                  <p className="text-xs text-white/60 flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                    Online & Ready
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-hide bg-gray-50"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user' ? 'bg-secondary ml-2' : 'bg-primary mr-2'
                    }`}>
                      {msg.role === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-secondary text-white rounded-tr-none' 
                        : 'bg-white text-primary border border-black/5 shadow-sm rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}

              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {[
                    "I want to buy land",
                    "I want to sell land",
                    "What details are needed?",
                    "Legal verification process"
                  ].map((chip, i) => (
                    <button 
                      key={i}
                      onClick={() => setInput(chip)}
                      className="px-4 py-2 bg-white border border-primary/10 rounded-full text-[10px] font-bold text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-black/5 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 bg-primary/20 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-primary/20 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary/20 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-black/5">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about buying or selling land..."
                  className="w-full bg-gray-50 border border-black/5 rounded-2xl py-4 pl-6 pr-14 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                />
                <button 
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center disabled:opacity-50 transition-all hover:bg-primary-light"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[10px] text-text-muted mt-3 text-center uppercase tracking-widest font-bold">
                Powered by IGO Agri-LLM
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {isOpen ? <ChevronDown size={32} className="relative z-10" /> : <MessageSquare size={32} className="relative z-10" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary border-4 border-background rounded-full"></span>
        )}
      </motion.button>
    </div>
  );
};

export default AIAssistant;
