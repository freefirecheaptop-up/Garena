import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DIAMOND_PACKAGES,
  validatePlayerUID,
  getPackageById,
  calculateOrderPrice,
} from './packages.ts';

test('every diamond package has exactly 50% reduced price', () => {
  assert.ok(DIAMOND_PACKAGES.length >= 6, 'Must have all standard packages');
  for (const pkg of DIAMOND_PACKAGES) {
    const expected = Math.round(pkg.originalPrice * 0.5);
    assert.equal(
      pkg.discountedPrice,
      expected,
      `Package ${pkg.id} (${pkg.name}) discounted price must be exactly 50% of ₹${pkg.originalPrice}`
    );
    assert.ok(pkg.diamonds > 0, `Diamonds must be positive`);
    assert.equal(
      pkg.totalDiamonds,
      pkg.diamonds + pkg.bonus,
      `Total diamonds must equal base diamonds + bonus`
    );
  }
});

test('check specified benchmark prices from prompt', () => {
  const benchmarks: Record<number, number> = {
    80: 40,
    160: 80,
    240: 120,
    400: 200,
    800: 400,
    1600: 800,
  };

  for (const [orig, disc] of Object.entries(benchmarks)) {
    const pkg = DIAMOND_PACKAGES.find((p) => p.originalPrice === Number(orig));
    assert.ok(pkg, `Should find package for original price ₹${orig}`);
    assert.equal(pkg.discountedPrice, disc, `₹${orig} must discount to ₹${disc}`);
  }
});

test('validates Free Fire Player UID correctly', () => {
  // Valid cases
  assert.equal(validatePlayerUID('12345678').valid, true);
  assert.equal(validatePlayerUID('1077889123').valid, true);
  assert.equal(validatePlayerUID('987654321012').valid, true);
  assert.equal(validatePlayerUID('  1077889123  ').cleanUID, '1077889123');

  // Invalid cases
  assert.equal(validatePlayerUID('').valid, false);
  assert.equal(validatePlayerUID('   ').valid, false);
  assert.equal(validatePlayerUID('abc12345').valid, false);
  assert.equal(validatePlayerUID('1234567').valid, false); // only 7 digits
  assert.equal(validatePlayerUID('1234567890123').valid, false); // 13 digits
});

test('calculateOrderPrice enforces server-side 50% discount and safety', () => {
  const valid = calculateOrderPrice('ff-100');
  assert.equal(valid.success, true);
  assert.equal(valid.originalPrice, 80);
  assert.equal(valid.discountedPrice, 40);

  const invalid = calculateOrderPrice('invalid-pack-id');
  assert.equal(invalid.success, false);
});
