# TODO: Intern Task - Implement DRF or Token-based login overrides if custom token behavior is desired.
# Note: Basic JWT handling is natively configured via simplejwt urls.

from rest_framework import permissions, viewsets

from .models import User
from .serializers import StaffSerializer


class IsAdminGroupOrSuperuser(permissions.BasePermission):
    """Restricts access to superusers or members of the 'Admin' group."""

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and (user.is_superuser or user.groups.filter(name="Admin").exists())
        )


class StaffViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only listing of staff/admin users and their group-based
    permissions, for the admin "Staff" page. Students are excluded since
    they're managed via the Students UI instead.
    """

    queryset = (
        User.objects.exclude(groups__name="Student")
        .prefetch_related("groups", "user_permissions")
        .order_by("last_name", "first_name")
    )
    serializer_class = StaffSerializer
    permission_classes = [IsAdminGroupOrSuperuser]
