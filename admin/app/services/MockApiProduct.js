class MockApiProduct {
  constructor() {
    this.baseURL = "https://6700eea0b52042b542d64a46.mockapi.io/api/V1";
  }

  async getProducts() {
    try {
      const response = await axios.get(`${this.baseURL}/products`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async addProduct(product) {
    try {
      const response = await axios.post(`${this.baseURL}/products`, product);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async removeProduct(productId) {
    try {
      const response = await axios.delete(
        `${this.baseURL}/products/${productId}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async updateProduct(product) {
    try {
      const response = await axios.put(
        `${this.baseURL}/products/${product.id}`,
        product
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async getProductById(productId) {
    try {
      const response = await axios.get(`${this.baseURL}/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}

export default MockApiProduct;
