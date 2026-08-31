from rest_framework import serializers
from .models import StudentProfile, MentorProfile


class StudentUserSummarySerializer(serializers.Serializer):
    """Read-only summary of the linked auth user, for display purposes."""

    id = serializers.IntegerField()
    username = serializers.CharField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField()


class StudentProfileSerializer(serializers.ModelSerializer):
    # `user` stays writable (by primary key) for creating/reassigning a
    # profile, while `user_detail` gives the frontend a read-only,
    # human-readable view of the linked account without an extra request.
    # TODO: Intern Task - Build fields mapper allowing write transitions while guarding internal system flags
    user_detail = StudentUserSummarySerializer(source="user", read_only=True)

    class Meta:
        model = StudentProfile
        fields = "__all__"
