FROM node:18.3.0-alpine3.15

# Create app directory
WORKDIR /usr/src/app

# Install stockfish
RUN apk add --no-cache stockfish
RUN npm i -g pnpm

# Install app dependencies
COPY package*.json ./

RUN pnpm install

# Bundle app source
COPY . .

WORKDIR /usr/src/app/frontend

RUN pnpm run build

WORKDIR /usr/src/app/backend

EXPOSE 3000

CMD [ "pnpm", "start" ]

