# # Base image
# FROM node:18-alpine

# # Set the working directory
# WORKDIR /app

# # Copy package files and install dependencies
# COPY package.json package-lock.json ./
# RUN npm install

# # Copy project files
# COPY . .

# # Expose the Vite default port
# EXPOSE 5173

# # Default command
# CMD ["npm", "run", "dev"]


# Base image
FROM node:alpine
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5713
CMD ["npm", "run", "dev"]
# ENTRYPOINT ["npm", "run", "dev", "--", "--port=5713", "--host=0.0.0.0"]