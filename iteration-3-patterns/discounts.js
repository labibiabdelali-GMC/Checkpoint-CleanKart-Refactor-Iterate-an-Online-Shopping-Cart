// STRATEGY PATTERN
// Each discount is its own small object with one method: calculate(subtotal).
// The cart doesn't care WHICH discount it has - it just calls calculate().
// To add a new discount, write a new class. No existing code needs to change.

class NoDiscount {
  calculate() {
    return 0;
  }
}

class PercentageDiscount {
  constructor(percent) {
    this.percent = percent;
  }

  calculate(subtotal) {
    return subtotal * (this.percent / 100);
  }
}

class FlatDiscount {
  constructor(amount) {
    this.amount = amount;
  }

  calculate(subtotal) {
    return Math.min(this.amount, subtotal); // never discount more than the cart is worth
  }
}

// 20% off big orders, 10% off everything else
class BigOrderDiscount {
  constructor(threshold) {
    this.threshold = threshold;
  }

  calculate(subtotal) {
    const percent = subtotal > this.threshold ? 20 : 10;
    return subtotal * (percent / 100);
  }
}

// Maps coupon codes to strategies. Adding a coupon = adding one line here.
const COUPONS = {
  SAVE10: new PercentageDiscount(10),
  SAVE20: new BigOrderDiscount(100),
  FLAT15: new FlatDiscount(15),
  BLACKFRIDAY: new PercentageDiscount(50),
};

function discountForCoupon(code) {
  return COUPONS[code] || new NoDiscount();
}

module.exports = {
  NoDiscount,
  PercentageDiscount,
  FlatDiscount,
  BigOrderDiscount,
  discountForCoupon,
};
