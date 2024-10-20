// Hamburger Menu
document.getElementById('hamb-btn').addEventListener('click', toggleMobileMenu);
document.getElementById('hamb-btn-mobile').addEventListener('click', toggleMobileMenu);

function toggleMobileMenu() {
  document.body.classList.toggle('open-mobile-menu');
}


//catalog
// catalog
fetch('../data/data.json')
  .then(response => response.json())
  .then(data => {
    const isCatalogPage = window.location.pathname.includes('/pages/catalog.html');

    function renderItemsByType(items) {
      const sections = {
        "Браслет": document.querySelector('#bracelets .product-list'),
        "Гердан": document.querySelector('#gerdan .product-list'),
        "Намисто": document.querySelector('#necklace .product-list'),
        "Чокер": document.querySelector('#choker .product-list'),
        "Сережки": document.querySelector('#earrings .product-list')
      };

      // Очищаем секции перед добавлением новых товаров
      Object.values(sections).forEach(section => section.innerHTML = '');

      items.forEach(item => {
        const listItem = document.createElement('li');
        const imagePath = isCatalogPage ? `../images/${item.photo.split('/').pop()}` : `assets/images/${item.photo.split('/').pop()}`;

        listItem.innerHTML = `
          <div class="slide">
            <div class="slide-top">
              <img class="lazy" src="${imagePath}" alt="${item.tipe}">
            </div>
            <div class="slide-middle">
              <div class="title">${item.tipe}</div>
              <div class="price">${item.Price} грн</div>
            </div>
            <div class="slide-bottom">
              <div class="details">Матеріал: ${item.material}</div>
              <div class="details">Колір: ${item.color}</div>
              <div class="details">Розмір: ${item.size} см</div>
            </div>
            <button class="add-to-cart" 
              data-id="${item.id}" 
              data-name="${item.tipe}" 
              data-price="${item.Price}" 
              data-material="${item.material}" 
              data-color="${item.color}" 
              data-size="${item.size}" 
              data-photo="${item.photo}" 
              data-mark="${item.Mark}">
              Додати до кошика
            </button>
          </div>
        `;

        const section = sections[item.tipe.trim()];
        if (section) {
          section.appendChild(listItem);
        }
      });

      // Вызов функции для привязки событий
      addCartEventListeners();
    }

    renderItemsByType(data);
  })
  .catch(error => console.error('Помилка при завантаженні даних:', error));

// Добавляем обработчики для кнопок "Добавить в корзину"
function addCartEventListeners() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      const item = {
        id: Number(this.getAttribute('data-id')),
        tipe: this.getAttribute('data-name'),
        Price: Number(this.getAttribute('data-price')),
        quantity: 1,
        material: this.getAttribute('data-material'),
        color: this.getAttribute('data-color'),
        size: this.getAttribute('data-size'),
        photo: this.getAttribute('data-photo'),
        Mark: this.getAttribute('data-mark')
      };
      shoppingCart.addItemToCart(item);
      showCartModal();
      console.log("Add to cart button clicked!", item);
    });
  });
}
