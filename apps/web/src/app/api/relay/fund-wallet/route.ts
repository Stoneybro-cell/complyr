import { NextRequest, NextResponse } from "next/server";
import { createWalletClient, http, createPublicClient, parseEther } from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

export async function POST(req: NextRequest) {
    try {
        const { targetWallet } = await req.json();

        if (!targetWallet || !targetWallet.startsWith("0x") || targetWallet.length !== 42) {
            return NextResponse.json({ error: "Invalid target wallet address" }, { status: 400 });
        }

        const rawKey = process.env.RELAY_PRIVATE_KEY;
        if (!rawKey) {
            return NextResponse.json(
                { error: "Relay not configured — RELAY_PRIVATE_KEY missing" },
                { status: 500 }
            );
        }

        const privateKey = rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;
        const account = privateKeyToAccount(privateKey as `0x${string}`);

        const publicClient = createPublicClient({
            chain: sepolia,
            transport: http("https://ethereum-sepolia-rpc.publicnode.com"),
        });

        const walletClient = createWalletClient({
            account,
            chain: sepolia,
            transport: http("https://ethereum-sepolia-rpc.publicnode.com"),
        });

        // The user requested 0.0001 ETH, but FHE operations (retroactive FHE.allow array loops)
        // are very gas-heavy. If the ledger has many records, 0.0001 might run out of gas.
        // We will send exactly what they requested (0.0001) but keep in mind we might need to increase it.
        const fundAmount = parseEther("0.001");

        // Check the relayer's balance to make sure we don't drain or crash
        const relayerBalance = await publicClient.getBalance({ address: account.address });
        if (relayerBalance < fundAmount) {
            return NextResponse.json(
                { error: "Relayer has insufficient Sepolia ETH to sponsor." },
                { status: 500 }
            );
        }

        console.log(`[relay-fund] Funding connected embedded wallet ${targetWallet} with 0.001 ETH...`);

        const hash = await walletClient.sendTransaction({
            to: targetWallet as `0x${string}`,
            value: fundAmount,
        });

        console.log(`[relay-fund] Transfer initiated (tx: ${hash})`);

        await publicClient.waitForTransactionReceipt({
            hash,
            timeout: 60_000,
        });

        return NextResponse.json({
            success: true,
            txHash: hash,
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[relay-fund] Funding failed:", message);
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}
