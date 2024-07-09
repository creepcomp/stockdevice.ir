from rest_framework.permissions import IsAdminUser, SAFE_METHODS, BasePermission

class IsAdminUserOrReadOnly(IsAdminUser):
    def has_permission(self, request, view):
        is_admin = super().has_permission(request, view)
        return request.method in SAFE_METHODS or is_admin

class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user