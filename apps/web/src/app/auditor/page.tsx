"use client";

import React, { useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Lock, Search, Eye, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { createPublicClient, http, getContract, hexToString, bytesToHex } from "viem";
import { sepolia } from "viem/chains"; // Using Sepolia standard for Zama Devnet representation
import { ComplianceRegistryABI } from "@/lib/abi/ComplianceRegistryABI";
import { JURISDICTION_DISPLAY, CATEGORY_DISPLAY } from "@/lib/compliance-enums";
import { getFhevmInstance } from "@/lib/fhevm";
import { BrowserProvider } from "ethers";

// Hardcoded Zama Registry Address (we should import this if it's dynamic)
// NOTE: Must replace with deployed ComplianceRegistry address!
const COMPLIANCE_REGISTRY_ADDR = "0x0000000000000000000000000000000000000000" as `0x${string}`;

type ComplianceRecord = {
  index: number;
  flowTxHash: string;
  recipients: readonly `0x${string}`[];
  amounts: readonly bigint[];
  timestamp: bigint;
  decryptedCategory?: string;
  decryptedJurisdiction?: string;
};

export default function AuditorPortal() {
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const connectedWallet = wallets?.[0];
  
  const [proxyAddress, setProxyAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [records, setRecords] = useState<ComplianceRecord[]>([]);

  // Simple public client connected to Zama Devnet (using Sepolia settings internally if needed)
  const zamaClient = createPublicClient({
    chain: {
      id: 8008135,
      name: "Zama Devnet",
      nativeCurrency: { name: "ZAMA", symbol: "ZAMA", decimals: 18 },
      rpcUrls: { default: { http: ["https://devnet.zama.ai"] } }
    },
    transport: http()
  });

  const handleSearch = async () => {
    if (!proxyAddress || !proxyAddress.startsWith("0x")) {
      toast.error("Please enter a valid proxy account address");
      return;
    }
    
    setIsSearching(true);
    try {
      const contract = getContract({
        address: COMPLIANCE_REGISTRY_ADDR,
        abi: ComplianceRegistryABI,
        client: zamaClient
      });

      const count = await contract.read.getCompanyRecordCount([proxyAddress as `0x${string}`]);
      
      const fetchedRecords: ComplianceRecord[] = [];
      for (let i = Number(count) - 1; i >= 0; i--) { // Fetch latest first
        const meta = await contract.read.getRecordMetadata([proxyAddress as `0x${string}`, BigInt(i)]);
        fetchedRecords.push({
          index: i,
          flowTxHash: meta[0],
          recipients: meta[1],
          amounts: meta[2],
          timestamp: meta[3]
        });
        if (fetchedRecords.length >= 10) break; // Limit to 10 for demo
      }

      setRecords(fetchedRecords);
      toast.success(`Found ${fetchedRecords.length} records`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch records. Is the registry address correct?");
    } finally {
      setIsSearching(false);
    }
  };

  const handleDecrypt = async (recordIndex: number) => {
    if (!connectedWallet) return toast.error("Connect wallet to decrypt");

    const toastId = toast.loading("Requesting FHE Re-encryption...");
    try {
      const eip1193provider = await connectedWallet.getEthereumProvider();
      const provider = new BrowserProvider(eip1193provider);
      const signer = await provider.getSigner();
      
      const instance = await getFhevmInstance();
      const { publicKey, privateKey } = instance.generateKeypair();
      const eip712 = instance.createEIP712(publicKey, COMPLIANCE_REGISTRY_ADDR);

      // Request user signature for authorization
      const signature = await signer.signTypedData(eip712.domain, { Reencrypt: eip712.types.Reencrypt }, eip712.message);
      
      const contract = getContract({
        address: COMPLIANCE_REGISTRY_ADDR,
        abi: ComplianceRegistryABI,
        client: zamaClient
      });

      // Fetch the encrypted values
      const encCat = await contract.read.getEncryptedCategory([proxyAddress as `0x${string}`, BigInt(recordIndex), 0n]);
      const encJur = await contract.read.getEncryptedJurisdiction([proxyAddress as `0x${string}`, BigInt(recordIndex), 0n]);

      // Re-encrypt them using fhevmjs and the generated signature
      const decCatVal = await instance.reencrypt(BigInt(encCat as unknown as string | bigint), privateKey, publicKey, signature, COMPLIANCE_REGISTRY_ADDR, signer.address);
      const decJurVal = await instance.reencrypt(BigInt(encJur as unknown as string | bigint), privateKey, publicKey, signature, COMPLIANCE_REGISTRY_ADDR, signer.address);

      const catDisplay = CATEGORY_DISPLAY[Number(decCatVal)] || "Unknown";
      const jurDisplay = JURISDICTION_DISPLAY[Number(decJurVal)] || "Unknown";

      // Update UI
      setRecords(prev => prev.map(r => r.index === recordIndex ? {
        ...r,
        decryptedCategory: catDisplay,
        decryptedJurisdiction: jurDisplay
      } : r));

      toast.success("Successfully decrypted via Zama FHE!", { id: toastId });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to decrypt", { id: toastId });
    }
  };

  if (!ready) return <div className="h-screen flex items-center justify-center bg-black text-white">Loading Portal...</div>;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="border-b border-indigo-500/20 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-indigo-400" />
            <h1 className="text-xl font-bold tracking-tight">Complyr <span className="font-light text-muted-foreground">Auditor Portal</span></h1>
          </div>
          {authenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-mono text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">
                {connectedWallet?.address.slice(0,6)}...{connectedWallet?.address.slice(-4)}
              </span>
              <Button onClick={logout} variant="outline" className="border-zinc-800 hover:bg-zinc-800">Disconnect</Button>
            </div>
          ) : (
            <Button onClick={login} className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]">
              Auditor Login
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {!authenticated ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-lg mx-auto">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 shadow-2xl border border-zinc-800">
              <Lock className="w-10 h-10 text-zinc-500" />
            </div>
            <h2 className="text-3xl font-semibold mb-4 bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">Restricted Access</h2>
            <p className="text-zinc-400 mb-8 text-lg">
              This portal is strictly for authorized compliance auditors. Connect your registered wallet to securely decrypt and verify cross-chain financial data.
            </p>
            <Button onClick={login} size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.2)]">
              Connect Auditor Wallet
            </Button>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Search Section */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-semibold mb-2">Locate Business Ledger</h2>
              <p className="text-zinc-400 mb-6">Enter the Smart Wallet Proxy address to retrieve encrypted compliance records anchored from Flow.</p>
              
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <Input 
                    placeholder="0x..." 
                    value={proxyAddress}
                    onChange={(e) => setProxyAddress(e.target.value)}
                    className="pl-12 h-14 bg-black/50 border-zinc-700 text-lg focus-visible:ring-indigo-500"
                  />
                </div>
                <Button 
                  onClick={handleSearch} 
                  disabled={isSearching} 
                  className="h-14 px-8 bg-white text-black hover:bg-zinc-200 font-semibold text-lg"
                >
                  {isSearching ? "Searching..." : "Retrieve Ledger"}
                </Button>
              </div>
            </div>

            {/* Results Section */}
            {records.length > 0 && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm">
                <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-green-400" />
                    Encrypted Ledger
                  </h3>
                  <span className="text-sm font-mono text-zinc-500">Source: Zama fhEVM</span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="text-xs uppercase text-zinc-500 border-b border-zinc-800 bg-black/20">
                      <tr>
                        <th className="px-6 py-4 font-medium">Date</th>
                        <th className="px-6 py-4 font-medium">Flow TX Hash</th>
                        <th className="px-6 py-4 font-medium">Tvl (FLOW)</th>
                        <th className="px-6 py-4 font-medium min-w-[300px]">Compliance Payload (FHE)</th>
                        <th className="px-6 py-4 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {records.map((r) => (
                        <tr key={r.index} className="hover:bg-zinc-800/20 transition-colors">
                          <td className="px-6 py-4 text-sm text-zinc-300">
                            {new Date(Number(r.timestamp) * 1000).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm font-mono text-zinc-400">
                            {r.flowTxHash.slice(0, 10)}... <ExternalLink className="w-3 h-3 inline pb-0.5" />
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-zinc-200">
                            {r.amounts.length} recipient(s)
                          </td>
                          <td className="px-6 py-4">
                            {r.decryptedCategory ? (
                              <div className="flex items-center gap-3 animate-in fade-in zoom-in duration-500">
                                <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-md text-sm font-medium">
                                  {r.decryptedCategory}
                                </span>
                                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-md text-sm font-medium">
                                  {r.decryptedJurisdiction}
                                </span>
                              </div>
                            ) : (
                              <div className="flex gap-2 isolate">
                                <span className="inline-flex overflow-hidden rounded-md border border-zinc-700/50 bg-black/50 text-[10px] text-zinc-600 font-mono tracking-tighter opacity-70 filter blur-[1px] select-none pointer-events-none px-2 py-1 items-center gap-1">
                                  <Lock className="w-3 h-3" /> FHE_ENCRYPTED_BLOB_0x8F92...
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button 
                              onClick={() => handleDecrypt(r.index)}
                              disabled={!!r.decryptedCategory}
                              size="sm"
                              className={r.decryptedCategory ? "bg-zinc-800 text-zinc-500" : "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300 border border-indigo-500/20"}
                            >
                              {r.decryptedCategory ? "Verified" : (
                                <><Eye className="w-4 h-4 mr-2" /> Decrypt</>
                              )}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
