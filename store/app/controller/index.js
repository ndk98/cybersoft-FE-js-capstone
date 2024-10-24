
let productList = null;
let fetchProductList = () => {
    axios({
        url: "https://6700eea0b52042b542d64a46.mockapi.io/api/V1/products",
        method: "GET"
    })
        .then((res) => {
            console.log("res:", res);
            productList = res.data;
            renderProduct(productList);
        })
        .catch((err) => {
            console.log("err:", err);
        })

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
        <button class ="btn-add" onclick="addProduct(${product.id})">Add to cart</button>
        </div>
     
    `
    });
    document.getElementById("product-list").innerHTML = content;

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
                `
                tong = tong + 1;
                break; // Dừng vòng lặp
            }
        }
    });
    document.getElementById("cart-list").innerHTML = content;
    document.getElementById("cart-number").innerHTML = tong;
}





fetchProductList();

//filter
// filterPhone(type){
//     let listPhoneFillter = [];
//     if()
// }
document.getElementById("selLoai").addEventListener("change", ()=>{
   const value = document.getElementById("selLoai").value;
   console.log(value);
   
    
});

// Mở giỏ hàng
function openCart() {
    document.getElementById("cart").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

// Đóng giỏ hàng
function closeCart() {
    document.getElementById("cart").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// Xóa sản phẩm khỏi giỏ hàng
function removeItem() {
    document.querySelector('.cart-item').style.display = 'none';
    document.getElementById('total').innerText = '0';
}

// Tăng giảm số lượng sản phẩm
let quantity = 1;
// let pricePerItem = price;

function increaseQuantity() {
    quantity++;
    document.getElementById('quantity').innerText = quantity;
    document.getElementById('total').innerText = quantity * pricePerItem;
}

function decreaseQuantity() {
    if (quantity > 1) {
        quantity--;
        document.getElementById('quantity').innerText = quantity;
        document.getElementById('total').innerText = quantity * pricePerItem;
    }
}

// Xóa toàn bộ giỏ hàng
function clearCart() {
    document.querySelector('.cart-item').style.display = 'none';
    document.getElementById('total').innerText = '0';
}

