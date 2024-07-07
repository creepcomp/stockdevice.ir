from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, AuthViewSet

router = DefaultRouter()
router.register("", AuthViewSet, "/")
router.register("users", UserViewSet)

urlpatterns = [
    path("account/", include(router.urls))
]
