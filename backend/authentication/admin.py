from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# TODO: Intern Task - Register the custom User model to display gracefully within the standard Django Admin interface
admin.site.register(User, UserAdmin)
