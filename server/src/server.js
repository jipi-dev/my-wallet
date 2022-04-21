require('dotenv/config');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('./config/mongoose');
const logger = require('./logger');

const port = process.env.PORT || 3000;

const app = express();

const cryptoRoute = require('./routes/crypto');

app.use(cors());
app.use(bodyParser.json());
app.use('/api/cryptos', cryptoRoute);

// open mongoose connection
mongoose.connect();

app.listen(port, () => logger.log('info', `API running on port ${port}`));