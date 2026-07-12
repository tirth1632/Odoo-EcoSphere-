# ----------------------------------------------------------------
#  EcoSphere ESG Platform — Dockerfile
#  Django 6 + Gunicorn + WhiteNoise (Python 3.11-slim base)
# ----------------------------------------------------------------

FROM python:3.11-slim AS base

# -- System dependencies ----------------------------------------
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    curl \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

# -- Python env -------------------------------------------------
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=ecosphere_project.settings \
    PORT=8000

WORKDIR /app

# -- Install Python dependencies --------------------------------
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
 && pip install --no-cache-dir -r requirements.txt

# -- Copy project source ----------------------------------------
COPY . .

# -- Make entrypoint executable ---------------------------------
RUN chmod +x entrypoint.sh

# -- Create non-root user ---------------------------------------
RUN addgroup --system ecosphere && adduser --system --ingroup ecosphere ecosphere
RUN chown -R ecosphere:ecosphere /app
USER ecosphere

# -- Expose port ------------------------------------------------
EXPOSE 8000

# -- Health check -----------------------------------------------
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8000/health/ || exit 1

# -- Entrypoint -------------------------------------------------
ENTRYPOINT ["./entrypoint.sh"]
