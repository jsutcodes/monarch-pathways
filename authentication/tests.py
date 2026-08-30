"""
TDD test suite for the `authentication` app.

These tests are written ahead of (or alongside) the outstanding
"Intern Task" TODOs in this app (URL wiring, admin registration,
signal-based audit logging, and the encrypted contact info field).
Several tests are expected to FAIL until those TODOs are implemented -
that failure is the point: it defines the contract the implementation
must satisfy.

Run with:
    python manage.py test authentication
"""

from django.contrib.auth.models import Group
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase

from authentication.models import User

# Endpoint paths as documented by the TODO in core/urls.py:
#   path("api/v1/auth/", include("authentication.urls"))
AUTH_PREFIX = "api/v1/auth/"
LOGIN_URL = f"/{AUTH_PREFIX}token/login/"
REFRESH_URL = f"/{AUTH_PREFIX}token/refresh/"


class UserModelTests(TestCase):
    """Unit tests for the custom User model."""

    def setUp(self):
        self.user = User.objects.create_user(
            username="jdoe", password="s3cur3-pass!"
        )

    def test_user_created_with_hashed_password(self):
        # Django core should transparently hash the password (pbkdf2/argon2).
        self.assertNotEqual(self.user.password, "s3cur3-pass!")
        self.assertTrue(self.user.check_password("s3cur3-pass!"))

    def test_role_defaults_to_no_role_assigned(self):
        self.assertEqual(self.user.role, "No Role Assigned")

    def test_role_reflects_first_group_membership(self):
        group = Group.objects.create(name="Mentor")
        self.user.groups.add(group)
        self.assertEqual(self.user.role, "Mentor")

    def test_role_updates_when_group_membership_changes(self):
        mentor = Group.objects.create(name="Mentor")
        admin = Group.objects.create(name="Admin")
        self.user.groups.add(mentor)
        self.assertEqual(self.user.role, "Mentor")

        self.user.groups.remove(mentor)
        self.user.groups.add(admin)
        self.assertEqual(self.user.role, "Admin")

    def test_str_representation_includes_full_name_and_role(self):
        self.user.first_name = "Jane"
        self.user.last_name = "Doe"
        self.user.save()
        self.assertEqual(str(self.user), "Jane Doe (No Role Assigned)")

    def test_encrypted_contact_info_field_is_optional(self):
        self.assertIsNone(self.user.encrypted_contact_info or None)

    def test_encrypted_contact_info_can_store_a_value(self):
        self.user.encrypted_contact_info = "555-0100"
        self.user.save()
        self.user.refresh_from_db()
        self.assertEqual(self.user.encrypted_contact_info, "555-0100")


class JWTAuthenticationTests(APITestCase):
    """
    Integration tests for JWT login/refresh, exercised through the
    project's root URLConf. These will fail with a 404 until
    `authentication.urls` is wired into `core/urls.py` per the TODO.
    """

    def setUp(self):
        self.username = "jdoe"
        self.password = "s3cur3-pass!"
        self.user = User.objects.create_user(
            username=self.username, password=self.password
        )

    def test_login_with_valid_credentials_returns_tokens(self):
        response = self.client.post(
            LOGIN_URL,
            {"username": self.username, "password": self.password},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_login_with_invalid_password_is_rejected(self):
        response = self.client.post(
            LOGIN_URL,
            {"username": self.username, "password": "wrong-password"},
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertNotIn("access", response.data)

    def test_login_with_unknown_username_is_rejected(self):
        response = self.client.post(
            LOGIN_URL,
            {"username": "ghost", "password": "irrelevant"},
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_refresh_with_valid_token_returns_new_access_token(self):
        login_response = self.client.post(
            LOGIN_URL,
            {"username": self.username, "password": self.password},
        )
        refresh_token = login_response.data["refresh"]

        response = self.client.post(REFRESH_URL, {"refresh": refresh_token})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

    def test_refresh_with_invalid_token_is_rejected(self):
        response = self.client.post(REFRESH_URL, {"refresh": "not-a-real-token"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class AuthAuditSignalTests(TestCase):
    """
    Tests for the login success/failure audit logging signals in
    `authentication/signals.py`.
    """

    def setUp(self):
        self.username = "jdoe"
        self.password = "s3cur3-pass!"
        self.user = User.objects.create_user(
            username=self.username, password=self.password
        )

    def test_successful_login_is_logged(self):
        with self.assertLogs("authentication", level="INFO") as captured:
            logged_in = self.client.login(
                username=self.username, password=self.password
            )
        self.assertTrue(logged_in)
        self.assertTrue(
            any("LOGIN_SUCCESS" in message for message in captured.output)
        )
        self.assertTrue(
            any(self.username in message for message in captured.output)
        )

    def test_failed_login_is_logged_without_leaking_password(self):
        with self.assertLogs("authentication", level="WARNING") as captured:
            logged_in = self.client.login(
                username=self.username, password="wrong-password"
            )
        self.assertFalse(logged_in)
        self.assertTrue(
            any("LOGIN_FAILED" in message for message in captured.output)
        )
        self.assertTrue(
            any(self.username in message for message in captured.output)
        )
        self.assertFalse(
            any("wrong-password" in message for message in captured.output)
        )


class AdminRegistrationTests(TestCase):
    """Ensures the custom User model is manageable from Django admin."""

    def test_user_model_is_registered_with_admin_site(self):
        from django.contrib import admin

        self.assertIn(User, admin.site._registry)

    def test_admin_login_page_is_reachable(self):
        response = self.client.get("/admin/login/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
