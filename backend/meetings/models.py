from django.db import models
from django.conf import settings
from students.models import StudentProfile, MentorProfile


class Meeting(models.Model):
    STATUS_CHOICES = [
        ("SCHEDULED", "Scheduled"),
        ("COMPLETED", "Completed"),
        ("NO_SHOW", "No-Show"),
    ]

    mentor = models.ForeignKey(
        MentorProfile, on_delete=models.CASCADE, related_name="meetings"
    )
    student = models.ForeignKey(
        StudentProfile, on_delete=models.CASCADE, related_name="meetings"
    )
    scheduled_time = models.DateTimeField()
    duration_minutes = models.IntegerField(default=30)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="SCHEDULED"
    )

    def __str__(self):
        return f"Meeting on {self.scheduled_time.date()}"


class MeetingNote(models.Model):
    VISIBILITY_CHOICES = [
        ("PRIVATE", "Private to Mentor"),
        ("SHARED", "Shared with Student"),
    ]

    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name="notes")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField(help_text="Rich text or markdown context logs")
    visibility = models.CharField(
        max_length=15, choices=VISIBILITY_CHOICES, default="PRIVATE"
    )
    created_at = models.DateTimeField(auto_now_add=True)


class Milestone(models.Model):
    STATUS_CHOICES = [
        ("NOT_STARTED", "Not Started"),
        ("IN_PROGRESS", "In Progress"),
        ("COMPLETED", "Completed"),
    ]

    student = models.ForeignKey(
        StudentProfile, on_delete=models.CASCADE, related_name="milestones"
    )
    title = models.CharField(max_length=255)
    due_date = models.DateField()
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="NOT_STARTED"
    )
