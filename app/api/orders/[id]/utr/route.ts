import { NextRequest, NextResponse } from 'next/server';
import { updateOrderUtr } from '@/lib/orders-db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { utr } = body;

    if (!utr || typeof utr !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Valid UTR/Transaction Reference ID is required.' },
        { status: 400 }
      );
    }

    const result = await updateOrderUtr(id, utr);
    if (!result.success || !result.order) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, order: result.order });
  } catch (error) {
    console.error('API submit UTR error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record transaction reference.' },
      { status: 500 }
    );
  }
}
