# URL patterns specific to this app

from django.urls import path
from .views import upload_file

# URLs always point to a callable (function or class), never to a file(module)
urlpatterns = [
    path('upload/', upload_file, name='file'),
]