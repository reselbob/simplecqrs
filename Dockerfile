FROM node:15.4.0-alpine3.10

WORKDIR /api

COPY package.json .

RUN npm install --only-production

COPY dist/ ./dist

EXPOSE 3000

WORKDIR /api/dist/src

CMD ["node", "app.js"]

