#!/bin/sh
set -e

echo "==> Applying migrations..."
python manage.py migrate --noinput

echo "==> Ensuring a superuser exists..."
# Same default as run.sh (local dev): admin/admin, unless overridden by env vars.
DJANGO_SUPERUSER_USERNAME="${DJANGO_SUPERUSER_USERNAME:-admin}" \
DJANGO_SUPERUSER_EMAIL="${DJANGO_SUPERUSER_EMAIL:-admin@example.com}" \
DJANGO_SUPERUSER_PASSWORD="${DJANGO_SUPERUSER_PASSWORD:-admin}" \
python manage.py shell -c "
import os
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(is_superuser=True).exists():
    User.objects.create_superuser(
        os.environ['DJANGO_SUPERUSER_USERNAME'],
        os.environ['DJANGO_SUPERUSER_EMAIL'],
        os.environ['DJANGO_SUPERUSER_PASSWORD'],
    )
    print('Created default superuser -> username: %s' % os.environ['DJANGO_SUPERUSER_USERNAME'])
else:
    print('Superuser already exists, skipping creation.')
"

echo "==> Ensuring demo accounts exist (taylor/taylor, staff/staff, student/student)..."
python manage.py create_demo_users

echo "==> Collecting static files..."
python manage.py collectstatic --noinput

echo "==> Starting gunicorn..."
exec gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 3
