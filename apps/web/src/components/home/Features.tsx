"use client";

import React from 'react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: 'lock',
    title: 'FHE Privacy',
    body: 'Confidential data stays private even while being verified by on-chain logic using Fully Homomorphic Encryption.',
  },
  {
    icon: 'history_edu',
    title: 'Atomic Records',
    body: 'The payment and the proof are inseparable. Every transaction hash is cryptographically linked to its manifest.',
  },
  {
    icon: 'dynamic_form',
    title: 'Automated Tagging',
    body: 'Categorize corporate expenses dynamically at the exact moment a transaction is executed.',
  },
  {
    icon: 'lan',
    title: 'Seamless Bridging',
    body: 'Securely sync payment states between Flow EVM and Zama fhEVM without sacrificing data integrity or privacy.',
  },
  {
    icon: 'query_stats',
    title: 'Real-time Index',
    body: 'Instant access to your transaction history via Envio, with deep filtering and institutional-grade metadata.',
  },
  {
    icon: 'verified_user',
    title: 'Zero-Trust',
    body: 'Mathematical certainty over document validity without revealing contents using EIP-712 cryptographic signatures.',
  },
];

export default function Features() {
  return (
    <section className="py-32 px-6 md:px-12 bg-surface-container-high overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-outline block mb-4">Built for real business operations</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight max-w-2xl">Everything a corporate treasury needs. Nothing it doesn't.</h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-outline-variant/20 border border-outline-variant/20 mt-12">
          {features.map((f, i) => (
            <div 
              key={f.title}
              className="bg-surface p-10 flex flex-col justify-between min-h-[280px] hover:bg-surface-container-high transition-colors"
            >
              <div>
                <span className="material-symbols-outlined text-3xl mb-6 text-on-surface">{f.icon}</span>
                <h3 className="font-bold uppercase text-sm tracking-widest mb-4">{f.title}</h3>
              </div>
              <p className="text-sm text-on-surface-variant">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
