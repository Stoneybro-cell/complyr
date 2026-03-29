"use client";

import { useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComplianceOverview } from "@/components/compliance/ComplianceOverview";
import { TaxReportGenerator } from "@/components/compliance/TaxReportGenerator";
import { AuditTrail } from "@/components/compliance/AuditTrail";
import { AuditorsManager } from "@/components/compliance/AuditorsManager";
import { useSepoliaAuditLogs } from "@/hooks/useSepoliaAuditLogs";
import { Button } from "@/components/ui/button";
import { Loader2, LockIcon, UnlockIcon, RefreshCw, AlertTriangle } from "lucide-react";
import { ComplianceStats, ComplianceData } from "@/hooks/useComplianceData";

interface ComplianceDashboardProps {
    walletAddress?: string;
    isExternalAuditor?: boolean; // Hides Access Control Tab
}

export function ComplianceDashboard({ walletAddress, isExternalAuditor = false }: ComplianceDashboardProps) {
    const {
        records,
        isLoading,
        isDecrypting,
        fetchLogs,
        decryptLedger
    } = useSepoliaAuditLogs(walletAddress);

    useEffect(() => {
        if (walletAddress) {
            fetchLogs();
        }
    }, [walletAddress, fetchLogs]);

    // Transform SepoliaAuditRecord[] into flat ComplianceData[] for children
    const parsedData = useMemo(() => {
        const flat: ComplianceData[] = [];
        const stats: ComplianceStats = {
            totalCategorized: 0,
            totalUncategorized: 0,
            byJurisdiction: {},
            byCategory: {},
            healthScore: 0
        };

        records.forEach(record => {
            record.recipients.forEach((recipient, i) => {
                const amountFlow = parseFloat(record.amounts[i]);
                const cat = record.decrypted && record.categories ? record.categories[i] : "Encrypted";
                const jur = record.decrypted && record.jurisdictions ? record.jurisdictions[i] : "Encrypted";
                
                // For TaxReport generator compatibility, multiply by 1e18 since it divides by 1e18
                const amountWei = (amountFlow * 1e18).toString();

                flat.push({
                    date: record.timestamp,
                    txHash: record.flowTxHash,
                    amount: amountWei,
                    currency: "FLOW",
                    entityId: "SepoliaLedger",
                    jurisdiction: jur,
                    category: cat,
                    periodId: "N/A",
                    reference: "Zama FHE Record",
                    details: {},
                    recipientAddress: recipient
                });

                if (record.decrypted) {
                    if (jur !== "Not Specified" && jur !== "Unknown") {
                        if (!stats.byJurisdiction[jur]) stats.byJurisdiction[jur] = { count: 0, amount: 0 };
                        stats.byJurisdiction[jur].count++;
                        stats.byJurisdiction[jur].amount += amountFlow;
                    }
                    if (cat !== "Not Specified" && cat !== "Unknown") {
                        if (!stats.byCategory[cat]) stats.byCategory[cat] = { count: 0, amount: 0 };
                        stats.byCategory[cat].count++;
                        stats.byCategory[cat].amount += amountFlow;
                    }
                    if (jur !== "Not Specified" || cat !== "Not Specified") {
                        stats.totalCategorized++;
                    } else {
                        stats.totalUncategorized++;
                    }
                } else {
                    stats.totalUncategorized++;
                }
            });
        });

        const isAnyRecord = records.length > 0;
        const totalTx = stats.totalCategorized + stats.totalUncategorized;
        stats.healthScore = totalTx > 0 ? Math.round((stats.totalCategorized / totalTx) * 100) : (isAnyRecord ? 0 : 100);

        return { flat, stats };
    }, [records]);

    const recordCount = records.length;
    const allDecrypted = recordCount > 0 && records.every(r => r.decrypted);

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold tracking-tight">Compliance Dashboard</h2>
                    <p className="text-muted-foreground">
                        Monitor zero-knowledge compliance health directly from Sepolia.
                    </p>
                </div>
                
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={fetchLogs} disabled={isLoading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button 
                        variant={allDecrypted ? "secondary" : "default"} 
                        onClick={decryptLedger} 
                        disabled={isDecrypting || recordCount === 0 || allDecrypted}
                        className={allDecrypted ? "" : "bg-emerald-600 hover:bg-emerald-700 text-white"}
                    >
                        {isDecrypting ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : allDecrypted ? (
                            <UnlockIcon className="h-4 w-4 mr-2" />
                        ) : (
                            <LockIcon className="h-4 w-4 mr-2" />
                        )}
                        {allDecrypted ? "Fully Decrypted" : "Unlock Ledger via KMS"}
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-3 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-lg text-sm">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <p>
                    <strong>Note:</strong> We are now exclusively reading immutable records directly from the Sepolia FHE smart contract. Data is only available once LayerZero successfully relays the confirmation. Stats remain hidden until decrypted.
                </p>
            </div>

            {isLoading && records.length === 0 ? (
                <div className="py-12 flex flex-col justify-center items-center text-muted-foreground gap-4">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p>Securing connection to Sepolia FHEVM...</p>
                </div>
            ) : (
                <Tabs defaultValue="overview" className="space-y-4 h-full flex flex-col">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="reports">Tax Reports</TabsTrigger>
                        <TabsTrigger value="audit">Audit Trail</TabsTrigger>
                        {!isExternalAuditor && (
                            <TabsTrigger value="auditors">Access Control</TabsTrigger>
                        )}
                    </TabsList>

                    <div className="flex-1 overflow-auto">
                        <TabsContent value="overview" className="space-y-4 m-0">
                            <ComplianceOverview stats={parsedData.stats} />
                        </TabsContent>

                        <TabsContent value="reports" className="space-y-4 m-0 h-full">
                            <TaxReportGenerator data={parsedData.flat} />
                        </TabsContent>

                        <TabsContent value="audit" className="space-y-4 m-0 h-full">
                            <AuditTrail walletAddress={walletAddress} recordsOverride={records} onDecrypt={decryptLedger} isDecrypting={isDecrypting} isLoading={isLoading} />
                        </TabsContent>
                        
                        {!isExternalAuditor && (
                            <TabsContent value="auditors" className="space-y-4 m-0 h-full">
                                <AuditorsManager proxyAccount={walletAddress} />
                            </TabsContent>
                        )}
                    </div>
                </Tabs>
            )}
        </div>
    );
}
