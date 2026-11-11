import { NextRequest, NextResponse } from 'next/server';
import { createNewOrder, getOrdersByPlayerUid, getOrderById } from '@/lib/orders-db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { playerUid, inGameName, packageId } = body;

    if (!playerUid || !packageId) {
      return NextResponse.json(
        { success: false, error: 'Both Player UID and Package Selection are required.' },
        { status: 400 }
      );
    }

    const result = await createNewOrder({
      playerUid: String(playerUid),
      inGameName: inGameName ? String(inGameName) : undefined,
      packageId: String(packageId),
    });

    if (!result.success || !result.order) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      order: result.order,
      paymentUrl: result.order.paymentUrl,
    });
  } catch (error) {
    console.error('API create order error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing top-up order.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get('uid');
  const id = searchParams.get('id');

  if (id) {
    const order = await getOrderById(id);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, orders: [order] });
  }

  if (uid) {
    const orders = await getOrdersByPlayerUid(uid);
    return NextResponse.json({ success: true, orders });
  }

  return NextResponse.json(
    { success: false, error: 'Provide order ID or Player UID to search.' },
    { status: 400 }
  );
}
