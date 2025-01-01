FROM python:3.12-slim
LABEL authors="Taneem"

# WORKDIR /django

# COPY requirements.txt .

# RUN pip install --no-cache-dir -r requirements.txt

# COPY . /django/
# EXPOSE 8000
# # CMD ["uvicorn", "ecommerce_application.asgi:application", "--host", "0.0.0.0", "--port", "8000"]
# # CMD ["uvicorn", "ecommerce_application.asgi:application", "--host", "0.0.0.0", "--port", "8000"]
# # CMD ["uvicorn", "ecommerce_application.asgi:application", "--host", "0.0.0.0", "--port", "8000"]
# # CMD ["uvicorn", "ecommerce_application.asgi:application", "--host", "0.0.0.0", "--port", "8000"]


# # FROM python:3.12-slim
# # LABEL authors="Taneem"
# # ENV PYTHONUNBUFFERED=1
# # WORKDIR /django
# # COPY requirements.txt requirements.txt
# RUN pip install -r requirements.txt
# CMD ["python", "manage.py","runserver", "--host", "0.0.0.0", "--port", "8000"]



# Set the working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the project files
COPY . .

# Expose the application port
EXPOSE 8000

# Default command
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]