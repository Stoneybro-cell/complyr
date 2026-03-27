import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#F9F9F9] dark:bg-[#0A0A0A] border-t border-black/5 dark:border-white/5">
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-16 max-w-[1440px] mx-auto">
        <div className="md:col-span-2">
          <div className="text-lg font-bold text-black dark:text-white mb-6 uppercase tracking-tighter">
            <div className="flex items-center gap-3">
              <img
                alt="COMPLYR Logo"
                className="h-8 w-auto block dark:hidden"
                src="https://lh3.googleusercontent.com/aida/ADBb0uhcpn7FRuXJiTR2nx5Z4tDm7cwuCaRX-MQ48Q7zwtW_qrILCc0g6zdV6_bUKHTgcvoeashZirt1W2rFPcSpgmfFQFnFKuHUmIvTORl721liuEWuc4Q_x7j2mtNYJUwZVdnS_StuzgHo-tsmDyicsg_-CKLUjLTudqu-86fFAJdPo3i4PobXmrP7mjLPb38xxgNde4Bmr6rq9kUiBW6CNfxOOobjuL9EZI9n5dD1ka_8eShitXfPWlOqstVMwEaZXnNGEQ74Fdniu78"
              />
              <img
                alt="COMPLYR Logo"
                className="h-8 w-auto hidden dark:block"
                src="https://lh3.googleusercontent.com/aida/ADBb0ujshU2yWb8D4EMJfkklcSNMA6KGK9a6RHAdYh6BK-2yvAniXwYPUwBLdbiJd-M7iUNdvQFNknCxoupsYh6yNKbm31pAF8y4gW6rEhzcWDyY5TMzYRxmBWChbwGEEsJuSQkGBKecbIbijYejijKITkMyMe-y9zKqlEpN6-SZrYxosnuzPuWiPAuWelSy8Asr2gsPCVlDjGR7rDfRkgpWr4BGSAr8uAloiErA3T7srB88hF3JrA8zPPh8olbQj_KTzWP4yd8uqSK4hw"
              />
              <span className="font-bold uppercase tracking-tighter text-2xl">Complyr</span>
            </div>
          </div>
          <p className="font-inter text-[10px] uppercase tracking-widest leading-relaxed text-gray-400 dark:text-gray-600 max-w-xs mb-10">
            The compliance layer for onchain business payments. Built for the future of institutional treasury.
          </p>
          <div className="flex gap-4 items-center">
            <div className="w-10 h-px bg-black dark:bg-white"></div>
            <span className="font-inter text-[10px] uppercase tracking-widest font-bold">PL Genesis: Frontiers of Collaboration</span>
          </div>
        </div>
        <div>
          <h4 className="font-inter text-[10px] font-bold uppercase tracking-widest mb-8 text-black dark:text-white">Resources</h4>
          <ul className="space-y-4">
            <li><Link href="/login" className="font-inter text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-600 hover:text-black dark:hover:text-white transition-all underline">Demo</Link></li>
            <li><Link href="https://github.com/Stoneybro/complyr#readme" target="_blank" rel="noopener noreferrer" className="font-inter text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-600 hover:text-black dark:hover:text-white transition-all underline">Docs</Link></li>
            <li><Link href="https://github.com/Stoneybro/complyr" target="_blank" rel="noopener noreferrer" className="font-inter text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-600 hover:text-black dark:hover:text-white transition-all underline">GitHub</Link></li>
            <li><Link href="https://github.com/Stoneybro/complyr/tree/main/packages/contract" target="_blank" rel="noopener noreferrer" className="font-inter text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-600 hover:text-black dark:hover:text-white transition-all underline">Contracts</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-inter text-[10px] font-bold uppercase tracking-widest mb-8 text-black dark:text-white">Powered By</h4>
          <ul className="space-y-4">
            <li><span className="font-inter text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-600">FLOW EVM</span></li>
            <li><span className="font-inter text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-600">ZAMA FHEVM</span></li>
            <li><span className="font-inter text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-600">LAYERZERO V2</span></li>
            <li><span className="font-inter text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-600">ENVIO</span></li>
          </ul>
        </div>
      </div>
      <div className="px-12 pb-8 flex flex-col md:flex-row justify-between items-center border-t border-black/5 dark:border-white/5 pt-8">
        <p className="font-inter text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-700">
          © 2024 COMPLYR INFRASTRUCTURE. PL Genesis: Frontiers of Collaboration.
        </p>
        <p className="font-inter text-[10px] uppercase tracking-widest text-gray-300 dark:text-gray-800">
          Powered by LayerZero and Envio. No user data is stored without encryption.
        </p>
      </div>
    </footer>
  );
}
