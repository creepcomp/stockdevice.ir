from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RequestViewSet, ReportViewSet
from .views import UserViewSet
from .views import ProductViewSet, CategoryViewSet, CommentViewSet, OrderViewSet
from .views import BlogViewSet
from .views import BannerViewSet

router = DefaultRouter()
router.register("requests", RequestViewSet)
router.register("report", ReportViewSet, basename="report")
# Account
router.register("users", UserViewSet)
# Store
router.register("products", ProductViewSet)
router.register("categories", CategoryViewSet)
router.register("comments", CommentViewSet)
router.register("orders", OrderViewSet)
# Blog
router.register("blogs", BlogViewSet)
# Home
router.register("banners", BannerViewSet)

urlpatterns = [
    path("admin/", include(router.urls))
]