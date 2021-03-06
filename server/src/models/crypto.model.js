const mongoose = require('mongoose');

const CryptoSchema = mongoose.Schema({
    code: {
        type: String,
        require: true,
    },
    amount: {
        type: Number,
        require: true,
    },
});

module.exports = {
  schema: CryptoSchema,
  model: mongoose.model('Crypto', CryptoSchema),
};
