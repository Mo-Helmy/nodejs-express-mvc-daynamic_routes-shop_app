const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  console.log(req);

  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

exports.getProdutDetails = (req, res, next) => {
  Product.findProductById(req.params.productId, (product) => {
    console.log(product);
    res.render(`shop/product-detail`, {
      pageTitle: product.title,
      path: "/products",
      product,
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.getProducts((cart) => {
    Product.fetchAll((products) => {
      let existingCartProducts = [];
      cart.products.forEach((prod) => {
        const cartProduct = products.find((product) => product.id === prod.id);
        if (cartProduct) {
          existingCartProducts.push({ cartProduct, productQty: prod.qty });
        }
      });

      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: existingCartProducts,
        totalPrice: cart.totalPrice,
      });
    });
  });
};

exports.postDeleteCartItem = (req, res, next) => {
  Cart.deleteProductFromCart(req.body.productId, req.body.productPrice);
  res.redirect("/cart");
};

exports.postCart = (req, res, next) => {
  console.log(req.body.productId);
  Product.findProductById(req.body.productId, (product) => {
    Cart.addProductToCart(req.body.productId, product.price);
  });
  res.redirect("/cart");
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
