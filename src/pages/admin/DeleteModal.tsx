import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, X, AlertTriangle } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  estateName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, estateName, onConfirm, onCancel }) => {
  const [input, setInput] = useState('');
  const confirmed = input.trim().toLowerCase() === 'delete';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl z-10"
          >
            <button onClick={onCancel} className="absolute top-6 right-6 p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <X size={20} />
            </button>
            <div className="w-16 h-16 bg-red-50 rounded-[24px] flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-primary text-center uppercase tracking-tighter mb-2">Confirm Delete</h2>
            <p className="text-text-muted text-sm text-center mb-6">
              This will <strong>permanently remove</strong> the estate from the website immediately.
            </p>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6">
              <p className="text-xs font-bold text-red-600 text-center">{estateName}</p>
            </div>
            <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">
              Type <span className="text-red-500 font-black">delete</span> to confirm
            </label>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="delete"
              autoFocus
              className="w-full bg-gray-50 border border-black/10 rounded-2xl py-3 px-5 text-sm font-bold mb-6 focus:ring-2 focus:ring-red-300 outline-none"
            />
            <div className="flex gap-3">
              <button onClick={onCancel} className="flex-1 py-3 rounded-2xl border border-black/10 font-black text-sm uppercase tracking-widest hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button
                onClick={() => { if (confirmed) { onConfirm(); setInput(''); } }}
                disabled={!confirmed}
                className={`flex-1 py-3 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                  confirmed ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Trash2 size={16} />
                Delete Estate
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteModal;
