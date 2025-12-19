# URL patterns specific to this app

from django.urls import path
from . import views

urlpattern = [
    path('upload/', views.upload_file, name='upload_file'),
]