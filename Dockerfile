FROM node:20.19-alpine3.21 AS builder

WORKDIR /app
COPY . .

RUN npm install -g typescript
RUN npm install
RUN npm run build

#######################################

FROM node:20.19-alpine3.21

RUN apk add bash
RUN apk add --no-cache \
        python3 \
        aws-cli \
    && rm -rf /var/cache/apk/*
RUN apk add --update alpine-sdk

RUN apk update
RUN apk upgrade

WORKDIR /app
# RUN rm -rf ./*

COPY --from=builder ./app/ ./

RUN npm install

ARG ORIGIN
ENV ORIGIN=${ORIGIN}

ARG ENVIRONMENT
ENV ENVIRONMENT=${ENVIRONMENT}

RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/bin/bash", "-c", "/app/entrypoint.sh $ENVIRONMENT"]

# CMD ["node", "build/index.js"]
