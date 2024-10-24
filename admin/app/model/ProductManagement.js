import MockApiProduct from "../services/MockApiProduct.js";

class ProductManagement {
  constructor() {
    this.mockApiProduct = new MockApiProduct();
    this.productList = [];
  }

  async addProduct(product) {
    let response = await this.mockApiProduct.addProduct(product);
    this.productList.push(response);
    return;
  }

  async updateProduct(product) {
    let response = await this.mockApiProduct.updateProduct(product);
    this.productList = this.productList.map((item) =>
      item.id === response.id ? response : item
    );
    return;
  }

  async removeProduct(product) {
    let productRemoved = await this.mockApiProduct.removeProduct(product.id);
    this.productList = this.productList.filter(
      (item) => item.id !== productRemoved.id
    );
    return;
  }

  getProductById(productId) {
    return this.productList.find((product) => product.id === productId);
  }

  async getProductList() {
    this.productList = await this.mockApiProduct.getProducts();
    return this.productList;
  }

  async filterProducts(searchValue) {
    return this.productList.filter((product) => {
      return product.name.toLowerCase().includes(searchValue.toLowerCase());
    });
  }

  async sortProductsByPrice(sortBy) {
    return this.productList.sort((a, b) => {
      if (sortBy === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
  }
}

export default ProductManagement;
