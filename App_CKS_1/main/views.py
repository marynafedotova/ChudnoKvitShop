from django.shortcuts import render
from django.http import HttpResponse

from typing import Any

def index(request) -> Any:
    return render(request, 'main/index.html')

def shipping(request) -> HttpResponse:
    return render(request, 'main/shipping.html')

def contacts(request) -> HttpResponse:
    return render(request, 'main/contacts.html')

def promotions(request) -> HttpResponse:
    return render(request, 'main/promotions.html')

def reviews(request) -> HttpResponse:
    return render(request, 'main/reviews.html')

def shipping(request) -> HttpResponse:
    return render(request, 'main/shipping.html')
