from django.contrib import admin

from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('user_name', 'user_last_name', 'user_phone_number', 'email', 'comment')
    search_fields = ('user_name', 'user_last_name', 'user_phone_number', 'email')
    fieldsets = (
        ("Персональна інформація", {
            'fields': ('user_name', 'user_last_name', 'user_phone_number', 'email')
        }),
        ("Додатково", {
            'fields': ('comment',)
        }),
    )
    ordering = ('user_name', 'user_last_name')
