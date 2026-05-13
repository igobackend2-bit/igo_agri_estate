import React, { useState } from 'react';
import { Property } from '../../types';
import { IndianRupee, Percent, Calendar, Calculator } from 'lucide-react';

interface MortgageCalculatorProps {
  property: Property;
}

const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({ property }) => {
  const [downPayment, setDownPayment] = useState('20');
  const [interestRate, setInterestRate] = useState('9.5');
  const [loanTerm, setLoanTerm] = useState('20');
  const [manualPriceCr, setManualPriceCr] = useState(property.priceValue && property.priceValue > 0 ? property.priceValue.toString() : '1.25');
  const effectivePriceCr = parseFloat(manualPriceCr) || 0;


  const calculateEMI = () => {
    const totalPrice = effectivePriceCr * 10000000;

    const down = (parseFloat(downPayment) / 100) * totalPrice;
    const loanAmount = totalPrice - down;
    const monthlyRate = (parseFloat(interestRate) / 100) / 12;
    const months = parseFloat(loanTerm) * 12;

    if (loanAmount <= 0) return { emi: 0, totalInterest: 0, totalPayment: 0, downPaymentAmount: 0 };

    const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - loanAmount;

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      downPaymentAmount: Math.round(down)
    };
  };

  const { emi, totalInterest, totalPayment, downPaymentAmount } = calculateEMI();
  const hasPrice = effectivePriceCr > 0;

  // Estimate monthly rental income for comparison
  const estimatedRent = hasPrice ? effectivePriceCr * 0.05 * 10000000 / 12 : 0;

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-10">
        {/* Inputs */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Estate Price for Calculation (Cr)</label>
              {property.priceValue && property.priceValue > 0 && manualPriceCr !== property.priceValue.toString() && (
                <button 
                  onClick={() => setManualPriceCr(property.priceValue!.toString())}
                  className="text-[9px] font-black text-secondary uppercase tracking-widest border-b border-secondary hover:text-primary transition-colors"
                >
                  Reset to Actual
                </button>
              )}
            </div>
            <div className="relative">
              <IndianRupee size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary" />
              <input
                type="number"
                step="0.01"
                min="0"
                value={manualPriceCr}
                onChange={(e) => setManualPriceCr(e.target.value)}
                placeholder="e.g. 1.25"
                className="w-full bg-black/5 border-none rounded-2xl pl-14 pr-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Down Payment (%)</label>
            <div className="relative">
              <Percent size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary" />
              <input
                type="range"
                min="10"
                max="50"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                className="w-full h-3 bg-primary/10 rounded-full appearance-none cursor-pointer accent-secondary"
              />
              <div className="flex justify-between text-xs text-text-muted mt-2">
                <span>10%</span>
                <span className="font-black text-primary text-lg">{downPayment}%</span>
                <span>50%</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Interest Rate (% p.a.)</label>
            <div className="relative">
              <Percent size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary" />
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full bg-black/5 border-none rounded-2xl pl-14 pr-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Loan Tenure (Years)</label>
            <div className="relative">
              <Calendar size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary" />
              <input
                type="number"
                min="1"
                max="30"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                className="w-full bg-black/5 border-none rounded-2xl pl-14 pr-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-primary/5 rounded-[32px] p-8 border border-primary/10 relative">
          <div className="absolute top-6 right-6 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Calculator size={20} className="text-secondary" />
          </div>

          <h3 className="text-lg font-bold text-primary mb-6">Loan Summary</h3>

          <div className="space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-black/5">
              <span className="text-sm text-text-muted">Property Price</span>
              <span className="font-bold text-primary">{hasPrice ? `₹${effectivePriceCr.toFixed(2)} Cr` : 'Enter price to calculate'}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-black/5">
              <span className="text-sm text-text-muted">Down Payment</span>
              <span className="font-bold text-secondary">₹{(downPaymentAmount / 10000000).toFixed(2)} Cr</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-black/5">
              <span className="text-sm text-text-muted">Loan Amount</span>
              <span className="font-bold text-primary">₹{(totalPayment - totalInterest) / 10000000 > 0 ? ((totalPayment - totalInterest) / 10000000).toFixed(2) : '0.00'} Cr</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-black/5">
              <span className="text-sm text-text-muted">Total Interest</span>
              <span className="font-bold text-red-500">₹{(totalInterest / 10000000).toFixed(2)} Cr</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-base font-black uppercase tracking-wider text-primary">Monthly EMI</span>
              <span className="text-2xl font-black text-secondary">₹{emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>
          </div>

          {/* Rent vs Buy Comparison */}
          {estimatedRent > 0 && (
            <div className="mt-6 pt-6 border-t border-primary/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-3">Rent vs Buy</p>
              <div className="flex items-center justify-between bg-white rounded-xl p-4">
                <div>
                  <p className="text-[9px] text-text-muted uppercase">Est. Monthly Rent</p>
                  <p className="font-bold text-primary">₹{Math.round(estimatedRent).toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                  <span className="text-secondary text-lg font-black">vs</span>
                </div>
                <div>
                  <p className="text-[9px] text-text-muted uppercase">Your EMI</p>
                  <p className={`font-bold ${emi > estimatedRent ? 'text-red-500' : 'text-green-600'}`}>
                    ₹{emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="text-[10px] text-text-muted mt-6 text-center font-light">
        EMI calculation based on {loanTerm}-year term at {interestRate}% interest. Actual bank rates and eligibility may vary.
      </p>
    </div>
  );
};

export default MortgageCalculator;
