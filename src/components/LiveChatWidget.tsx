import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Phone, Mail } from 'lucide-react';

const LiveChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: "Hello! 👋 I'm IGO's virtual assistant. How can I help you today?\n\nYou can ask about:\n- Estate types & pricing\n- Investment returns\n- Site visits\n- Legal process", time: '10:00 AM' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const quickReplies = [
    'Tell me about ROI',
    'Schedule a site visit',
    'Compare estates',
    'Contact human agent'
  ];

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    
    // User message
    const userMsg = { id: Date.now(), sender: 'user' as const, text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setMessage('');

    // Simulate bot typing and response
    setIsTyping(true);
    setTimeout(() => {
      let response = "I'll connect you with our estate advisor for detailed information.";
      if (text.toLowerCase().includes('roi') || text.toLowerCase().includes('return')) {
        response = "Average ROI across our estates ranges from 12-18% annually, varying by crop cycle and estate type. Would you like a detailed projection for a specific estate?";
      } else if (text.toLowerCase().includes('visit') || text.toLowerCase().includes('site')) {
        response = "We arrange site visits across all our estate locations. Please share your preferred state and date, and our team will coordinate.";
      } else if (text.toLowerCase().includes('compare') || text.toLowerCase().includes('difference')) {
        response = "I can help compare estates. Which types are you considering? Eg: Polyhouse vs Hydroponic vs Open Cultivation?";
      } else if (text.toLowerCase().includes('human') || text.toLowerCase().includes('agent') || text.toLowerCase().includes('person')) {
        response = "Transferring you to a human agent... Please call +91 8376883780 or email info@igoagritechfarms.com";
      }
      
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot' as const, text: response, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(message);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'bg-red-500 text-white rotate-90' : 'bg-secondary text-primary'
        }`}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-8 z-50 w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-white rounded-[40px] shadow-2xl border border-black/10 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-secondary to-primary p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">IGO Assistant</h3>
                  <p className="text-xs opacity-80">Typically replies instantly</p>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-secondary text-primary rounded-br-none'
                      : 'bg-white text-primary rounded-bl-none border border-black/5'
                  }`}>
                    <div className="flex items-start gap-2">
                      {msg.sender === 'bot' && <Bot size={16} className="mt-1 text-secondary" />}
                      <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                      {msg.sender === 'user' && <User size={16} className="mt-1 text-white/80" />}
                    </div>
                    <p className="text-[10px] opacity-60 mt-2 text-right">{msg.time}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-black/5">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Replies */}
            <div className="px-6 py-3 border-t border-black/5 bg-white flex gap-2 overflow-x-auto pb-3">
              {quickReplies.map((reply, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(reply)}
                  className="px-4 py-2 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider rounded-full whitespace-nowrap hover:bg-primary hover:text-white transition-all"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-black/5 bg-white flex gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-50 rounded-full px-5 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-secondary/20"
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className="w-12 h-12 bg-secondary text-primary rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary hover:text-white transition-all"
              >
                <Send size={18} />
              </button>
            </form>

            {/* Contact fallback */}
            <div className="px-6 py-3 bg-black/5 border-t border-black/5 flex justify-between items-center">
              <a href="tel:+918376883780" className="flex items-center gap-2 text-xs text-primary hover:text-secondary">
                <Phone size={14} /> Call: +91 8376883780
              </a>
              <a href="mailto:info@igoagritechfarms.com" className="flex items-center gap-2 text-xs text-primary hover:text-secondary">
                <Mail size={14} /> Email
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LiveChatWidget;
