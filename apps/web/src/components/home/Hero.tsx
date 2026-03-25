import React from 'react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-8 md:px-24 pt-20 border-b-[0.5px] border-white/10">
      <div className="max-w-5xl z-10">
        <p className="font-['Inter'] text-[0.6875rem] uppercase tracking-widest text-[#919191] mb-8">Infrastructure Standard 01-A</p>
        <h1 className="font-['Public_Sans'] text-5xl md:text-[5.5rem] leading-[1.05] font-bold tracking-tight text-white mb-10">
          The compliance layer for onchain business payments.
        </h1>
        <p className="font-['Inter'] text-xl md:text-2xl text-[#c6c6c6] max-w-3xl leading-relaxed mb-12">
          Complyr attaches encrypted, auditable compliance records to every payment your business makes on-chain. Bridging the gap between cryptographic settlement and corporate regulatory requirements.
        </p>
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
          <Link href="/login" className="flex items-center justify-center bg-[#ffffff] text-[#1a1c1c] px-10 py-5 font-['Inter'] text-[0.75rem] font-black uppercase tracking-widest hover:bg-[#c7c6c6] transition-colors">
            INITIATE DEPLOYMENT
          </Link>
          <div className="flex items-center gap-4 text-[#474747]">
            <span className="w-12 h-[1px] bg-[#474747]"></span>
            <span className="font-['Inter'] text-[0.6875rem] uppercase tracking-widest">Live on Flow EVM Testnet</span>
          </div>
        </div>
      </div>
      {/* Background Detail */}
      <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-20 hidden lg:block overflow-hidden pointer-events-none">
        <img alt="abstract architectural geometry" className="w-full h-full object-cover grayscale contrast-125" data-alt="high contrast monochrome macro shot of brutalist concrete architecture with sharp shadows and geometric lines" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVXikFXNQ1V5v0I2A61mAd1rwcLBLZygrF3cq4IH0xxiZY2H29Mhbx-6O8iHrXgprLtlxo9Z2qG5ba9LKv9gOf7Rza5mq3WB3XK6SlZ_9r2sKfl6FZAcyvCJzLC1ybVXqxfoG2Y2CkoRgdaaa5reQ7jS4CV3oCDlvQ6wD4aiJaZNz8XwS3x9ek8-hXgNwo0galcEtjjHcytZH7vUP838MM4Xiu17sTsZMkwEAW9h-OkNIrMxW5k_Y-duV9blM-I5bzeZEuIbetNfA"/>
      </div>
    </section>
  );
}
