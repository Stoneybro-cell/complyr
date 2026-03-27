<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              "inverse-on-surface": "#f1f1f1",
              "outline": "#777777",
              "background": "#f9f9f9",
              "tertiary-fixed": "#5f5e5e",
              "on-primary-container": "#ffffff",
              "on-tertiary-container": "#ffffff",
              "on-surface": "#1b1b1b",
              "surface-container": "#eeeeee",
              "surface-dim": "#dadada",
              "surface-tint": "#5e5e5e",
              "primary-fixed": "#5e5e5e",
              "on-background": "#1b1b1b",
              "secondary": "#5f5e5e",
              "inverse-primary": "#c6c6c6",
              "on-secondary-container": "#1b1c1c",
              "on-primary-fixed": "#ffffff",
              "on-secondary": "#ffffff",
              "secondary-fixed": "#c8c6c6",
              "primary-fixed-dim": "#474747",
              "tertiary-container": "#767474",
              "surface-container-low": "#f3f3f3",
              "error-container": "#ffdad6",
              "surface-container-highest": "#e2e2e2",
              "tertiary-fixed-dim": "#474646",
              "surface": "#f9f9f9",
              "primary-container": "#3b3b3b",
              "outline-variant": "#c6c6c6",
              "on-surface-variant": "#474747",
              "on-error": "#ffffff",
              "on-error-container": "#410002",
              "primary": "#000000",
              "error": "#ba1a1a",
              "on-secondary-fixed-variant": "#3b3b3b",
              "on-primary": "#e2e2e2",
              "secondary-fixed-dim": "#acabaa",
              "on-tertiary-fixed-variant": "#e5e2e1",
              "on-tertiary-fixed": "#ffffff",
              "surface-bright": "#f9f9f9",
              "inverse-surface": "#303030",
              "tertiary": "#3c3b3b",
              "on-tertiary": "#e5e2e1",
              "surface-variant": "#e2e2e2",
              "on-primary-fixed-variant": "#e2e2e2",
              "on-secondary-fixed": "#1b1c1c",
              "surface-container-high": "#e8e8e8",
              "secondary-container": "#d6d4d3",
              "surface-container-lowest": "#ffffff"
            },
            fontFamily: {
              "headline": ["Inter"],
              "body": ["Inter"],
              "label": ["Inter"],
              "mono": ["monospace"]
            },
            borderRadius: {"DEFAULT": "0px", "lg": "0px", "xl": "0px", "full": "9999px"},
          },
        },
      }
    </script>
<style>.material-symbols-outlined {
    font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24
    }
.grain-overlay {
    background-image: url(https://lh3.googleusercontent.com/aida-public/AB6AXuD8XVICT316uJn7txiNqnZDc6PBNpBIW7TdieeMiYLEK23iSh23V2e6j8bLzyeRi5zaxVeoclz31R6NuitZrZhISJpIOZ7QRBRIe9SBinrSIpmQ4VIPkzIRGEZokRcwzfpe2iUdPoqu7lXYVnSNpt-tSBSJkAC8d6B4Ol3CTvNY198cyjW20ZKvZrqgC60jchi3ZA6EvlR6gGzl9iSfvLL_Y0qq7REnXoaGQaQN_7RVuLBNX4D07P53vwOa8NEKVcTFm1bkaSUU6FL8);
    opacity: 0.02;
    pointer-events: none
    }
.technical-grid {
    background-size: 40px 40px;
    background-image: linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
    }</style>
</head>
<body class="bg-surface text-on-surface font-body selection:bg-primary selection:text-on-primary">
<!-- TopAppBar -->
<header class="fixed top-0 w-full flex justify-between items-center px-6 py-4 mx-auto bg-white/80 dark:bg-black/80 backdrop-blur-none border-b border-black/10 dark:border-white/10 z-50">
<div class="text-xl font-bold tracking-tighter text-black dark:text-white"><div class="flex items-center gap-3">
<img alt="COMPLYR Logo" class="h-8 w-auto block dark:hidden" src="https://lh3.googleusercontent.com/aida/ADBb0uhcpn7FRuXJiTR2nx5Z4tDm7cwuCaRX-MQ48Q7zwtW_qrILCc0g6zdV6_bUKHTgcvoeashZirt1W2rFPcSpgmfFQFnFKuHUmIvTORl721liuEWuc4Q_x7j2mtNYJUwZVdnS_StuzgHo-tsmDyicsg_-CKLUjLTudqu-86fFAJdPo3i4PobXmrP7mjLPb38xxgNde4Bmr6rq9kUiBW6CNfxOOobjuL9EZI9n5dD1ka_8eShitXfPWlOqstVMwEaZXnNGEQ74Fdniu78"/>
<img alt="COMPLYR Logo" class="h-8 w-auto hidden dark:block" src="https://lh3.googleusercontent.com/aida/ADBb0ujshU2yWb8D4EMJfkklcSNMA6KGK9a6RHAdYh6BK-2yvAniXwYPUwBLdbiJd-M7iUNdvQFNknCxoupsYh6yNKbm31pAF8y4gW6rEhzcWDyY5TMzYRxmBWChbwGEEsJuSQkGBKecbIbijYejijKITkMyMe-y9zKqlEpN6-SZrYxosnuzPuWiPAuWelSy8Asr2gsPCVlDjGR7rDfRkgpWr4BGSAr8uAloiErA3T7srB88hF3JrA8zPPh8olbQj_KTzWP4yd8uqSK4hw"/>
<span class="font-bold uppercase tracking-tighter text-2xl">Complyr</span>
</div></div>
<nav class="hidden md:flex gap-8 items-center">
<a class="font-inter tracking-tight font-semibold uppercase text-xs text-black dark:text-white border-b border-black dark:border-white hover:text-black dark:hover:text-white transition-colors duration-150" href="#">Demo</a>
<a class="font-inter tracking-tight font-semibold uppercase text-xs text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-150" href="#">Docs</a>
<a class="font-inter tracking-tight font-semibold uppercase text-xs text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-150" href="#">GitHub</a>
<a class="font-inter tracking-tight font-semibold uppercase text-xs text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-150" href="#">Contracts</a>
</nav>
<button class="bg-primary text-on-primary px-5 py-2 text-xs font-semibold uppercase tracking-widest hover:opacity-90 active:opacity-70 transition-all">
            Try the demo
        </button>
</header>
<main class="pt-16">
<!-- Hero Section -->
<section class="min-h-screen flex flex-col justify-center px-6 md:px-12 relative overflow-hidden technical-grid">
<div class="absolute inset-0 grain-overlay"></div>
<div class="max-w-6xl w-full mx-auto z-10 flex flex-col items-center text-center">
<div class="h-px w-24 bg-primary mb-8"></div>
<h1 class="text-[3.5rem] md:text-[6rem] leading-[0.95] font-bold tracking-tighter uppercase mb-8 max-w-5xl">
                    The compliance layer for onchain business payments.
                </h1>
<p class="text-xl md:text-2xl text-on-surface-variant max-w-2xl font-light mb-12 leading-relaxed mx-auto">
                    Complyr attaches encrypted, auditable compliance records directly to every transaction, bridging the gap between decentralized rails and institutional standards.
                </p>
<div class="flex flex-col gap-4">
<button class="bg-primary text-on-primary px-10 py-5 text-sm font-bold uppercase tracking-[0.2em] hover:bg-on-surface-variant transition-colors">
                        Try the demo
                    </button>
<button class="border border-primary text-primary px-10 py-5 text-sm font-bold uppercase tracking-[0.2em] hover:bg-surface-container-highest transition-colors">
                        Read the docs
                    </button>
</div>
</div>
<div class="absolute bottom-12 left-6 md:left-12 flex items-center gap-4">
<div class="text-[10px] font-mono tracking-widest uppercase opacity-40">SYSTEM_STATUS: OPERATIONAL</div>
<div class="w-1.5 h-1.5 bg-black animate-pulse"></div>
</div>
</section>
<!-- Problem Section -->
<section class="py-32 px-6 md:px-12 bg-surface-container-low border-y border-outline-variant/20">
<div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
<div class="md:col-span-4">
<span class="text-[10px] font-bold uppercase tracking-[0.3em] text-outline">The gap nobody talks about</span>
</div>
<div class="md:col-span-8">
<h2 class="text-4xl md:text-6xl font-semibold tracking-tight mb-16 leading-tight">
                        Blockchain payments tell you <span class="text-outline">who</span> was paid. They don't tell you <span class="italic underline decoration-1">why</span>.
                    </h2>
<div class="h-px w-full bg-outline-variant/30 mb-8"></div>
<p class="text-lg text-on-surface-variant max-w-xl leading-relaxed">
                        For institutional treasury, a transaction hash is insufficient evidence. Audits require context, intent, and documentation. Complyr solves the semantic void in onchain finance.
                    </p>
</div>
</div>
</section>
<!-- How it Works (The Mechanism) -->
<section class="py-32 px-6 md:px-12 bg-surface">
<div class="max-w-6xl mx-auto">
<div class="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-primary pb-8">
<div>
<span class="text-[10px] font-bold uppercase tracking-[0.3em] text-outline block mb-4">The mechanism</span>
<h2 class="text-5xl font-bold tracking-tighter uppercase">A dual ledger for every payment.</h2>
</div>
<div class="hidden md:block text-right">
<span class="font-mono text-xs opacity-50">TX_PROTOCOL_V.01.04</span>
</div>
</div>
<div class="grid grid-cols-1 md:grid-cols-4 gap-0 divide-x divide-outline-variant/20 border border-outline-variant/20">
<div class="p-8 hover:bg-surface-container-lowest transition-colors group">
<div class="font-mono text-4xl mb-12 opacity-10 group-hover:opacity-100 transition-opacity">01</div>
<h3 class="text-xs font-bold uppercase tracking-widest mb-4">Deploy</h3>
<p class="text-sm text-on-surface-variant leading-relaxed">Initialize a compliance-aware vault on Flow EVM. Define roles and spending limits.</p>
</div>
<div class="p-8 hover:bg-surface-container-lowest transition-colors group">
<div class="font-mono text-4xl mb-12 opacity-10 group-hover:opacity-100 transition-opacity">02</div>
<h3 class="text-xs font-bold uppercase tracking-widest mb-4">Create</h3>
<p class="text-sm text-on-surface-variant leading-relaxed">Upload invoices or contracts. Zama-powered FHE ensures data is encrypted but verifiable.</p>
</div>
<div class="p-8 hover:bg-surface-container-lowest transition-colors group">
<div class="font-mono text-4xl mb-12 opacity-10 group-hover:opacity-100 transition-opacity">03</div>
<h3 class="text-xs font-bold uppercase tracking-widest mb-4">Execute</h3>
<p class="text-sm text-on-surface-variant leading-relaxed">Execute payments with Keeper Automation. Atomic coupling of payment and proof.</p>
</div>
<div class="p-8 hover:bg-surface-container-lowest transition-colors group">
<div class="font-mono text-4xl mb-12 opacity-10 group-hover:opacity-100 transition-opacity">04</div>
<h3 class="text-xs font-bold uppercase tracking-widest mb-4">Audit</h3>
<p class="text-sm text-on-surface-variant leading-relaxed">Real-time indexing via Envio provides a cryptographic audit trail for regulators.</p>
</div>
</div>
</div>
</section>
<!-- Features -->
<section class="py-32 px-6 md:px-12 bg-surface-container-high">
<div class="max-w-6xl mx-auto">
<div class="mb-20">
<span class="text-[10px] font-bold uppercase tracking-[0.3em] text-outline block mb-4">Built for real business operations</span>
<h2 class="text-4xl md:text-5xl font-bold tracking-tight max-w-2xl">Everything a corporate treasury needs. Nothing it doesn't.</h2>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-px bg-outline-variant/20 border border-outline-variant/20">
<div class="bg-surface p-10 flex flex-col justify-between min-h-[280px]">
<div>
<span class="material-symbols-outlined text-3xl mb-6">lock</span>
<h3 class="font-bold uppercase text-sm tracking-widest mb-4">FHE Privacy</h3>
</div>
<p class="text-sm text-on-surface-variant">Confidential data stays private even while being verified by on-chain logic.</p>
</div>
<div class="bg-surface p-10 flex flex-col justify-between min-h-[280px]">
<div>
<span class="material-symbols-outlined text-3xl mb-6">history_edu</span>
<h3 class="font-bold uppercase text-sm tracking-widest mb-4">Atomic Records</h3>
</div>
<p class="text-sm text-on-surface-variant">The payment and the proof are inseparable. Never lose an invoice again.</p>
</div>
<div class="bg-surface p-10 flex flex-col justify-between min-h-[280px]">
<div>
<span class="material-symbols-outlined text-3xl mb-6">dynamic_form</span>
<h3 class="font-bold uppercase text-sm tracking-widest mb-4">Custom Flows</h3>
</div>
<p class="text-sm text-on-surface-variant">Build complex multi-sig and approval hierarchies suited to your org chart.</p>
</div>
<div class="bg-surface p-10 flex flex-col justify-between min-h-[280px]">
<div>
<span class="material-symbols-outlined text-3xl mb-6">lan</span>
<h3 class="font-bold uppercase text-sm tracking-widest mb-4">Omnichain Base</h3>
</div>
<p class="text-sm text-on-surface-variant">Powered by LayerZero for seamless compliance across any connected network.</p>
</div>
<div class="bg-surface p-10 flex flex-col justify-between min-h-[280px]">
<div>
<span class="material-symbols-outlined text-3xl mb-6">query_stats</span>
<h3 class="font-bold uppercase text-sm tracking-widest mb-4">Real-time Index</h3>
</div>
<p class="text-sm text-on-surface-variant">Instant access to your transaction history with deep filtering and metadata.</p>
</div>
<div class="bg-surface p-10 flex flex-col justify-between min-h-[280px]">
<div>
<span class="material-symbols-outlined text-3xl mb-6">verified_user</span>
<h3 class="font-bold uppercase text-sm tracking-widest mb-4">Zero-Trust</h3>
</div>
<p class="text-sm text-on-surface-variant">Mathematical certainty over document validity without revealing contents.</p>
</div>
</div>
</div>
</section>
<!-- Use Cases -->
<section class="py-32 px-6 md:px-12 bg-surface">
<div class="max-w-6xl mx-auto">
<div class="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
<div>
<span class="text-[10px] font-bold uppercase tracking-[0.3em] text-outline block mb-4">Who builds with Complyr</span>
<h2 class="text-5xl font-bold tracking-tighter uppercase leading-[1.1] mb-8">Any business that pays people on-chain needs a compliance layer.</h2>
<div class="h-2 w-24 bg-primary mb-12"></div>
</div>
<div class="grid grid-cols-1 gap-12">
<div class="border-l-4 border-primary pl-8 py-2">
<h4 class="text-lg font-bold uppercase mb-2">Web3 Native DAOs</h4>
<p class="text-on-surface-variant text-sm">Automate contributor payouts while maintaining public accountability and private records.</p>
</div>
<div class="border-l-4 border-outline-variant pl-8 py-2">
<h4 class="text-lg font-bold uppercase mb-2">Global Payroll Providers</h4>
<p class="text-on-surface-variant text-sm">Streamline cross-border contractor payments with integrated tax document verification.</p>
</div>
<div class="border-l-4 border-outline-variant pl-8 py-2">
<h4 class="text-lg font-bold uppercase mb-2">Institutional VC Funds</h4>
<p class="text-on-surface-variant text-sm">Manage capital calls and distributions with institutional-grade audit readiness.</p>
</div>
<div class="border-l-4 border-outline-variant pl-8 py-2">
<h4 class="text-lg font-bold uppercase mb-2">E-commerce Platforms</h4>
<p class="text-on-surface-variant text-sm">Onboard suppliers globally with automated KYC/AML checks baked into the payout rail.</p>
</div>
</div>
</div>
</div>
</section>
<!-- Technology Section -->
<section class="py-32 px-6 md:px-12 bg-surface-container-low border-t border-outline-variant/30">
<div class="max-w-6xl mx-auto">
<div class="mb-24 flex items-center gap-6">
<span class="text-[10px] font-bold uppercase tracking-[0.3em] text-outline">The stack</span>
<div class="flex-grow h-px bg-outline-variant/30"></div>
</div>
<div class="grid grid-cols-1 md:grid-cols-5 gap-12 text-center">
<div class="flex flex-col items-center">
<div class="font-mono text-xs mb-4 p-2 bg-surface border border-outline-variant/50 w-full uppercase">Flow EVM</div>
<p class="text-[10px] uppercase tracking-widest leading-relaxed opacity-50">Settlement Layer</p>
</div>
<div class="flex flex-col items-center">
<div class="font-mono text-xs mb-4 p-2 bg-surface border border-outline-variant/50 w-full uppercase">Zama</div>
<p class="text-[10px] uppercase tracking-widest leading-relaxed opacity-50">FHE Encryption</p>
</div>
<div class="flex flex-col items-center">
<div class="font-mono text-xs mb-4 p-2 bg-surface border border-outline-variant/50 w-full uppercase">Envio</div>
<p class="text-[10px] uppercase tracking-widest leading-relaxed opacity-50">Data Indexing</p>
</div>
<div class="flex flex-col items-center">
<div class="font-mono text-xs mb-4 p-2 bg-surface border border-outline-variant/50 w-full uppercase">LayerZero</div>
<p class="text-[10px] uppercase tracking-widest leading-relaxed opacity-50">Omnichain Msg</p>
</div>
<div class="flex flex-col items-center">
<div class="font-mono text-xs mb-4 p-2 bg-surface border border-outline-variant/50 w-full uppercase">Keepers</div>
<p class="text-[10px] uppercase tracking-widest leading-relaxed opacity-50">Automation</p>
</div>
</div>
<div class="mt-24 p-12 border border-primary bg-surface relative">
<div class="absolute -top-3 left-8 bg-surface px-4 text-[10px] font-bold uppercase tracking-widest">Architectural Summary</div>
<p class="text-xl md:text-3xl font-light leading-relaxed">
                        Complyr is not just a smart contract; it is a <span class="font-bold">unified protocol stack</span> designed to make on-chain payments compatible with traditional legal frameworks without sacrificing decentralization.
                    </p>
</div>
</div>
</section>
<!-- CTA Section -->
<section class="py-40 px-6 md:px-12 bg-primary text-on-primary relative overflow-hidden">
<div class="absolute inset-0 grain-overlay"></div>
<div class="max-w-4xl mx-auto text-center relative z-10">
<h2 class="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-10 leading-none">
                    Your business is already operating onchain. Your compliance layer should be too.
                </h2>
<p class="text-lg md:text-xl font-light mb-16 opacity-70">
                    Complyr is live on Flow EVM testnet. Integrate the gold standard of onchain compliance today.
                </p>
<div class="flex flex-col md:flex-row gap-6 justify-center">
<button class="bg-on-primary text-primary px-12 py-6 text-sm font-bold uppercase tracking-[0.2em] hover:bg-surface-dim transition-colors">
                        Try the demo
                    </button>
<button class="border border-on-primary text-on-primary px-12 py-6 text-sm font-bold uppercase tracking-[0.2em] hover:bg-on-primary hover:text-primary transition-colors">
                        Read the docs
                    </button>
</div>
</div>
</section>
</main>
<!-- Footer -->
<footer class="bg-[#F9F9F9] dark:bg-[#0A0A0A] border-t border-black/5 dark:border-white/5">
<div class="w-full grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-16">
<div class="md:col-span-2">
<div class="text-lg font-bold text-black dark:text-white mb-6 uppercase tracking-tighter"><div class="flex items-center gap-3">
<img alt="COMPLYR Logo" class="h-8 w-auto block dark:hidden" src="https://lh3.googleusercontent.com/aida/ADBb0uhcpn7FRuXJiTR2nx5Z4tDm7cwuCaRX-MQ48Q7zwtW_qrILCc0g6zdV6_bUKHTgcvoeashZirt1W2rFPcSpgmfFQFnFKuHUmIvTORl721liuEWuc4Q_x7j2mtNYJUwZVdnS_StuzgHo-tsmDyicsg_-CKLUjLTudqu-86fFAJdPo3i4PobXmrP7mjLPb38xxgNde4Bmr6rq9kUiBW6CNfxOOobjuL9EZI9n5dD1ka_8eShitXfPWlOqstVMwEaZXnNGEQ74Fdniu78"/>
<img alt="COMPLYR Logo" class="h-8 w-auto hidden dark:block" src="https://lh3.googleusercontent.com/aida/ADBb0ujshU2yWb8D4EMJfkklcSNMA6KGK9a6RHAdYh6BK-2yvAniXwYPUwBLdbiJd-M7iUNdvQFNknCxoupsYh6yNKbm31pAF8y4gW6rEhzcWDyY5TMzYRxmBWChbwGEEsJuSQkGBKecbIbijYejijKITkMyMe-y9zKqlEpN6-SZrYxosnuzPuWiPAuWelSy8Asr2gsPCVlDjGR7rDfRkgpWr4BGSAr8uAloiErA3T7srB88hF3JrA8zPPh8olbQj_KTzWP4yd8uqSK4hw"/>
<span class="font-bold uppercase tracking-tighter text-2xl">Complyr</span>
</div></div>
<p class="font-inter text-[10px] uppercase tracking-widest leading-relaxed text-gray-400 dark:text-gray-600 max-w-xs mb-10">
                    The compliance layer for onchain business payments. Built for the future of institutional treasury.
                </p>
<div class="flex gap-4">
<div class="w-10 h-px bg-black"></div>
<span class="font-inter text-[10px] uppercase tracking-widest font-bold">PL Genesis: Frontiers of Collaboration</span>
</div>
</div>
<div>
<h4 class="font-inter text-[10px] font-bold uppercase tracking-widest mb-8 text-black dark:text-white">Navigation</h4>
<ul class="space-y-4">
<li><a class="font-inter text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-600 hover:text-black dark:hover:text-white transition-all underline" href="#">Demo</a></li>
<li><a class="font-inter text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-600 hover:text-black dark:hover:text-white transition-all underline" href="#">Docs</a></li>
<li><a class="font-inter text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-600 hover:text-black dark:hover:text-white transition-all underline" href="#">GitHub</a></li>
<li><a class="font-inter text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-600 hover:text-black dark:hover:text-white transition-all underline" href="#">Contracts</a></li>
</ul>
</div>
<div>
<h4 class="font-inter text-[10px] font-bold uppercase tracking-widest mb-8 text-black dark:text-white">Powered By</h4>
<ul class="space-y-4">
<li><a class="font-inter text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-600 hover:text-black dark:hover:text-white transition-all underline" href="#">FLOW</a></li>
<li><a class="font-inter text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-600 hover:text-black dark:hover:text-white transition-all underline" href="#">ZAMA</a></li>
<li><a class="font-inter text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-600 hover:text-black dark:hover:text-white transition-all underline" href="#">ENVIO</a></li>
<li><a class="font-inter text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-600 hover:text-black dark:hover:text-white transition-all underline" href="#">LAYERZERO</a></li>
</ul>
</div>
</div>
<div class="px-12 pb-8 flex flex-col md:flex-row justify-between items-center border-t border-black/5 pt-8">
<p class="font-inter text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-600">
                © 2024 COMPLYR infrastructure. PL Genesis: Frontiers of Collaboration.
            </p>
<div class="mt-4 md:mt-0 flex gap-4">
<span class="font-mono text-[9px] text-gray-300">BUILD: CONFIDENTIAL-24-A</span>
<span class="font-mono text-[9px] text-gray-300">REGION: GLOBAL</span>
</div>
</div>
</footer>
</body></html>