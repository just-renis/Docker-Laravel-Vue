FROM node:18.18.0

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install vuex --save

COPY . .

EXPOSE 8080

CMD ["npm", "run", "serve"]