import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("Mock HSP Order Request received:", body);
        
        const flow_id = crypto.randomUUID();
        const payloadData = {
            flow_id,
            amount: body.amount,
            token: body.token,
        };

        const params = new URLSearchParams(payloadData as Record<string, string>);
        if (body.compliance) {
            params.append('compliance', Buffer.from(JSON.stringify(body.compliance)).toString('base64'));
        }
        
        return NextResponse.json({
            success: true,
            data: {
                payment_url: `/checkout/${flow_id}?${params.toString()}`,
                flow_id: payloadData.flow_id,
                cart_mandate_id: "mock_mandate_" + Date.now()
            }
        });
    } catch (e) {
        console.log("Failed to parse request body");
        return NextResponse.json({ success: false }, { status: 400 });
    }
}


