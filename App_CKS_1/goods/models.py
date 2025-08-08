from django.db import models
from django.utils.text import slugify

import os


class Categories(models.Model):
    name = models.CharField(max_length=150, unique=True, verbose_name='Назва')
    slug = models.SlugField(max_length=200, unique=True, blank=True, verbose_name='URL')

    class Meta:
        db_table = 'category'
        verbose_name = 'Категорію'
        verbose_name_plural = 'Категорії'

    def __str__(self) -> str:
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=150, unique=True, verbose_name='Назва')
    slug = models.SlugField(max_length=200, unique=True, blank=True, verbose_name='URL')
    article = models.CharField(max_length=10, unique=True, db_index=True, verbose_name='Артикул', blank=True)
    category = models.ForeignKey(Categories, on_delete=models.SET_NULL, null=True, verbose_name='Категорія')
    availability = models.CharField(
        max_length=50,
        choices=[
            ('in_stock', 'В наявності'),
            ('sold', 'Продано'),
        ],
        default='in_stock',
        db_index=True,
        verbose_name='Статус'
    )
    size = models.DecimalField(max_digits=10, blank=True, null=True, decimal_places=2, verbose_name='Розмір')
    description = models.CharField(max_length=300, null=True, blank=True, verbose_name="Опис")
    material = models.CharField(max_length=300, null=True, blank=True, verbose_name="Матеріал")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Ціна')
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name='Акційна ціна')


    class Meta:
        db_table = 'product'
        verbose_name = 'Товар'
        verbose_name_plural = 'Товари'

    @property
    def final_price(self):
        """Повертає акційну ціну, якщо вона задана і менша за звичайну"""
        if self.discount_price and self.discount_price < self.price:
            return self.discount_price
        return self.price

    def has_discount(self):
        """Чи є знижка"""
        return self.discount_price is not None and self.discount_price < self.price

    def discount_percent(self):
        """Відсоток знижки"""
        if self.has_discount():
            return round((self.price - self.discount_price) / self.price * 100)
        return 0

    def __str__(self):
        return self.name



    def save(self, *args, **kwargs):
        # Генерація article
        if not self.article:
            last_product = Product.objects.order_by('-id').first()
            if last_product and last_product.article.isdigit():
                next_number = int(last_product.article) + 1
            else:
                next_number = 1
            self.article = f"{next_number:04d}"

        # Генерація унікального slug
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Product.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug

        super().save(*args, **kwargs)


    def __str__(self):
        return f"{self.article} - {self.name}"
    


def product_image_upload_path(instance, filename):
    """
    Формує шлях для збереження зображень товарів:
    product/{article}/{filename}
    """
    if instance.product and instance.product.article:
        return os.path.join("product", instance.product.article, filename)
    return os.path.join("product", "unknown", filename)


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name='images'
    )
    photo = models.ImageField(upload_to=product_image_upload_path)

    def __str__(self):
        if self.product:
            return f"Зображення для {self.product.name}"
        return "Зображення без прив'язки до товару"
