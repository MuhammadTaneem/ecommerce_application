# user_interface/Dockerfile
FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

# Add development dependencies for better hot reloading
#RUN npm install -D @vitejs/plugin-react-refresh

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]