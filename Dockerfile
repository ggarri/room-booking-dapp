FROM node:10.16.0 AS builder

MAINTAINER Gabriel Garrido

ENV HTTP_PORT 3000
ENV HTTP_HOST 0.0.0.0

WORKDIR /srv
COPY . .

RUN npm config set user 0
RUN npm config set unsafe-perm true
RUN npm install -g ganache-cli

RUN npm install
RUN cp .env.sample .env

ENTRYPOINT ["./scripts/docker_entrypoint.sh"]
EXPOSE 3000 7545

