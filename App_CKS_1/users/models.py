from django.db import models
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
import re


def validate_ukrainian_phone_number(value):
    # Регулярний вираз для українського номера телефону
    pattern = r'^\+380\d{9}$'  # исправил `n` на `pattern`
    
    if not re.match(pattern, value):  # убрал лишний отступ
        raise ValidationError("Номер телефону має відповідати формату +380XXXXXXXXX (20 символів).")



class CustomUser(models.Model):
    user_name = models.CharField(max_length=150, verbose_name="Ім'я")
    user_last_name  = models.CharField(max_length=150, verbose_name="Прізвище")
    user_phone_number = models.CharField(
        max_length=13,  # Довжина: +380XXXXXXXXX
        validators=[validate_ukrainian_phone_number],
        null=True,
        blank=True,
        verbose_name="Номер телефону"
    )
    
    email = models.EmailField(
        max_length=255,  
        unique=True,  
        null=True,
        blank=True,
        verbose_name="Email"
    )
    
    comment = models.CharField(max_length=300, null=True, blank=True, verbose_name="Коментар")


    class Meta:
        db_table = 'user'
        verbose_name = 'Клієнта'
        verbose_name_plural = 'Клієнти'




    def __str__(self) -> str:
        return f'{self.user_name} {self.user_last_name} {self.user_phone_number}'