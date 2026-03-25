import React from 'react';

export default function Features() {
  return (
    <section className="py-32 px-8 md:px-24 bg-[#0e0e0e]">
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div className="max-w-xl">
          <h2 className="font-['Inter'] text-[0.6875rem] uppercase tracking-[0.2em] text-[#919191] mb-4">Core Capabilities</h2>
          <p className="font-['Public_Sans'] text-3xl font-bold text-white tracking-tight uppercase">Built for real business operations</p>
        </div>
        <div className="text-right">
          <span className="font-['Inter'] text-[0.6875rem] text-[#474747] uppercase">Release v1.0.4-alpha</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5 bg-[#474747]/20">
        <div className="bg-[#0E0E0E] p-10 group hover:bg-[#1f1f1f] transition-all">
          <div className="w-2 h-2 bg-[#ffffff] mb-8"></div>
          <h4 className="font-['Public_Sans'] text-lg font-bold text-white mb-4 uppercase">Gasless smart accounts</h4>
          <p className="font-['Inter'] text-sm text-[#c6c6c6] leading-relaxed">Remove the friction of seed phrase management and gas replenishment for non-technical employees.</p>
        </div>
        <div className="bg-[#0E0E0E] p-10 group hover:bg-[#1f1f1f] transition-all">
          <div className="w-2 h-2 bg-[#ffffff] mb-8"></div>
          <h4 className="font-['Public_Sans'] text-lg font-bold text-white mb-4 uppercase">Scheduled payments</h4>
          <p className="font-['Inter'] text-sm text-[#c6c6c6] leading-relaxed">Automate payroll and recurring vendor invoices with deterministic execution logic.</p>
        </div>
        <div className="bg-[#0E0E0E] p-10 group hover:bg-[#1f1f1f] transition-all">
          <div className="w-2 h-2 bg-[#ffffff] mb-8"></div>
          <h4 className="font-['Public_Sans'] text-lg font-bold text-white mb-4 uppercase">Encrypted records</h4>
          <p className="font-['Inter'] text-sm text-[#c6c6c6] leading-relaxed">Sensitive business intelligence is protected by FHE, only visible to authorized entities.</p>
        </div>
        <div className="bg-[#0E0E0E] p-10 group hover:bg-[#1f1f1f] transition-all">
          <div className="w-2 h-2 bg-[#ffffff] mb-8"></div>
          <h4 className="font-['Public_Sans'] text-lg font-bold text-white mb-4 uppercase">Deterministic audit links</h4>
          <p className="font-['Inter'] text-sm text-[#c6c6c6] leading-relaxed">Every transaction hash is cryptographically linked to its corresponding compliance manifest.</p>
        </div>
        <div className="bg-[#0E0E0E] p-10 group hover:bg-[#1f1f1f] transition-all">
          <div className="w-2 h-2 bg-[#ffffff] mb-8"></div>
          <h4 className="font-['Public_Sans'] text-lg font-bold text-white mb-4 uppercase">Granular access</h4>
          <p className="font-['Inter'] text-sm text-[#c6c6c6] leading-relaxed">Provision temporary viewing rights for specific data siloes without exposing the entire ledger.</p>
        </div>
        <div className="bg-[#0E0E0E] p-10 group hover:bg-[#1f1f1f] transition-all">
          <div className="w-2 h-2 bg-[#ffffff] mb-8"></div>
          <h4 className="font-['Public_Sans'] text-lg font-bold text-white mb-4 uppercase">Immutable tracking</h4>
          <p className="font-['Inter'] text-sm text-[#c6c6c6] leading-relaxed">Complete audit trails that meet the highest standards of financial reporting and transparency.</p>
        </div>
      </div>
    </section>
  );
}
