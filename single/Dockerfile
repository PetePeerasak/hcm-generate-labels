FROM node:16.16.0-alpine3.16 as builder

RUN apk update && apk add bash

WORKDIR /home/node

COPY ./app.js /home/node/app.js

CMD ["node", "app.js"]

