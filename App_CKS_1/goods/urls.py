from django.urls import path

from goods import views

app_name = 'goods'

urlpatterns = [
    path('', views.catalog_index, name='catalog_index'),
    path('<slug:category_slug>/', views.catalog, name='catalog'),

]