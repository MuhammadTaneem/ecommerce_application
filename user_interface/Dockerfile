FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies including react-facebook-login
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev"]