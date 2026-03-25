import React from 'react';

export default function Problem() {
  return (
    <section className="py-32 px-8 md:px-24 bg-[#0e0e0e] relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <h2 className="font-['Inter'] text-[0.6875rem] uppercase tracking-widest text-[#919191] sticky top-32">The gap nobody talks about</h2>
        </div>
        <div className="lg:col-span-8">
          <div className="border-l border-[#474747] pl-8 md:pl-16">
            <blockquote className="font-['Public_Sans'] text-3xl md:text-5xl font-medium text-white leading-tight mb-12 italic">
              "Blockchain payments tell you who was paid. They don't tell you why. For a business, that missing data is a liability."
            </blockquote>
            <div className="space-y-8 max-w-2xl">
              <p className="font-['Inter'] text-lg text-[#c6c6c6] leading-relaxed">
                Conventional onchain transactions are data-poor. While the movement of value is immutable, the business context—invoices, tax jurisdictions, expense categories—remains fragmented across emails, PDFs, and spreadsheets.
              </p>
              <p className="font-['Inter'] text-lg text-[#c6c6c6] leading-relaxed">
                Complyr solves this by baking compliance logic directly into the transaction lifecycle using Fully Homomorphic Encryption (FHE) and cross-chain messaging.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
