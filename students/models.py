from django.db import models
from django.conf import settings


class MentorProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="mentor_profile",
    )
    department = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"Mentor: {self.user.get_full_name()}"


class StudentProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="student_profile",
    )
    dob = models.DateField(verbose_name="Date of Birth")
    country_of_origin = models.CharField(max_length=100)

    # Secure field layers for profile tracking
    # TODO: Intern Task - Integrate programmatic encryption-at-rest field decoders
    encrypted_phone = models.TextField()
    encrypted_address = models.TextField()

    hs_status = models.CharField(
        max_length=50, help_text="e.g., Freshman, Senior, Graduated"
    )
    college_status = models.CharField(
        max_length=50, help_text="e.g., Prospective, Applied, Enrolled"
    )
    graduation_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"Student: {self.user.get_full_name()}"


class MentorStudentAssignment(models.Model):
    mentor = models.ForeignKey(
        MentorProfile, on_delete=models.CASCADE, related_name="assignments"
    )
    student = models.ForeignKey(
        StudentProfile, on_delete=models.CASCADE, related_name="assigned_mentors"
    )
    assigned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("mentor", "student")

    def __str__(self):
        return f"{self.mentor} -> {self.student}"
