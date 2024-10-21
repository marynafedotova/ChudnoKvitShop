from django.shortcuts import render
from django.http import HttpResponse

from typing import Any

def index(request) -> Any:
    return render(request, 'main/index.html')

def shipping(request) -> HttpResponse:
    return render(request, 'main/shipping.html')
