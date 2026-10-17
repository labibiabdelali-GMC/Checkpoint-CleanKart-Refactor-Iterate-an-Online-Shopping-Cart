// BUILDER PATTERN
// Products can have many optional fields. Instead of a constructor with
// 6+ parameters in a fixed order, we build a product step by step:
//
//   const laptop = new ProductBuilder("Laptop", 1000).category("electronics").color("silver").build();

class Product {
  constructor({ name, price, category, weight, color }) {
    this.name = name;
    this.price = price;
    this.category = category;
    this.weight = weight;
    this.color = color;
  }
}

class ProductBuilder {
  constructor(name, price) {
    // Required fields go in the constructor, optional ones get their own method
    this.fields = { name, price, category: "general", weight: 0, color: null };
  }

  category(category) {
    this.fields.category = category;
    return this;
  }

  weight(kilograms) {
    this.fields.weight = kilograms;
    return this;
  }

  color(color) {
    this.fields.color = color;
    return this;
  }

  build() {
    if (!this.fields.name) throw new Error("Product needs a name");
    if (!(this.fields.price >= 0)) throw new Error("Product needs a valid price");
    return new Product(this.fields);
  }
}

module.exports = { Product, ProductBuilder };
