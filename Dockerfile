FROM node:12.15.0-alpine

ENV WDIR /app

RUN apk add --no-cache --upgrade bash
RUN mkdir -p ${WDIR}

WORKDIR ${WDIR}

COPY package*.json ./

RUN  npm install

COPY . .