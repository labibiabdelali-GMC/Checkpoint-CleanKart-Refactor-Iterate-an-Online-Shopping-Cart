// ITERATION 3 - CLEAN CODE + DESIGN PATTERNS
// The cart now only does cart things (add, remove, total).
// Discounts  -> Strategy (discounts.js)
// Alerts     -> Observer (priceAlerts.js)
// Products   -> Builder  (Product.js)

const { NoDiscount } = require("./discounts");
const { PriceAlerts } = require("./priceAlerts");

const TAX_RATE = 0.08;

class ShoppingCart {
  constructor() {
    this.items = []; // each item: { product, quantity }
    this.discount = new NoDiscount();
    this.priceAlerts = new PriceAlerts();
  }

  findItem(name) {
    return this.items.find((item) => item.product.name === name);
  }

  addItem(product, quantity = 1) {
    const existing = this.findItem(product.name);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }
  }

  removeItem(name) {
    this.items = this.items.filter((item) => item.product.name !== name);
  }

  changePrice(name, newPrice) {
    const item = this.findItem(name);
    if (!item) return;

    const oldPrice = item.product.price;
    item.product.price = newPrice;
    if (newPrice < oldPrice) {
      this.priceAlerts.notifyPriceDrop(item.product, oldPrice, newPrice);
    }
  }

  setDiscount(discountStrategy) {
    this.discount = discountStrategy;
  }

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  getDiscount() {
    return this.discount.calculate(this.getSubtotal());
  }

  getTax() {
    return (this.getSubtotal() - this.getDiscount()) * TAX_RATE;
  }

  getTotal() {
    return this.getSubtotal() - this.getDiscount() + this.getTax();
  }

  printReceipt() {
    for (const { product, quantity } of this.items) {
      console.log(`  ${quantity} x ${product.name} @ $${product.price}`);
    }
    console.log(`Subtotal: $${this.getSubtotal().toFixed(2)}`);
    console.log(`Discount: $${this.getDiscount().toFixed(2)}`);
    console.log(`Tax:      $${this.getTax().toFixed(2)}`);
    console.log(`TOTAL:    $${this.getTotal().toFixed(2)}`);
  }
}

module.exports = { ShoppingCart };
