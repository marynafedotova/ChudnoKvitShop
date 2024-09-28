from django.shortcuts import render
from django.http import HttpResponse

from typing import Any

def index(request) -> Any:
    return render(request, 'main/index.html')

def about(request) -> HttpResponse:
    return HttpResponse('About')

