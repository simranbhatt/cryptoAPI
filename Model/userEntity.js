const mongoose = require('mongoose')

const userEntity = new mongoose.Schema({
    address: {
        type: String,
        required:true
    },
    transactionData: { type: Array }
})

module.exports = {User : mongoose.model('User', userEntity)};