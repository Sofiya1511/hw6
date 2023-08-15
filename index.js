function displayProducts(products) {
  const wrapper = document.querySelector(".wrapper");
  products.forEach((product) => {
    const productDiv = createProductDiv(product);
    wrapper.appendChild(productDiv);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", addToCartClicked);
  });

  const wrapper = document.querySelector(".wrapper");
  const cartContent = document.querySelector(".sidebar-content");

  wrapper.addEventListener("click", (event) => {
    if (event.target.classList.contains("add-to-cart-btn")) {
      addToCartClicked(event, cartContent);
    } else if (event.target.classList.contains("quantity-btn")) {
      handleQuantityChange(event, cartContent);
    }

    const orderButton = document.querySelector(".order-btn");
    orderButton.addEventListener("click", () => {
      alert("Your order has been placed!");
      cartContent.innerHTML = "";
      const cartItems = cartContent.querySelectorAll(".cart-item");
      orderButton.disabled = cartItems.length === 0;
    });

    const cartTotalElement = document.querySelector(".cart-total");
    orderButton.addEventListener("click", () => {
      cartTotalElement.textContent = "Total: $0.00";
    });
  });

  fetch("https://dummyjson.com/products")
    .then((res) => res.json())
    .then((data) => {
      displayProducts(data.products);
    });
});

function createProductDiv(product) {
  const productDiv = document.createElement("div");
  productDiv.classList.add("product");
  productDiv.innerHTML = `
    <img src="${product.thumbnail}" alt="${product.brand}" class="product-img position-relative object-fit-fill border rounded">
    <h3 class="product-title">${product.brand}</h3>
    <p class="product-description">${product.description}</p>
    <p class="product-price">$${product.price}</p>
    <p class="product-rating">${product.rating}</p>
    <button class="add-to-cart-btn">Add to cart</button>
  `;
  return productDiv;
}

function searchProducts() {
  const searchTerm = document
    .getElementById("search-input")
    .value.toLowerCase();
  const products = document.querySelectorAll(".product");

  products.forEach((product) => {
    const title = product
      .querySelector(".product-title")
      .textContent.toLowerCase();

    if (title.includes(searchTerm)) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
}

function openNav() {
  document.getElementById("mySidebar").style.width = "460px";
}

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
}

function addToCartClicked(event) {
  const button = event.target;
  const product = button.closest(".product");

  const productName = product.querySelector(".product-title").textContent;
  const productPrice = parseFloat(
    product.querySelector(".product-price").textContent.replace("$", "")
  );
  const productImage = product.querySelector(".product-img").src;

  const cartItem = document.createElement("div");
  cartItem.classList.add("cart-item");
  cartItem.innerHTML = `
    <img src="${productImage}" alt="${productName}" class="cart-item-image">
    <p>${productName} - $${productPrice}</p>
    <div class="quantity-controls">
      <button class="quantity-btn decrease">-</button>
      <span class="quantity">1</span>
      <button class="quantity-btn increase">+</button>
    </div>
  `;

  const cartContent = document.querySelector(".sidebar-content");
  cartContent.appendChild(cartItem);

  updateCartTotal(productPrice);
}

function updateCartTotal(priceChange) {
  const cartTotalElement = document.querySelector(".cart-total");
  const cartTotal = parseFloat(
    cartTotalElement.textContent.replace("Total: $", "")
  );
  const newTotal = cartTotal + priceChange;
  cartTotalElement.textContent = `Total: $${newTotal.toFixed(2)}`;
}

function handleQuantityChange(event) {
  const button = event.target;
  const quantityContainer = button.parentElement;
  const quantityElement = quantityContainer.querySelector(".quantity");
  const productPrice = parseFloat(
    button
      .closest(".cart-item")
      .querySelector(".product-price")
      .textContent.replace("$", "")
  );

  if (button.classList.contains("increase")) {
    const newQuantity = parseInt(quantityElement.textContent) + 1;
    quantityElement.textContent = newQuantity;
    updateCartTotal(productPrice);
  } else if (button.classList.contains("decrease")) {
    const currentQuantity = parseInt(quantityElement.textContent);
    if (currentQuantity > 1) {
      const newQuantity = currentQuantity - 1;
      quantityElement.textContent = newQuantity;
      updateCartTotal(-productPrice);
    }
  }

  const cartItems = document.querySelectorAll(".cart-item");
  const orderButton = document.querySelector(".order-btn");
  orderButton.disabled = cartItems.length === 0;
}
