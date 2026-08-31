"""
Auto-provisions the standard access-control Groups for the platform.

Connected to Django's `post_migrate` signal (see `AuthenticationConfig.ready`)
so that every environment (dev, CI, prod) ends up with the same baseline
Groups/permissions immediately after `migrate` runs, without needing a
manual fixture load or data migration.

Group -> intended access:
    Admin      Full CRUD access to every model in the system.
    Staff      Can view/manage students, mentor assignments, meeting
               notes, meetings, and milestones. (Access to "only their
               own timecard hours" is a row-level restriction that must
               be enforced in views/querysets once a Timecard model
               exists -- Django group permissions are model-level only.)
    Reporting  Read-only access to aggregate/reporting data. No add,
               change, or delete permissions anywhere.
    Student    Read-only access to student records. Restricting a
               student to *their own* record is a row-level concern
               enforced in views/querysets, not by group permissions.

Group and permission names may be adjusted here as models are added
(e.g., once a Timecard model exists, add `("timecard", ["view"])` to
the Staff and Reporting entries below).
"""

import logging

from django.apps import apps as django_apps
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType

logger = logging.getLogger("authentication")

ADMIN = "Admin"
STAFF = "Staff"
REPORTING = "Reporting"
STUDENT = "Student"

ALL_ACTIONS = ("view", "add", "change", "delete")

# (app_label, model_name) -> permission actions to grant, per group.
# "__all__" grants every permission Django defines for that model.
GROUP_MODEL_PERMISSIONS = {
    ADMIN: "__all__",
    STAFF: {
        ("students", "studentprofile"): ("view", "change"),
        ("students", "mentorstudentassignment"): ("view",),
        ("students", "mentorprofile"): ("view",),
        ("meetings", "meeting"): ("view", "add", "change"),
        ("meetings", "meetingnote"): ("view", "add", "change"),
        ("meetings", "milestone"): ("view", "add", "change"),
    },
    REPORTING: {
        ("students", "studentprofile"): ("view",),
        ("students", "mentorstudentassignment"): ("view",),
        ("meetings", "meeting"): ("view",),
        ("meetings", "meetingnote"): ("view",),
        ("meetings", "milestone"): ("view",),
    },
    STUDENT: {
        ("students", "studentprofile"): ("view",),
    },
}


def _permissions_for(app_label, model_name, actions):
    """
    Resolves (creating if necessary) the requested permissions for a
    model. Content types/permissions for *other* apps may not have been
    synced yet when this fires (it depends on where `authentication`
    falls in the post_migrate processing order), but every app's
    database tables already exist by the time any post_migrate signal
    fires -- so it's always safe to create the ContentType/Permission
    rows ourselves rather than assume another app's post_migrate
    receiver has already done so.
    """
    model = django_apps.get_model(app_label, model_name)
    content_type = ContentType.objects.get_for_model(model)

    permissions = []
    for action in actions:
        codename = f"{action}_{model_name}"
        permission, _ = Permission.objects.get_or_create(
            codename=codename,
            content_type=content_type,
            defaults={"name": f"Can {action} {model._meta.verbose_name_raw}"},
        )
        permissions.append(permission.pk)
    return Permission.objects.filter(pk__in=permissions)


def _ensure_all_permissions_exist():
    """
    Force-creates any missing ContentType/Permission rows across *every*
    installed app's models. Depending on where `authentication` falls in
    the post_migrate processing order, Django's own per-app
    `create_permissions` receiver may not have run yet for other apps,
    so `Permission.objects.all()` could otherwise be incomplete when we
    assign the Admin group's "full access" permission set below.
    """
    for model in django_apps.get_models():
        _permissions_for(
            model._meta.app_label, model._meta.model_name, ALL_ACTIONS
        )


def create_default_groups(sender=None, **kwargs):
    """
    Idempotently creates (or updates) the Admin/Staff/Reporting/Student
    Groups and assigns their baseline model permissions.
    """
    _ensure_all_permissions_exist()

    for group_name, spec in GROUP_MODEL_PERMISSIONS.items():
        group, created = Group.objects.get_or_create(name=group_name)

        if spec == "__all__":
            permissions = Permission.objects.all()
        else:
            permissions = Permission.objects.none()
            for (app_label, model_name), actions in spec.items():
                permissions |= _permissions_for(app_label, model_name, actions)

        group.permissions.set(permissions)

        logger.info(
            "GROUP_PROVISIONED | Group: %s (created=%s, permissions=%d)",
            group_name,
            created,
            permissions.count() if hasattr(permissions, "count") else len(permissions),
        )
