# Use debian:buster as the base image
FROM debian:buster

# Install curl, gnupg, lsb-release, and build-essential for adding the NodeSource repository and building stockfish from source
RUN apt-get update && apt-get install -y curl gnupg lsb-release build-essential

# Add the NodeSource repository and install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

# Install pnpm
RUN npm i -g pnpm

# Create app directory
WORKDIR /usr/src/app

# Install stockfish from source
RUN curl -sL https://github.com/official-stockfish/Stockfish/archive/refs/tags/sf_14.tar.gz | tar xz
WORKDIR /usr/src/app/Stockfish-sf_14/src
RUN make help
RUN make net
RUN make build ARCH=x86-64-modern
RUN mv stockfish /usr/local/bin

WORKDIR /usr/src/app

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