// ITERATION 1 - THE MESSY STARTING POINT
// This code works, but it is intentionally BAD. Do not copy it!
// Code smells are marked with "SMELL:" comments.

var c = []; // SMELL: global variable with a meaningless name
var u = []; // SMELL: "u" = users who want price alerts (you'd never guess)

// SMELL: a function that takes 6 parameters in a fixed order
function add(n, p, q, t, w, col) {
  // SMELL: duplicated "find item" loop (also appears in rem and chg)
  for (var i = 0; i < c.length; i++) {
    if (c[i].n == n) {
      c[i].q = c[i].q + q;
      return;
    }
  }
  c.push({ n: n, p: p, q: q, t: t, w: w, col: col });
}

function rem(n) {
  for (var i = 0; i < c.length; i++) {
    if (c[i].n == n) {
      c.splice(i, 1);
      return;
    }
  }
}

// SMELL: price change logic and notification logic mixed together
function chg(n, np) {
  for (var i = 0; i < c.length; i++) {
    if (c[i].n == n) {
      if (np < c[i].p) {
        for (var j = 0; j < u.length; j++) {
          console.log("EMAIL to " + u[j] + ": " + n + " dropped from $" + c[i].p + " to $" + np);
        }
      }
      c[i].p = np;
    }
  }
}

// SMELL: one long method doing everything (subtotal, discount, tax, printing)
// SMELL: magic numbers (0.1, 0.2, 100, 15, 0.08 ...)
// SMELL: if/else chain that must be edited for every new discount type
function calc(code) {
  var s = 0;
  for (var i = 0; i < c.length; i++) {
    s = s + c[i].p * c[i].q;
  }
  var d = 0;
  if (code == "SAVE10") {
    d = s * 0.1;
  } else if (code == "SAVE20") {
    if (s > 100) {
      d = s * 0.2;
    } else {
      d = s * 0.1;
    }
  } else if (code == "FLAT15") {
    d = 15;
    if (d > s) d = s;
  } else if (code == "BLACKFRIDAY") {
    d = s * 0.5;
  }
  var tx = (s - d) * 0.08;
  var tot = s - d + tx;
  console.log("Subtotal: " + s);
  console.log("Discount: " + d);
  console.log("Tax: " + tx);
  console.log("TOTAL: " + tot);
  return tot;
}

// SMELL: dead code - never called anywhere
function oldCalc() {
  var x = 0;
  for (var i = 0; i < c.length; i++) x += c[i].p;
  return x;
}

// ---- demo ----
u.push("alice@mail.com");
add("Laptop", 1000, 1, "electronics", 2.5, "silver");
add("Mouse", 25, 2, "electronics", 0.1, "black");
add("Mouse", 25, 1, "electronics", 0.1, "black");
chg("Laptop", 900);
rem("Mouse");
add("Book", 20, 3, "books", 0.5, null);
calc("SAVE20");
