from django.urls import path, include
from django.contrib.sitemaps.views import sitemap
from rest_framework.routers import DefaultRouter
from .sitemaps import ProductSitemap, CategorySitemap
from .views import ProductViewSet, CategoryViewSet, CommentViewSet, OrderViewSet, ItemViewSet
from .views import ProductAdminViewSet, CategoryAdminViewSet, CommentAdminViewSet, OrderAdminViewSet

router = DefaultRouter()
router.register("products", ProductViewSet)
router.register("categories", CategoryViewSet)
router.register("comments", CommentViewSet)
router.register("orders", OrderViewSet)
router.register("items", ItemViewSet)
router.register("admin/products", ProductAdminViewSet, basename="admin_products")
router.register("admin/categories", CategoryAdminViewSet, basename="admin_categories")
router.register("admin/comments", CommentAdminViewSet, basename="admin_comments")
router.register("admin/orders", OrderAdminViewSet, basename="admin_orders")

sitemaps = {
    "product": ProductSitemap,
    "category": CategorySitemap
}

urlpatterns = [
    # API
    path("store/", include(router.urls)),
    # Sitemap
    path("store/sitemap.xml", sitemap, {"sitemaps": sitemaps}, name="django.contrib.sitemaps.views.sitemap")
]