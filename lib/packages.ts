export interface DiamondPackage {
  id: string;
  name: string;
  diamonds: number;
  bonus: number;
  totalDiamonds: number;
  originalPrice: number;
  discountedPrice: number;
  category: 'standard' | 'membership' | 'pass';
  popular?: boolean;
  bestValue?: boolean;
  tag?: string;
}

export const DIAMOND_PACKAGES: DiamondPackage[] = [
  {
    id: 'ff-100',
    name: '100 + 10 Diamonds',
    diamonds: 100,
    bonus: 10,
    totalDiamonds: 110,
    originalPrice: 80,
    discountedPrice: 40,
    category: 'standard',
  },
  {
    id: 'ff-210',
    name: '210 + 21 Diamonds',
    diamonds: 210,
    bonus: 21,
    totalDiamonds: 231,
    originalPrice: 160,
    discountedPrice: 80,
    category: 'standard',
  },
  {
    id: 'ff-310',
    name: '310 + 31 Diamonds',
    diamonds: 310,
    bonus: 31,
    totalDiamonds: 341,
    originalPrice: 240,
    discountedPrice: 120,
    category: 'standard',
    popular: true,
    tag: 'Popular',
  },
  {
    id: 'ff-520',
    name: '520 + 52 Diamonds',
    diamonds: 520,
    bonus: 52,
    totalDiamonds: 572,
    originalPrice: 400,
    discountedPrice: 200,
    category: 'standard',
  },
  {
    id: 'ff-1060',
    name: '1,060 + 106 Diamonds',
    diamonds: 1060,
    bonus: 106,
    totalDiamonds: 1166,
    originalPrice: 800,
    discountedPrice: 400,
    category: 'standard',
    bestValue: true,
    tag: 'Best Value',
  },
  {
    id: 'ff-2180',
    name: '2,180 + 218 Diamonds',
    diamonds: 2180,
    bonus: 218,
    totalDiamonds: 2398,
    originalPrice: 1600,
    discountedPrice: 800,
    category: 'standard',
  },
  {
    id: 'ff-pass-weekly',
    name: 'Weekly Membership',
    diamonds: 450,
    bonus: 0,
    totalDiamonds: 450,
    originalPrice: 190,
    discountedPrice: 95,
    category: 'membership',
    tag: 'Weekly VIP',
  },
  {
    id: 'ff-pass-monthly',
    name: 'Monthly Membership',
    diamonds: 2600,
    bonus: 0,
    totalDiamonds: 2600,
    originalPrice: 790,
    discountedPrice: 395,
    category: 'membership',
    tag: 'Monthly VIP',
  },
  {
    id: 'ff-pass-levelup',
    name: 'Level Up Pass (800💎)',
    diamonds: 800,
    bonus: 0,
    totalDiamonds: 800,
    originalPrice: 300,
    discountedPrice: 150,
    category: 'pass',
    tag: '800% ROI',
  },
];

export const OFFICIAL_RUPAYEX_URL = 'https://rupayex.net/payme/1077';

/**
 * Validates Free Fire Player UID:
 * Must be non-empty, numeric string, length between 8 and 12 digits.
 */
export function validatePlayerUID(uid: string): { valid: boolean; error?: string; cleanUID?: string } {
  if (!uid || typeof uid !== 'string') {
    return { valid: false, error: 'Player UID is required.' };
  }
  const clean = uid.trim();
  if (clean.length === 0) {
    return { valid: false, error: 'Player UID cannot be blank.' };
  }
  if (!/^\d+$/.test(clean)) {
    return { valid: false, error: 'Player UID must contain numbers only.' };
  }
  if (clean.length < 8 || clean.length > 12) {
    return { valid: false, error: 'Player UID must be between 8 and 12 digits.' };
  }
  return { valid: true, cleanUID: clean };
}

/**
 * Ensures strict 50% discount price validation.
 * Never trust client prices: this guarantees the exact discount rate.
 */
export function getPackageById(packageId: string): DiamondPackage | null {
  return DIAMOND_PACKAGES.find((pkg) => pkg.id === packageId) || null;
}

export function calculateOrderPrice(packageId: string): {
  success: boolean;
  package?: DiamondPackage;
  originalPrice?: number;
  discountedPrice?: number;
  error?: string;
} {
  const pkg = getPackageById(packageId);
  if (!pkg) {
    return { success: false, error: `Invalid diamond package ID: ${packageId}` };
  }
  // Server-side enforce exactly 50% of original price
  const expectedDiscounted = Math.round(pkg.originalPrice * 0.5);
  return {
    success: true,
    package: pkg,
    originalPrice: pkg.originalPrice,
    discountedPrice: expectedDiscounted,
  };
}

export type OrderStatus = 'pending' | 'verifying' | 'paid' | 'failed';

export interface OrderRecord {
  id: string; // e.g., "FF-1077-88912"
  playerUid: string;
  inGameName?: string;
  packageId: string;
  packageName: string;
  diamonds: number;
  bonus: number;
  totalDiamonds: number;
  originalPrice: number;
  discountedPrice: number;
  paymentMethod: string;
  paymentUrl: string;
  paymentStatus: OrderStatus;
  utrReference?: string;
  createdAt: string;
  updatedAt: string;
  verifiedAt?: string;
  adminNotes?: string;
}
