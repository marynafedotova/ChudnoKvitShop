from django.urls import path

from main import views

app_name = 'main'

urlpatterns = [
    path('', views.index, name='index'),
    path('contacts/', views.contacts, name='contacts'),
    path('sales/', views.promotions, name='sales'),
    path('reviews/', views.reviews, name='reviews'),
    path('shipping/', views.shipping, name='shipping'),



]