FROM node:20.11-alpine3.18 AS builder

WORKDIR /app
COPY . .

RUN npm install -g typescript
RUN npm install
RUN npm run build

#######################################

FROM node:20.11-alpine3.18

RUN apk add bash
RUN apk add --no-cache \
        python3 \
    && rm -rf /var/cache/apk/*
RUN apk add --update alpine-sdk
RUN apk add chromium \
    harfbuzz

RUN apk update
RUN apk upgrade

WORKDIR /app
RUN rm -rf ./*

COPY --from=builder ./app/package*.json ./
COPY --from=builder ./app/build .

RUN npm install --production

CMD ["node", "index.js"]