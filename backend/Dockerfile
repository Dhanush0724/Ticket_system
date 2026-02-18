FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y postgresql-client

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["sh", "-c", "until pg_isready -h db -p 5432 -U postgres; do echo 'Waiting for postgres...'; sleep 1; done && python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
