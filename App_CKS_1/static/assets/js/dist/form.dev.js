"use strict";

// form
document.addEventListener('DOMContentLoaded', function () {
  var formControl = document.querySelectorAll('.form-control');
  var feedbackForm = document.getElementById('feedback_form');
  var nameFld = document.getElementById('exampleInputName');
  var emailFld = document.getElementById('exampleInputEmail1');
  formControl.forEach(function (input) {
    input.addEventListener('focus', function () {
      if (this.classList.contains('is-invalid')) {
        this.classList.remove('is-invalid');
      }
    });
  });
  feedbackForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var errors = [];
    var name = nameFld.value.trim();
    var email = emailFld.value.trim();

    if (name === '') {
      errors.push('Enter your name, please');
      nameFld.classList.add('is-invalid');
    } else if (name.length < 2) {
      errors.push('Your name is too short');
      nameFld.classList.add('is-invalid');
    }

    if (email === '') {
      errors.push('Enter your email, please');
      emailFld.classList.add('is-invalid');
    } else if (!isValidEmail(email)) {
      errors.push('Incorrect email format, please');
      emailFld.classList.add('is-invalid');
    }

    if (errors.length) {
      toast.error(errors.join('. '));
      return;
    }

    var CHAT_ID = '-1002326954626';
    var BOT_TOKEN = '7789690626:AAGEoRLZY2WpWhU22cjfN7fbj7fS_nFCsYM'; // Перенеси на сервер

    var url = "https://api.telegram.org/bot".concat(BOT_TOKEN, "/sendMessage?chat_id=").concat(CHAT_ID, "&text=").concat(encodedMessage, "&parse_mode=HTML");
    console.log(url);
    fetch(url, {
      method: 'POST'
    }).then(function (response) {
      return response.json();
    }).then(function (resp) {
      if (resp.ok) {
        nameFld.value = '';
        emailFld.value = '';
        toast.success('Ваше повідомлення успішно відправлене.');
      } else {
        toast.error('Виникла помилка, спробуйте пізніше.');
      }
    })["catch"](function (err) {
      console.error(err);
      toast.error('Щось пішло не так.');
    });
  });

  function isValidEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }
}); // Пример использования
// toast.success('Ваше замовлення успішно выдправлене!');
// toast.error('Відбулася помилка привідправленні замовлення. Спробуйте, будь ласка, ще раз!');
// toast.warning('Это предупреждение!');
// toast.info('Это информационное сообщение.');