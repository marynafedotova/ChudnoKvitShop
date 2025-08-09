from django.db import models
from goods.models import Product
from users.models import CustomUser


class Order(models.Model):
    id = models.AutoField(primary_key=True)
    order_number = models.CharField(
        max_length=20, unique=True, blank=True, verbose_name='Номер замовлення'
    )
    customer = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="orders",
        verbose_name="Клієнт"
    )
    product = models.ManyToManyField(
        Product,
        through="OrderItem",
        related_name="orders",
        verbose_name="Товар"
    )
    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        verbose_name="Загальна сума"
    )
    shipping_details = models.TextField(verbose_name="Дані по відправці та оплаті")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата створення")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата оновлення")
    ttn = models.CharField(
        max_length=50,
        unique=True,
        blank=True,
        null=True,
        verbose_name="ТТН"
    )

    class Meta:
        db_table = "order"
        verbose_name = "замовлення"
        verbose_name_plural = "Замовлення"
        ordering = ["-created_at"]

    def __str__(self):
        return self.order_number

    def save(self, *args, **kwargs):
        if not self.order_number:
            last_order = Order.objects.order_by('-id').first()
            if last_order and last_order.order_number.startswith('ORD-'):
                last_num = int(last_order.order_number.split('-')[1])
                self.order_number = f'ORD-{last_num + 1:04d}'
            else:
                self.order_number = 'ORD-0001'
        super().save(*args, **kwargs)

    def update_total_amount(self):
        total = sum(
            item.price * item.quantity for item in self.order_items.all()
        )
        self.total_amount = total
        self.save(update_fields=['total_amount'])


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="order_items"
    )
    product = models.ForeignKey(Product, verbose_name="Товар", on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1, verbose_name="Кількість")
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Ціна за одиницю"
    )

    class Meta:
        db_table = "order_item"
        verbose_name = "Позицію замовлення"
        verbose_name_plural = "Позиції замовлення"

    def __str__(self):
        return f"{self.product.name if self.product else '0.00'} (x{self.quantity})"

    def save(self, *args, **kwargs):
        if not self.price:
            self.price = self.product.final_price
        super().save(*args, **kwargs)
        self.order.update_total_amount()
