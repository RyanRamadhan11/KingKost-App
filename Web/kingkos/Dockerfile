FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm i --legacy-peer-deps

COPY . .

CMD ["npm","run","dev"]