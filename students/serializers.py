from rest_framework import serializers
from .models import StudentProfile, MentorProfile

class StudentProfileSerializer(serializers.ModelSerializer):
    # TODO: Intern Task - Build fields mapper allowing write transitions while guarding internal system flags
    class Meta:
        model = StudentProfile
        fields = '__all__'
