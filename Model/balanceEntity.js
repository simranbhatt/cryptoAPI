const mongoose = require('mongoose')

const balanceEntity = new mongoose.Schema({
    address: {
        type: String,
        required:true
    },
    currentBalance: { type: Number, default: 0 },
    etherValue: {type: Number}
})

module.exports = {Balance: mongoose.model('Balance', balanceEntity)};