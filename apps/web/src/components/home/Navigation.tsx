import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
export default function Navigation() {
  return (
    <header className="fixed top-0 w-full flex justify-between items-center px-6 py-4 mx-auto bg-white/80 dark:bg-black/80 backdrop-blur-none border-b border-black/10 dark:border-white/10 z-50">
      <div className="text-xl font-bold tracking-tighter text-black dark:text-white">
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
      <nav className="hidden md:flex gap-8 items-center">
        <Link
          href="/login"
          className="font-inter tracking-tight font-semibold uppercase text-xs text-black dark:text-white border-b border-black dark:border-white hover:text-black dark:hover:text-white transition-colors duration-150"
        >
          Demo
        </Link>
        <Link
          href="https://github.com/Stoneybro/complyr#readme"
          target="_blank"
          rel="noopener noreferrer"
          className="font-inter tracking-tight font-semibold uppercase text-xs text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-150"
        >
          Docs
        </Link>

      </nav>
      <Link
        href="/login"
        className="bg-primary text-on-primary px-5 py-2 text-xs font-semibold uppercase tracking-widest hover:opacity-90 active:opacity-70 transition-all cursor-pointer"
      >
        Try the demo
      </Link>
    </header>
  );
}
