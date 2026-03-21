export default function WhyComplyr() {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-secondary">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold leading-tight tracking-tight max-w-2xl mx-auto">
          Complyr makes global payroll a private, compliant, on-chain primitive
        </h2>

        <div className="mt-10 space-y-4 text-muted-foreground text-lg md:text-xl leading-relaxed max-w-xl mx-auto">
          <p>
            Define payroll once — recipients, amounts, jurisdiction, tax category.
          </p>
          <p>
            Sensitive data is encrypted on-chain. Only authorized parties can read it.
          </p>
          <p>
            Payments execute automatically, every cycle, without manual intervention.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 text-foreground font-medium">
          <span>No exposed salaries.</span>
          <span>No manual reconciliation.</span>
          <span>No compliance guesswork.</span>
        </div>
      </div>
    </section>
  );
}
