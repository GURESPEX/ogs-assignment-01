const { Product, Category, Cart } = require("./model.js");
const readline = require("readline");
const fs = require("fs");

// Import data
const rawdata = fs.readFileSync("data.json");
const data = JSON.parse(rawdata);

// Create list of product object
const product_list = data.map(
  ({ name, price, category, quantity, product_id }) =>
    new Product(name, price, new Category(category), quantity, product_id)
);

// Create asynchronous
async function ShopPrompt() {
  const cart = new Cart();

  while (true) {
    // Prompt input
    const prompt = (
      await new Promise((resolve, reject) => {
        const readInterface = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });
        readInterface.question(
          "กรุณาพิมพ์คำสั่ง (ดูรายการสินค้า, ดูประเภทสินค้า, เพิ่มสินค้าในตะกร้า, ลบสินค้าในตะกร้า, แสดงสินค้าในตะกร้า): ",
          (value) => {
            resolve(value);
            readInterface.close();
          }
        );
      })
    ).split(" ");

    if (prompt[0] === "ดูรายการสินค้า") {
      const product_list_table = product_list.map(
        ({ name, price, category, quantity, product_id, balance }) => ({
          name,
          price,
          category: category.name,
          quantity,
          product_id,
          balance,
        })
      );
      console.table(product_list_table);
    } else if (prompt[0] === "ดูประเภทสินค้า") {
      const categories_set = new Set();

      product_list.forEach((product) => {
        categories_set.add(product.category.name);
      });
      const categories_array = [...categories_set];
      const categories_table = categories_array.map((category) => {
        let amount = product_list.reduce((amount, product) => {
          if (product.category.name === category) {
            amount += 1;
          }
          return amount;
        }, 0);
        return {
          category: category,
          amount,
        };
      });

      console.table(categories_table);
    } else if (prompt[0] === "เพิ่มสินค้าในตะกร้า") {
      cart.addProduct(product_list, prompt[1]);
    } else if (prompt[0] === "ลบสินค้าในตะกร้า") {
      cart.removeProduct(product_list, prompt[1]);
    } else if (prompt[0] === "แสดงสินค้าในตะกร้า") {
      const cart_table = cart.cart_product_list.map(
        ({ name, price, amount }) => ({
          name,
          price,
          amount,
          all_price: price * amount,
        })
      );
      cart_table.push({
        name: "รวม",
        price: "",
        amount: "",
        all_price: cart_table.reduce(
          (price, cart_product) => price + cart_product.all_price,
          0
        ),
      });
      console.table(cart_table);
    } else {
      console.log("คำสั่งไม่ถูกต้อง");
    }
  }
}

ShopPrompt();
