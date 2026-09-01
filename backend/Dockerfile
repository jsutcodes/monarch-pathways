FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# System deps for psycopg2-binary / building wheels if needed
RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p logs staticfiles data

EXPOSE 8000

# Apply migrations, collect static, then serve with gunicorn.
CMD ["sh", "-c", "python manage.py migrate --noinput && python manage.py collectstatic --noinput && gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 3"]
