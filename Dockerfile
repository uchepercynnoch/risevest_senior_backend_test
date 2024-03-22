###############################
### BUILD FOR LOCAL DEVELOPMENT
###############################
FROM node:18 AS development

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --immutable --immutable-cache --check-cache

COPY . .

#RUN mv docker.env ./.env

USER node

EXPOSE 3000

CMD [ "npm","run", "serve" ]
