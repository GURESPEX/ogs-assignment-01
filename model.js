class Product {
  constructor(name, price, category, quantity, product_id) {
    this.name = name;
    this.price = price;
    this.category = category;
    this.quantity = quantity;
    this.product_id = product_id;
    this.balance = quantity;
  }
}

class Category {
  constructor(name) {
    this.name = name;
  }
}

class Cart {
  constructor() {
    this.cart_product_list = [];
  }

  addProduct(product_list, product_id) {
    if (product_id) {
      const selected_product_index = product_list.findIndex(
        (product) => product.product_id === product_id
      );
      const selected_cart_product_index = this.cart_product_list.findIndex(
        (cart_product) =>
          cart_product.name === product_list[selected_product_index]?.name
      );

      const selected_product = product_list[selected_product_index];
      const selected_cart_product =
        this.cart_product_list[selected_cart_product_index];

      if (selected_product) {
        if (selected_product.balance > 0) {
          if (selected_cart_product) {
            this.cart_product_list[selected_cart_product_index].amount += 1;
          } else {
            this.cart_product_list.push({
              name: selected_product.name,
              price: selected_product.price,
              amount: 1,
              // all_price: selected_cart_product.price
            });
          }
          product_list[selected_product_index].balance -= 1;
          console.log(`เพิ่มสินค้า ${selected_product.name} สำเร็จ`);
        } else {
          console.log("สินค้าหมด");
        }
      } else {
        console.log("ไม่พบสินค้า");
      }
    } else {
      console.log("โปรดระบุรหัสสินค้าที่ต้องการเพิ่มเข้าตะกร้า");
    }
  }

  removeProduct(product_list, product_id) {
    if (product_id) {
      if (this.cart_product_list.length) {
        const selected_product_index = product_list.findIndex(
          (product) => product.product_id === product_id
        );
        const selected_cart_product_index = this.cart_product_list.findIndex(
          (cart_product) =>
            cart_product.name === product_list[selected_product_index]?.name
        );

        const selected_product = product_list[selected_product_index];
        const selected_cart_product =
          this.cart_product_list[selected_cart_product_index];

        if (selected_product) {
          if (selected_cart_product) {
            this.cart_product_list[selected_cart_product_index].amount -= 1;
            if (
              this.cart_product_list[selected_cart_product_index].amount === 0
            ) {
              this.cart_product_list.splice(selected_cart_product_index, 1);
            }
            product_list[selected_product_index].balance += 1;
            console.log(`ลบสินค้า ${selected_product.name} สำเร็จ`);
          } else {
            console.log("ไม่พบสินค้าในตะกร้า");
          }
        } else {
          console.log("ไม่พบสินค้า");
        }
      } else {
        console.log("ไม่พบสินค้าในตะกร้า");
      }
    } else {
      console.log("โปรดระบุรหัสสินค้าที่ต้องการลบออกจากตะกร้า");
    }
  }
}

module.exports = { Product, Category, Cart };
