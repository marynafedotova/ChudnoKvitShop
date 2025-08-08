from django.shortcuts import render

def catalog(requests):
    return render(requests, 'goods/catalog.html')
