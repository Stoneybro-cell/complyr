"use client";

import { useEffect, useState } from "react";
import { ComplianceDashboard } from "@/components/compliance/ComplianceDashboard";

export default function CompliancePage() {
    const [address, setAddress] = useState<string | undefined>(undefined);

    useEffect(() => {
        const saved = localStorage.getItem("wallet-deployed");
        if (saved) setAddress(saved);
    }, []);

    return (
        <div className="flex flex-col h-full w-full p-6">
            <ComplianceDashboard walletAddress={address} />
        </div>
    );
}
