import React from 'react';
import Link from 'next/link';

export default function Navigation() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#131313] border-b-[0.5px] border-white/10">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-3">
          <img alt="COMPLYR Icon" className="h-6 w-auto" src="https://lh3.googleusercontent.com/aida/ADBb0uh0Bh2x6YYy0f3uej6EN_-ZPlzLlfwCFF4F0YwAc7efktvEW7cPU8ZpeYMmb98AVmVj9E1FX-v1MqnkRWLkAL_0XTygXu8PcChq-zUv0jnXyfJXUu_bYukn0c4gwgJ7bElL36VBzuGb9ZRz5szbE1GND_68vkkUUokQQaITYEF7db7jnWDiGDYE8HnK9sAzoP6q_9lK-Km06y7SSvh84nBZEHwcGQFVEyuyRbEqxo7TE3uIi--n1yOBL43f3YHhnTGQY83USCF_"/>
          <span className="font-['Public_Sans'] font-bold uppercase tracking-[0.1em] text-white text-[1.125rem] leading-none">COMPLYR</span>
        </div>
        <nav className="hidden md:flex items-center gap-12">
          <Link className="font-['Public_Sans'] uppercase tracking-[0.05em] text-[0.6875rem] font-medium text-white border-b border-white pb-1" href="/login">Demo</Link>
          <Link className="font-['Public_Sans'] uppercase tracking-[0.05em] text-[0.6875rem] font-medium text-gray-500 hover:text-white transition-colors duration-200" href="https://github.com/Stoneybro/complyr#readme" target="_blank" rel="noopener noreferrer">Docs</Link>
        </nav>
        <Link href="/login" className="flex items-center justify-center bg-[#ffffff] text-[#1a1c1c] px-6 py-2 font-['Public_Sans'] uppercase tracking-[0.05em] text-[0.6875rem] font-bold transition-all duration-300 hover:bg-white/90">
          TRY THE DEMO
        </Link>
      </div>
    </header>
  );
}
