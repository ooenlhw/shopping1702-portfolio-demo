const products = [
  { id: 3, name: 'Colorfulbag', price: 15000, category: 'Bag', image: 'admin/image/img7.jpg', description: 'Best Choice' },
  { id: 4, name: 'Couple', price: 1200, category: 'Free Shirt', image: 'admin/image/4.jpg', description: 'Sample shirt product' },
  { id: 5, name: 'Style Shoe', price: 15000, category: 'Shoe', image: 'admin/image/img6.jpg', description: 'Sample shoe product' },
  { id: 6, name: 'Necklace', price: 20000, category: 'Fancy Jewellery', image: 'admin/image/img3.jpg', description: 'Sample jewellery product' }
];
const money = value => 'Ks ' + value.toLocaleString();
const cart = new Map();
const dialog = document.querySelector('#shop-dialog');
const content = document.querySelector('#dialog-content');
const title = document.querySelector('#dialog-title');
const count = document.querySelector('#cart-count');
let activeCategory = 'all';

function showProducts() {
  let visible = 0;
  document.querySelectorAll('.product-card').forEach(card => {
    card.hidden = activeCategory !== 'all' && card.dataset.category !== activeCategory;
    if (!card.hidden) visible++;
  });
  document.querySelector('#result-count').textContent = visible + ' product' + (visible === 1 ? '' : 's');
  document.querySelector('#empty-products').hidden = visible !== 0;
}
document.querySelectorAll('#category-list button').forEach(button => button.addEventListener('click', () => {
  activeCategory = button.dataset.category;
  document.querySelectorAll('#category-list button').forEach(item => {
    const selected = item === button;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  showProducts();
  document.querySelector('#products').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}));
showProducts();

function updateCount() { count.textContent = [...cart.values()].reduce((sum, qty) => sum + qty, 0); }
function renderCart() {
  title.textContent = 'My Cart';
  content.replaceChildren();
  if (!cart.size) { content.textContent = 'Your cart is empty. Add a product to try the demo.'; return; }
  let total = 0;
  for (const [id, qty] of cart) {
    const product = products.find(item => item.id === id);
    total += product.price * qty;
    const row = document.createElement('div');
    row.className = 'cart-row';
    const description = document.createElement('div');
    const name = document.createElement('strong');
    name.textContent = product.name;
    const price = document.createElement('small');
    price.textContent = money(product.price) + ' each';
    description.append(name, document.createElement('br'), price);
    const label = document.createElement('label');
    label.textContent = 'Qty ';
    const input = document.createElement('input');
    input.type = 'number'; input.min = '1'; input.max = '10'; input.value = qty;
    input.dataset.quantity = id;
    input.setAttribute('aria-label', 'Quantity for ' + product.name);
    label.append(input);
    const remove = document.createElement('button');
    remove.type = 'button'; remove.dataset.remove = id; remove.textContent = 'Remove';
    row.append(description, label, remove);
    content.append(row);
  }
  const totalLine = document.createElement('p');
  totalLine.className = 'cart-total'; totalLine.textContent = 'Total: ' + money(total);
  const note = document.createElement('p');
  note.className = 'cart-note'; note.textContent = 'Demo cart only. Checkout and payment are unavailable.';
  content.append(totalLine, note);
}
document.querySelector('#cart-button').addEventListener('click', () => { renderCart(); dialog.showModal(); });
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
content.addEventListener('click', event => {
  const id = Number(event.target.dataset.remove);
  if (id) { cart.delete(id); updateCount(); renderCart(); }
});
content.addEventListener('change', event => {
  const id = Number(event.target.dataset.quantity);
  if (id) { cart.set(id, Math.max(1, Math.min(10, Number(event.target.value) || 1))); updateCount(); renderCart(); }
});
document.querySelectorAll('.add-to-cart').forEach(button => button.addEventListener('click', () => {
  const id = Number(button.dataset.id);
  cart.set(id, Math.min(10, (cart.get(id) || 0) + 1));
  updateCount();
  button.textContent = 'Added ✓';
  setTimeout(() => { button.textContent = 'Add to Cart'; }, 1200);
}));
document.querySelectorAll('.view-detail').forEach(button => button.addEventListener('click', () => {
  const product = products.find(item => item.id === Number(button.dataset.id));
  title.textContent = product.name;
  content.replaceChildren();
  const image = document.createElement('img');
  image.className = 'detail-image'; image.src = product.image; image.alt = product.name;
  const description = document.createElement('p'); description.textContent = product.description;
  const category = document.createElement('p'); category.textContent = 'Category: ' + product.category;
  const price = document.createElement('p'); price.textContent = 'Price: ' + money(product.price);
  const note = document.createElement('p'); note.className = 'cart-note'; note.textContent = 'Product details are sample content from the original project.';
  content.append(image, description, category, price, note);
  dialog.showModal();
}));

const slides = ['image/1.jpg', 'image/2.jpg', 'image/3.jpg'];
let slide = 0;
function showSlide(index) {
  slide = (index + slides.length) % slides.length;
  document.querySelector('#slide-image').src = slides[slide];
  document.querySelectorAll('.slide-dots button').forEach((button, i) => {
    const selected = i === slide;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
}
document.querySelector('#prev-slide').addEventListener('click', () => showSlide(slide - 1));
document.querySelector('#next-slide').addEventListener('click', () => showSlide(slide + 1));
document.querySelectorAll('.slide-dots button').forEach(button => button.addEventListener('click', () => showSlide(Number(button.dataset.slide))));
