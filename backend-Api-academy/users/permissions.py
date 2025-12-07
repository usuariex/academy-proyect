from rest_framework.permissions import BasePermission


class IsAdminGroup(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.groups.filter(name="Admin").exists()


class IsTeacherGroup(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.groups.filter(name="Teacher").exists()


class IsStudentGroup(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.groups.filter(name="Student").exists()


class HasModelPerm(BasePermission):
    """
    Valida un permiso específico de modelo. Úsalo con view.extra_perm = "app_label.codename"
    """

    def has_permission(self, request, view):
        perm = getattr(view, "extra_perm", None)
        return request.user.is_authenticated and (not perm or request.user.has_perm(perm))
