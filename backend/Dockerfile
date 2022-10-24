FROM node:13 as development

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY backend/package*.json ./

USER node

RUN npm install

COPY --chown=node:node backend/. .

EXPOSE 4000

CMD ["npm", "run", "start:dev"]