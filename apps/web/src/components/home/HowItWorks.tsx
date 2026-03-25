import React from 'react';

export default function HowItWorks() {
  return (
    <section className="py-40 px-8 md:px-24 bg-[#131313] relative">
      <h2 className="font-['Public_Sans'] text-4xl font-bold mb-24 tracking-tighter uppercase text-white">The Mechanism</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border-t border-[#474747]/30">
        {/* Step 1 */}
        <div className="p-8 border-r border-[#474747]/30 min-h-[400px] flex flex-col group hover:bg-[#1b1b1b] transition-colors">
          <span className="font-['Inter'] text-[0.625rem] text-[#919191] mb-12">01 / ACCOUNT ABSTRACTION</span>
          <h3 className="font-['Public_Sans'] text-xl font-bold text-white mb-6 uppercase">Deploy your smart wallet</h3>
          <p className="font-['Inter'] text-sm text-[#c6c6c6] leading-relaxed mb-auto">
            Leverage Flow EVM for gasless transaction execution. Your corporate identity is established via a programmable smart account.
          </p>
          <div className="h-1 bg-[#474747]/20 w-full mt-8 group-hover:bg-[#ffffff] transition-colors"></div>
        </div>
        {/* Step 2 */}
        <div className="p-8 border-r border-[#474747]/30 min-h-[400px] flex flex-col group hover:bg-[#1b1b1b] transition-colors">
          <span className="font-['Inter'] text-[0.625rem] text-[#919191] mb-12">02 / METADATA INJECTION</span>
          <h3 className="font-['Public_Sans'] text-xl font-bold text-white mb-6 uppercase">Create payment with metadata</h3>
          <p className="font-['Inter'] text-sm text-[#c6c6c6] leading-relaxed mb-auto">
            Attach expense categories, tax identifiers, and jurisdiction data. All sensitive information is encrypted before reaching the mempool.
          </p>
          <div className="h-1 bg-[#474747]/20 w-full mt-8 group-hover:bg-[#ffffff] transition-colors"></div>
        </div>
        {/* Step 3 */}
        <div className="p-8 border-r border-[#474747]/30 min-h-[400px] flex flex-col group hover:bg-[#1b1b1b] transition-colors">
          <span className="font-['Inter'] text-[0.625rem] text-[#919191] mb-12">03 / CONFIDENTIAL EXECUTION</span>
          <h3 className="font-['Public_Sans'] text-xl font-bold text-white mb-6 uppercase">Record generation</h3>
          <p className="font-['Inter'] text-sm text-[#c6c6c6] leading-relaxed mb-auto">
            Payment executes via LayerZero. A compliance record is generated on Zama fhEVM, maintaining privacy while ensuring auditable integrity.
          </p>
          <div className="h-1 bg-[#474747]/20 w-full mt-8 group-hover:bg-[#ffffff] transition-colors"></div>
        </div>
        {/* Step 4 */}
        <div className="p-8 min-h-[400px] flex flex-col group hover:bg-[#1b1b1b] transition-colors">
          <span className="font-['Inter'] text-[0.625rem] text-[#919191] mb-12">04 / DETERMINISTIC AUDIT</span>
          <h3 className="font-['Public_Sans'] text-xl font-bold text-white mb-6 uppercase">Audit on demand</h3>
          <p className="font-['Inter'] text-sm text-[#c6c6c6] leading-relaxed mb-auto">
            Generate time-locked access keys for auditors. Verify compliance status instantly using EIP-712 cryptographic signatures.
          </p>
          <div className="h-1 bg-[#474747]/20 w-full mt-8 group-hover:bg-[#ffffff] transition-colors"></div>
        </div>
      </div>
    </section>
  );
}
