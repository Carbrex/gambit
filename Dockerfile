FROM carbrex/sf-on-node-alpine

WORKDIR /usr/src/app

# Install app dependencies
COPY backend/package.json backend/pnpm-lock.yaml ./backend/
COPY frontend/package.json frontend/pnpm-lock.yaml ./frontend/
COPY pnpm-workspace.yaml ./

RUN npm i -g pnpm
RUN pnpm install

# Bundle app source
COPY . .

WORKDIR /usr/src/app/frontend

RUN pnpm run build

WORKDIR /usr/src/app/backend

EXPOSE 5000

CMD [ "pnpm", "start" ]
