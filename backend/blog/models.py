from django.db import models
from django.utils.html import strip_tags
from account.models import User
from markdown import markdown

class Blog(models.Model):
    title = models.CharField(max_length=64, unique=True)
    body = models.TextField()
    image = models.CharField(max_length=64, null=True)
    author = models.ForeignKey(User, models.CASCADE)
    keywords = models.CharField(max_length=256, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    show = models.BooleanField(default=False)
    slug = models.SlugField(allow_unicode=True)

    @property
    def description(self):
        html = markdown(self.body)
        return strip_tags(html)[:64]

    def get_absolute_url(self):
        return "/blog/%d/%s" % (self.id, self.slug)

    class Meta:
        ordering = ["id"]

class Comment(models.Model):
    user = models.ForeignKey(User, models.CASCADE, related_name="blog_comment_user")
    blog = models.ForeignKey(Blog, models.CASCADE)
    content = models.CharField(max_length=256)
    reply = models.CharField(max_length=256, null=True)
    score = models.PositiveSmallIntegerField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
