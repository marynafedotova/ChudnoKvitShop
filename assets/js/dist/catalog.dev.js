"use strict";

// Hamburger Menu
document.getElementById('hamb-btn').addEventListener('click', toggleMobileMenu);
document.getElementById('hamb-btn-mobile').addEventListener('click', toggleMobileMenu);

function toggleMobileMenu() {
  document.body.classList.toggle('open-mobile-menu');
} //catalog
// catalog


fetch('../data/data.json').then(function (response) {
  return response.json();
}).then(function (data) {
  var isCatalogPage = window.location.pathname.includes('/pages/catalog.html');

  function renderItemsByType(items) {
    var sections = {
      "Браслет": document.querySelector('#bracelets .product-list'),
      "Гердан": document.querySelector('#gerdan .product-list'),
      "Намисто": document.querySelector('#necklace .product-list'),
      "Чокер": document.querySelector('#choker .product-list'),
      "Сережки": document.querySelector('#earrings .product-list')
    }; // Очищаем секции перед добавлением новых товаров

    Object.values(sections).forEach(function (section) {
      return section.innerHTML = '';
    });
    items.forEach(function (item) {
      var listItem = document.createElement('li');
      var imagePath = isCatalogPage ? "../images/".concat(item.photo.split('/').pop()) : "assets/images/".concat(item.photo.split('/').pop());
      listItem.innerHTML = "\n          <div class=\"slide\">\n            <div class=\"slide-top\">\n              <img class=\"lazy\" src=\"".concat(imagePath, "\" alt=\"").concat(item.tipe, "\">\n            </div>\n            <div class=\"slide-middle\">\n              <div class=\"title\">").concat(item.tipe, "</div>\n              <div class=\"price\">").concat(item.Price, " \u0433\u0440\u043D</div>\n            </div>\n            <div class=\"slide-bottom\">\n              <div class=\"details\"><div class=\"details-title\">\u041C\u0430\u0442\u0435\u0440\u0456\u0430\u043B:</div>  ").concat(item.material, "</div>\n              <div class=\"details\"><div class=\"details-title\">\u041A\u043E\u043B\u0456\u0440:</div>  ").concat(item.color, "</div>\n              <div class=\"details\"><div class=\"details-title\">\u0420\u043E\u0437\u043C\u0456\u0440:</div>  ").concat(item.size, " \u0441\u043C</div>\n            </div>\n            <button class=\"add-to-cart\" \n              data-id=\"").concat(item.id, "\" \n              data-name=\"").concat(item.tipe, "\" \n              data-price=\"").concat(item.Price, "\" \n              data-material=\"").concat(item.material, "\" \n              data-color=\"").concat(item.color, "\" \n              data-size=\"").concat(item.size, "\" \n              data-photo=\"").concat(item.photo, "\" \n              data-mark=\"").concat(item.Mark, "\">\n              \u0414\u043E\u0434\u0430\u0442\u0438 \u0434\u043E \u043A\u043E\u0448\u0438\u043A\u0430\n            </button>\n          </div>\n        ");
      var section = sections[item.tipe.trim()];

      if (section) {
        section.appendChild(listItem);
      }
    }); // Вызов функции для привязки событий

    addCartEventListeners();
  }

  renderItemsByType(data);
})["catch"](function (error) {
  return console.error('Помилка при завантаженні даних:', error);
}); // Добавляем обработчики для кнопок "Добавить в корзину"

function addCartEventListeners() {
  var addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach(function (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      var item = {
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