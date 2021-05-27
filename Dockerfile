FROM node:15.5.0-alpine3.12
WORKDIR /usr/src/app/

COPY package.json .

RUN npm install

EXPOSE 3000

COPY . .

CMD ["npm","start"]