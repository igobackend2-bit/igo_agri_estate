import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BarChart3, ShieldCheck, AlertTriangle, TrendingUp, CheckCircle2, FileText, Loader2 } from 'lucide-react';
import { Property } from '../../types';

interface AIInvestmentReportProps {
  property: Property;
}

interface InvestmentReport {
  score: number;
  sentiment: string;
  analysis: string;
  strengths: string[];
  risks: string[];
  recommendation: string;
}

const AIInvestmentReport: React.FC<AIInvestmentReportProps> = ({ property }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<InvestmentReport | null>(null);

  const generateReport = () => {
    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      setReport({
        score: 88,
        sentiment: 'Suitable for Review',
        analysis: `"${property.title}" in ${property.location} is suitable for buyer review based on land size, access, estimated yield, and managed-farm potential. The quoted value of ${property.price} for ${property.size} should be reviewed along with local price-per-acre benchmarks and legal documents before token payment.`,
        strengths: ['High soil carbon content', 'Direct canal access', 'Clear 30-year title chain'],
        risks: ['Regional rainfall variability', 'Labor availability in peak season'],
        recommendation: 'Ideal for high-density horticulture or Bio-CNG feedstock cultivation.'
      });
      setIsGenerating(false);
    }, 2000);
  };

  const downloadReport = () => {
    if (!report) return;

    const content = [
      `IGO Agricultural Estate Land Advisory Report`,
      `Property: ${property.title}`,
      `Location: ${property.location}`,
      `Investment: ${property.price}`,
      `Land Area: ${property.size}`,
      `Estimated Yield: ${property.roi}`,
      ``,
      `Land Readiness Score: ${report.score}/100`,
      `Buyer View: ${report.sentiment}`,
      `Risk Profile: Low to Moderate`,
      ``,
      `Strategic Analysis`,
      report.analysis,
      ``,
      `Key Strengths`,
      ...report.strengths.map((item: string) => `- ${item}`),
      ``,
      `Risk Mitigants`,
      ...report.risks.map((item: string) => `- ${item}`),
      ``,
      `Recommendation`,
      report.recommendation,
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${property.id}-land-advisory-report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-[40px] border border-black/5 shadow-2xl overflow-hidden p-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-secondary">
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Land Advisory Report</h3>
            <p className="text-xs text-text-muted uppercase tracking-widest font-bold">Prepared by IGO Agri Tech Farms</p>
          </div>
        </div>
        
        {!report && !isGenerating && (
          <button 
            onClick={generateReport}
            className="btn-premium bg-primary text-white border-none py-4 px-8 rounded-2xl flex items-center space-x-3 shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all"
          >
            <BarChart3 size={18} />
            <span>Generate Advisory Report</span>
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-20 text-center space-y-6"
          >
            <Loader2 size={48} className="mx-auto text-secondary animate-spin" />
            <p className="text-primary font-bold animate-pulse uppercase tracking-[0.3em] text-xs">Reviewing land, documents, crop fit, and market position...</p>
          </motion.div>
        ) : report ? (
          <motion.div 
            key="report"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-[32px] text-center border border-black/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-4">Land Readiness Score</p>
                <div className="text-5xl font-black text-primary">{report.score}<span className="text-xl text-secondary">/100</span></div>
              </div>
              <div className="bg-emerald-50 p-6 rounded-[32px] text-center border border-emerald-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700/60 mb-4">Buyer View</p>
                <div className="text-2xl font-black text-emerald-700 uppercase tracking-tighter">{report.sentiment}</div>
              </div>
              <div className="bg-primary p-6 rounded-[32px] text-center text-white">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Risk Profile</p>
                <div className="text-2xl font-black uppercase tracking-tighter">Low to Moderate</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-bold flex items-center space-x-2">
                <TrendingUp size={20} className="text-secondary" />
                <span>Strategic Analysis</span>
              </h4>
              <p className="text-text-muted leading-relaxed font-light italic">
                "{report.analysis}"
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <h4 className="text-sm font-black uppercase tracking-widest text-primary flex items-center space-x-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>Key Strengths</span>
                </h4>
                <ul className="space-y-3">
                  {report.strengths.map((s: string, i: number) => (
                    <li key={i} className="text-sm text-text-muted flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-black uppercase tracking-widest text-primary flex items-center space-x-2">
                  <AlertTriangle size={16} className="text-orange-500" />
                  <span>Risk Mitigants</span>
                </h4>
                <ul className="space-y-3">
                  {report.risks.map((r: string, i: number) => (
                    <li key={i} className="text-sm text-text-muted flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center space-x-3">
                <ShieldCheck size={24} className="text-secondary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Prepared for buyer discussion</span>
              </div>
              <button
                onClick={downloadReport}
                className="flex items-center space-x-2 text-primary hover:text-secondary transition-colors font-bold uppercase text-[10px] tracking-widest"
              >
                <FileText size={18} />
                <span>Download Report</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="py-12 bg-gray-50 rounded-[32px] border border-dashed border-black/10 text-center">
            <p className="text-text-muted font-light">Generate a concise advisory report before discussing the property with the IGO team.</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIInvestmentReport;
