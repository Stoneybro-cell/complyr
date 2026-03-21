const useCases = [
  {
    title: "Startup with a global remote team",
    instruction: "Monthly payroll: Alice $8,000 W2 California, Bob £5,000 contractor UK, Dayo ₦1,200,000 contractor Nigeria — encrypted, automated, for 12 months",
    outcomes: [
      "All salary amounts encrypted on fhEVM",
      "Jurisdiction and tax category tagged per recipient",
      "Payments execute automatically each month on Flow",
    ],
  },
  {
    title: "Agency paying quarterly 1099 contractors",
    instruction: "Pay 8 US-based 1099 contractors $12,000 each quarterly for 2025 — label Q1–Q4, encrypt amounts",
    outcomes: [
      "Encrypted per-recipient salary records",
      "1099 category stored confidentially on-chain",
      "One-click auditor access grant at tax time",
    ],
  },
  {
    title: "DAO paying grant recipients",
    instruction: "Monthly grants to 5 builders — amounts private, jurisdiction tracked, schedule automated for 6 months",
    outcomes: [
      "Grant amounts hidden from public view",
      "Treasury spending verifiable without revealing individual amounts",
      "Fully non-custodial — DAO retains control throughout",
    ],
  },
];

export default function UseCases() {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-secondary">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-semibold leading-tight tracking-tight">
          Real payroll scenarios Complyr solves today
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {useCases.map((useCase, index) => (
            <div key={index} className="bg-background rounded-lg p-6 border border-border">
              <h3 className="text-lg font-semibold mb-4">{useCase.title}</h3>

              <div className="mb-6">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Instruction</span>
                <p className="text-sm italic text-muted-foreground mt-1">"{useCase.instruction}"</p>
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Outcome</span>
                <ul className="mt-2 space-y-2">
                  {useCase.outcomes.map((outcome, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
