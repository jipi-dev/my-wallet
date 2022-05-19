const mongoose = require('mongoose');

const { schema: Crypto } = require('./crypto.model');

const WalletSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    cryptos: {
      type: [Crypto],
      require: false,
    },
});

module.exports = mongoose.model('Wallet', WalletSchema);
