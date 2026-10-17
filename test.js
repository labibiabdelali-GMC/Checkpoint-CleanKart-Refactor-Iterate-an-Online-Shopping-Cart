// Simple tests using Node's built-in test runner. Run with: npm test

const test = require("node:test");
const assert = require("node:assert");

const { ShoppingCart: CleanCart } = require("./iteration-2-clean/cart");
const { ShoppingCart } = require("./iteration-3-patterns/ShoppingCart");
const { ProductBuilder } = require("./iteration-3-patterns/Product");
const { PercentageDiscount, FlatDiscount, BigOrderDiscount, discountForCoupon } = require("./iteration-3-patterns/discounts");
const { PriceAlerts } = require("./iteration-3-patterns/priceAlerts");

// Same scenario as the demos. Expected total: (900 + 60) - 20% = 768, + 8% tax = 829.44
const EXPECTED_TOTAL = 829.44;

test("iteration 2 gives the same total as iteration 1", () => {
  const cart = new CleanCart();
  cart.addItem({ name: "Laptop", price: 1000 });
  cart.addItem({ name: "Mouse", price: 25 }, 3);
  cart.changePrice("Laptop", 900);
  cart.removeItem("Mouse");
  cart.addItem({ name: "Book", price: 20 }, 3);
  assert.strictEqual(cart.getTotal("SAVE20").toFixed(2), EXPECTED_TOTAL.toFixed(2));
});

test("iteration 3 gives the same total as iteration 1", () => {
  const cart = new ShoppingCart();
  cart.addItem(new ProductBuilder("Laptop", 1000).build());
  cart.addItem(new ProductBuilder("Mouse", 25).build(), 3);
  cart.changePrice("Laptop", 900);
  cart.removeItem("Mouse");
  cart.addItem(new ProductBuilder("Book", 20).build(), 3);
  cart.setDiscount(discountForCoupon("SAVE20"));
  assert.strictEqual(cart.getTotal().toFixed(2), EXPECTED_TOTAL.toFixed(2));
});

test("adding the same product twice increases quantity", () => {
  const cart = new ShoppingCart();
  const pen = new ProductBuilder("Pen", 2).build();
  cart.addItem(pen, 2);
  cart.addItem(pen, 3);
  assert.strictEqual(cart.items.length, 1);
  assert.strictEqual(cart.items[0].quantity, 5);
});

test("Builder: sets defaults and optional fields", () => {
  const plain = new ProductBuilder("Cup", 5).build();
  assert.strictEqual(plain.category, "general");

  const fancy = new ProductBuilder("Cup", 5).category("kitchen").color("red").weight(0.3).build();
  assert.deepStrictEqual([fancy.category, fancy.color, fancy.weight], ["kitchen", "red", 0.3]);
});

test("Builder: rejects a product without a valid price", () => {
  assert.throws(() => new ProductBuilder("Cup").build());
});

test("Strategy: each discount calculates correctly", () => {
  assert.strictEqual(new PercentageDiscount(10).calculate(200), 20);
  assert.strictEqual(new FlatDiscount(15).calculate(10), 10); // capped at subtotal
  assert.strictEqual(new BigOrderDiscount(100).calculate(50), 5);
  assert.strictEqual(new BigOrderDiscount(100).calculate(200), 40);
  assert.strictEqual(discountForCoupon("NOT_A_CODE").calculate(100), 0);
});

test("Observer: subscribers are told about price drops only", () => {
  const cart = new ShoppingCart();
  const received = [];
  cart.priceAlerts.subscribe({ onPriceDrop: (product, oldPrice, newPrice) => received.push(newPrice) });
  cart.addItem(new ProductBuilder("Lamp", 50).build());

  cart.changePrice("Lamp", 40); // drop -> notify
  cart.changePrice("Lamp", 60); // rise -> no notification
  assert.deepStrictEqual(received, [40]);
});

test("Observer: unsubscribed users get nothing", () => {
  const alerts = new PriceAlerts();
  let calls = 0;
  const subscriber = { onPriceDrop: () => calls++ };
  alerts.subscribe(subscriber);
  alerts.unsubscribe(subscriber);
  alerts.notifyPriceDrop({ name: "x" }, 10, 5);
  assert.strictEqual(calls, 0);
});
