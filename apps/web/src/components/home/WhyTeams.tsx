export default function WhyTeams() {
  const reasons = [
    'Privacy by default: salary amounts are encrypted — not just hidden behind a UI',
    'Compliance-first: jurisdiction and tax category live on-chain, not in a spreadsheet',
    'Auditor-ready: grant selective decrypt access on demand, revoke it when done',
    'Global from day one: US, UK, EU, Nigeria, Singapore — all supported out of the box',
  ];

  return (
    <section className="py-20 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-semibold text-gray-900 mb-6">
            Why compliance-focused teams choose Complyr
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Every other payroll tool either ignores privacy or ignores compliance.
            Complyr is built on the premise that you need both — and that they're
            not in conflict.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            {reasons.map((reason, index) => (
              <div key={index} className="border-l-2 border-gray-900 pl-4">
                <p className="text-gray-900 font-medium">{reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
