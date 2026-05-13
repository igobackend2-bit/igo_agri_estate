import React from 'react';
import { motion } from 'framer-motion';
import { Link2, ShieldCheck, Cpu, ChevronRight, Hash, Copy } from 'lucide-react';

interface BlockchainLedgerProps {
  propertyTitle?: string;
  contractAddress?: string;
}

const BlockchainLedger: React.FC<BlockchainLedgerProps> = ({ 
  propertyTitle = "Estate", 
  contractAddress = "0x8f2A...c914" 
}) => {
  const transactions = [
    { type: 'Fractional Sale', hash: '0x1a...f92', from: 'IGO Treasury', to: '0x4b...1a8', amount: '2 Shares', time: '14 mins ago' },
    { type: 'Fractional Sale', hash: '0x9c...3a1', from: 'IGO Treasury', to: '0x2f...9c4', amount: '10 Shares', time: '1 hour ago' },
    { type: 'Smart Contract Audit', hash: '0x4f...b88', from: 'CertiK', to: 'Contract', amount: 'Verified', time: '2 days ago' },
    { type: 'Token Minting', hash: '0x7d...e22', from: 'Genesis', to: 'IGO Treasury', amount: '100 Shares', time: '3 days ago' },
    { type: 'Title Deed Hash', hash: '0x3e...11c', from: 'Land Registry', to: 'Contract', amount: 'Immutable', time: '3 days ago' },
  ];

  return (
    <div className="bg-slate-900 rounded-[40px] p-8 border border-slate-800 shadow-2xl mt-12 text-slate-300 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                <Link2 className="text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Immutable Ledger</h3>
            </div>
            <p className="text-sm text-slate-400">Polygon Blockchain verification for {propertyTitle}</p>
          </div>
          
          <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 flex items-center space-x-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Smart Contract</p>
              <p className="text-sm font-mono text-indigo-300 flex items-center">
                {contractAddress}
                <button className="ml-2 hover:text-white transition-colors"><Copy size={12} /></button>
              </p>
            </div>
            <div className="w-px h-8 bg-slate-700"></div>
            <div className="flex items-center space-x-2 text-emerald-400">
              <ShieldCheck size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Audited</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 rounded-3xl border border-slate-800/50 overflow-hidden">
          <div className="grid grid-cols-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-900 p-4 border-b border-slate-800">
            <div className="col-span-1">Action</div>
            <div className="col-span-1">Txn Hash</div>
            <div className="col-span-2">Transfer</div>
            <div className="col-span-1 text-right">Time</div>
          </div>
          
          <div className="divide-y divide-slate-800/50">
            {transactions.map((tx, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                key={i} 
                className="grid grid-cols-5 items-center p-4 hover:bg-slate-800/30 transition-colors text-sm group"
              >
                <div className="col-span-1 flex items-center space-x-2 text-white">
                  <Cpu size={14} className="text-indigo-400" />
                  <span>{tx.type}</span>
                </div>
                <div className="col-span-1 font-mono text-indigo-300 flex items-center">
                  <Hash size={12} className="mr-1 text-slate-600" />
                  {tx.hash}
                </div>
                <div className="col-span-2 flex items-center space-x-3 text-slate-400">
                  <span className="font-mono">{tx.from}</span>
                  <ChevronRight size={14} className="text-slate-600" />
                  <span className="font-mono">{tx.to}</span>
                  <span className="px-2 py-0.5 bg-slate-800 text-[10px] font-bold rounded-md text-white border border-slate-700 ml-2">
                    {tx.amount}
                  </span>
                </div>
                <div className="col-span-1 text-right text-xs text-slate-500">
                  {tx.time}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainLedger;
