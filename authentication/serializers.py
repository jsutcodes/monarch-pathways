from django.contrib.auth.models import Group
from rest_framework import serializers

from .models import User


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ("id", "name")


class StaffSerializer(serializers.ModelSerializer):
    """
    Read-only view of a staff/admin user, exposing their assigned group(s)
    and the resulting effective permissions, for the admin "Staff" UI.
    """

    role = serializers.CharField(read_only=True)
    groups = GroupSerializer(many=True, read_only=True)
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "is_active",
            "is_superuser",
            "role",
            "groups",
            "permissions",
        )

    def get_permissions(self, obj):
        # Superusers implicitly have every permission; group/user permissions
        # otherwise come from `get_all_permissions()`.
        return sorted(obj.get_all_permissions())
