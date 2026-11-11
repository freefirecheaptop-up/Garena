import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createNewOrder,
  getOrderById,
  updateOrderUtr,
  updateOrderStatus,
  getAdminSummaryStats,
} from './orders-db.ts';

test('createNewOrder creates valid order with server-enforced 50% price', async () => {
  const result = await createNewOrder({
    playerUid: '1077889123',
    inGameName: 'ProSniper',
    packageId: 'ff-400' in {} ? 'ff-400' : 'ff-520',
  });

  assert.equal(result.success, true);
  assert.ok(result.order);
  assert.equal(result.order.playerUid, '1077889123');
  assert.equal(result.order.packageId, 'ff-520');
  assert.equal(result.order.originalPrice, 400);
  assert.equal(result.order.discountedPrice, 200);
  assert.equal(result.order.paymentStatus, 'pending');
  assert.ok(result.order.id.startsWith('FF-1077-'));

  // Test retrieval
  const retrieved = await getOrderById(result.order.id);
  assert.ok(retrieved);
  assert.equal(retrieved.id, result.order.id);

  // Test UTR submission
  const utrRes = await updateOrderUtr(result.order.id, 'RPX-TEST-778899');
  assert.equal(utrRes.success, true);
  assert.equal(utrRes.order?.paymentStatus, 'verifying');
  assert.equal(utrRes.order?.utrReference, 'RPX-TEST-778899');

  // Test admin status update
  const adminRes = await updateOrderStatus(result.order.id, 'paid', 'Verified and diamonds transferred.');
  assert.equal(adminRes.success, true);
  assert.equal(adminRes.order?.paymentStatus, 'paid');
  assert.ok(adminRes.order?.verifiedAt);

  // Test admin summary stats
  const stats = await getAdminSummaryStats();
  assert.ok(stats.totalOrders >= 1);
  assert.ok(stats.totalRevenue >= 200);
});

test('createNewOrder rejects invalid player UID', async () => {
  const result = await createNewOrder({
    playerUid: 'short',
    packageId: 'ff-100',
  });
  assert.equal(result.success, false);
});
