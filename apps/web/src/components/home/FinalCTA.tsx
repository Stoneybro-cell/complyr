import React from 'react';
import Link from 'next/link';

export default function FinalCTA() {
  return (
    <section className="relative py-40 px-8 md:px-24 bg-[#ffffff] text-[#1a1c1c] overflow-hidden">
      {/* Decorative image overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none grayscale">
        <img alt="modern glass skyscraper" className="w-full h-full object-cover" data-alt="dramatic upward angle of a black and white skyscraper glass facade with sharp reflections and deep contrast" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-x8XI29ALNjfEcFqQOkIa1q2LLuMjqQDWs_1XQcj-gIIobv318AqiSsIOKggbtzbR7gK9RbV_tSBSGrFGNNx5d0Ly4RiPhOcHvh0ihqtKob5qzDMbJzrRLbTIvUKrbbzkcIMraTMyCD1UCOCCpY92kK0Z-LcGB7hsluZ3oDKKhzRIsVj5HsX10SgGnNEHKsD2iGupL_nG207zmPd5T4m0i-1LbxCWKo2QN1aG6dc6rJ76tUIJADOinxVSuB0yAbB4PnYOOzK7Yzk"/>
      </div>
      <div className="relative z-10 max-w-4xl">
        <h2 className="font-['Public_Sans'] text-4xl md:text-6xl font-black mb-8 leading-[1.1] tracking-tighter uppercase">
          Your business is already operating onchain. Your compliance layer should be too.
        </h2>
        <p className="font-['Inter'] text-xl md:text-2xl mb-12 opacity-80 leading-relaxed">
          Complyr is live on Flow EVM testnet. Start building the future of institutional-grade onchain finance today.
        </p>
        <div className="flex flex-col sm:flex-row gap-6">
          <Link href="/login" className="flex items-center justify-center bg-[#0E0E0E] text-white px-12 py-6 font-['Inter'] text-[0.875rem] font-black uppercase tracking-[0.2em] hover:bg-black transition-colors">
            TRY THE DEMO
          </Link>
          <Link href="https://github.com/Stoneybro/complyr#readme" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center border border-[#1a1c1c] text-[#1a1c1c] px-12 py-6 font-['Inter'] text-[0.875rem] font-black uppercase tracking-[0.2em] hover:bg-[#1a1c1c] hover:text-[#ffffff] transition-all">
            READ THE DOCS
          </Link>
        </div>
      </div>
    </section>
  );
}
