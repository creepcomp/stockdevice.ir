from .models import Request

class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        Request.objects.create(
            http_x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR", "127.0.0.1"),
            http_user_agent = request.META.get("HTTP_USER_AGENT"),
            method = request.method,
            path = request.path,
            status_code = response.status_code
        )
        return response