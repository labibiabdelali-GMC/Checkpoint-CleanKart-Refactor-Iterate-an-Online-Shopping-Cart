# CleanKart: Refactoring a Shopping Cart

This project starts with a messy shopping cart and cleans it up in small steps.
Each step is saved in its own folder, so you can compare them side by side.

## How to run

You only need [Node.js](https://nodejs.org) (version 18 or newer). Nothing to install.

```bash
npm run messy   # Iteration 1: the messy code
npm run clean   # Iteration 2: cleaned-up code
npm start       # Iteration 3: clean code + design patterns
npm test        # Run the tests
```

All three versions run the same scenario and print the same total (**$829.44**).
That's how we know the refactoring didn't break anything.

## Project structure

```
iteration-1-messy/cart.js         The bad starting code (smells marked with "SMELL:")
iteration-2-clean/cart.js         Same features, clean code, no patterns yet
iteration-3-patterns/
    Product.js                    Builder pattern: creating products
    discounts.js                  Strategy pattern: discount types
    priceAlerts.js                Observer pattern: price drop alerts
    ShoppingCart.js               The cart itself
    main.js                       Demo
test.js                           Tests
```

---

## Summary report

### Iteration 1: the messy code

The starting code works, but it's hard to read and hard to change. Problems found:

| Code smell | Example |
|---|---|
| Bad names | `c`, `u`, `n`, `p`, `q`, `calc`, `chg` |
| Global variables | the cart `c` and user list `u` sit in the global scope |
| Duplicated code | the same "find item by name" loop is written 3 times |
| Long method | `calc()` adds up prices, applies discounts, adds tax **and** prints |
| Magic numbers | `0.1`, `0.2`, `100`, `15`, `0.08` with no explanation |
| Too many parameters | `add(n, p, q, t, w, col)`: easy to mix up the order |
| Tight coupling | changing a price also sends emails, all in the same function |
| Dead code | `oldCalc()` is never used |

### Iteration 2: clean code (refactoring only)

| What changed | Why |
|---|---|
| Renamed everything (`c` → `items`, `chg` → `changePrice`) | Code should explain itself |
| Put the cart in a `ShoppingCart` class | No more global state |
| Extracted `findItem()` | Removes the repeated loop (DRY: Don't Repeat Yourself) |
| Split `calc()` into `getSubtotal`, `getDiscount`, `getTax`, `getTotal` | Each method does one thing |
| Moved printing into `printReceipt()` | Calculation and display are separate jobs |
| Named constants `TAX_RATE`, `BIG_ORDER_THRESHOLD` | No more magic numbers |
| Products passed as one object `{ name, price, ... }` | No need to remember parameter order |
| Deleted `oldCalc()` | Dead code is just noise |

Still left to fix: the discount `switch` grows every time a new coupon is added,
and price alerts can only be emails.

### Iteration 3: design patterns

**Strategy, for discounts** (`discounts.js`)
Every discount type is its own small class with a `calculate(subtotal)` method.
The cart just calls `this.discount.calculate(...)` and doesn't care which discount it is.
- Before: adding a coupon meant editing the big `switch` inside the cart.
- After: you write a new class (or add one line to `COUPONS`). The cart doesn't change.

**Observer, for price drop alerts** (`priceAlerts.js`)
`PriceAlerts` keeps a list of subscribers. When a price drops, it calls
`onPriceDrop()` on each one.
- Before: the cart only knew how to "send emails".
- After: anything can subscribe (email, SMS, a test). Adding a new kind of
  alert doesn't touch the cart. People can also unsubscribe.

**Builder, for products** (`Product.js`)
```js
const laptop = new ProductBuilder("Laptop", 1000)
  .category("electronics")
  .color("silver")
  .build();
```
- Before: `add("Laptop", 1000, 1, "electronics", 2.5, "silver")`. What is `2.5`?
- After: every value is labelled, optional fields can be skipped, and
  `build()` checks that the product is valid.

### Clean code principles used

- **Meaningful names**: you can read the code almost like English.
- **Small functions**: each method does one job.
- **DRY**: no copy-pasted logic.
- **Single Responsibility**: the cart handles items, discounts live in
  `discounts.js`, alerts live in `priceAlerts.js`.
- **Open/Closed**: new discounts and new alert types can be added without
  changing existing code.
- **Tested at every step**: the tests check that iterations 2 and 3 give the
  same total as iteration 1, plus one test per pattern.

### How we worked

Refactor → Test → Add pattern → Test → Repeat.
After every change we ran `npm test` to make sure the total stayed at $829.44.
