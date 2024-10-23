import ProductManagement from "../model/ProductManagement.js";
import Product from "../model/Product.js";
import Validation from "../model/Validation.js";

const productManagement = new ProductManagement();

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("productModal");
  const openModalBtn = document.getElementById("addProductModal");
  const closeModalBtn = document.getElementById("closeModalBtn");

  // Open modal
  openModalBtn.addEventListener("click", () => {
    document.getElementById("modal-title").textContent = "Add New Product";
    clearForm();
    showModal();
  });

  // Close modal
  closeModalBtn.addEventListener("click", hideModal);

  // Close modal when clicking outside of the modal content
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      hideModal();
    }
  });

  // Render product list
  const productList = document.querySelector("tbody#productList");
  productList.innerHTML = getProductListHtml();

  //Handle search
  const searchBox = document.getElementById("search-box");
  searchBox.addEventListener("input", function (event) {
    const searchValue = event.target.value;

    const filteredProducts = productManagement.filterProducts(searchValue);
    filteredProducts.then((products) => {
      productList.innerHTML = renderProductList(products);
    });
  });

  // Handle sort
  const sortSelect = document.getElementById("order-by-price");
  sortSelect.addEventListener("change", function (event) {
    const sortBy = event.target.value;

    const sortedProducts = productManagement.sortProductsByPrice(sortBy);
    sortedProducts.then((products) => {
      productList.innerHTML = renderProductList(products);
    });
  });

  // Handle save product
  const productForm = document.getElementById("productForm");

  productForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(productForm);
    const product = new Product(
      formData.get("id").length ? formData.get("id") : null,
      formData.get("name"),
      formData.get("price"),
      formData.get("screen"),
      formData.get("backCamera"),
      formData.get("frontCamera"),
      formData.get("image"),
      formData.get("desc"),
      formData.get("type")
    );

    // Validate form
    const validation = new Validation();
    let errors = validation.validate(product);

    if (Object.keys(errors).length) {
      for (let key in errors) {
        const input = document.getElementById(key);
        input.classList.add("is-error");

        const errorElement = document.getElementById(`error-${key}`);
        errorElement.classList.add("is-error");
        errorElement.textContent = errors[key];
      }
      return;
    }

    showLoader();
    // Save product
    if (product.id) {
      productManagement
        .updateProduct(product)
        .then(() => {
          getProductListHtml();
        })
        .catch((error) => {
          console.error(error);
          getProductListHtml();
        })
        .finally(() => hideLoader());
    } else {
      productManagement
        .addProduct(product)
        .then(() => {
          getProductListHtml();
        })
        .catch((error) => {
          console.error(error);
          getProductListHtml();
        })
        .finally(() => hideLoader());
    }

    // Close the modal after form submission
    hideModal();
  });

  const inputs = productForm.getElementsByTagName("input");
  for (let input of inputs) {
    input.addEventListener("input", function (event) {
      const input = event.target;
      input.classList.remove("is-error");

      const errorElement = document.getElementById(`error-${input.id}`);
      errorElement.classList.remove("is-error");
      errorElement.textContent = "";
    });
  }

  const productListElment = document.querySelector("tbody#productList");
  function getProductListHtml() {
    let productList = productManagement.getProductList();

    productList
      .then((products) => {
        productListElment.innerHTML = renderProductList(products);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // Add event listeners to edit buttons
  function addEditBtnsEventListeners() {
    let editBtns = productListElment.querySelectorAll(".edit-btn");
    editBtns.forEach((editBtn) => {
      editBtn.addEventListener("click", editProduct.bind(editBtn));
    });
  }

  function editProduct() {
    const productId = this.getAttribute("data-id");
    const product = productManagement.getProductById(productId);

    document.getElementById("modal-title").textContent = "Edit Product";

    // Clear form
    clearForm();

    productForm.id.value = product.id;
    productForm.name.value = product.name;
    productForm.price.value = product.price;
    productForm.screen.value = product.screen;
    productForm.backCamera.value = product.backCamera;
    productForm.frontCamera.value = product.frontCamera;
    productForm.image.value = product.img;
    productForm.desc.value = product.desc;
    productForm.type.value = product.type;

    showModal();
  }

  // Add event listeners to delete buttons
  function addDeleteBtnsEventListeners() {
    let deleteBtns = productListElment.querySelectorAll(".delete-btn");
    deleteBtns.forEach((deleteBtn) => {
      deleteBtn.addEventListener("click", deleteProduct.bind(deleteBtn));
    });
  }

  function deleteProduct() {
    showLoader();
    const productId = this.getAttribute("data-id");
    const product = productManagement.getProductById(productId);
    const response = productManagement.removeProduct(product);
    response.then(() => {
      getProductListHtml();
      hideLoader();
    });
  }

  // Observe changes in the product list
  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        addDeleteBtnsEventListeners();
        addEditBtnsEventListeners();
      }
    }
  });
  observer.observe(productListElment, { childList: true, subtree: true });

  function renderProductList(products) {
    document.getElementById("total-products").textContent = products.length;

    return products
      .map((product) => {
        return `
        <tr>
          <td>${product.id}</td>
          <td>${product.name}</td>
          <td>${product.price}</td>
          <td>${product.screen}</td>
          <td>${product.backCamera}</td>
          <td>${product.frontCamera}</td>
          <td>
            <img
              src="${product.img}"
              width="100px"
              height="100px"
              alt="${product.name}"
            />
          </td>
          <td>${product.desc}</td>
          <td>${product.type}</td>
          <td class="actions">
            <span class="more-options"
              ><a href="#" class="edit-btn" id="btnEdit${product.id}" data-id="${product.id}"><i class="fa-regular fa-pen-to-square"></i></a
            ></span>
            <span class="more-options"
              ><a href="#" class="delete-btn" id="btnDelete${product.id}" data-id="${product.id}"><i class="fa-solid fa-trash-can"></i></a
            ></span>
          </td>
        </tr>
      `;
      })
      .join("");
  }

  const loader = document.getElementById("loader");

  function showLoader() {
    loader.style.display = "block";
  }

  function hideLoader() {
    loader.style.display = "none";
  }

  function showModal() {
    modal.style.display = "flex";
  }

  function hideModal() {
    modal.style.display = "none";
  }

  function clearForm() {
    productForm.reset();
  }
});
