from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BannerViewSet, BannerAdminViewSet

router = DefaultRouter()
router.register("banners", BannerViewSet)
router.register("admin/banners", BannerAdminViewSet, basename="admin_banners")

urlpatterns = [
    path("home/", include(router.urls)),
]