export class Product {
  private name: string;
  private price: number;
  private category: Category;
  private quantity: number;
  private product_id: string;
  private balance: number;

  public constructor(name: string, price: number, category: Category, quantity: number, product_id: string) {
    this.name = name;
    this.price = price;
    this.category = category;
    this.quantity = quantity;
    this.product_id = product_id;
    this.balance = quantity;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getPrice(): number {
    return this.price;
  }

  public setPrice(price: number): void {
    this.price = price;
  }

  public getCategory(): Category {
    return this.category;
  }

  public setCategory(category: Category): void {
    this.category = category;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public setQuantity(quantity: number): void {
    this.quantity = quantity;
  }

  public getProductId(): string {
    return this.product_id;
  }

  public setProductId(product_id: string): void {
    this.product_id = product_id;
  }

  public getBalance(): number {
    return this.balance;
  }

  public setBalance(balance: number): void {
    this.balance = balance;
  }

}

export class Category {
  private name: string;
  public constructor(name: string) {
    this.name = name;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }
}

export class Cart {
  private cart_product_list: Product[];
  public constructor() {
    this.cart_product_list = [];
  }

  public getCartProductList(): Product[] {
    return this.cart_product_list;
  }

  public setCartProductList(cart_product_list: Product[]): void {
    this.cart_product_list = cart_product_list;
  }

  public addProduct(product_list: Product[], product_id: string) {
    if (product_id) {
      const selected_product_index = product_list.findIndex(
        (product) => product.getProductId() === product_id
      );

      const selected_product = product_list[selected_product_index];

      if (selected_product) {
        if (selected_product.getBalance() > 0) {
          this.cart_product_list.push(selected_product);
          product_list[selected_product_index].setBalance(product_list[selected_product_index].getBalance() - 1);
          console.log(`เพิ่มสินค้า ${selected_product.getName()} สำเร็จ`);
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

  public removeProduct(product_list: Product[], product_id: string) {
    if (product_id) {
      if (this.cart_product_list.length) {
        const selected_product_index = product_list.findIndex(
          (product) => product.getProductId() === product_id
        );
        const selected_cart_product_index = this.cart_product_list.findIndex(
          (cart_product) =>
            cart_product.getProductId() ===
            product_list[selected_product_index]?.getProductId()
        );

        const selected_product = product_list[selected_product_index];
        const selected_cart_product =
          this.cart_product_list[selected_cart_product_index];

        if (selected_product) {
          if (selected_cart_product) {
            this.cart_product_list.splice(selected_cart_product_index, 1);
            product_list[selected_product_index].setBalance(product_list[selected_product_index].getBalance() + 1)
            console.log(`ลบสินค้า ${selected_product.getName()} สำเร็จ`);
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