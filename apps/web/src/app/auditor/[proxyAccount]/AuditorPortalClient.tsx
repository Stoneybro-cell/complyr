"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { ComplianceDashboard } from "@/components/compliance/ComplianceDashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, LogIn, Lock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AuditorPortalClient({ proxyAccount }: { proxyAccount: string }) {
    const { login, authenticated, ready, logout } = usePrivy();
    const { wallets } = useWallets();

    const activeWallet = wallets.find((w) => w.walletClientType === "privy") || wallets[0];

    return (
        <div className="flex flex-col gap-6">
            {!authenticated ? (
                <div className="flex flex-col items-center justify-center py-20 animate-in fade-in slide-in-from-bottom-6 duration-500">
                    <Card className="max-w-md w-full border-muted/50 shadow-xl overflow-hidden">
                        <div className="h-2 w-full bg-emerald-500" />
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto bg-emerald-100 dark:bg-emerald-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                <ShieldCheck className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <CardTitle className="text-2xl">Zama FHE Encrypted Ledger</CardTitle>
                            <CardDescription className="text-base mt-2">
                                You have been invited to review the confidential compliance history for Entity ID <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs select-all text-primary">{proxyAccount}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 flex flex-col items-center pb-8">
                            <div className="bg-muted/50 rounded-lg p-4 text-sm text-center flex flex-col gap-2 w-full">
                                <div className="flex items-center gap-2 justify-center text-muted-foreground">
                                    <Lock className="h-4 w-4" /> Fully Homomorphic Encryption
                                </div>
                                <p>To view these records, connect your explicitly authorized auditor wallet to decrypt the data.</p>
                            </div>
                            <Button size="lg" className="w-full text-lg h-12" onClick={login} disabled={!ready}>
                                <LogIn className="h-5 w-5 mr-2" /> Connect Wallet
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <div className="flex flex-col gap-6 animate-in fade-in">
                    <Card className="bg-emerald-500/10 border-emerald-500/20 shadow-none">
                        <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="bg-emerald-500/20 p-2 rounded-full mt-0.5">
                                    <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                                        Authorized Auditor Session
                                        <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400">Live</Badge>
                                    </h3>
                                    <p className="text-sm mt-1 text-emerald-800/80 dark:text-emerald-200/80 max-w-2xl leading-relaxed">
                                        You are viewing the immutable compliance ledger for entity <span className="font-mono bg-emerald-500/20 px-1 py-0.5 rounded text-emerald-900 dark:text-emerald-100">{proxyAccount}</span>. 
                                        Your connected external key (<span className="font-mono text-emerald-900 dark:text-emerald-100">{activeWallet?.address.slice(0, 6)}...{activeWallet?.address.slice(-4)}</span>) has been delegated FHE decryption permissions.
                                    </p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={logout} className="shrink-0 border-emerald-500/30 hover:bg-emerald-500/10">
                                Log out
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="bg-background rounded-xl border shadow-sm p-4 md:p-6 min-h-[70vh]">
                        {/* We reuse the exact same dashboard used internally, locked exclusively to the targeted address */}
                        <ComplianceDashboard walletAddress={proxyAccount} isExternalAuditor={true} />
                    </div>
                </div>
            )}
        </div>
    );
}
