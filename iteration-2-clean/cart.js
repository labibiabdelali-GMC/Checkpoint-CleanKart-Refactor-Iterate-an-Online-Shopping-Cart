// ITERATION 2 - CLEAN CODE (no design patterns yet)
// What changed from iteration 1:
//   - Renamed everything to clear names (c -> items, calc -> getTotal ...)
//   - Wrapped global state inside a ShoppingCart class
//   - Extracted the repeated "find item" loop into findItem()
//   - Split the long calc() into small methods: getSubtotal, getDiscount, getTax, getTotal
//   - Replaced magic numbers with named constants
//   - Separated calculation from printing (printReceipt)
//   - Deleted the dead oldCalc() function

const TAX_RATE = 0.08;
const BIG_ORDER_THRESHOLD = 100;

class ShoppingCart {
  constructor() {
    this.items = [];
    this.priceAlertEmails = [];
  }

  findItem(name) {
    return this.items.find((item) => item.name === name);
  }

  addItem(product, quantity = 1) {
    const existing = this.findItem(product.name);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ ...product, quantity });
    }
  }

  removeItem(name) {
    this.items = this.items.filter((item) => item.name !== name);
  }

  subscribeToPriceAlerts(email) {
    this.priceAlertEmails.push(email);
  }

  changePrice(name, newPrice) {
    const item = this.findItem(name);
    if (!item) return;

    const oldPrice = item.price;
    item.price = newPrice;
    if (newPrice < oldPrice) {
      this.notifyPriceDrop(name, oldPrice, newPrice);
    }
  }

  notifyPriceDrop(name, oldPrice, newPrice) {
    for (const email of this.priceAlertEmails) {
      console.log(`EMAIL to ${email}: ${name} dropped from $${oldPrice} to $${newPrice}`);
    }
  }

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  // Still an if/else chain - we fix this with the Strategy pattern in iteration 3
  getDiscount(code) {
    const subtotal = this.getSubtotal();
    switch (code) {
      case "SAVE10":
        return subtotal * 0.1;
      case "SAVE20":
        return subtotal > BIG_ORDER_THRESHOLD ? subtotal * 0.2 : subtotal * 0.1;
      case "FLAT15":
        return Math.min(15, subtotal);
      case "BLACKFRIDAY":
        return subtotal * 0.5;
      default:
        return 0;
    }
  }

  getTax(code) {
    return (this.getSubtotal() - this.getDiscount(code)) * TAX_RATE;
  }

  getTotal(code) {
    return this.getSubtotal() - this.getDiscount(code) + this.getTax(code);
  }

  printReceipt(code) {
    console.log(`Subtotal: $${this.getSubtotal().toFixed(2)}`);
    console.log(`Discount: $${this.getDiscount(code).toFixed(2)}`);
    console.log(`Tax:      $${this.getTax(code).toFixed(2)}`);
    console.log(`TOTAL:    $${this.getTotal(code).toFixed(2)}`);
  }
}

module.exports = { ShoppingCart };

// ---- demo (runs only when this file is executed directly) ----
if (require.main === module) {
  const cart = new ShoppingCart();
  cart.subscribeToPriceAlerts("alice@mail.com");
  cart.addItem({ name: "Laptop", price: 1000, category: "electronics" });
  cart.addItem({ name: "Mouse", price: 25, category: "electronics" }, 2);
  cart.addItem({ name: "Mouse", price: 25, category: "electronics" }, 1);
  cart.changePrice("Laptop", 900);
  cart.removeItem("Mouse");
  cart.addItem({ name: "Book", price: 20, category: "books" }, 3);
  cart.printReceipt("SAVE20");
}
