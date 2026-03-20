import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-gray-200 text-xs text-gray-500 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Built for Flow EVM · Private compliance via Zama fhEVM
          </div>

          <h1 className="text-5xl lg:text-6xl font-semibold text-gray-900 leading-tight mb-6">
            Global payroll that's compliant, private, and fully on-chain
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-12 max-w-3xl">
            Complyr lets businesses run automated cross-border payroll with built-in tax classification
            and jurisdiction tracking — while keeping sensitive salary data encrypted on-chain via
            fully homomorphic encryption.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link
              href="/wallet"
              className="px-6 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              Launch App
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/Stoneybro/complyr"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-gray-300 text-gray-900 font-medium hover:border-gray-400 transition-colors text-center"
            >
              View on GitHub
            </a>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border-l-2 border-gray-900 pl-4">
              <p className="text-sm text-gray-900 font-medium">Encrypted salary data via fhEVM</p>
            </div>
            <div className="border-l-2 border-gray-900 pl-4">
              <p className="text-sm text-gray-900 font-medium">Automated recurring payroll on Flow</p>
            </div>
            <div className="border-l-2 border-gray-900 pl-4">
              <p className="text-sm text-gray-900 font-medium">W2, 1099, contractor classification</p>
            </div>
            <div className="border-l-2 border-gray-900 pl-4">
              <p className="text-sm text-gray-900 font-medium">Gasless for employees, always</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
