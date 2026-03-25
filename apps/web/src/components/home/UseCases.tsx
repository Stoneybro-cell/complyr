import React from 'react';

export default function UseCases() {
  return (
    <section className="py-32 px-8 md:px-24 bg-[#131313] border-y border-white/5">
      <div className="flex flex-col lg:flex-row gap-20">
        <div className="lg:w-1/3">
          <h2 className="font-['Inter'] text-[0.6875rem] uppercase tracking-widest text-[#919191] mb-6">Who builds with Complyr</h2>
          <p className="font-['Inter'] text-sm text-[#474747] max-w-xs uppercase leading-loose tracking-tighter">
            From decentralized protocols to established fintech platforms moving to the ledger.
          </p>
        </div>
        <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-16">
          <div className="space-y-4">
            <span className="font-['Inter'] text-[0.625rem] text-[#ffffff]">01</span>
            <h5 className="font-['Public_Sans'] text-xl font-bold text-white uppercase">Crypto-native startups</h5>
            <p className="font-['Inter'] text-sm text-[#c6c6c6]">Streamlining vendor payments with built-in KYC/AML metadata.</p>
          </div>
          <div className="space-y-4">
            <span className="font-['Inter'] text-[0.625rem] text-[#ffffff]">02</span>
            <h5 className="font-['Public_Sans'] text-xl font-bold text-white uppercase">DAOs &amp; Treasuries</h5>
            <p className="font-['Inter'] text-sm text-[#c6c6c6]">Transparent governance-to-payment flows with auditable trails.</p>
          </div>
          <div className="space-y-4">
            <span className="font-['Inter'] text-[0.625rem] text-[#ffffff]">03</span>
            <h5 className="font-['Public_Sans'] text-xl font-bold text-white uppercase">Onchain Treasury</h5>
            <p className="font-['Inter'] text-sm text-[#c6c6c6]">Enterprise-grade reporting for institutional funds moving onchain.</p>
          </div>
          <div className="space-y-4">
            <span className="font-['Inter'] text-[0.625rem] text-[#ffffff]">04</span>
            <h5 className="font-['Public_Sans'] text-xl font-bold text-white uppercase">Payroll &amp; HR</h5>
            <p className="font-['Inter'] text-sm text-[#c6c6c6]">Compliant international payroll settlement in stablecoins.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
