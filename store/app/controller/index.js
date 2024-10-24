import Cart from "../model/Cart.js";

let cart = new Cart();

let productList = null;
let fetchProductList = () => {
    axios({
        url: "https://6700eea0b52042b542d64a46.mockapi.io/api/V1/products",
        method: "GET",
    })
        .then((res) => {
            console.log("res:", res);
            productList = res.data;
            renderProduct(productList);
        })
        .catch((err) => {
            console.log("err:", err);
        });
};

let renderProduct = (productList) => {
    let content = "";
    productList.forEach((product) => {
        content += `
             <div class="product-item--box">
        <img src="${product.img}" alt="${product.name}" width="100">
        <h2>${product.name}</h2>
        <h3>Giá: $${product.price}</h3>
        <p>Màn hình: ${product.screen}</p>
        <p>Camera sau: ${product.backCamera}</p>
        <p>Camera trước: ${product.frontCamera}</p>
        <p>Mô tả: ${product.desc}</p>
        <button class="btn-add" data-productId="${product.id}">Add to cart</button>
        </div>
     
    `;
    });
    document.getElementById("product-list").innerHTML = content;

    // Add event listener for each button
    document.querySelectorAll("button.btn-add").forEach((btn) => {
        btn.addEventListener("click", addProduct.bind(btn));
    });
};

function addProduct() {
    let productId = this.getAttribute("data-productId");
    cart.add(productId, 1).then(() => renderCart());
}

//fillter
let products = [];
async function fetchProduct() {
    try {
        const response = await fetch(
            `https://6700eea0b52042b542d64a46.mockapi.io/api/V1/products`
        );
        const data = await response.json();
        products = data;
        createProductUI(products);
    } catch (error) {
        console.error("err:", error);
    }
}
function createProductUI(productArray) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";
    productArray.forEach((product) => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");

        productDiv.innerHTML = `
            <div class="product-card">
        <img src="${product.img}" alt="${product.name}" width="100">
        <h2>${product.name}</h2>
        <h3>Giá: $${product.price}</h3>
        <p>Màn hình: ${product.screen}</p>
        <p>Camera sau: ${product.backCamera}</p>
        <p>Camera trước: ${product.frontCamera}</p>
        <p>Mô tả: ${product.desc}</p>
        <button class="btn-add" data-productId="${product.id}">Add to cart</button>
        </div>
        `;
        productList.appendChild(productDiv);
    });

    // Add event listener for each button
    document.querySelectorAll("button.btn-add").forEach((btn) => {
        btn.addEventListener("click", addProduct.bind(btn));
    });
}
function filterProducts() {
    const selectedType = document.getElementById("product-filter").value;
    let filteredProducts;

    if (selectedType === "all") {
        filteredProducts = products;
    } else {
        filteredProducts = products.filter(
            (product) =>
                product.type.toLowerCase() === selectedType.toLowerCase()
        );
    }
    createProductUI(filteredProducts);
}

document
    .getElementById("product-filter")
    .addEventListener("change", filterProducts);
fetchProduct();

function renderCart() {
    let content = "";
    let total = 0;
    cart.getItems().forEach((item) => {
        content += `
        <tr class="cart-item">
            <td class="product-name">
                <p>${item.name}</p>
                <img src="${item.product.img}" alt="${item.name}" width="70">
            </td>
            <td>$${item.price}</td>
            <td>
                <div class="qty">
                    <button class="btn-decrease qty-btn" data-productId="${item.product.id}">-</button>
                    <input class"qty-input" type="number" value="${item.quantity}" disabled>
                    <button class="btn-increase qty-btn" data-productId="${item.product.id}">+</button>
                </div>
            </td>
            <td>$${item.total}</td>
            <td>
                <button class="btn-remove btn" data-productId="${item.product.id}">Xóa</button>
            </td>
        </tr>
        `;
        total += item.total;
    });
    document.getElementById("cart-items").innerHTML = content;
    document.getElementById("total").innerText = total;

    // Add event listener for each button
    document.querySelectorAll("button.btn-remove").forEach((btn) => {
        btn.addEventListener("click", removeItem.bind(btn));
    });

    document.querySelectorAll(".btn-increase.qty-btn").forEach((btn) => {
        btn.addEventListener("click", increaseQuantity.bind(btn));
    });

    document.querySelectorAll(".btn-decrease.qty-btn").forEach((btn) => {
        btn.addEventListener("click", decreaseQuantity.bind(btn));
    });

    updateCartCount();
}

renderCart();

// Update cart count
function updateCartCount() {
    const cartItemCount = document.getElementById("cartCount");
    cartItemCount.innerText = cart.getItems().length;
}

const cartModal = document.getElementById("cart");

// Open cart
let openCartBtn = document.getElementById("openCartBtn");
openCartBtn.addEventListener("click", openCart);

// Đóng giỏ hàng
let closeCartBtn = document.getElementById("closeCartBtn");
closeCartBtn.addEventListener("click", closeCart);

// Close modal when clicking outside of the modal content
document.getElementById("overlay").addEventListener("click", closeCart);

function openCart() {
    cartModal.style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeCart() {
    document.getElementById("cart").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// Xóa sản phẩm khỏi giỏ hàng
function removeItem() {
    let productId = this.getAttribute("data-productId");
    cart.removeItem(productId);
    renderCart();
}

function increaseQuantity() {
    let productId = this.getAttribute("data-productId");
    cart.increaseQuantity(productId);
    renderCart();
}

function decreaseQuantity() {
    let productId = this.getAttribute("data-productId");
    cart.decreaseQuantity(productId);
    renderCart();
}

// Remove all items from cart
let clearCartBtn = document.getElementById("clearCartBtn");
clearCartBtn.addEventListener("click", () => {
    if (cart.getItems().length === 0) {
        alert("Giỏ hàng của bạn đã trống!");
        return;
    }

    if (confirm("Bạn có chắc chắn muốn xóa toàn bộ sản phẩm khỏi giỏ hàng?")) {
        cart.clear();
        renderCart();
    }
    return;
});
