const express = require('express');

const router = express.Router();
const Cryptos = require('../models/crypto.model');
const errors = require('../middlewares/error');
const logger = require('../logger');

router.get('/', async (req, res, next) => {
    logger.log('info', 'Request GET');
    try {
        const data = await Cryptos.find().sort({ date: -1 }).limit(10);
        res.status(200).json({
            state: 'success',
            data,

        });
    } catch (error) {
        next({ status: 500, message: 'Error reading DB', stack: error });
    }
});

router.post('/', async (req, res, next) => {
    logger.log('info', `Request POST, with this body: ${JSON.stringify(req.body)}`);
    const { code, amount } = req.body;
    if (!code || !amount) {
        res.status(400).json({
            state: 'error',
            message: 'Code and amount are needed',
        });
        logger.log('error', 'Request POST, Description and amount are needed');
        return;
    }
    const crypto = new Cryptos({
        code,
        amount,
    });
    try {
        const data = await crypto.save();
        logger.log('info', 'Saving in DB is OK, responding');
        res.status(200).json({
            state: 'success',
            data,
        });
    } catch (error) {
        next({ status: 500, message: 'Error writing DB', stack: error });
    }
});

router.delete('/:cryptoID', async (req, res, next) => {
    const { cryptoID } = req.params;
    logger.log('info', `Request DELETE, with this id: ${cryptoID}`);
    if (!cryptoID) {
        logger.log('error', 'Request DELETE, Movement ID are needed');
        res.status(400).json({
            state: 'error',
            message: 'Crypto ID are needed',
        });
        return;
    }
    try {
        const data = await Cryptos.deleteOne({ _id: cryptoID });
        logger.log('info', 'Delete in DB is OK, responding');
        res.status(200).json({
            state: 'success',
            data,
        });
    } catch (error) {
        next({ status: 500, message: 'Error deleting DB', stack: error });
    }
});

// Update a movement
router.patch('/:cryptoID', async (req, res, next) => {
    const { cryptoID } = req.params;
    const { code, amount } = req.body;
    logger.log('info', `Request PATCH, with this id: ${cryptoID}, and this body: ${JSON.stringify(req.body)}`);
    if (!cryptoID) {
        logger.log('error', 'Request PATCH, Movement ID are needed');
        res.status(400).json({
            state: 'error',
            message: 'Crypto ID are needed',
        });
        return;
    }
    if (!code && !amount) {
        logger.log('error', 'Request PATCH, Crypto ID are needed');
        res.status(400).json({
            state: 'error',
            message: 'Code and amount are needed',
        });
        return;
    }
    try {
        const data = await Cryptos.updateOne(
            { _id: cryptoID },
            { $set: { code, amount } },
);
        logger.log('info', 'Delete in DB is OK, responding');
        res.status(200).json({
            state: 'success',
            data,
        });
    } catch (error) {
        next({ status: 500, message: 'Error patching DB', stack: error });
    }
});

router.use(errors.notFound);
router.use(errors.handler);
module.exports = router;
