from django.urls import path, include
from django.contrib.sitemaps.views import sitemap
from rest_framework.routers import DefaultRouter
from .views import BlogViewSet, CommentViewSet
from .sitemaps import BlogSitemap

router = DefaultRouter()
router.register("blogs", BlogViewSet)
router.register("comments", CommentViewSet)

sitemaps = {
    "blog": BlogSitemap
}

urlpatterns = [
    path("blog/", include(router.urls)),
    path("blog/sitemap.xml", sitemap, {"sitemaps": sitemaps}, name="django.contrib.sitemaps.views.sitemap")
]
