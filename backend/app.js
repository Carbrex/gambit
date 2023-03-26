require('dotenv').config();
const { StatusCodes } = require('http-status-codes');
require('express-async-errors');

// extra security
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

// error handler
const errorHandlerMiddleware = require('./middleware/error-handler');
const express = require("express");
const path = require('path');

const app = express();
const authenticateUser = require('./middleware/authentication');

app.set('trust proxy',1);
// middleware
app.use(rateLimiter({
  windowMs: 15*60*1000,//15 minutes
  max: 500
}));
app.use(express.json());
// extra packages
app.use(helmet());
app.use(cors());
app.use(xss());

app.use(express.static('./build'));
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// connectDB
const connectDB = require('./db/connect');

const { wss } = require('./web-socket/web-socket');

// routers
const authRouter = require('./routes/auth');
const gameRouter = require('./routes/game');
const Game = require('./models/Game');
const { createGame, assignPlayer } = require('./controllers/game.js');
// Express routes
app.get('/', (req, res) => {
    res.status(200).send('Home Page');
})
app.use('/game', authenticateUser, gameRouter);
app.use('/api/v1/auth', authRouter);

app.all('*', (req, res) => {
    res.status(404).send('Route does not exist');
})
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        const server = app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`);
        })
        server.on('upgrade', (request, socket, head) => {
            wss.handleUpgrade(request, socket, head, (socket) => {
                wss.emit('connection', socket, request);
            });
        });
    } catch (error) {
        console.log(error);
    }
}
start();