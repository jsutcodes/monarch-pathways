from django.apps import AppConfig


class AuthenticationConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "authentication"

    def ready(self):
        # Connect the login success/failure audit-logging signal receivers.
        from . import signals  # noqa: F401

        # Auto-provision the standard Admin/Staff/Reporting/Student groups
        # (and their baseline permissions) right after migrations run.
        from django.db.models.signals import post_migrate

        from .group_setup import create_default_groups

        post_migrate.connect(create_default_groups, sender=self)
