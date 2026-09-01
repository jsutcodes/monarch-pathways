"""
Idempotently creates a small set of demo/dev accounts covering each role, so
new environments (local dev via run.sh, or a fresh Docker deploy) can be
explored immediately without manually creating users in /admin/.

Accounts created (username/password):
    taylor / taylor   -- Staff group member, also granted superuser/admin
                         credentials (is_superuser + is_staff).
    staff  / staff    -- Staff group member, no admin privileges.
    student/ student  -- Student group member, with a linked StudentProfile
                         so the Student dashboard has something to show.

Safe to run repeatedly: existing accounts are left untouched (password is
only set at creation time), matching the default-admin behavior in
entrypoint.sh/run.sh.
"""

import datetime

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.core.management.base import BaseCommand

from students.models import StudentProfile

User = get_user_model()


class Command(BaseCommand):
    help = "Creates demo accounts (taylor/taylor, staff/staff, student/student) for each role."

    def handle(self, *args, **options):
        self._create_staff_admin(
            username="taylor",
            password="taylor",
            first_name="Taylor",
        )
        self._create_staff(
            username="staff",
            password="staff",
            first_name="Staff",
        )
        self._create_student(
            username="student",
            password="student",
            first_name="Student",
        )

    def _get_or_create_user(self, username, password, first_name, is_staff=False, is_superuser=False):
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                "first_name": first_name,
                "email": f"{username}@example.com",
                "is_staff": is_staff,
                "is_superuser": is_superuser,
            },
        )
        if created:
            user.set_password(password)
            user.save()
            self.stdout.write(self.style.SUCCESS(f"Created user -> username: {username} / password: {password}"))
        else:
            self.stdout.write(f"User '{username}' already exists, skipping creation.")
        return user, created

    def _create_staff_admin(self, username, password, first_name):
        # "Staff member with admin creds": role/group is Staff, but the
        # account itself is a Django superuser (full admin access).
        user, _ = self._get_or_create_user(
            username, password, first_name, is_staff=True, is_superuser=True
        )
        staff_group, _ = Group.objects.get_or_create(name="Staff")
        user.groups.add(staff_group)

    def _create_staff(self, username, password, first_name):
        user, _ = self._get_or_create_user(username, password, first_name)
        staff_group, _ = Group.objects.get_or_create(name="Staff")
        user.groups.add(staff_group)

    def _create_student(self, username, password, first_name):
        user, created = self._get_or_create_user(username, password, first_name)
        student_group, _ = Group.objects.get_or_create(name="Student")
        user.groups.add(student_group)

        if not hasattr(user, "student_profile"):
            StudentProfile.objects.create(
                user=user,
                dob=datetime.date(2007, 1, 1),
                country_of_origin="United States",
                encrypted_phone="555-0100",
                encrypted_address="123 Example St",
                hs_status="Senior",
                college_status="Prospective",
            )
            self.stdout.write(self.style.SUCCESS(f"Created StudentProfile for '{username}'."))
