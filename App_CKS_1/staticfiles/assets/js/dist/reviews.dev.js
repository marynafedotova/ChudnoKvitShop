"use strict";

$(document).ready(function () {
  $('#sliderReviews').lightSlider({
    item: 1,
    auto: true,
    loop: true,
    vertical: true,
    verticalHeight: 200,
    speed: 400,
    slideMargin: 0
  });
}); // Hamburger Menu

document.getElementById('hamb-btn').addEventListener('click', toggleMobileMenu);
document.getElementById('hamb-btn-mobile').addEventListener('click', toggleMobileMenu);

function toggleMobileMenu() {
  document.body.classList.toggle('open-mobile-menu');
}