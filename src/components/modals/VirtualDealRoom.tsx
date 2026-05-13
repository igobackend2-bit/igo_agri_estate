import React, { useState } from 'react';
import { Lock, FileText, Shield, CheckCircle, Download, FileSignature } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VirtualDealRoom: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleUnlock = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      setIsUnlocked(true);
    }, 1500); // Simulate biometric/MFA auth
  };

  const documents = [
    { name: 'Soil Quality & Agronomy Report.pdf', size: '4.2 MB', type: 'PDF', status: 'Verified' },
    { name: 'Title Deed & Land Registry.pdf', size: '12.8 MB', type: 'PDF', status: 'Verified' },
    { name: 'Water Rights & Usage License.pdf', size: '2.1 MB', type: 'PDF', status: 'Verified' },
    { name: 'Historical Yield Data (2018-2025).csv', size: '850 KB', type: 'CSV', status: 'Verified' },
    { name: 'Environmental Impact Assessment.pdf', size: '8.5 MB', type: 'PDF', status: 'Verified' }
  ];

  const downloadDocument = (docName: string) => {
    const content = [
      `IGO Secure Deal Room`,
      `Document: ${docName}`,
      `Status: Verified`,
      ``,
      `This preview file confirms that the requested due diligence document is available in the buyer vault.`,
      `A signed copy should be requested from the legal desk before transaction execution.`,
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = docName.replace(/\.[^/.]+$/, '.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-[40px] border border-black/5 shadow-xl overflow-hidden relative">
      <div className="p-8 border-b border-black/5 bg-gray-50 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold flex items-center">
            <Shield size={24} className="text-primary mr-3" />
            Virtual Deal Room
          </h3>
          <p className="text-text-muted text-sm mt-1">Secure Due Diligence Document Vault</p>
        </div>
        {!isUnlocked && (
          <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center border border-red-100">
            <Lock size={16} className="mr-2" />
            LOCKED
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div 
            key="locked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-16 flex flex-col items-center justify-center text-center bg-gray-50/50"
          >
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 relative">
              <Lock size={40} className="text-primary" />
              {isAuthenticating && (
                <div className="absolute inset-0 border-4 border-t-secondary rounded-full animate-spin"></div>
              )}
            </div>
            <h4 className="text-xl font-bold mb-2">Restricted Access</h4>
            <p className="text-text-muted max-w-md mb-8">
              Legal documents, title deeds, and comprehensive agronomy reports are restricted to verified investors only.
            </p>
            <button 
              onClick={handleUnlock}
              disabled={isAuthenticating}
              className="bg-primary text-white px-8 py-3 rounded-2xl font-bold hover:bg-primary-light transition-all flex items-center space-x-2"
            >
              {isAuthenticating ? (
                <span>Verifying Identity...</span>
              ) : (
                <>
                  <FileSignature size={18} />
                  <span>Authenticate to Unlock</span>
                </>
              )}
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="unlocked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 bg-white"
          >
            <div className="bg-green-50 text-green-700 px-4 py-3 rounded-2xl text-sm font-bold flex items-center mb-6 border border-green-100">
              <CheckCircle size={18} className="mr-2" />
              Identity verified. Access granted to confidential documents.
            </div>
            
            <div className="space-y-3">
              {documents.map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-black/5 hover:border-primary/20 hover:shadow-md transition-all group">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-text-muted">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-gray-900 group-hover:text-primary transition-colors">{doc.name}</h5>
                      <div className="flex items-center text-xs text-gray-500 mt-1 space-x-3">
                        <span>{doc.size}</span>
                        <span className="flex items-center text-green-600 font-semibold">
                          <CheckCircle size={12} className="mr-1" />
                          {doc.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => downloadDocument(doc.name)}
                    className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    aria-label={`Download ${doc.name}`}
                  >
                    <Download size={18} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VirtualDealRoom;
