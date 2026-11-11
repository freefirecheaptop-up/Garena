import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedAdmin } from '@/lib/auth';
import { getAllOrders, getAdminSummaryStats } from '@/lib/orders-db';

export async function GET(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Admin credentials required.' },
      { status: 401 }
    );
  }

  try {
    const orders = await getAllOrders();
    const stats = await getAdminSummaryStats();
    return NextResponse.json({ success: true, orders, stats });
  } catch (error) {
    console.error('Admin get orders error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve admin orders.' },
      { status: 500 }
    );
  }
}
