from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import os
from django.conf import settings

@csrf_exempt
def upload_file(request) :
    if request.method != 'POST' :
        return JsonResponse({ "message": 'Invalid request method' }, status=405)
    
    file = request.FILES.get('file')
    if not file:
        return JsonResponse({ "message": 'No file uploaded' }, status=400)
    
    file_path = os.path.join(settings.MEDIA_ROOT, file.name)
    
    with open(file_path, 'wb+') as destination:
        for chunk in file.chunks():
            destination.write(chunk)

    return JsonResponse({ "message": 'File uploaded successfully', 
                          "file_name": file.name }, 
                        status=201)