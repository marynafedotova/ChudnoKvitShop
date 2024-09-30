"use strict";

// Hamburger Menu
document.getElementById('hamb-btn').addEventListener('click', toggleMobileMenu);
document.getElementById('hamb-btn-mobile').addEventListener('click', toggleMobileMenu);

function toggleMobileMenu() {
  document.body.classList.toggle('open-mobile-menu');
} // Slider


document.addEventListener('DOMContentLoaded', function () {
  fetch('assets/data/data.json').then(function (response) {
    return response.json();
  }).then(function (data) {
    createSlider('sliderNewGoods', data);
  })["catch"](function (error) {
    return console.error('Error fetching data:', error);
  });
});

function createSlider(elementId, jsonData) {
  var sliderContainer = $("#" + elementId);
  var ulElement = $("<ul></ul>");
  var slides = jsonData.map(function (item) {
    return "\n    <li>\n      <div class=\"slide\">\n        <div class=\"slide-top\">\n          <img class=\"lazy\" src=\"".concat(item.photo, "\" alt=\"").concat(item.tipe, "\">\n        </div>\n        <div class=\"slide-middle\">\n          <div class=\"title\">").concat(item.tipe, "</div>\n          <div class=\"price\">").concat(item.Price, " \u0433\u0440\u043D</div>\n        </div>\n        <div class=\"slide-bottom\">\n          <div class=\"details\">\u041C\u0430\u0442\u0435\u0440\u0456\u0430\u043B: ").concat(item.material, "</div>\n          <div class=\"details\">\u041A\u043E\u043B\u0456\u0440: ").concat(item.color, "</div>\n          <div class=\"details\">\u0420\u043E\u0437\u043C\u0456\u0440: ").concat(item.size, " \u0441\u043C</div>\n        </div>\n        <button class=\"add-to-cart\"\n         data-id=\"").concat(item.id, "\" data-name=\"").concat(item.tipe, "\" \n         data-price=\"").concat(item.Price, "\" data-material=\"").concat(item.material, "\" \n         data-color=\"").concat(item.color, "\" data-size=\"").concat(item.size, "\" \n         data-photo=\"").concat(item.photo, "\" data-mark=\"").concat(item.Mark, "\">\u0414\u043E\u0434\u0430\u0442\u0438 \u0434\u043E \u043A\u043E\u0448\u0438\u043A\u0430</button>\n\n      </div>\n    </li>\n  ");
  });
  ulElement.html(slides.join(""));
  sliderContainer.append(ulElement);
  initializeSlider(ulElement);
  addCartEventListeners(ulElement);
}

function initializeSlider(ulElement) {
  ulElement.lightSlider({
    item: 3,
    controls: true,
    loop: true,
    speed: 400,
    auto: true,
    slideMove: 1,
    slideMargin: 20,
    pager: true,
    enableTouch: true,
    verticalHeight: 700,
    responsive: [{
      breakpoint: 1200,
      settings: {
        item: 2,
        slideMove: 1
      }
    }, {
      breakpoint: 900,
      settings: {
        item: 1,
        slideMove: 1
      }
    }]
  });
}

function addCartEventListeners(ulElement) {
  var addToCartButtons = ulElement.querySelectorAll('.add-to-cart');
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
      console.log("Add to cart button clicked!");
    });
  });
}