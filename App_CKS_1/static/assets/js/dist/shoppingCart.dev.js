"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var shoppingCart = {
  cart: [],
  initCart: function initCart() {
    var savedCart = sessionStorage.getItem('cart');

    if (savedCart) {
      this.cart = JSON.parse(savedCart);
      this.updateCartDisplay();
    }
  },
  addItemToCart: function addItemToCart(item) {
    var existingItem = this.cart.find(function (cartItem) {
      return cartItem.id === item.id;
    });

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.cart.push(_objectSpread({}, item, {
        quantity: item.quantity
      }));
    }

    this.saveCart();
    this.updateCartDisplay();
  },
  saveCart: function saveCart() {
    sessionStorage.setItem('cart', JSON.stringify(this.cart));
  },
  updateCartDisplay: function updateCartDisplay() {
    var cartBody = document.querySelector('.show-cart');
    var totalDisplay = document.querySelector('.total-cart');
    cartBody.innerHTML = '';
    var total = 0;
    this.cart.forEach(function (item) {
      var row = document.createElement('tr');
      row.innerHTML = "\n        <td>".concat(item.id, "</td>\n        <td>").concat(item.tipe, "</td>\n        <td>").concat(item.Price, " \u0433\u0440\u043D</td>\n        <td>").concat(item.quantity, "</td>\n        <td><button class=\"remove-item\" data-id=\"").concat(item.id, "\">\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438</button></td>\n      ");
      cartBody.appendChild(row);
      total += item.Price * item.quantity;
    });
    totalDisplay.textContent = total.toFixed(2);
    this.bindRemoveItemButtons();
  },
  bindRemoveItemButtons: function bindRemoveItemButtons() {
    var removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var itemId = this.getAttribute('data-id');
        removeFromCart(itemId);
      });
    });
  }
};

function removeFromCart(itemId) {
  shoppingCart.cart = shoppingCart.cart.filter(function (item) {
    return item.id !== Number(itemId);
  });
  shoppingCart.saveCart();
  shoppingCart.updateCartDisplay();
} // Initialization


document.addEventListener('DOMContentLoaded', function () {
  shoppingCart.initCart();
  var openCartButton = document.getElementById('openCartBtn');

  if (openCartButton) {
    openCartButton.addEventListener('click', function () {
      showCartModal();
      shoppingCart.updateCartDisplay();
    });
  } // Оформление заказа


  var checkoutBtn = document.getElementById('checkoutBtn');

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function () {
      hideCartModal();
      showOrderModal();
      var orderItemsList = document.querySelector('.order-items-list');
      orderItemsList.innerHTML = '';
      var cartItems = shoppingCart.cart;

      if (cartItems.length === 0) {
        var emptyMessage = document.createElement('li');
        emptyMessage.textContent = 'Кошик порожній';
        orderItemsList.appendChild(emptyMessage);
      } else {
        cartItems.forEach(function (item) {
          var listItem = document.createElement('li');
          listItem.textContent = "ID: ".concat(item.id, " - ").concat(item.tipe, " - ").concat(item.Price, " \u0433\u0440\u043D (\u041A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C: ").concat(item.quantity, ")");
          orderItemsList.appendChild(listItem);
        });
      }
    });
  } // Обработка формы заказа


  var checkoutForm = document.getElementById('checkoutForm');

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var name = document.getElementById('name').value.trim(2);
      var phone = document.getElementById('phone').value.trim();
      var cartItems = shoppingCart.cart; // Валидация формы

      if (!name || !phone) {
        toast.warning('Будь ласка, заповніть поля форми!');
        return;
      }

      if (cartItems.length === 0) {
        toast.info('Кошик порожній. Будь ласка, додайте товар до кошику перед оформленням замовлення.');
        return;
      }

      var orderDetails = {
        name: name,
        phone: phone,
        items: cartItems
      };
      console.log('Order placed:', orderDetails); // Формируем данные заказа

      var itemsDetails = cartItems.map(function (item) {
        return "ID: ".concat(item.id, " - ").concat(item.tipe, " - ").concat(item.Price, " \u0433\u0440\u043D (\u041A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C: ").concat(item.quantity, ")");
      }).join('\n');
      var message = "<b>\u0418\u043C\u044F:</b> ".concat(name, "\n<b>\u0422\u0435\u043B\u0435\u0444\u043E\u043D:</b> ").concat(phone, "\n<b>\u0412\u0430\u0448\u0435 \u0437\u0430\u043C\u043E\u0432\u043B\u0435\u043D\u043D\u044F:</b>\n").concat(itemsDetails);
      var encodedMessage = encodeURIComponent(message); // Telegram 

      var CHAT_ID = '-1002326954626';
      var BOT_TOKEN = '7789690626:AAGEoRLZY2WpWhU22cjfN7fbj7fS_nFCsYM'; // Перенести на сервер

      var url = "https://api.telegram.org/bot".concat(BOT_TOKEN, "/sendMessage?chat_id=").concat(CHAT_ID, "&text=").concat(encodedMessage, "&parse_mode=HTML"); // Отправка данных

      console.log('Отправляем сообщение:', message);
      console.log('Формируемый URL:', url);
      fetch(url).then(function (response) {
        if (!response.ok) {
          throw new Error('Ошибка при отправке сообщения в Telegram');
        }

        return response.json();
      }).then(function (data) {
        console.log('Сообщение отправлено:', data);
        toast.success('Ваше замовлення успішно відправлене!');
        hideOrderModal();
        checkoutForm.reset();
        shoppingCart.cart = [];
        shoppingCart.saveCart();
        shoppingCart.updateCartDisplay();
      })["catch"](function (error) {
        console.error('Ошибка при отправке сообщения:', error);
        toast.error('Відбулася помилка привідправленні замовлення. Спробуйте, будь ласка, ще раз!');
      });
    });
  } // Закрытие модальных окон


  window.onclick = function (event) {
    var cartModal = document.getElementById('modalWrapper');
    var orderModal = document.getElementById('orderModal');

    if (event.target === cartModal) {
      hideCartModal();
    } else if (event.target === orderModal) {
      hideOrderModal();
    }
  };
}); // Функции управления модальными окнами

function showCartModal() {
  var cartModal = document.getElementById('modalWrapper');

  if (cartModal) {
    cartModal.style.display = 'block';
  }
}

function hideCartModal() {
  var cartModal = document.getElementById('modalWrapper');

  if (cartModal) {
    cartModal.style.display = 'none';
  }
}

function showOrderModal() {
  var orderModal = document.getElementById('orderModal');

  if (orderModal) {
    orderModal.style.display = 'block';
  }
}

function hideOrderModal() {
  var orderModal = document.getElementById('orderModal');

  if (orderModal) {
    orderModal.style.display = 'none';
  }
}