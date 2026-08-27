from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Unified identity mapping table. Natively handles first_name, last_name,
    email, and secure pbkdf2/argon2 password hashes via Django core.
    """

    # TODO: Intern Task - Implement cryptographic encryption abstraction (e.g. django-fernet-fields) for sensitive data
    encrypted_contact_info = models.TextField(blank=True, null=True)

    @property
    def role(self):
        """
        Resolves access privileges strictly mapped by group membership names
        ('Admin', 'Lead_Mentor', 'Mentor', 'Student').
        """
        group = self.groups.first()
        return group.name if group else "No Role Assigned"

    def __str__(self):
        return f"{self.get_full_name()} ({self.role})"
