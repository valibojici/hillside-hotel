const express = require('express')
const cors = require('cors')
const { createHandler } = require('graphql-http/lib/use/express');

const { models } = require('./models');
const { schema } = require('./graphql');
const { JWTMiddleware } = require('./middleware/jwtMiddleware');
const { webhook } = require('./stripe/webhook');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(cors());

// stripe webhook
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => webhook(req, res, { models, stripe }));

app.use(express.json());

app.use('/graphql', JWTMiddleware, createHandler({
    schema: schema,
    context: (req, params) => ({ req: req, jwtPayload: req.raw.jwtPayload, stripe: stripe })
}))

app.listen(process.env.PORT, () => console.log('Listening on port ' + process.env.PORT));
