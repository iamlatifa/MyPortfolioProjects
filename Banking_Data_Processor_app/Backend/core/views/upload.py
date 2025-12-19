from django.http import JsonResponse

def upload_file(request) :
    file = request.getFile('upload')
    if not file:
        return JsonResponse({ "message": 'No file uploaded' }, status=400)
    
