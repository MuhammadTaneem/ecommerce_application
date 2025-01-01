FROM node:alpine
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5713
CMD ["npm", "run", "dev"]
# ENTRYPOINT ["npm", "run", "dev", "--", "--port=5713", "--host=0.0.0.0"]