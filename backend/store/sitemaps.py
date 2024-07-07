from django.contrib.sitemaps import Sitemap
from .models import Product


class ProductSitemap(Sitemap):
    def items(self):
        return Product.objects.filter(show=True)

    def lastmod(self, obj):
        return obj.modified_at
