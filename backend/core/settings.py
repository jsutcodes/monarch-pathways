import os
from pathlib import Path

import environ

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(
    DEBUG=(bool, True),
)
# .env is optional in local dev (run.sh / manual venv); required only in prod containers.
env_file = BASE_DIR / ".env"
if env_file.exists():
    environ.Env.read_env(str(env_file))

SECRET_KEY = env("SECRET_KEY", default="django-insecure-intern-project-mock-key-12345")
DEBUG = env.bool("DEBUG", default=True)
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=["*"])

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third-party packages
    "rest_framework",
    "rest_framework_simplejwt",
    # Custom project apps
    "authentication",
    "students",
    "meetings",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "core.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "core.wsgi.application"

# DB_PATH lets the production container point at a mounted volume
# (e.g. /app/data/db.sqlite3) while local dev keeps using BASE_DIR/db.sqlite3.
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": env("DB_PATH", default=str(BASE_DIR / "db.sqlite3")),
    }
}

# Explicitly register our customized unified user model
AUTH_USER_MODEL = "authentication.User"

# REST Framework Configuration
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
}

# Logging configuration tracking access patterns via append-only text logs
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "auth_file": {
            "level": "INFO",
            "class": "logging.FileHandler",
            "filename": os.path.join(BASE_DIR, "logs/auth_audit.log"),
        },
    },
    "loggers": {
        "authentication": {
            "handlers": ["auth_file"],
            "level": "INFO",
            "propagate": True,
        },
    },
}

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
