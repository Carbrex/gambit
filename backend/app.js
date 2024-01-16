require('dotenv').config();
const { StatusCodes } = require('http-status-codes');
require('express-async-errors');
const fs = require('fs');

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
const UserCt = require('./models/UserCt');

app.set('trust proxy', 1);
// middleware
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,//15 minutes
    max: 500
}));
app.use(express.json());
// extra packages
app.use(helmet({ contentSecurityPolicy: false, }));
app.use(cors());
app.use(xss());

// ls contents of ../frontend
console.log(fs.readdirSync('../frontend'));

if (process.env.NODE_ENV === 'production') {
    //check whether directory exists
    if (!fs.existsSync('../frontend/dist')) {
        console.log('Please run "npm run build" in the frontend directory');
        process.exit(1);
    }
    app.use(express.static('../frontend/dist'));
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
    });
}
// connectDB
const connectDB = require('./db/connect');

const { wss } = require('./web-socket/web-socket');

// routers
const authRouter = require('./routes/auth');
const gameRouter = require('./routes/game');
const Game = require('./models/Game');
const { createGame, assignPlayer } = require('./controllers/game.js');
// Express routes
let userCt=0;
// log requests and increment user count
app.use((req, res, next) => {
    userCt++;
    // update user count in the database
    UserCt.findOneAndUpdate({}, { ct: userCt }, { upsert: true }, (err, doc) => {
        if (err) {
            console.log(err);
        }
    });
    console.log(`${req.method} ${req.url} ${userCt}`);
    next();
})

app.get('/', (req, res) => {
    userCt++;
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
        // initialize user count
        const userCtDoc = await UserCt.findOne({});
        if (userCtDoc) {
            userCt = userCtDoc.ct;
        }
    } catch (error) {
        console.log(error);
    }
}
start();