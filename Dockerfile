FROM node:19.9.0

WORKDIR /app/src

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

CMD ["yarn", "prod:start"]