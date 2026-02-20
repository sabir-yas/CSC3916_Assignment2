/*
CSC3916 HW2
File: server.js
Description: Web API for Movie API
*/

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const authController = require('./auth');
const authJwtController = require('./auth_jwt');
const db = require('./db')();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

const router = express.Router();

/*
====================================================
SIGNUP ROUTE
====================================================
*/
router.post('/signup', (req, res) => {

    if (!req.body.username || !req.body.password) {
        return res.status(400).json({
            success: false,
            msg: 'Please include both username and password to signup.'
        });
    }

    const newUser = {
        username: req.body.username,
        password: req.body.password
    };

    db.save(newUser);

    res.status(200).json({
        success: true,
        msg: 'Successfully created new user.'
    });
});


/*
====================================================
SIGNIN ROUTE
====================================================
*/
router.post('/signin', (req, res) => {

    if (!req.body.username || !req.body.password) {
        return res.status(400).json({
            success: false,
            msg: 'Please include username and password.'
        });
    }

    const user = db.findOne(req.body.username);

    if (!user) {
        return res.status(401).json({
            success: false,
            msg: 'Authentication failed. User not found.'
        });
    }

    if (req.body.password !== user.password) {
        return res.status(401).json({
            success: false,
            msg: 'Authentication failed. Wrong password.'
        });
    }

    const payload = {
        id: user.id,
        username: user.username
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });

    res.status(200).json({
        success: true,
        token: token
    });
});


/*
====================================================
MOVIES ROUTE
====================================================
*/
router.route('/movies')

    /*
    GET
    */
    .get((req, res) => {
        res.status(200).json({
            status: 200,
            message: "GET movies",
            headers: req.headers,
            query: req.query,
            env: process.env.UNIQUE_KEY
        });
    })

    /*
    POST
    */
    .post((req, res) => {
        res.status(200).json({
            status: 200,
            message: "movie saved",
            headers: req.headers,
            query: req.query,
            env: process.env.UNIQUE_KEY
        });
    })

    /*
    PUT (Requires JWT Authentication)
    */
    .put(authJwtController.isAuthenticated, (req, res) => {
        res.status(200).json({
            status: 200,
            message: "movie updated",
            headers: req.headers,
            query: req.query,
            env: process.env.UNIQUE_KEY
        });
    })

    /*
    DELETE (Requires Basic Authentication)
    */
    .delete(authController.isAuthenticated, (req, res) => {
        res.status(200).json({
            status: 200,
            message: "movie deleted",
            headers: req.headers,
            query: req.query,
            env: process.env.UNIQUE_KEY
        });
    })

    /*
    ALL OTHER METHODS
    */
    .all((req, res) => {
        res.status(405).json({
            message: "HTTP method not supported."
        });
    });


/*
====================================================
MOUNT ROUTER
====================================================
*/
app.use('/', router);


/*
====================================================
START SERVER
====================================================
*/
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});

module.exports = app;