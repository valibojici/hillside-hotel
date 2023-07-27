require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { createHandler } = require('graphql-http/lib/use/express');

const { models } = require('./models');
const { schema } = require('./graphql');

const app = express();

app.use(cors());

app.use('/graphql', createHandler({
    schema: schema,
}))

app.get('/', async (req, res) => {
    const users = await models.User.findAll()
    res.json(users);
})

app.listen(process.env.PORT, () => console.log('Listening on port ' + process.env.PORT));
