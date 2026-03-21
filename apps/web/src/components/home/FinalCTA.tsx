import { Github } from 'lucide-react';
import Link from 'next/link';

export default function FinalCTA() {
  return (
    <section className="py-20 px-6 lg:px-8 bg-secondary">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-semibold text-gray-900 mb-6">
            Private, compliant payroll — built for the real world
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Complyr encrypts what should be private, automates what should be automatic,
            and makes global payroll compliance something you set up once.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link
              href="/wallet"
              className="px-6 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors text-center"
            >
              Launch App
            </Link>
            <a
              href="https://github.com/Stoneybro/complyr"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-gray-300 text-gray-900 font-medium hover:border-gray-400 transition-colors flex items-center justify-center gap-2"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="flex items-start">
                <span className="mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-600">Open-source codebase</span>
              </div>
              <div className="flex items-start">
                <span className="mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-600">Non-custodial throughout</span>
              </div>
              <div className="flex items-start">
                <span className="mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-600">Built on Flow EVM + Zama fhEVM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
