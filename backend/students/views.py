from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import StudentProfile
from .serializers import StudentProfileSerializer


class StudentViewSet(viewsets.ModelViewSet):
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer
    # TODO: Intern Task - Bind custom permission middleware checks ensuring students can exclusively query their own records

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[permissions.IsAuthenticated],
    )
    def me(self, request):
        """
        Returns the logged-in user's own StudentProfile, for the Student
        role's Dashboard view. 404s for staff/admin accounts that don't
        have a linked StudentProfile.
        """
        profile = StudentProfile.objects.filter(user=request.user).first()
        if profile is None:
            return Response(
                {"detail": "No student profile linked to this account."},
                status=404,
            )
        serializer = self.get_serializer(profile)
        return Response(serializer.data)
