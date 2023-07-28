const express = require('express')
const cors = require('cors')
const { createHandler } = require('graphql-http/lib/use/express');

const { models } = require('./models');
const { schema } = require('./graphql');
const { JWTMiddleware } = require('./middleware/jwtMiddleware');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(cors());
app.use(express.json());
// app.use(express.raw());

app.use('/graphql', JWTMiddleware, createHandler({
    schema: schema,
    context: (req, params) => ({ req: req, jwtPayload: req.raw.jwtPayload, stripe: stripe })
}))

app.get('/', async (req, res) => {
    const users = await models.User.findAll()
    res.json(users);
})

app.get('/test', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'No token provided.' });
    }
    console.log(token);
    res.json([]);
})

app.get('/email', (req, res) => {
    const { email, token } = req.query;
    const jwt = require('jsonwebtoken');

    let data = null;
    try {
        data = jwt.verify(token, process.env.JWT_SECRET).data;
    } catch (error) {
        console.log(error);
    }
    res.json({ token, data });
});

app.listen(process.env.PORT, () => console.log('Listening on port ' + process.env.PORT));
