import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0E0E0E] border-t-[0.5px] border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full px-12 py-20 max-w-[1440px] mx-auto">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <img alt="COMPLYR Icon" className="h-6 w-auto" src="https://lh3.googleusercontent.com/aida/ADBb0uh0Bh2x6YYy0f3uej6EN_-ZPlzLlfwCFF4F0YwAc7efktvEW7cPU8ZpeYMmb98AVmVj9E1FX-v1MqnkRWLkAL_0XTygXu8PcChq-zUv0jnXyfJXUu_bYukn0c4gwgJ7bElL36VBzuGb9ZRz5szbE1GND_68vkkUUokQQaITYEF7db7jnWDiGDYE8HnK9sAzoP6q_9lK-Km06y7SSvh84nBZEHwcGQFVEyuyRbEqxo7TE3uIi--n1yOBL43f3YHhnTGQY83USCF_"/>
            <span className="font-['Public_Sans'] font-bold uppercase tracking-[0.1em] text-white text-[1.125rem] leading-none">COMPLYR</span>
          </div>
          <p className="font-['Inter'] text-[0.6875rem] uppercase tracking-widest text-gray-600 leading-relaxed max-w-md">
            © 2024 COMPLYR INFRASTRUCTURE. BUILT FOR ONCHAIN COMPLIANCE. THE INFRASTRUCTURE STANDARD FOR GLOBAL TREASURY OPERATIONS.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-12">
          <div className="flex flex-col gap-4">
            <span className="font-['Inter'] text-[0.625rem] text-[#919191] mb-4">RESOURCES</span>
            <Link className="font-['Inter'] text-[0.6875rem] uppercase tracking-widest text-gray-600 hover:text-white transition-colors" href="/login">Demo</Link>
            <Link className="font-['Inter'] text-[0.6875rem] uppercase tracking-widest text-gray-600 hover:text-white transition-colors" href="https://github.com/Stoneybro/complyr#readme" target="_blank" rel="noopener noreferrer">Docs</Link>
            <Link className="font-['Inter'] text-[0.6875rem] uppercase tracking-widest text-gray-600 hover:text-white transition-colors" href="https://github.com/Stoneybro/complyr" target="_blank" rel="noopener noreferrer">GitHub</Link>
            <Link className="font-['Inter'] text-[0.6875rem] uppercase tracking-widest text-gray-600 hover:text-white transition-colors" href="https://github.com/Stoneybro/complyr/tree/main/packages/contracts" target="_blank" rel="noopener noreferrer">Contracts</Link>
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-['Inter'] text-[0.625rem] text-[#919191] mb-4">HACKATHON</span>
            <p className="font-['Inter'] text-[0.625rem] uppercase leading-loose text-gray-600">
              Built for PL Genesis: Frontiers of Collaboration. Submitted under Flow and Zama Confidential Onchain Finance tracks.
            </p>
          </div>
        </div>
      </div>
      <div className="px-12 py-8 border-t border-white/5 bg-[#0A0A0A]">
        <p className="font-['Inter'] text-[0.625rem] uppercase tracking-widest text-gray-700 text-center">
          Powered by LayerZero, Chainlink, and Envio. No user data is stored without encryption.
        </p>
      </div>
    </footer>
  );
}
