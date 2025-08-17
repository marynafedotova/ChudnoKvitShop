"use strict";

var checkoutForm = document.getElementById('feedback_form');

if (checkoutForm) {
  checkoutForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var name = document.getElementById('name').value.trim();
    var phone = document.getElementById('phone').value.trim();
    var email = document.getElementById('email').value.trim();
    var comment = document.getElementById('comment').value.trim(); // Валидация формы

    if (!name || !phone || !email || !comment) {
      toast.warning('Будь ласка, заповніть всі поля форми!');
      return;
    }

    if (name === '') {
      toast.error('Будь ласка, введіть ім\'я');
      nameFld.classList.add('is-invalid');
    } else if (name.length < 2) {
      toast.error('Ваше ім\'я занадто коротке');
      nameFld.classList.add('is-invalid');
    }

    if (phone === '') {
      toast.error('Будь ласка, введіть номер телефону');
      phoneFld.classList.add('is-invalid');
    } // Формируем сообщение


    var message = "<b>\u0406\u043C'\u044F:</b> ".concat(name, "\n<b>\u0422\u0435\u043B\u0435\u0444\u043E\u043D:</b> ").concat(phone, "\n<b>\u0415\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u043D\u0430 \u043F\u043E\u0448\u0442\u0430:</b> ").concat(email, "\n<b>\u041A\u043E\u043C\u0435\u043D\u0442\u0430\u0440:</b> ").concat(comment);
    var encodedMessage = encodeURIComponent(message); // Telegram 

    var CHAT_ID = '-1002326954626';
    var BOT_TOKEN = '7789690626:AAGEoRLZY2WpWhU22cjfN7fbj7fS_nFCsYM'; // Перенести на сервер

    var url = "https://api.telegram.org/bot".concat(BOT_TOKEN, "/sendMessage?chat_id=").concat(CHAT_ID, "&text=").concat(encodedMessage, "&parse_mode=HTML"); // Отправка данных

    console.log('Відправляємо повідомлення:', message);
    console.log('Формований URL:', url);
    fetch(url).then(function (response) {
      if (!response.ok) {
        throw new Error('Помилка при відправці повідомлення в Telegram');
      }

      return response.json();
    }).then(function (data) {
      console.log('Повідомлення відправлено:', data);
      toast.success('Ваше повідомлення успішно відправлене!');
      checkoutForm.reset();
    })["catch"](function (error) {
      console.error('Помилка при відправці повідомлення:', error);
      toast.error('Відбулася помилка при відправленні повідомлення. Спробуйте, будь ласка, ще раз!');
    });
  });
}