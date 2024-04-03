const readline = require("readline");
const fs = require("fs");

// Import data and convert to JavaScript object
const rawdata = fs.readFileSync("data.json");
let products = JSON.parse(rawdata);
products = products.map((product) => {
  return { ...product, balance: product.quantity };
});

// Create asynchronous
async function ShopPrompt() {
  const cart = [];

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
      console.table(products);
    } else if (prompt[0] === "ดูประเภทสินค้า") {
      const categories_set = new Set();

      products.forEach((product) => {
        categories_set.add(product.category);
      });

      const categories_array = [...categories_set];

      const categories = categories_array.map((category) => {
        let amount = products.reduce((amount, product) => {
          if (product.category === category) {
            amount += 1;
          }
          return amount;
        }, 0);
        return {
          category: category,
          amount,
        };
      });

      console.table(categories);
    } else if (prompt[0] === "เพิ่มสินค้าในตะกร้า") {
      const product_id = prompt[1];

      if (product_id) {
        const founded_product_index = products.findIndex(
          (product) => product.product_id === product_id
        );

        if (founded_product_index >= 0) {
          if (products[founded_product_index].balance > 0) {
            const founded_cart_product_index = cart.findIndex(
              (cart_product) =>
                cart_product.name === products[founded_product_index].name
            );
            if (founded_cart_product_index >= 0) {
              cart[founded_cart_product_index].amount += 1;
            } else {
              cart.push({
                name: products[founded_product_index].name,
                amount: 1,
              });
            }
            products[founded_product_index].balance -= 1;
            console.log(
              `เพิ่มสินค้า ${products[founded_product_index].name} สำเร็จ`
            );
          } else {
            console.log("สินค้าหมด");
          }
        } else {
          console.log("ไม่พบสินค้า");
        }
      } else {
        console.log("โปรดระบุรหัสสินค้าที่ต้องการเพิ่ม");
      }
    } else if (prompt[0] === "ลบสินค้าในตะกร้า") {
      const product_id = prompt[1];
      if (product_id) {
        const founded_product_index = products.findIndex(
          (product) => product.product_id === product_id
        );

        if (founded_product_index >= 0) {
          const founded_cart_product_index = cart.findIndex(
            (cart_product) =>
              cart_product.name === products[founded_product_index].name
          );
          if (founded_cart_product_index >= 0) {
            cart[founded_cart_product_index].amount -= 1;
            if (cart[founded_cart_product_index].amount === 0) {
              cart.splice(founded_cart_product_index, 1);
            }
            products[founded_product_index].balance += 1;
            console.log(
              `ลบสินค้า ${products[founded_product_index].name} สำเร็จ`
            );
          } else {
            console.log("ไม่พบสินค้าในตะกร้า");
          }
        } else {
          console.log("ไม่พบสินค้า");
        }
      } else {
        console.log("โปรดระบุรหัสสินค้าที่ต้องการลบ");
      }
    } else if (prompt[0] === "แสดงสินค้าในตะกร้า") {
      console.table(cart);
    } else {
      console.log("คำสั่งไม่ถูกต้อง");
    }
  }
}

ShopPrompt();
