"use client";

import { useState, useCallback, useEffect } from "react";
import { createPublicClient, http, createWalletClient, custom, getAddress } from "viem";
import { sepolia } from "viem/chains";
import { useWallets } from "@privy-io/react-auth";
import { ComplianceRegistryABI } from "@/lib/abi/ComplianceRegistryABI";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Trash2, ShieldCheck, UserPlus, Fingerprint, Share2, Check, Copy } from "lucide-react";

const REGISTRY_ADDRESS = "0x231Fcd3ae69f723B3AeFfe7B9B876Bb37C4Db4D6" as const;

export function AuditorsManager({ proxyAccount }: { proxyAccount?: string }) {
    const [auditors, setAuditors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isManaging, setIsManaging] = useState(false);
    const [newAuditorAddress, setNewAuditorAddress] = useState("");
    
    const [isCopying, setIsCopying] = useState(false);
    
    const { wallets } = useWallets();

    const fetchAuditors = useCallback(async () => {
        if (!proxyAccount) return;
        setIsLoading(true);
        try {
            const publicClient = createPublicClient({
                chain: sepolia,
                transport: http("https://ethereum-sepolia-rpc.publicnode.com"),
            });

            const current = await publicClient.readContract({
                address: REGISTRY_ADDRESS,
                abi: ComplianceRegistryABI,
                functionName: "getAuditors",
                args: [proxyAccount as `0x${string}`],
            }) as string[];
            
            setAuditors(current);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [proxyAccount]);

    useEffect(() => {
        if (proxyAccount) {
            fetchAuditors();
        }
    }, [proxyAccount, fetchAuditors]);

    const handleAdd = async () => {
        if (!newAuditorAddress) return;
        if (!newAuditorAddress.startsWith("0x") || newAuditorAddress.length !== 42) {
            toast.error("Invalid checksummed address");
            return;
        }

        const ownerWallet = wallets?.find((w) => w.walletClientType === "privy");
        if (!ownerWallet) {
            toast.error("Please connect your wallet");
            return;
        }

        setIsManaging(true);
        const loadingId = toast.loading("Checking wallet balance for FHE operations...");

        try {
            const provider = await ownerWallet.getEthereumProvider();
            const walletClient = createWalletClient({
                account: ownerWallet.address as `0x${string}`,
                chain: sepolia,
                transport: custom(provider),
            });
            const publicClient = createPublicClient({
                chain: sepolia,
                transport: custom(provider)
            });

            await ownerWallet.switchChain(sepolia.id);

            // 1. Just-In-Time Backend Faucet Check
            const balance = await publicClient.getBalance({ address: ownerWallet.address as `0x${string}` });
            const minimumGasRequired = 500000000000000n; // 0.0005 ETH
            
            if (balance < minimumGasRequired) {
                toast.loading("Insufficient gas. Relayer is funding your embedded wallet...", { id: loadingId });
                
                const response = await fetch('/api/relay/fund-wallet', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ targetWallet: ownerWallet.address })
                });

                if (!response.ok) {
                    const errorObj = await response.json().catch(() => ({}));
                    throw new Error(errorObj.error || "Backend gas funding failed. You might need to manually fund your Sepolia address.");
                }
                
                toast.loading("Wallet funded! Requesting signature to add auditor...", { id: loadingId });
            } else {
                toast.loading("Requesting signature to add auditor...", { id: loadingId });
            }

            const { request } = await publicClient.simulateContract({
                account: ownerWallet.address as `0x${string}`,
                address: REGISTRY_ADDRESS,
                abi: ComplianceRegistryABI,
                functionName: "addAuditor",
                args: [proxyAccount as `0x${string}`, getAddress(newAuditorAddress)],
            });

            toast.loading("Transaction signed. Adding auditor & retro-granting FHE access...", { id: loadingId });
            
            const hash = await walletClient.writeContract(request);
            await publicClient.waitForTransactionReceipt({ hash });

            toast.success("External auditor successfully added!", { id: loadingId });
            setNewAuditorAddress("");
            fetchAuditors();
        } catch (err: any) {
            console.error(err);
            toast.error(err.shortMessage || err.message || "Failed to add auditor", { id: loadingId });
        } finally {
            setIsManaging(false);
        }
    };

    const handleRemove = async (auditorAddr: string) => {
        const ownerWallet = wallets?.find((w) => w.walletClientType === "privy");
        if (!ownerWallet) return toast.error("Connect wallet");

        setIsManaging(true);
        const loadingId = toast.loading("Checking wallet balance for FHE operations...");

        try {
            const provider = await ownerWallet.getEthereumProvider();
            const walletClient = createWalletClient({
                account: ownerWallet.address as `0x${string}`,
                chain: sepolia,
                transport: custom(provider),
            });
            const publicClient = createPublicClient({
                chain: sepolia,
                transport: custom(provider)
            });

            await ownerWallet.switchChain(sepolia.id);

            // 1. Just-In-Time Backend Faucet Check
            const balance = await publicClient.getBalance({ address: ownerWallet.address as `0x${string}` });
            const minimumGasRequired = 500000000000000n; // 0.0005 ETH
            
            if (balance < minimumGasRequired) {
                toast.loading("Insufficient gas. Relayer is funding your embedded wallet...", { id: loadingId });
                
                const response = await fetch('/api/relay/fund-wallet', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ targetWallet: ownerWallet.address })
                });

                if (!response.ok) {
                    const errorObj = await response.json().catch(() => ({}));
                    throw new Error(errorObj.error || "Backend gas funding failed.");
                }
                
                toast.loading("Wallet funded! Requesting signature to remove auditor...", { id: loadingId });
            } else {
                toast.loading("Requesting signature to remove auditor...", { id: loadingId });
            }

            const { request } = await publicClient.simulateContract({
                account: ownerWallet.address as `0x${string}`,
                address: REGISTRY_ADDRESS,
                abi: ComplianceRegistryABI,
                functionName: "removeAuditor",
                args: [proxyAccount as `0x${string}`, auditorAddr as `0x${string}`],
            });
            
            const hash = await walletClient.writeContract(request);
            await publicClient.waitForTransactionReceipt({ hash });

            toast.success("External auditor successfully removed!", { id: loadingId });
            fetchAuditors();
        } catch (err: any) {
            toast.error(err.shortMessage || err.message || "Failed to remove auditor", { id: loadingId });
        } finally {
            setIsManaging(false);
        }
    };

    const handleCopyLink = async () => {
        if (!proxyAccount) return;
        setIsCopying(true);
        const url = `${window.location.origin}/auditor/${proxyAccount}`;
        try {
            await navigator.clipboard.writeText(url);
            toast.success("Auditor portal link copied to clipboard!");
            setTimeout(() => setIsCopying(false), 2000);
        } catch (err) {
            toast.error("Failed to copy link");
            setIsCopying(false);
        }
    };

    return (
        <Card className="max-w-3xl">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5" />
                        External Auditors Access
                    </CardTitle>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleCopyLink}
                        disabled={!proxyAccount}
                        className="gap-2"
                    >
                        {isCopying ? <Check className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
                        {isCopying ? "Copied!" : "Share Portal Link"}
                    </Button>
                </div>
                <CardDescription>
                    Manage the third-party auditors who can view your encrypted compliance records.
                    Zama's Fully Homomorphic Encryption guarantees only authorized addresses can decrypt your ledger.
                    Up to 3 auditors allowed.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-sm font-medium">Currently Authorized Auditors</h3>
                    
                    {isLoading ? (
                         <div className="py-4 flex justify-center text-muted-foreground">
                             <Loader2 className="h-5 w-5 animate-spin" />
                         </div>
                    ) : auditors.length === 0 ? (
                        <div className="bg-muted/30 border border-dashed rounded-lg p-6 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
                            <Fingerprint className="h-8 w-8 text-muted-foreground/50" />
                            No external auditors configured.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {auditors.map((auditor, i) => (
                                <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-card text-sm">
                                    <span className="font-mono">{auditor}</span>
                                    <Button 
                                        variant="destructive" 
                                        size="sm" 
                                        onClick={() => handleRemove(auditor)}
                                        disabled={isManaging}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-sm font-medium">Add New Auditor</h3>
                    <div className="flex gap-2">
                        <Input 
                            value={newAuditorAddress}
                            onChange={(e) => setNewAuditorAddress(e.target.value)}
                            placeholder="0x... (e.g. 0x123...abc)"
                            className="font-mono"
                            disabled={isManaging || auditors.length >= 3}
                        />
                        <Button 
                            onClick={handleAdd} 
                            disabled={isManaging || !newAuditorAddress || auditors.length >= 3}
                            className="shrink-0"
                        >
                            {isManaging ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <UserPlus className="h-4 w-4 mr-2" />}
                            Grant Access
                        </Button>
                    </div>
                    {auditors.length >= 3 && (
                        <p className="text-sm text-destructive font-medium">
                            You have reached the maximum limit of 3 external auditors. Please remove one to add another.
                        </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                        Adding a new auditor securely re-evaluates Zama FHE conditions and grants retroactive decryption capabilities over your entire history log to the new EOA.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
