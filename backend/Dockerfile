FROM node:13 as development

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY backend/package*.json ./

USER node

RUN npm ci

COPY --chown=node:node backend/. .

EXPOSE 4000

CMD ["npm", "run", "start:dev"]

FROM node:13 as build

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY backend/package*.json ./

COPY tsconfig*.json ./

USER node

COPY --chown=node:node backend/. .

RUN npm ci

RUN npm run build

FROM node:13 as production

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY backend/package*.json ./

USER node

RUN npm ci --production

COPY --from=build /home/node/app/dist ./

EXPOSE 4000

CMD ["npm", "run", "start"]

