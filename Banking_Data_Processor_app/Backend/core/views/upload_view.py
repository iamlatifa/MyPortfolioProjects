from django.http import JsonResponse
import os
from django.conf import settings


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


from tasks.celery_tasks import process_batch

def upload_file(request):
    batch = create_batch_record()
    file_path = save_file(request.FILES['file'])

    process_batch.delay(batch.id, file_path)

    return JsonResponse({
        "batch_id": batch.id,
        "status": "PROCESSING"
    })
