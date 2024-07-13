from django.urls import path, include
from django.contrib.sitemaps.views import sitemap
from rest_framework.routers import DefaultRouter
from .sitemaps import BlogSitemap
from .views import BlogViewSet, CommentViewSet, BlogAdminViewSet, CommentAdminViewSet

router = DefaultRouter()
router.register("blogs", BlogViewSet)
router.register("comments", CommentViewSet)
router.register("admin/blogs", BlogAdminViewSet, basename="admin_blogs")
router.register("admin/comments", CommentAdminViewSet, basename="admin_comments")

sitemaps = {
    "blog": BlogSitemap
}

urlpatterns = [
    path("blog/", include(router.urls)),
    path("blog/sitemap.xml", sitemap, {"sitemaps": sitemaps}, name="django.contrib.sitemaps.views.sitemap")
]