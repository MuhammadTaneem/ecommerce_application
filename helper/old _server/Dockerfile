

# FROM python:3.12-slim
# LABEL authors="Taneem"
# ENV PYTHONDONTWRITEBYTECODE=1
# ENV PYTHONUNBUFFERED=1
# # Set the working directory
# WORKDIR /app

# RUN apt-get update && apt-get install -y \
#     netcat-traditional \
#     && rm -rf /var/lib/apt/lists/*

# # Copy requirements and install dependencies
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# # Copy the project files
# COPY . .

# # Expose the application port
# EXPOSE 8000

# # Default command
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]


# server/Dockerfile
FROM python:3.12-slim
LABEL authors="Taneem"

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y \
    netcat-traditional \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Add debugging tools
RUN pip install ipdb

COPY . .

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]