#!/usr/bin/env bash
# Quick-start script for the Monarch Pathways Django app.
# Sets up the venv, installs deps, runs migrations, and boots the dev server.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

VENV_DIR="venv"

if [ ! -d "$VENV_DIR" ]; then
  echo "==> Creating virtual environment..."
  python3 -m venv "$VENV_DIR"
fi

# shellcheck disable=SC1091
source "$VENV_DIR/bin/activate"

echo "==> Installing dependencies..."
pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt

echo "==> Applying migrations..."
python manage.py makemigrations authentication students meetings
python manage.py migrate

# Create a default superuser (admin/admin) if none exists yet, so you can log in immediately.
echo "==> Ensuring a superuser exists..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(is_superuser=True).exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin')
    print('Created default superuser -> username: admin / password: admin')
else:
    print('Superuser already exists, skipping creation.')
"

echo "==> Starting development server at http://127.0.0.1:8000 ..."
python manage.py runserver
