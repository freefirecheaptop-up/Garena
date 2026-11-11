import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedAdmin } from '@/lib/auth';
import { updateOrderStatus } from '@/lib/orders-db';
import { OrderStatus } from '@/lib/packages';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Admin credentials required.' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { status, adminNotes } = body;

    const validStatuses: OrderStatus[] = ['pending', 'verifying', 'paid', 'failed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const result = await updateOrderStatus(id, status, adminNotes);
    if (!result.success || !result.order) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, order: result.order });
  } catch (error) {
    console.error('Admin update order error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order status.' },
      { status: 500 }
    );
  }
}
