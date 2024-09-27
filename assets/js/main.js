// Hamburger Menu
document.getElementById('hamb-btn').addEventListener('click', toggleMobileMenu);
document.getElementById('hamb-btn-mobile').addEventListener('click', toggleMobileMenu);

function toggleMobileMenu() {
  document.body.classList.toggle('open-mobile-menu');
}

// Slider
document.addEventListener('DOMContentLoaded', function () {
  fetch('assets/data/data.json')
    .then(response => response.json())
    .then(data => {
      createSlider('sliderNewGoods', data);
    })
    .catch(error => console.error('Error fetching data:', error));
});

function createSlider(elementId, jsonData) {
  const sliderContainer = $("#" + elementId);
  const ulElement = $("<ul></ul>");

  const slides = jsonData.map(item => `
    <li>
      <div class="slide">
        <div class="slide-top">
          <img class="lazy" src="${item.photo}" alt="${item.tipe}">
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
         data-id="${item.id}" data-name="${item.tipe}" 
         data-price="${item.Price}" data-material="${item.material}" 
         data-color="${item.color}" data-size="${item.size}" 
         data-photo="${item.photo}" data-mark="${item.Mark}">Додати до кошика</button>

      </div>
    </li>
  `);

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
    verticalHeight:700,
    responsive: [
      {
        breakpoint: 1200,
        settings: { item: 2, slideMove: 1 }
      },
      {
        breakpoint: 900,
        settings: { item: 1, slideMove: 1 }
      }
    ]
  });
}

function addCartEventListeners(ulElement) {
  const addToCartButtons = ulElement.find('.add-to-cart');
  addToCartButtons.each(function () {
    $(this).on('click', function (event) {
      event.preventDefault();
      const item = {
        id: Number($(this).attr('data-id')),
        tipe: $(this).attr('data-name'),
        Price: Number($(this).attr('data-price')),
        quantity: 1,
        material: $(this).data('material'),
        color: $(this).data('color'),
        size: $(this).data('size'),
        photo: $(this).data('photo'),
        Mark: $(this).data('mark')
      };
      shoppingCart.addItemToCart(item);
      showCartModal();
      console.log("Add to cart button clicked!");
    });
  });
}







