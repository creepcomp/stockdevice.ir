from django.conf import settings
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf.urls.static import static

urlpatterns = [
    # Admin
    path("api/", include("admin.urls")),
    # Account
    path("api/", include("account.urls")),
    # Store
    path("api/", include("store.urls")),
    # Blog
    path("api/", include("blog.urls")),
    # Home
    path("api/", include("home.urls")),
    # Robots.txt
    path(
        "robots.txt",
        TemplateView.as_view(template_name="robots.txt", content_type="text/plain"),
        name="robots_file",
    ),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
