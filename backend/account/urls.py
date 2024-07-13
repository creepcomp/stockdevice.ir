from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AccountViewSet, UserAdminViewSet

router = DefaultRouter()
router.register("", AccountViewSet, "/")
router.register("admin/users", UserAdminViewSet)

urlpatterns = [
    path("account/", include(router.urls))
]