FROM node:18

WORKDIR /app

COPY package*.json .
COPY yarn.lock .
RUN yarn install

COPY . .
RUN yarn run build

CMD [ "yarn", "run", "start" ]