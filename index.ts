import { Product, Category, Cart } from "./model"
import readline from "readline"
import fs from "fs"

// Import data
const rawdata = fs.readFileSync("./data.json", 'utf8')
const data = JSON.parse(rawdata);

// Create list of product object
const product_list: Product[] = data.map(
  ({ name, price, category, quantity, product_id }: { name: string, price: number, category: string, quantity: number, product_id: string }) =>
    new Product(name, price, new Category(category), quantity, product_id)
);

// Create asynchronous
async function ShopPrompt() {
  const cart: Cart = new Cart();

  while (true) {
    // Prompt input
    const prompt: string[] = (
      await new Promise((resolve, reject) => {
        const readInterface = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });
        readInterface.question(
          "กรุณาพิมพ์คำสั่ง (ดูรายการสินค้า, ดูประเภทสินค้า, เพิ่มสินค้าในตะกร้า, ลบสินค้าในตะกร้า, แสดงสินค้าในตะกร้า): ",
          (value: string) => {
            resolve(value.split(" "));
            readInterface.close();
          }
        );
      })
    );

    if (prompt[0] === "ดูรายการสินค้า") {
      const product_list_table: { name: string, price: number, category: string, quantity: number, product_id: string, balance: number }[] = product_list.map(
        (product: Product) => ({
          name: product.getName(),
          price: product.getPrice(),
          category: product.getCategory().getName(),
          quantity: product.getQuantity(),
          product_id: product.getProductId(),
          balance: product.getBalance(),
        })
      );
      console.table(product_list_table);
    } else if (prompt[0] === "ดูประเภทสินค้า") {
      const categories_set: Set<string> = new Set();

      product_list.forEach((product: Product) => {
        categories_set.add(product.getCategory().getName());
      });
      const categories_array: string[] = [...categories_set];
      const categories_table: { category: string, amount: number }[] = categories_array.map((category: string) => {
        const amount: number = product_list.reduce((amount: number, product: Product) => {
          if (product.getCategory().getName() === category) {
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
      const cart_product_set: Set<string> = new Set();

      cart.getCartProductList().forEach((product: Product) => {
        cart_product_set.add(product.getProductId());
      });
      const cart_product_array: string[] = [...cart_product_set];
      const cart_table: { name: string, price: number | string, amount: number | string, all_price: number }[] = cart_product_array.map((cart_product_id: string) => {
        const amount = cart.getCartProductList().reduce((amount: number, product: Product) => {
          if (product.getProductId() === cart_product_id) {
            amount += 1;
          }
          return amount;
        }, 0);

        const selected_product_index: number = product_list.findIndex(
          (product: Product) => product.getProductId() === cart_product_id
        );
        const cart_product: Product = product_list[selected_product_index];
        return {
          name: cart_product.getName(),
          price: cart_product.getPrice(),
          amount,
          all_price: cart_product.getPrice() * amount,
        };
      });
      cart_table.push({
        name: "รวม",
        price: "",
        amount: "",
        all_price: cart_table.reduce(
          (price: number, cart_product: { name: string, price: number | string, amount: number | string, all_price: number }) => price + cart_product.all_price,
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
