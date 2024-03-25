# Gambit - Online Chess Platform

Welcome to Gambit, an online chess platform where you can play chess with your friends or against a computer while chatting in real-time or watch top games from lichess.org, a popular chess website.

## Tech Stack

Gambit is built using React on the frontend with react-chessboard to render the chessboard and chess.js to handle chess logic and Node.js with Express and WebSockets on the backend.

## Getting Started

To get started with Gambit, simply visit the website at [https://gambit.onrender.com](https://gambit.onrender.com).

## Setup

To run the project locally, follow these steps:

1. Clone the repository: `git clone https://github.com/Carbrex/gambit.git`
2. Install dependencies for both the frontend and the backend:  
`pnpm install` or `npm install`
3. Add environment variable to `.env` in `backend` and `frontend` folders:
```
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```
Then replace the values in the `.env` files with your own values.
4. Build the frontend using `cd frontend && npm run build`.
5. Start the backend server: `cd ../backend && node app.js`
6. Then navigate to http://localhost:5000/ in your browser.

<!-- Alternative setup using docker -->
### Alternative Setup using Docker

To run the project using Docker, follow these steps:
1. Clone the repository: `git clone https://github.com/Carbrex/gambit.git`
2. Add environment variable to `.env` in `backend` and `frontend` folders:
```
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```
Then replace the values in the `.env` files with your own values.
3. Build the Docker image: `docker build -t gambit .`
4. Run the Docker container: `docker run -p 5000:5000 gambit`
5. Then navigate to http://localhost:5000/ in your browser.

## Stockfish Engine
Thanks to the Stockfish engine, Gambit allows you to play against a computer. The Stockfish engine is a powerful open-source chess engine that is used by many chess websites and applications. You can find the Stockfish engine at [https://stockfishchess.org/](https://stockfishchess.org/).

The docker image used for docker setup can be found on Docker Hub at [https://hub.docker.com/r/carbrex/sf-on-node-alpine](https://hub.docker.com/r/carbrex/sf-on-node-alpine) it has stockfish 14 on top of node:18-alpine image.

## Contributing

We welcome contributions to Gambit! If you find a bug or have a feature request, please open an issue on GitHub. If you would like to contribute code, please fork the repository and submit a pull request.