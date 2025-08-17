from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1
    readonly_fields = ('price',)
    fields = ('product', 'quantity', 'price')  
    autocomplete_fields = ('product',)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    readonly_fields = ('order_number', 'total_amount', 'created_at', 'updated_at')
    list_display = ('order_number', 'customer', 'total_amount', 'status', 'created_at', 'updated_at', 'ttn')
    search_fields = ('order_number', 'customer__username', 'ttn')
    list_filter = ('created_at', 'status')
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('Основна інформація', {
            'fields': ('customer', 'shipping_details', 'ttn', 'total_amount', 'status'),
        }),
        ('Інформація про замовлення', {
            'classes': ('collapse',),
            'fields': ('created_at', 'updated_at', 'order_number'),
        }),
    )


