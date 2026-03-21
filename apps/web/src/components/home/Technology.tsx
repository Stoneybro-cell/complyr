export default function Technology() {
  const layers = [
    {
      title: 'Execution layer — Flow EVM',
      items: [
        'ERC-4337 smart accounts with gasless paymaster — recipients never pay gas',
        'IntentRegistry: on-chain payment scheduler with commitment tracking',
        'Keeper automation triggers each payment cycle',
        'Contracts written in Solidity 0.8.28, deployed to Flow EVM testnet',
      ],
    },
    {
      title: 'Privacy layer — Zama fhEVM',
      items: [
        'MpConfidentialPayroll.sol: stores encrypted salary (euint64), jurisdiction (euint8), category (euint8)',
        'Zama TFHE library for on-chain FHE operations',
        'ACL-based access control: employers grant selective decrypt per record per address',
        'Deployed to Zama Sepolia testnet; record ID stored alongside Flow intent',
      ],
    },
    {
      title: 'Authentication',
      items: [
        'Privy embedded wallets — email and social login, no seed phrases for end users',
        'Deterministic smart account addresses via ERC-1167 minimal proxy factory',
        'One smart account per user, deployed on first use',
      ],
    },
    {
      title: 'Indexing and data',
      items: [
        'Envio HyperIndex for real-time transaction history on Flow EVM',
        'GraphQL API for compliance dashboard queries',
        'Neon Postgres + Drizzle ORM for contact and reference data',
      ],
    },
    {
      title: 'Frontend',
      items: [
        'Next.js 16 App Router, Tailwind CSS v4, Shadcn UI',
        'Viem + Permissionless.js for AA transaction construction',
        'TanStack Query for server state, Sonner for toast notifications',
      ],
    },
  ];

  return (
    <section id="technology" className="py-20 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-semibold text-gray-900 mb-16">
          Built on production-grade Web3 infrastructure
        </h2>

        <div className="space-y-12">
          {layers.map((layer, index) => (
            <div key={index} className="border-t border-gray-200 pt-8">
              <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                  <h3 className="text-xl font-semibold text-gray-900">{layer.title}</h3>
                </div>
                <div className="lg:col-span-8">
                  <ul className="space-y-3">
                    {layer.items.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
