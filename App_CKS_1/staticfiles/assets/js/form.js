
const checkoutForm = document.getElementById('feedback_form');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const comment = document.getElementById('comment').value.trim();
        
        // Валидация формы
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
        }
  
        // Формируем сообщение
        const message = `<b>Ім'я:</b> ${name}\n<b>Телефон:</b> ${phone}\n<b>Електронна пошта:</b> ${email}\n<b>Коментар:</b> ${comment}`;
        const encodedMessage = encodeURIComponent(message);

        // Telegram 
        const CHAT_ID = '-1002326954626';
        const BOT_TOKEN = '7789690626:AAGEoRLZY2WpWhU22cjfN7fbj7fS_nFCsYM'; // Перенести на сервер
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodedMessage}&parse_mode=HTML`;

        // Отправка данных
        console.log('Відправляємо повідомлення:', message);
        console.log('Формований URL:', url);

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Помилка при відправці повідомлення в Telegram');
                }
                return response.json();
            })
            .then(data => {
                console.log('Повідомлення відправлено:', data);
                toast.success('Ваше повідомлення успішно відправлене!');
                checkoutForm.reset();
            })
            .catch(error => {
                console.error('Помилка при відправці повідомлення:', error);
                toast.error('Відбулася помилка при відправленні повідомлення. Спробуйте, будь ласка, ще раз!');
            });
    });
}
