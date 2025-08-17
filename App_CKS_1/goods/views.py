from django.shortcuts import get_object_or_404, render
from .models import Categories

def catalog(request, category_slug):
    category = get_object_or_404(Categories, slug=category_slug)
    categories = Categories.objects.all()

    contex = {
    'categories': categories,
    'category': category,
    }
    return render(request, 'goods/catalog.html', contex)



def catalog_index(request):
    return render(request, 'goods/catalog_index.html')
