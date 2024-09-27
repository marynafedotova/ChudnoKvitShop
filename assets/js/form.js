// form
document.addEventListener('DOMContentLoaded', function () {
  const formControl = document.querySelectorAll('.form-control');
  const feedbackForm = document.getElementById('feedback_form');
  const nameFld = document.getElementById('exampleInputName');
  const emailFld = document.getElementById('exampleInputEmail1');

  formControl.forEach(input => {
    input.addEventListener('focus', function () {
      if (this.classList.contains('is-invalid')) {
        this.classList.remove('is-invalid');
      }
    });
  });

  feedbackForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const errors = [];
    const name = nameFld.value.trim();
    const email = emailFld.value.trim();

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

    const CHAT_ID = '-1002326954626';
    const BOT_TOKEN = '7789690626:AAGEoRLZY2WpWhU22cjfN7fbj7fS_nFCsYM'; // Перенеси на сервер
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodedMessage}&parse_mode=HTML`;

    console.log(url);

    fetch(url, {
      method: 'POST'
    })
      .then(response => response.json())
      .then(resp => {
        if (resp.ok) {
          nameFld.value = '';
          emailFld.value = '';
          toast.success('Ваше повідомлення успішно відправлене.');
        } else {
          toast.error('Виникла помилка, спробуйте пізніше.');
        }
      })
      .catch(err => {
        console.error(err);
        toast.error('Щось пішло не так.');
      });
  });

  function isValidEmail(email) {
    const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }
});

// Пример использования
// toast.success('Ваше замовлення успішно выдправлене!');
// toast.error('Відбулася помилка привідправленні замовлення. Спробуйте, будь ласка, ще раз!');
// toast.warning('Это предупреждение!');
// toast.info('Это информационное сообщение.');
