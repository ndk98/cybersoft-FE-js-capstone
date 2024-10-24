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
        <p>Giá: $${product.price}</p>
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

let gioHang = (mangSanPhamDaThem) => {
    let content = "";
    let tong = 0;
    if (mangSanPhamDaThem) {
        mangSanPhamDaThem = mangSanPhamDaThem.split(",");
    }
    mangSanPhamDaThem.forEach((productDaThem) => {
        for (let product of productList) {
            if (product.id == productDaThem) {
                content += `
                <div class="product-item--box">
                <img src="${product.img}" alt="${product.name}" width="100">
                <h2>${product.name}</h2>
                <p>Giá: $${product.price}</p>
                </div>
                `;
                tong = tong + 1;
                break; // Dừng vòng lặp
            }
        }
    });
    document.getElementById("cart-list").innerHTML = content;
    document.getElementById("cart-number").innerHTML = tong;
};

fetchProductList();

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
    document.querySelector(".cart-item").style.display = "none";
    document.getElementById("total").innerText = "0";
}

// Tăng giảm số lượng sản phẩm
let quantity = 1;
// let pricePerItem = price;

function increaseQuantity() {
    quantity++;
    document.getElementById("quantity").innerText = quantity;
    document.getElementById("total").innerText = quantity * pricePerItem;
}

function decreaseQuantity() {
    if (quantity > 1) {
        quantity--;
        document.getElementById("quantity").innerText = quantity;
        document.getElementById("total").innerText = quantity * pricePerItem;
    }
}

// Xóa toàn bộ giỏ hàng
function clearCart() {
    document.querySelector(".cart-item").style.display = "none";
    document.getElementById("total").innerText = "0";
}
