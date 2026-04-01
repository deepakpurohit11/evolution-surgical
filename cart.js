// ============================================================
// cart.js — Guest cart using localStorage, no ES module imports
// ============================================================

var Cart = {

  getItems: function() {
    return JSON.parse(localStorage.getItem("es_cart") || "[]");
  },

  saveItems: function(items) {
    localStorage.setItem("es_cart", JSON.stringify(items));
    this.updateBadge();
  },

  addItem: function(product) {
    var items = this.getItems();
    var existing = items.find(function(i) { return i.id === product.id; });
    if (existing) {
      existing.qty += 1;
    } else {
      items.push(Object.assign({}, product, { qty: 1 }));
    }
    this.saveItems(items);
    this.showToast(product.name + " added to cart!");
  },

  removeItem: function(id) {
    var items = this.getItems().filter(function(i) { return i.id !== id; });
    this.saveItems(items);
  },

  updateQty: function(id, delta) {
    var items = this.getItems();
    var item = items.find(function(i) { return i.id === id; });
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) { this.removeItem(id); return; }
    this.saveItems(items);
  },

  getTotalCount: function() {
    return this.getItems().reduce(function(sum, i) { return sum + i.qty; }, 0);
  },

  updateBadge: function() {
    var badge = document.getElementById("cart-badge");
    if (!badge) return;
    var count = this.getTotalCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? "flex" : "none";
  },

  showToast: function(message) {
    var toast = document.getElementById("cart-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "cart-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(this._toastTimer);
    var self = this;
    this._toastTimer = setTimeout(function() { toast.classList.remove("show"); }, 2800);
  },

  clear: function() {
    localStorage.removeItem("es_cart");
    this.updateBadge();
  }
};

window.Cart = Cart;

function initCartButtons() {
  document.querySelectorAll(".cart-btn").forEach(function(btn) {
    if (btn.dataset.cartInit) return;
    btn.dataset.cartInit = "true";

    btn.addEventListener("click", function(e) {
      e.stopPropagation();

      var product = {
        id:       this.dataset.id,
        name:     this.dataset.name,
        price:    parseInt(this.dataset.price),
        oldPrice: parseInt(this.dataset.oldPrice),
        discount: this.dataset.discount,
        img:      this.dataset.img,
        link:     this.dataset.link,
      };

      if (!product.id) {
        var card = this.closest(".product-card");
        if (card) {
          product.id       = card.dataset.id || (card.querySelector("h3") ? card.querySelector("h3").textContent.trim().replace(/\s+/g, "-").toLowerCase() : "product");
          product.name     = card.querySelector("h3") ? card.querySelector("h3").textContent.trim() : "Product";
          product.price    = parseInt((card.querySelector(".price") ? card.querySelector(".price").textContent : "0").replace(/[^0-9]/g, "")) || 0;
          product.img      = card.querySelector("img") ? card.querySelector("img").src : "";
          product.link     = card.querySelector("a.card-link") ? card.querySelector("a.card-link").href : window.location.href;
        }
      }

      Cart.addItem(product);
    });
  });
}

document.addEventListener("DOMContentLoaded", function() {
  setTimeout(function() { Cart.updateBadge(); }, 150);
  initCartButtons();
});

setTimeout(initCartButtons, 400);

// scripts run before DOM sometimes, ensuring cart binding runs properly with below code

// document.addEventListener("DOMContentLoaded", function () {
//   attachCartEvents();
// });

// function attachCartEvents() {
//   document.querySelectorAll(".cart-btn").forEach(btn => {

//     btn.addEventListener("click", function () {

//       const item = {
//         id: this.dataset.id,
//         name: this.dataset.name,
//         price: Number(this.dataset.price),
//         oldPrice: Number(this.dataset.oldPrice),
//         discount: this.dataset.discount,
//         img: this.dataset.img,
//         link: this.dataset.link,
//         qty: 1
//       };

//       let cart = JSON.parse(localStorage.getItem("es_cart") || "[]");

//       const existing = cart.find(i => i.id === item.id);

//       if (existing) {
//         existing.qty += 1;
//       } else {
//         cart.push(item);
//       }

//       localStorage.setItem("es_cart", JSON.stringify(cart));

//       // optional popup
//       showAddedToCart(item.name);

//       updateCartCount();
//     });

//   });
// }