const express = require('express')
const cors = require('cors')
const { createHandler } = require('graphql-http/lib/use/express');

global.__baseDir = __dirname;

var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', { flags: 'w' });
var log_stdout = process.stdout;

console.log = function (d) { //
    log_file.write(util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
};

const { models } = require('./models');
const { schema } = require('./graphql');
const { schema: adminSchema } = require('./graphql/admin');
const { JWTMiddleware } = require('./middleware/jwtMiddleware');
const { webhook } = require('./stripe/webhook');
const { AdminGuard } = require('./middleware/adminGuard');
const { formatError } = require('./graphql/utils/errors');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.static(__dirname + '/public'));

// stripe webhook
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => webhook(req, res, { models, stripe }));

app.use(express.json({ limit: '50mb' }));


app.use('/graphql/admin', JWTMiddleware, AdminGuard, createHandler({
    schema: adminSchema,
    context: (req, params) => ({ req: req, jwtPayload: req.raw.jwtPayload, stripe: stripe, models: models }),
    formatError: formatError
}));


app.use('/graphql', JWTMiddleware, createHandler({
    schema: schema,
    context: (req, params) => ({ req: req, jwtPayload: req.raw.jwtPayload, stripe: stripe, models: models }),
    formatError: formatError
}))


app.listen(process.env.PORT, () => console.log('Listening on port ' + process.env.PORT));
