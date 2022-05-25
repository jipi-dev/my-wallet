const express = require('express');

const router = express.Router();
const Wallet = require('../models/wallet.model');
const errors = require('../middlewares/error');
const logger = require('../logger');
const validation = require('../validation/wallets');

router.get('/', async (req, res, next) => {
    logger.log('info', 'Wallet Request GET');
    try {
        const data = await Wallet.find().sort({ date: -1 }).limit(10);
        res.status(200).json({
            state: 'success',
            data,
        });
    } catch (error) {
        next({ status: 500, message: 'Error reading DB', stack: error });
    }
});

router.post('/', async (req, res, next) => {
  const { error } = validation.validate(req.body);
  if (error) {
    logger.log('error', `We have an error on request parameters: ${JSON.stringify(error)}`);
    return res.status(400).json({ status: 'error', type: 'validation', error: error.details.map((detail) => detail.message) });
  }

  logger.log('info', `Wallet Request POST, with this body: ${JSON.stringify(req.body)}`);
  const { name, cryptos } = req.body;
  const wallet = new Wallet({
      name,
      cryptos,
  });
  try {
      const data = await wallet.save();
      logger.log('info', 'Saving in DB is OK, responding');
      res.status(200).json({
          state: 'success',
          data,
      });
  } catch (err) {
      next({ status: 500, message: 'Error writing DB', stack: err });
  }
});

router.delete('/:walletID', async (req, res, next) => {
    const { walletID } = req.params;
    logger.log('info', `Request DELETE, with this id: ${walletID}`);
    if (!walletID) {
        logger.log('error', 'Request DELETE, walletID are needed');
        res.status(400).json({
            state: 'error',
            message: 'Crypto ID are needed',
        });
        return;
    }
    try {
        const data = await Wallet.deleteOne({ _id: walletID });
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
router.patch('/:walletID', async (req, res, next) => {
    const { walletID } = req.params;
    const { cryptos } = req.body;
    logger.log('info', `Request PATCH, with this id: ${walletID}, and this body: ${JSON.stringify(req.body)}`);
    if (!walletID) {
        logger.log('error', 'Request PATCH, walletID are needed');
        res.status(400).json({
            state: 'error',
            message: 'Crypto ID are needed',
        });
        return;
    }
    if (!cryptos && cryptos.length === 0) {
        logger.log('error', 'Request PATCH, cryptos is needed');
        res.status(400).json({
            state: 'error',
            message: 'Cryptos array is needed',
        });
        return;
    }
    try {
        const data = await Wallet.updateOne(
            { _id: walletID },
            { $set: { cryptos } },
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
