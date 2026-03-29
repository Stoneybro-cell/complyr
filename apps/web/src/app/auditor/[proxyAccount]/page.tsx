import { AuditorPortalClient } from "./AuditorPortalClient";

export default async function AuditorPage({
    params,
}: {
    params: Promise<{ proxyAccount: string }>;
}) {
    const resolvedParams = await params;

    return (
        <div className="min-h-screen bg-muted/40">
            {/* Minimal Header */}
            <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10 w-full">
                <div className="px-6 h-16 flex items-center">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <div className="h-6 w-6 rounded-md bg-emerald-600 flex items-center justify-center">
                            <span className="text-white text-xs">C</span>
                        </div>
                        Complyr <span className="font-normal text-muted-foreground text-sm ml-2 hidden sm:inline-block">/ External Auditor Portal</span>
                    </div>
                </div>
            </header>

            {/* Main Workspace */}
            <main className="container max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <AuditorPortalClient proxyAccount={resolvedParams.proxyAccount} />
            </main>
        </div>
    );
}
