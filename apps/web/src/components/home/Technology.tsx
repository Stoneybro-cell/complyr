import React from 'react';

export default function Technology() {
  return (
    <section className="py-32 px-8 md:px-24 bg-[#0e0e0e] overflow-hidden">
      <h2 className="font-['Public_Sans'] text-4xl font-black mb-20 text-center tracking-widest uppercase text-white/40">Technical Stack</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-12 items-center opacity-60">
        <div className="text-center space-y-4">
          <div className="font-['Inter'] text-[0.625rem] text-[#919191]">EXECUTION</div>
          <div className="text-white font-bold tracking-tight text-lg">FLOW EVM</div>
        </div>
        <div className="text-center space-y-4">
          <div className="font-['Inter'] text-[0.625rem] text-[#919191]">CONFIDENTIALITY</div>
          <div className="text-white font-bold tracking-tight text-lg">ZAMA FHEVM</div>
        </div>
        <div className="text-center space-y-4">
          <div className="font-['Inter'] text-[0.625rem] text-[#919191]">MESSAGING</div>
          <div className="text-white font-bold tracking-tight text-lg">LAYERZERO V2</div>
        </div>
        <div className="text-center space-y-4">
          <div className="font-['Inter'] text-[0.625rem] text-[#919191]">AUTOMATION</div>
          <div className="text-white font-bold tracking-tight text-lg">CHAINLINK</div>
        </div>
        <div className="text-center space-y-4">
          <div className="font-['Inter'] text-[0.625rem] text-[#919191]">INDEXING</div>
          <div className="text-white font-bold tracking-tight text-lg">ENVIO</div>
        </div>
      </div>
      <div className="mt-32 max-w-4xl mx-auto border border-[#474747]/30 bg-[#131313] p-8">
        <div className="flex justify-between border-b border-[#474747]/30 pb-4 mb-8">
          <span className="font-['Inter'] text-[0.6875rem] text-[#ffffff]">AUDIT_PROTOCOL_SCHEMA.JSON</span>
          <span className="font-['Inter'] text-[0.6875rem] text-[#919191]">V1.0</span>
        </div>
        <pre className="font-mono text-[0.75rem] text-[#c6c6c6] overflow-x-auto">{`{
  "protocol": "COMPLYR",
  "version": "v1.0.4",
  "engine": {
    "execution": "Flow_EVM_Mainnet",
    "privacy": "FHE_Zama_256bit",
    "verification": "EIP-712_Typed_Data"
  },
  "compliance_hooks": [
    "JURISDICTION_LOCK",
    "EXPENDITURE_TAGGING",
    "TAX_ID_ENCRYPTION"
  ]
}`}</pre>
      </div>    
    </section>
  );
}
