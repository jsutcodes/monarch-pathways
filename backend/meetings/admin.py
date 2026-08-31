from django.contrib import admin
from .models import Meeting, MeetingNote, Milestone

admin.site.register(Meeting)
admin.site.register(MeetingNote)
admin.site.register(Milestone)
