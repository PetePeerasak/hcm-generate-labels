################################################################################
FROM node:16.16.0-alpine3.16 as builder-stage
################################################################################

RUN apk update && apk add bash

ARG UID=1001
ARG GID=1001

RUN apk --no-cache add shadow && \
  groupmod -g $GID -n master node && \
  usermod -d /home/master -l master node

################################################################################
FROM builder-stage AS dependency-stage
################################################################################

USER master
WORKDIR /home/master

RUN mkdir -p ./source/dist ./source/labels

COPY ./app.js /home/master/

################################################################################
FROM dependency-stage AS release
################################################################################

USER master
WORKDIR /home/master

CMD ["node", "app.js"]
