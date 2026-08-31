from django.contrib import admin
from .models import MentorProfile, StudentProfile, MentorStudentAssignment

admin.site.register(MentorProfile)
admin.site.register(StudentProfile)
admin.site.register(MentorStudentAssignment)
