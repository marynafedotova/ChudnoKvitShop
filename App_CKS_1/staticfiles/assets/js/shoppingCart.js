const shoppingCart = {
  cart: [],

  initCart: function() {
    const savedCart = sessionStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
      this.updateCartDisplay();
    }
  },

  addItemToCart: function(item) {
    const existingItem = this.cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.cart.push({ ...item, quantity: item.quantity });
    }
    this.saveCart();
    this.updateCartDisplay();
  },

  saveCart: function() {
    sessionStorage.setItem('cart', JSON.stringify(this.cart));
  },

  updateCartDisplay: function() {
    const cartBody = document.querySelector('.show-cart');
    const totalDisplay = document.querySelector('.total-cart');

    cartBody.innerHTML = '';
    let total = 0;

    this.cart.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.tipe}</td>
        <td>${item.Price} грн</td>
        <td>${item.quantity}</td>
        <td><button class="remove-item" data-id="${item.id}">Видалити</button></td>
      `;
      cartBody.appendChild(row);
      total += item.Price * item.quantity;
    });

    totalDisplay.textContent = total.toFixed(2);
    this.bindRemoveItemButtons();
  },

  bindRemoveItemButtons: function() {
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
      button.addEventListener('click', function() {
        const itemId = this.getAttribute('data-id');
        removeFromCart(itemId);
      });
    });
  }
};

function removeFromCart(itemId) {
  shoppingCart.cart = shoppingCart.cart.filter(item => item.id !== Number(itemId));
  shoppingCart.saveCart();
  shoppingCart.updateCartDisplay();
}

// Initialization
document.addEventListener('DOMContentLoaded', function() {
  shoppingCart.initCart();

  const openCartButton = document.getElementById('openCartBtn');
  if (openCartButton) {
    openCartButton.addEventListener('click', function() {
      showCartModal();
      shoppingCart.updateCartDisplay();
    });
  }

  // Оформление заказа
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
      hideCartModal();
      showOrderModal();
  
      const orderItemsList = document.querySelector('.order-items-list');
      orderItemsList.innerHTML = '';
      const cartItems = shoppingCart.cart;
  
      if (cartItems.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = 'Кошик порожній';
        orderItemsList.appendChild(emptyMessage);
      } else {
        cartItems.forEach(item => {
          const listItem = document.createElement('li');
          listItem.textContent = `ID: ${item.id} - ${item.tipe} - ${item.Price} грн (Кількість: ${item.quantity})`;
          orderItemsList.appendChild(listItem);
        });
      }
    });
  }
  

  // Обработка формы заказа
  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const name = document.getElementById('name').value.trim(2);
      const phone = document.getElementById('phone').value.trim();
      const cartItems = shoppingCart.cart;

      // Валидация формы
      if (!name || !phone) {
        toast.warning('Будь ласка, заповніть поля форми!');
        return;
      }

      if (cartItems.length === 0) {
        toast.info('Кошик порожній. Будь ласка, додайте товар до кошику перед оформленням замовлення.');
        return;
      }

      const orderDetails = { name, phone, items: cartItems };
      console.log('Order placed:', orderDetails);


      // Формируем данные заказа
const itemsDetails = cartItems.map(item => `ID: ${item.id} - ${item.tipe} - ${item.Price} грн (Кількість: ${item.quantity})`).join('\n');

const message = `<b>Имя:</b> ${name}\n<b>Телефон:</b> ${phone}\n<b>Ваше замовлення:</b>\n${itemsDetails}`;
      const encodedMessage = encodeURIComponent(message); 

      // Telegram 
      const CHAT_ID = '-1002326954626';
      const BOT_TOKEN = '7789690626:AAGEoRLZY2WpWhU22cjfN7fbj7fS_nFCsYM'; // Перенести на сервер
      const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodedMessage}&parse_mode=HTML`;

      // Отправка данных
      console.log('Отправляем сообщение:', message);
      console.log('Формируемый URL:', url);

      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Ошибка при отправке сообщения в Telegram');
          }
          return response.json();
        })
        .then(data => {
          console.log('Сообщение отправлено:', data);
          toast.success('Ваше замовлення успішно відправлене!');
          hideOrderModal();
          checkoutForm.reset();
          shoppingCart.cart = [];
          shoppingCart.saveCart();
          shoppingCart.updateCartDisplay();
        })
        .catch(error => {
          console.error('Ошибка при отправке сообщения:', error);
          toast.error('Відбулася помилка привідправленні замовлення. Спробуйте, будь ласка, ще раз!');
      });
    });
  }

  // Закрытие модальных окон
  window.onclick = function(event) {
    const cartModal = document.getElementById('modalWrapper');
    const orderModal = document.getElementById('orderModal');
    if (event.target === cartModal) {
      hideCartModal();
    } else if (event.target === orderModal) {
      hideOrderModal();
    }
  };
});

// Функции управления модальными окнами
function showCartModal() {
  const cartModal = document.getElementById('modalWrapper');
  if (cartModal) {
    cartModal.style.display = 'block';
  }
}

function hideCartModal() {
  const cartModal = document.getElementById('modalWrapper');
  if (cartModal) {
    cartModal.style.display = 'none';
  }
}

function showOrderModal() {
  const orderModal = document.getElementById('orderModal');
  if (orderModal) {
    orderModal.style.display = 'block';
  }
}

function hideOrderModal() {
  const orderModal = document.getElementById('orderModal');
  if (orderModal) {
    orderModal.style.display = 'none';
  }
}
