FROM node:18.3.0

# Create app directory
WORKDIR /usr/src/app

# Install Stockfish
RUN apt update && apt install -y stockfish && apt clean && apt autoclean && apt autoremove -y

RUN npm i -g pnpm

# Install app dependencies
COPY backend/package.json backend/pnpm-lock.yaml ./backend/
COPY frontend/package.json frontend/pnpm-lock.yaml ./frontend/
COPY pnpm-workspace.yaml ./

RUN pnpm install

# Bundle app source
COPY . .

WORKDIR /usr/src/app/frontend

RUN pnpm run build

WORKDIR /usr/src/app/backend

EXPOSE 5000

CMD [ "pnpm", "start" ]
