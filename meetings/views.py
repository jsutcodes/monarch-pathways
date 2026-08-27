from rest_framework import viewsets, permissions
from .models import Meeting

# TODO: Intern Task - Build Custom DRF Permission class checking Mentor Assignment relations
class IsAssignedMentor(permissions.BasePermission):
    """
    Object-level authorization checker enforcing row-level security for mentors.
    """
    def has_object_permission(self, request, view, obj):
        # TODO: Intern Task - Check if request.user is linked via MentorStudentAssignment mapping for this student
        return True
