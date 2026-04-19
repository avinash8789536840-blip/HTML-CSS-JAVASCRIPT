const products = [
  {
    id: 1,
    name: 'Studio Noise-Cancelling Headset',
    category: 'audio',
    price: 119.99,
    rating: 4.8,
    tag: 'Audio',
    description: 'Comfortable over-ear design with premium sound and AES certification for clear study sessions.',
    image: 'https://images.unsplash.com/photo-1512446817454-1bca0e4450cf?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    name: 'Compact Bluetooth Speaker',
    category: 'audio',
    price: 89.0,
    rating: 4.5,
    tag: 'Audio',
    description: 'Portable speaker with vibrant sound and 16-hour battery life for on-the-go listening.',
    image: 'https://images.unsplash.com/photo-1518448032708-180e08d62d6d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    name: 'Minimalist Desk Organizer',
    category: 'work',
    price: 34.5,
    rating: 4.6,
    tag: 'Work',
    description: 'Aesthetic desktop organizer with charging space, pen holders, and notebook slots.',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    name: 'Laptop Comfort Stand',
    category: 'work',
    price: 49.99,
    rating: 4.7,
    tag: 'Work',
    description: 'Adjustable aluminium stand for better posture and cooler laptop performance.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    name: 'Urban Sneaker Set',
    category: 'fashion',
    price: 72.5,
    rating: 4.4,
    tag: 'Fashion',
    description: 'Modern sneakers with cushioned soles and everyday comfort for campus life.',
    image: 'https://images.unsplash.com/photo-1519741498245-7f93042b3029?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 6,
    name: 'Smart Accessory Case',
    category: 'fashion',
    price: 26.99,
    rating: 4.3,
    tag: 'Accessories',
    description: 'Compact case for charging cables, earbuds, and daily essentials.',
    image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80',
  },
];

const productGrid = document.getElementById('productGrid');
const cartBtn = document.getElementById('cartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const modalOverlay = document.getElementById('modalOverlay');
const quickViewModal = document.getElementById('quickViewModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalImage = document.getElementById('modalImage');
const modalName = document.getElementById('modalName');
const modalDesc = document.getElementById('modalDesc');
const modalPrice = document.getElementById('modalPrice');
const modalTag = document.getElementById('modalTag');
const modalAddBtn = document.getElementById('modalAddBtn');

let cart = [];
let activeProduct = null;
let activeCategory = 'all';
let searchTerm = '';

function formatCurrency(value) {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
}

function renderProducts() {
  const filtered = products.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.tag.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  productGrid.innerHTML = filtered
    .map(
      (product) => `
      <article class="product-card">
        <img src="${product.image}" alt="${product.name}" />
        <span class="product-tag">${product.tag}</span>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="price-row">
          <div class="price">${formatCurrency(product.price)}</div>
          <div class="rate">
            <i class="fa-solid fa-star"></i>${product.rating}
          </div>
        </div>
        <div class="product-actions">
          <button class="button button-primary" data-action="add" data-id="${product.id}">Add to Cart</button>
          <button class="button secondary" data-action="view" data-id="${product.id}">Quick View</button>
        </div>
      </article>
    `
    )
    .join('');
}

function updateCartIndicator() {
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalQuantity;
}

function updateCartDrawer() {
  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty. Add some essentials to begin.</p>';
    cartTotal.textContent = formatCurrency(0);
    return;
  }

  cartItems.innerHTML = cart
    .map((item) => {
      const product = products.find((product) => product.id === item.id);
      return `
      <div class="cart-item">
        <img src="${product.image}" alt="${product.name}" />
        <div>
          <h4>${product.name}</h4>
          <p>${formatCurrency(product.price)}</p>
          <div class="quantity-selector">
            <button data-action="decrease" data-id="${product.id}">-</button>
            <span>${item.quantity}</span>
            <button data-action="increase" data-id="${product.id}">+</button>
          </div>
        </div>
      </div>
    `;
    })
    .join('');

  const totalAmount = cart.reduce((sum, item) => {
    const product = products.find((product) => product.id === item.id);
    return sum + product.price * item.quantity;
  }, 0);

  cartTotal.textContent = formatCurrency(totalAmount);
}

function openCart() {
  cartDrawer.classList.add('active');
}

function closeCart() {
  cartDrawer.classList.remove('active');
}

function openModal(product) {
  activeProduct = product;
  modalImage.src = product.image;
  modalName.textContent = product.name;
  modalDesc.textContent = product.description;
  modalPrice.textContent = formatCurrency(product.price);
  modalTag.textContent = product.tag;
  modalOverlay.classList.add('active');
}

function closeModal() {
  modalOverlay.classList.remove('active');
}

function addToCart(productId) {
  const itemIndex = cart.findIndex((item) => item.id === productId);
  if (itemIndex > -1) {
    cart[itemIndex].quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  updateCartIndicator();
  updateCartDrawer();
  openCart();
}

function changeQuantity(productId, delta) {
  const itemIndex = cart.findIndex((item) => item.id === productId);
  if (itemIndex === -1) return;
  cart[itemIndex].quantity += delta;
  if (cart[itemIndex].quantity <= 0) {
    cart.splice(itemIndex, 1);
  }
  updateCartIndicator();
  updateCartDrawer();
}

productGrid.addEventListener('click', (event) => {
  const action = event.target.dataset.action;
  const id = Number(event.target.dataset.id);
  if (!action || !id) return;

  if (action === 'add') {
    addToCart(id);
  }
  if (action === 'view') {
    const product = products.find((product) => product.id === id);
    if (product) {
      openModal(product);
    }
  }
});

cartItems.addEventListener('click', (event) => {
  const action = event.target.dataset.action;
  const id = Number(event.target.dataset.id);
  if (!action || !id) return;

  if (action === 'decrease') changeQuantity(id, -1);
  if (action === 'increase') changeQuantity(id, 1);
});

cartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
modalOverlay.addEventListener('click', (event) => {
  if (event.target === modalOverlay) closeModal();
});
closeModalBtn.addEventListener('click', closeModal);
modalAddBtn.addEventListener('click', () => {
  if (activeProduct) {
    addToCart(activeProduct.id);
    closeModal();
  }
});

searchInput.addEventListener('input', (event) => {
  searchTerm = event.target.value.trim().toLowerCase();
  renderProducts();
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    activeCategory = button.dataset.category;
    renderProducts();
  });
});

// Initialize
renderProducts();
updateCartIndicator();
updateCartDrawer();
