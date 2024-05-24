################################################################################
FROM golang:1.22.0-alpine3.18 as build
################################################################################

RUN apk update && apk add curl git neovim zsh upx && \
  sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

RUN adduser -h /go/github.com/PetePeerasak -s /bin/sh -S -D -u 1000 master && \
  addgroup -g 1000 -S master && \
  chown -R master:master /go

WORKDIR /go/github.com/PetePeerasak

RUN go install github.com/spf13/cobra-cli@latest && \
  mkdir app && cd app && \
  go mod init github.com/PetePeerasak/app && \
  cobra-cli init
RUN chown -R master:master /go

################################################################################
FROM build as release
################################################################################

USER master
WORKDIR /go/github.com/PetePeerasak/app

RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
RUN echo "alias vim=\"nvim\"" >> ~/.zshrc
