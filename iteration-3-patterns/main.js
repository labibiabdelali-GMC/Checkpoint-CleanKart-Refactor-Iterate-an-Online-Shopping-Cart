// Demo: same scenario as iterations 1 and 2, so you can compare the output.

const { ShoppingCart } = require("./ShoppingCart");
const { ProductBuilder } = require("./Product");
const { discountForCoupon } = require("./discounts");
const { EmailSubscriber, SmsSubscriber } = require("./priceAlerts");

const laptop = new ProductBuilder("Laptop", 1000).category("electronics").weight(2.5).color("silver").build();
const mouse = new ProductBuilder("Mouse", 25).category("electronics").color("black").build();
const book = new ProductBuilder("Book", 20).category("books").build();

const cart = new ShoppingCart();
cart.priceAlerts.subscribe(new EmailSubscriber("alice@mail.com"));
cart.priceAlerts.subscribe(new SmsSubscriber("+1-555-0100"));

cart.addItem(laptop);
cart.addItem(mouse, 2);
cart.addItem(mouse, 1);
cart.changePrice("Laptop", 900);
cart.removeItem("Mouse");
cart.addItem(book, 3);

cart.setDiscount(discountForCoupon("SAVE20"));
cart.printReceipt();
