import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Sparkles, X, CheckCircle2, AlertCircle, Send, User } from 'lucide-react';

interface DocumentAssistantProps {
  propertyTitle?: string;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const DocumentAssistant: React.FC<DocumentAssistantProps> = ({ propertyTitle = "Selected Estate", isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: `Hello. I can help prepare a buyer document summary or draft discussion points for **${propertyTitle}**. You can ask about sale agreement terms, lease terms, water rights, ownership transfer, or managed-farm responsibilities.` }
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [draftReady, setDraftReady] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setIsGenerating(true);

    // Simulate AI thinking and drafting
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: `I have prepared a draft summary covering the requested terms, including ownership or lease structure, soil maintenance, water rights, farm access, and legal review requirements. The draft is ready for your review.`
      }]);
      setIsGenerating(false);
      setDraftReady(true);
    }, 2500);
  };

  const downloadDraft = () => {
    const content = [
      `Agricultural Agreement Working Draft`,
      `Property: ${propertyTitle}`,
      ``,
      `Recommended clauses:`,
      `- Lease term and renewal rights`,
      `- Revenue-share or fixed-rent structure`,
      `- Soil maintenance obligations`,
      `- Water rights and irrigation responsibility`,
      `- Exit, dispute, and inspection process`,
      ``,
      `This is a working draft and must be reviewed by a certified legal professional before execution.`,
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${propertyTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-agreement-draft.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          ></motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary p-8 text-white flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center">
                  <FileText size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Document Assistant</h3>
                  <p className="text-white/60 text-sm">Buyer document guidance</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col h-[600px]">
              {/* Chat Messages */}
              <div className="flex-1 p-6 overflow-y-auto bg-gray-50/50 space-y-6">
                {messages.map((msg, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start max-w-[80%] space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-secondary text-white shadow-lg'}`}>
                        {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                      </div>
                      <div className={`p-4 rounded-2xl text-sm ${
                        msg.role === 'user' 
                          ? 'bg-primary text-white rounded-tr-none' 
                          : 'bg-white border border-black/5 shadow-sm rounded-tl-none text-gray-800'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isGenerating && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="flex items-start max-w-[80%] space-x-3">
                      <div className="w-8 h-8 rounded-full bg-secondary text-white shadow-lg flex items-center justify-center mt-1">
                        <Sparkles size={16} />
                      </div>
                      <div className="p-4 rounded-2xl bg-white border border-black/5 shadow-sm rounded-tl-none flex space-x-2">
                        <div className="w-2 h-2 bg-secondary/50 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-secondary/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-secondary/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {draftReady && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="p-6 bg-white border border-secondary/20 rounded-3xl shadow-lg mt-6"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <CheckCircle2 size={24} className="text-green-500" />
                      <h4 className="font-bold text-lg">Agreement Draft Prepared</h4>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-start space-x-3 mb-6">
                      <AlertCircle size={18} className="text-orange-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-orange-800 leading-relaxed">
                        This is a working draft. It must be vetted by a certified legal professional before execution.
                      </p>
                    </div>
                    <button 
                      onClick={downloadDraft}
                      className="w-full bg-secondary text-white py-4 rounded-2xl font-bold hover:bg-secondary/90 transition-all flex items-center justify-center space-x-2"
                    >
                      <Download size={18} />
                      <span>Download Draft</span>
                    </button>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-6 bg-white border-t border-black/5">
                <div className="flex items-center space-x-4 bg-gray-50 border border-black/5 p-2 rounded-3xl">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="E.g., Draft a 5-year lease with 10% revenue share..."
                    className="flex-1 bg-transparent px-4 outline-none text-sm"
                    disabled={isGenerating || draftReady}
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!input.trim() || isGenerating || draftReady}
                    className="w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center hover:bg-primary-light disabled:opacity-50 transition-colors"
                  >
                    <Send size={18} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DocumentAssistant;
