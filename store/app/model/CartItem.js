import Product from "../../../admin/app/model/Product.js";

class CartItem {
    constructor(product, quantity) {
        this.product = new Product(
            product.id,
            product.name,
            product.price,
            product.screen,
            product.backCamera,
            product.frontCamera,
            product.img,
            product.desc,
            product.type
        );
        this.quantity = quantity;
    }

    get total() {
        return this.product.price * this.quantity;
    }

    get name() {
        return this.product.name;
    }

    get price() {
        return this.product.price;
    }

    get id() {
        return this.product.id;
    }
}

export default CartItem;
