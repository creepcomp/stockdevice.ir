from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BannerViewSet

router = DefaultRouter()
router.register("banners", BannerViewSet)

urlpatterns = [
    path("home/", include(router.urls)),
]
