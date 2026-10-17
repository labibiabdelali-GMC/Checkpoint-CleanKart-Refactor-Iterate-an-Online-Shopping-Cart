// OBSERVER PATTERN
// PriceAlerts keeps a list of subscribers. When a price drops, it tells
// every subscriber. The cart doesn't know (or care) whether a subscriber
// sends an email, an SMS, or just logs to the console.

class PriceAlerts {
  constructor() {
    this.subscribers = [];
  }

  subscribe(subscriber) {
    this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber) {
    this.subscribers = this.subscribers.filter((s) => s !== subscriber);
  }

  notifyPriceDrop(product, oldPrice, newPrice) {
    for (const subscriber of this.subscribers) {
      subscriber.onPriceDrop(product, oldPrice, newPrice);
    }
  }
}

// A subscriber is any object with an onPriceDrop() method.
class EmailSubscriber {
  constructor(email) {
    this.email = email;
  }

  onPriceDrop(product, oldPrice, newPrice) {
    console.log(`EMAIL to ${this.email}: ${product.name} dropped from $${oldPrice} to $${newPrice}`);
  }
}

class SmsSubscriber {
  constructor(phone) {
    this.phone = phone;
  }

  onPriceDrop(product, oldPrice, newPrice) {
    console.log(`SMS to ${this.phone}: ${product.name} is now $${newPrice} (was $${oldPrice})`);
  }
}

module.exports = { PriceAlerts, EmailSubscriber, SmsSubscriber };
