from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RequestViewSet, ReportViewSet

router = DefaultRouter()
router.register("requests", RequestViewSet)
router.register("report", ReportViewSet, basename="report")

urlpatterns = [
    path("admin/", include(router.urls))
]