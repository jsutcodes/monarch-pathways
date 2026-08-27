import logging
from django.contrib.auth.signals import user_logged_in, user_login_failed
from django.dispatch import receiver

logger = logging.getLogger('authentication')

@receiver(user_logged_in)
def log_successful_login(sender, request, user, **kwargs):
    # TODO: Intern Task - Parse HTTP request wrapper context to extract real IP address (handling proxies/headers)
    logger.info(f"LOGIN_SUCCESS | User: {user.username} (ID: {user.id})")

@receiver(user_login_failed)
def log_failed_login(sender, credentials, request, **kwargs):
    # TODO: Intern Task - Extract incoming username or identifiers to safely profile target risk levels without exposing raw passwords
    logger.warning(f"LOGIN_FAILED | Credentials parsed: {credentials.get('username')}")
