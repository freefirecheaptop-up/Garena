import fs from 'fs/promises';
import path from 'path';
import {
  DiamondPackage,
  OrderRecord,
  OrderStatus,
  calculateOrderPrice,
  OFFICIAL_RUPAYEX_URL,
  validatePlayerUID,
} from './packages.ts';

const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Sample initial seed orders to show realistic historical operations
const INITIAL_SEED_ORDERS: OrderRecord[] = [
  {
    id: 'FF-1077-94182',
    playerUid: '1098472910',
    inGameName: 'RaiStar_FF',
    packageId: 'ff-520',
    packageName: '520 + 52 Diamonds',
    diamonds: 520,
    bonus: 52,
    totalDiamonds: 572,
    originalPrice: 400,
    discountedPrice: 200,
    paymentMethod: 'Rupayex Gateway',
    paymentUrl: OFFICIAL_RUPAYEX_URL,
    paymentStatus: 'paid',
    utrReference: 'RPX-UTR-99210482',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1.8).toISOString(),
    verifiedAt: new Date(Date.now() - 3600000 * 1.8).toISOString(),
    adminNotes: 'Diamonds automatically credited via UID API.',
  },
  {
    id: 'FF-1077-83291',
    playerUid: '8271049281',
    inGameName: 'Legend_Aura',
    packageId: 'ff-1060',
    packageName: '1,060 + 106 Diamonds',
    diamonds: 1060,
    bonus: 106,
    totalDiamonds: 1166,
    originalPrice: 800,
    discountedPrice: 400,
    paymentMethod: 'Rupayex Gateway',
    paymentUrl: OFFICIAL_RUPAYEX_URL,
    paymentStatus: 'verifying',
    utrReference: 'RPX-UTR-88319201',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date(Date.now() - 900000).toISOString(),
    adminNotes: 'Customer submitted UTR. Pending bank confirmation.',
  },
  {
    id: 'FF-1077-72019',
    playerUid: '4928103921',
    inGameName: 'Viper_Boss',
    packageId: 'ff-210',
    packageName: '210 + 21 Diamonds',
    diamonds: 210,
    bonus: 21,
    totalDiamonds: 231,
    originalPrice: 160,
    discountedPrice: 80,
    paymentMethod: 'Rupayex Gateway',
    paymentUrl: OFFICIAL_RUPAYEX_URL,
    paymentStatus: 'pending',
    createdAt: new Date(Date.now() - 600000).toISOString(),
    updatedAt: new Date(Date.now() - 600000).toISOString(),
    adminNotes: 'Awaiting customer payment on Rupayex.',
  },
];

async function ensureDataFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(ORDERS_FILE);
    } catch {
      await fs.writeFile(ORDERS_FILE, JSON.stringify(INITIAL_SEED_ORDERS, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error ensuring orders file exists:', err);
  }
}

export async function getAllOrders(): Promise<OrderRecord[]> {
  await ensureDataFile();
  try {
    const raw = await fs.readFile(ORDERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading orders file:', err);
    return INITIAL_SEED_ORDERS;
  }
}

async function saveOrders(orders: OrderRecord[]): Promise<void> {
  await ensureDataFile();
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
}

export async function getOrderById(id: string): Promise<OrderRecord | null> {
  const orders = await getAllOrders();
  const search = id.trim().toUpperCase();
  return orders.find((o) => o.id.toUpperCase() === search) || null;
}

export async function getOrdersByPlayerUid(playerUid: string): Promise<OrderRecord[]> {
  const orders = await getAllOrders();
  const clean = playerUid.trim();
  return orders.filter((o) => o.playerUid === clean);
}

export interface CreateOrderParams {
  playerUid: string;
  inGameName?: string;
  packageId: string;
}

export async function createNewOrder(params: CreateOrderParams): Promise<{
  success: boolean;
  order?: OrderRecord;
  error?: string;
}> {
  // 1. Validate UID
  const uidCheck = validatePlayerUID(params.playerUid);
  if (!uidCheck.valid || !uidCheck.cleanUID) {
    return { success: false, error: uidCheck.error || 'Invalid Player UID' };
  }

  // 2. Validate package and price (server-side only)
  const priceCheck = calculateOrderPrice(params.packageId);
  if (!priceCheck.success || !priceCheck.package || priceCheck.discountedPrice === undefined) {
    return { success: false, error: priceCheck.error || 'Invalid package' };
  }

  const pkg: DiamondPackage = priceCheck.package;
  const now = new Date().toISOString();
  // Generate distinct readable Order ID with random component
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const orderId = `FF-1077-${randomSuffix}`;

  const newOrder: OrderRecord = {
    id: orderId,
    playerUid: uidCheck.cleanUID,
    inGameName: params.inGameName?.trim() || undefined,
    packageId: pkg.id,
    packageName: pkg.name,
    diamonds: pkg.diamonds,
    bonus: pkg.bonus,
    totalDiamonds: pkg.totalDiamonds,
    originalPrice: pkg.originalPrice,
    discountedPrice: priceCheck.discountedPrice,
    paymentMethod: 'Rupayex Gateway (UPI/Card)',
    paymentUrl: OFFICIAL_RUPAYEX_URL,
    paymentStatus: 'pending',
    createdAt: now,
    updatedAt: now,
    adminNotes: 'Order initiated. Awaiting payment.',
  };

  const orders = await getAllOrders();
  orders.unshift(newOrder); // newest first
  await saveOrders(orders);

  return { success: true, order: newOrder };
}

export async function updateOrderUtr(
  orderId: string,
  utr: string
): Promise<{ success: boolean; order?: OrderRecord; error?: string }> {
  if (!utr || utr.trim().length < 4) {
    return { success: false, error: 'Please enter a valid Transaction Ref / UTR number.' };
  }
  const cleanUtr = utr.trim();
  const orders = await getAllOrders();
  const index = orders.findIndex((o) => o.id.toUpperCase() === orderId.trim().toUpperCase());
  if (index === -1) {
    return { success: false, error: 'Order not found.' };
  }

  orders[index].utrReference = cleanUtr;
  orders[index].paymentStatus = 'verifying';
  orders[index].updatedAt = new Date().toISOString();
  orders[index].adminNotes = `Customer submitted payment UTR: ${cleanUtr}. Verification in progress.`;

  await saveOrders(orders);
  return { success: true, order: orders[index] };
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  adminNotes?: string
): Promise<{ success: boolean; order?: OrderRecord; error?: string }> {
  const orders = await getAllOrders();
  const index = orders.findIndex((o) => o.id.toUpperCase() === orderId.trim().toUpperCase());
  if (index === -1) {
    return { success: false, error: 'Order not found.' };
  }

  orders[index].paymentStatus = newStatus;
  orders[index].updatedAt = new Date().toISOString();
  if (newStatus === 'paid') {
    orders[index].verifiedAt = new Date().toISOString();
  }
  if (adminNotes !== undefined) {
    orders[index].adminNotes = adminNotes;
  }

  await saveOrders(orders);
  return { success: true, order: orders[index] };
}

export async function getAdminSummaryStats(): Promise<{
  totalOrders: number;
  pendingOrders: number;
  verifyingOrders: number;
  paidOrders: number;
  failedOrders: number;
  totalRevenue: number;
  totalDiamondsDelivered: number;
}> {
  const orders = await getAllOrders();
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.paymentStatus === 'pending').length;
  const verifyingOrders = orders.filter((o) => o.paymentStatus === 'verifying').length;
  const paidOrders = orders.filter((o) => o.paymentStatus === 'paid').length;
  const failedOrders = orders.filter((o) => o.paymentStatus === 'failed').length;

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.discountedPrice, 0);

  const totalDiamondsDelivered = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.totalDiamonds, 0);

  return {
    totalOrders,
    pendingOrders,
    verifyingOrders,
    paidOrders,
    failedOrders,
    totalRevenue,
    totalDiamondsDelivered,
  };
}
