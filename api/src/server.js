require('dotenv').config()
const express = require('express')
const cors = require('cors')

const { models } = require('./models');

const app = express();

app.use(cors());

app.get('/', async (req, res) => {
    const users = await models.User.findAll()
    res.json(users);
})

app.listen(process.env.PORT, () => console.log('Listening on port ' + process.env.PORT));
