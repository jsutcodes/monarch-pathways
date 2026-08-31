from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Project(models.Model):
    name = models.CharField(max_length=150, unique=True)
    description = models.TextField(blank=True, null=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def __str__(self):
        return self.name

class TimeEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='time_entries')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='time_entries')
    date = models.DateField(default=timezone.now)
    hours = models.DecimalField(max_digits=4, decimal_places=2)
    description = models.TextField(help_text="What did you work on?")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Time Entries"
        ordering = ['-date']

    def __str__(self):
        return f"{self.user.username} - {self.project.name} - {self.hours} hrs"
