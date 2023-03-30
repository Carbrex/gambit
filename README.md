# Gambit - Online Chess Platform

Welcome to Gambit, an online chess platform where you can play chess with your friends while chatting in real-time or watch top games from lichess.org, a popular chess website.

## Tech Stack

Gambit is built using React on the frontend with react-chessboard to render the chessboard and chess.js to handle chess logic and Node.js with Express and WebSockets on the backend.

## Getting Started

To get started with Gambit, simply visit the website at [https://gambit.onrender.com](https://gambit.onrender.com).

## Setup

To run the project locally, follow these steps:

1. Clone the repository: `git clone https://github.com/Carbrex/gambit.git`
2. Install dependencies for both the frontend and the backend:  
`cd frontend && npm install`  
`cd ../backend && npm install`
3. Create a `.env` file in the `backend` directory with the following variables:  
Replace `<your-mongo-uri>` with the URI of your MongoDB database, `<your-jwt-secret>` with your preferred JWT secret, and `<your-jwt-lifetime>` with the lifetime of your JWT tokens.
```env
    MONGO_URI=<your-mongo-uri> 
    JWT_SECRET=<your-jwt-secret>
    JWT_LIFETIME=<your-jwt-lifetime>
```
4. Build the frontend and copy it to the backend folder:  
`cd frontend && npm run build && cp -r build ../backend`
5. Start the backend server: `cd ../backend && node app.js`
6. Then navigate to http://localhost:5000/ in your browser.

## Contributing

We welcome contributions to Gambit! If you find a bug or have a feature request, please open an issue on GitHub. If you would like to contribute code, please fork the repository and submit a pull request.