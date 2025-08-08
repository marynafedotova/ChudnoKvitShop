from django.contrib import admin
from django.utils.html import format_html

from .models import Product, Categories, ProductImage


@admin.register(Categories)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)  
    search_fields = ("name",)  
    prepopulated_fields = {"slug": ("name",)}  


class ProductImageInline(admin.TabularInline):  
    model = ProductImage
    extra = 1
    readonly_fields = ('preview',)  
    fields = ('photo', 'preview')  
    verbose_name = "Зображення"
    verbose_name_plural = "Зображення"

    def preview(self, obj):
        if obj.photo:
            return format_html('<img src="{}" style="max-height: 100px; max-width: 100px;" />', obj.photo.url)
        return "Немає зображення"
    preview.short_description = "Зображення"  

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("article", "name", "category", "material", "size", "price", "availability", "thumbnail")  
    list_filter = ("availability", "category", "material", "size")
    search_fields = ("name", "article", "category__name") 
    autocomplete_fields = ("category",) 
    prepopulated_fields = {"slug": ("name",)}  
    inlines = [ProductImageInline]  
    ordering = ("-id",) 
    readonly_fields = ("article",) 

    def thumbnail(self, obj):
        if obj.images.exists():
            image = obj.images.first()
            if image and image.photo:
                return format_html('<img src="{}" style="width: 70px; height: auto;">', image.photo.url)
        return "Немає зображення"
    thumbnail.short_description = "Зображення"