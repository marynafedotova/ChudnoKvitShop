from django.shortcuts import get_object_or_404, render
from .models import Categories, Product

def catalog(request, category_slug):
    category = get_object_or_404(Categories, slug=category_slug)
    categories = Categories.objects.all()
    products = category.products.all()  


    contex = {
    'categories': categories,
    'category': category,
    'products': products

    }
    return render(request, 'goods/catalog.html', contex)



def catalog_index(request):
    categories = Categories.objects.prefetch_related("products").all()

    context = {
        'categories': categories
    }
    return render(request, 'goods/catalog_index.html', context)


def product(request, product_slug):
    product = get_object_or_404(Product, slug=product_slug)

    context = {
        'product': product
    }

    return render(request, 'goods/product.html', context)
 