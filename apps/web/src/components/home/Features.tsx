import { Lock, Users, RefreshCw, Shield, BarChart3 } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Lock,
      title: 'Private compliance metadata via fhEVM',
      description: 'Salary amounts, tax categories, and jurisdiction codes are encrypted on-chain using Zama\'s fully homomorphic encryption.',
      details: 'Using euint64 for salary values and euint8 for jurisdiction and category enums, sensitive payroll data is stored encrypted on Zama\'s fhEVM. Employers define access control rules — an auditor can be granted decrypt access for a specific record without ever exposing the data publicly.',
      value: 'Your payroll data is verifiable to regulators without being readable by competitors, employees, or the general public.',
    },
    {
      icon: RefreshCw,
      title: 'Automated recurring payroll on Flow EVM',
      description: 'Payment schedules are created once and execute automatically on Flow — gasless for recipients, fully non-custodial.',
      details: 'The IntentRegistry contract holds the payment schedule: recipients, amounts, interval, and duration. Automation triggers each payment cycle. Funds are committed upfront and released on schedule — no manual execution required.',
      value: 'Set up monthly payroll for a 20-person team once. It runs for 12 months without you touching it.',
    },
    {
      icon: Users,
      title: 'Multi-jurisdiction classification',
      description: 'Every payment is tagged with its jurisdiction and tax category — W2, 1099, Contractor, Invoice — encrypted alongside the amount.',
      details: 'Complyr supports US (state-level), UK, EU, Nigeria, Singapore, and UAE jurisdiction codes. Tax categories include PAYROLL_W2, PAYROLL_1099, CONTRACTOR, BONUS, INVOICE, and VENDOR. All stored as encrypted enums on-chain.',
      value: 'A Lagos-based company paying contractors in California, the UK, and Nigeria can track and prove compliance for all three jurisdictions from a single dashboard.',
    },
    {
      icon: Shield,
      title: 'Selective decrypt for auditors',
      description: 'Grant time-limited or permanent decrypt access to specific addresses — your accountant, a tax authority, or an auditor — without exposing data to anyone else.',
      details: 'The fhEVM ACL (Access Control List) lets the contract owner grant decrypt permissions to specific wallet addresses on a per-record basis. Revocation is also supported. This maps directly to real-world compliance scenarios: "show your 2024 Q3 payroll to the IRS."',
      value: 'Prove compliance on demand without making your entire payroll history public.',
    },
    {
      icon: BarChart3,
      title: 'Compliance dashboard and CSV export',
      description: 'View your payment history filtered by jurisdiction, category, and period. Export audit-ready CSVs for your accountant.',
      details: 'Transaction history is indexed via Envio HyperIndex and queryable by wallet, type, timestamp, and compliance metadata. The dashboard aggregates by region and category. One-click CSV export generates accountant-ready files matching standard tax reporting formats.',
      value: 'Tax season becomes a filter and a download, not a forensic exercise.',
    },
  ];

  return (
    <section id="features" className="py-20 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl mb-16">
          <h2 className="text-4xl font-semibold text-gray-900 mb-6">
            Private, compliant, automated payroll — all three at once
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Complyr combines fully homomorphic encryption for privacy, ERC-4337 smart accounts
            for gasless UX, and on-chain automation for reliability. Each layer solves a
            distinct problem that no existing tool addresses.
          </p>
        </div>

        <div className="space-y-12">
          {features.map((feature, index) => (
            <div key={index} className="border-t border-gray-200 pt-12">
              <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                  <feature.icon className="w-8 h-8 text-gray-900 mb-4" strokeWidth={1.5} />
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>

                <div className="lg:col-span-8 space-y-4">
                  <p className="text-gray-700">{feature.details}</p>
                  <div className="pt-2">
                    <p className="text-sm font-medium text-gray-900">Why it matters</p>
                    <p className="text-sm text-gray-600">{feature.value}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
