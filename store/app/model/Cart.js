import CartItem from "./CartItem.js";
import MockApiProduct from "../../../admin/app/services/MockApiProduct.js";

class Cart {
    constructor() {
        this.items = this.getItemsFromLocalStorage() || [];
        this.mockApiProduct = new MockApiProduct();
    }

    async add(productId, quantity) {
        if (this.items.some((item) => item.id === productId)) {
            this.increaseQuantity(productId);
        } else {
            let product = await this.mockApiProduct.getProductById(productId);
            const cartItem = new CartItem(product, quantity);
            this.items.push(cartItem);
        }
        this.saveToLocalStorage();
    }

    increaseQuantity(productId) {
        const item = this.items.find((item) => item.id === productId);
        item.quantity++;
        this.saveToLocalStorage();
    }

    decreaseQuantity(productId) {
        const item = this.items.find((item) => item.id === productId);
        if (item.quantity > 1) {
            item.quantity--;
        } else {
            this.remove(productId);
        }
        this.saveToLocalStorage();
    }

    removeItem(productId) {
        this.items = this.items.filter((item) => item.id !== productId);
        this.saveToLocalStorage();
    }

    getItems() {
        return this.items;
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => total + item.price, 0);
    }

    getItemsFromLocalStorage() {
        const cart = JSON.parse(localStorage.getItem("cart"));
        if (cart) {
            return cart.items.map(
                (item) => new CartItem(item.product, item.quantity)
            );
        }
    }

    saveToLocalStorage() {
        const cart = {
            items: this.items,
        };
        localStorage.setItem("cart", JSON.stringify(cart));
    }
}

export default Cart;
