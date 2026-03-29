import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, ShieldCheck, ExternalLink, LockIcon, UnlockIcon, RefreshCw, Loader2 } from "lucide-react";
import { useSepoliaAuditLogs, SepoliaAuditRecord } from "@/hooks/useSepoliaAuditLogs";
import { Input } from "@/components/ui/input";

interface AuditTrailProps {
    walletAddress?: string;
    recordsOverride?: SepoliaAuditRecord[];
    onDecrypt?: () => void;
    isDecrypting?: boolean;
    isLoading?: boolean;
}

export function AuditTrail({ walletAddress, recordsOverride, onDecrypt, isDecrypting = false, isLoading = false }: AuditTrailProps) {
    const {
        records: hookedRecords,
        isLoading: hookedIsLoading,
        isDecrypting: hookedIsDecrypting,
        fetchLogs,
        decryptLedger: hookedDecrypt
    } = useSepoliaAuditLogs(walletAddress);

    const records = recordsOverride || hookedRecords;
    const currentIsLoading = recordsOverride ? isLoading : hookedIsLoading;
    const currentIsDecrypting = recordsOverride ? isDecrypting : hookedIsDecrypting;
    const decryptLedger = onDecrypt || hookedDecrypt;

    const [searchTerm, setSearchTerm] = useState("");
    
    // Automatically fetch logs when the component mounts if we have a wallet address and no override
    useEffect(() => {
        if (walletAddress && !recordsOverride) {
            fetchLogs();
        }
    }, [walletAddress, fetchLogs, recordsOverride]);

    const displayRecords = searchTerm 
        ? records.filter(r => r.flowTxHash.toLowerCase().includes(searchTerm.toLowerCase()) || r.recipients.some(rec => rec.toLowerCase().includes(searchTerm.toLowerCase())))
        : records;

    const totalPaid = displayRecords.reduce((sum, item) => {
        return sum + item.amounts.reduce((subSum, amt) => subSum + parseFloat(amt), 0);
    }, 0);

    const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        True Compliance Ledger
                    </CardTitle>
                    <CardDescription className="mt-1">
                        Immutable Sepolia audit trail with end-to-end Zama decryption.
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    {!recordsOverride && (
                        <Button variant="outline" size="sm" onClick={fetchLogs} disabled={currentIsLoading}>
                            <RefreshCw className={`h-4 w-4 mr-2 ${currentIsLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    )}
                    {!recordsOverride && (
                        <Button 
                            variant="default" 
                            size="sm" 
                            onClick={decryptLedger} 
                            disabled={currentIsDecrypting || records.length === 0 || records.every(r => r.decrypted)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            {currentIsDecrypting ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : records.some(r => r.decrypted) ? (
                                <UnlockIcon className="h-4 w-4 mr-2" />
                            ) : (
                                <LockIcon className="h-4 w-4 mr-2" />
                            )}
                            {records.length > 0 && records.every(r => r.decrypted) ? "Ledger Decrypted" : "Decrypt Ledger"}
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-6 flex-1 overflow-auto">
                <div className="flex gap-2">
                    <Input
                        placeholder="Search by TxHash or Recipient Address..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-md"
                    />
                </div>

                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    {currentIsLoading && records.length === 0 ? (
                        <div className="py-12 flex justify-center text-muted-foreground">
                            <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                    ) : displayRecords.length > 0 ? (
                        <>
                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Payments Found</div>
                                    <div className="text-2xl font-bold">{displayRecords.length}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Value</div>
                                    <div className="text-2xl font-bold">{totalPaid.toLocaleString(undefined, { maximumFractionDigits: 4 })} FLOW</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {displayRecords.map((record) => (
                                    <div key={record.recordIndex} className="p-4 bg-card border rounded-lg hover:border-primary/50 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="font-medium text-sm flex items-center gap-2">
                                                {record.timestamp.toLocaleString()}
                                                <a
                                                    href={`https://evm-testnet.flowscan.io/tx/${record.flowTxHash}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-xs text-primary hover:underline flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded"
                                                >
                                                    View Source Tx <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </div>
                                            <div className="flex gap-2 items-center">
                                                {record.decrypted ? (
                                                    <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                                                        <UnlockIcon className="h-3 w-3 mr-1" /> Decrypted
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                                                        <LockIcon className="h-3 w-3 mr-1" /> Encrypted
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2 mt-3 pl-2 border-l-2 border-muted">
                                            {record.recipients.map((recipient, i) => (
                                                <div key={i} className="grid grid-cols-12 gap-2 text-sm items-center py-1">
                                                    <div className="col-span-4 font-mono text-muted-foreground">
                                                        {formatAddress(recipient)}
                                                    </div>
                                                    <div className="col-span-2 font-medium">
                                                        {record.amounts[i]} FLOW
                                                    </div>
                                                    <div className="col-span-3">
                                                        {record.decrypted && record.categories ? (
                                                            <span className="px-2 py-1 bg-secondary rounded text-xs">
                                                                Cat: {record.categories[i]}
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-1 bg-muted rounded text-xs font-mono opacity-50 blur-[2px]">
                                                                {record.encryptedCategories[i].slice(0, 10)}...
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="col-span-3">
                                                        {record.decrypted && record.jurisdictions ? (
                                                            <span className="px-2 py-1 bg-secondary rounded text-xs">
                                                                Jur: {record.jurisdictions[i]}
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-1 bg-muted rounded text-xs font-mono opacity-50 blur-[2px]">
                                                                {record.encryptedJurisdictions[i].slice(0, 10)}...
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                            No immutable audit records found on Sepolia for this wallet.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
