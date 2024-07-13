from django.contrib.sitemaps import Sitemap
from .models import Product, Category

class ProductSitemap(Sitemap):
    def items(self):
        return Product.objects.filter(show=True)

class CategorySitemap(Sitemap):
    def items(self):
        return Category.objects.filter(show=True)